import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { SimulationConfig, SerialLog, TabType } from './types';
import { soundManager } from './lib/sound';
import { Header } from './components/Header';
import { SimulationRoom } from './components/SimulationRoom';
import { CodeViewer } from './components/CodeViewer';
import { HardwareVisualizer } from './components/HardwareVisualizer';
import { SerialMonitor } from './components/SerialMonitor';
import { EnergyAnalytics } from './components/EnergyAnalytics';
import { WiringGuide } from './components/WiringGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Simulation Configuration
  const [config, setConfig] = useState<SimulationConfig>({
    pirPin: 2,
    relayPin: 7,
    offDelaySeconds: 30, // 30 seconds delay (in milliseconds = 30000)
    relayActiveMode: 'LOW', // LOW = Active LOW (default for relay modules)
    fanWattage: 50, // 50W fan
    electricityRate: 0.15, // $0.15 / kWh or ₹8.00/kWh
    currencySymbol: '$',
    enableTempSensor: false,
    tempThreshold: 28,
    enableBuzzer: false,
    buzzerPin: 8,
  });

  // State Machine Variables matching Arduino C++ code
  const [isMotionDetected, setIsMotionDetected] = useState<boolean>(false);
  const [isFanOn, setIsFanOn] = useState<boolean>(false);
  const [lastMotionTime, setLastMotionTime] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(30);
  const [simulatedTemp, setSimulatedTemp] = useState<number>(30); // 30°C default

  // Serial Logs Stream
  const [serialLogs, setSerialLogs] = useState<SerialLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      message: 'System Initialized. PIR Pin: 2, Relay Pin: 7, Off-Delay: 30000ms',
      type: 'system',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      message: 'Serial communication started at 9600 baud.',
      type: 'system',
    },
  ]);

  // Keep soundManager sync
  useEffect(() => {
    soundManager.soundEnabled = soundEnabled;
  }, [soundEnabled]);

  const addSerialLog = useCallback((message: string, type: SerialLog['type'] = 'info') => {
    const newEntry: SerialLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setSerialLogs((prev) => [...prev.slice(-99), newEntry]); // keep last 100 entries
  }, []);

  // Trigger Motion Event (simulates digitalRead(PIR_PIN) == HIGH)
  const handleTriggerMotion = useCallback(() => {
    const now = Date.now();

    // Check Temperature guard if enabled
    if (config.enableTempSensor && simulatedTemp < config.tempThreshold) {
      addSerialLog(
        `Motion detected but Temp (${simulatedTemp}°C) is below threshold (${config.tempThreshold}°C). Fan stays OFF.`,
        'info'
      );
      setIsMotionDetected(true);
      setTimeout(() => setIsMotionDetected(false), 2000);
      return;
    }

    // Play sounds if turning ON
    if (!isFanOn) {
      soundManager.playRelayClick('ON');
      soundManager.playMotionChime();
      addSerialLog('Motion detected! Turning fan ON.', 'motion');
    } else {
      addSerialLog('Motion re-detected. Timer reset to 30s.', 'info');
    }

    setIsMotionDetected(true);
    setIsFanOn(true);
    setLastMotionTime(now);
    setTimeRemainingSeconds(config.offDelaySeconds);

    // Auto clear motion pulse after 2.5 seconds (PIR hardware pulse width)
    setTimeout(() => {
      setIsMotionDetected(false);
    }, 2500);
  }, [config, isFanOn, simulatedTemp, addSerialLog]);

  // Force Reset / Manual Fan OFF
  const handleResetTimer = useCallback(() => {
    if (isFanOn) {
      soundManager.playRelayClick('OFF');
      addSerialLog('Manual Reset. Turning fan OFF immediately.', 'off');
    }
    setIsMotionDetected(false);
    setIsFanOn(false);
    setLastMotionTime(0);
    setTimeRemainingSeconds(config.offDelaySeconds);
  }, [isFanOn, config.offDelaySeconds, addSerialLog]);

  // Main Timer Tick Engine (Simulates Arduino loop delay & millis() check)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (isFanOn) {
        if (isMotionDetected) {
          // If motion is currently active, timer stays full
          setLastMotionTime(Date.now());
          setTimeRemainingSeconds(config.offDelaySeconds);
        } else {
          // Calculate elapsed time in seconds since last motion
          const elapsedSec = Math.floor((Date.now() - lastMotionTime) / 1000);
          const remainingSec = Math.max(0, config.offDelaySeconds - elapsedSec);

          setTimeRemainingSeconds(remainingSec);

          // Check if OFF_DELAY has passed: millis() - lastMotionTime > OFF_DELAY
          if (remainingSec <= 0) {
            setIsFanOn(false);
            soundManager.playRelayClick('OFF');
            addSerialLog(
              `No motion for ${config.offDelaySeconds} seconds. Turning fan OFF.`,
              'off'
            );

            // Trigger celebration confetti on successful automation test!
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.7 },
            });
          }
        }
      }
    }, 500);

    return () => clearInterval(timerInterval);
  }, [isFanOn, isMotionDetected, lastMotionTime, config.offDelaySeconds, addSerialLog]);

  // Copy Arduino .INO Code
  const handleCopyCode = () => {
    const inoCode = `// Pin Definitions
const int PIR_PIN = ${config.pirPin};    // PIR Motion Sensor connected to Digital Pin ${config.pirPin}
const int RELAY_PIN = ${config.relayPin};  // Relay Module connected to Digital Pin ${config.relayPin}

// Timer Variables
unsigned long lastMotionTime = 0;
const unsigned long OFF_DELAY = ${config.offDelaySeconds * 1000}; // ${config.offDelaySeconds} seconds delay (in milliseconds) before turning off
bool isFanOn = false;

void setup() {
  pinMode(PIR_PIN, INPUT);      // Set sensor pin as input
  pinMode(RELAY_PIN, OUTPUT);   // Set relay pin as output
  
  // Most relay modules are active LOW (LOW = ON, HIGH = OFF)
  digitalWrite(RELAY_PIN, ${config.relayActiveMode === 'LOW' ? 'HIGH' : 'LOW'}); 
  Serial.begin(9600);           // Serial communication for debugging
}

void loop() {
  int motionDetected = digitalRead(PIR_PIN);

  if (motionDetected == HIGH) {
    Serial.println("Motion detected! Turning fan ON.");
    digitalWrite(RELAY_PIN, ${config.relayActiveMode === 'LOW' ? 'LOW' : 'HIGH'}); // Turn Fan ON
    isFanOn = true;
    lastMotionTime = millis();    // Reset the timer
  } else {
    // Check if the delay time has passed since last motion
    if (isFanOn && (millis() - lastMotionTime > OFF_DELAY)) {
      Serial.println("No motion for ${config.offDelaySeconds} seconds. Turning fan OFF.");
      digitalWrite(RELAY_PIN, ${config.relayActiveMode === 'LOW' ? 'HIGH' : 'LOW'}); // Turn Fan OFF
      isFanOn = false;
    }
  }
  
  delay(500); // Small delay to prevent overload
}`;

    navigator.clipboard.writeText(inoCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleSendSerialCommand = (cmd: string) => {
    addSerialLog(`> ${cmd}`, 'system');
    if (cmd.toUpperCase().includes('MOTION') || cmd === '1') {
      handleTriggerMotion();
    } else if (cmd.toUpperCase().includes('OFF') || cmd === '0') {
      handleResetTimer();
    } else {
      addSerialLog(`Unknown command '${cmd}'. Try 'MOTION' or 'OFF'.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFanOn={isFanOn}
        isMotionDetected={isMotionDetected}
        timeRemainingSeconds={timeRemainingSeconds}
        offDelaySeconds={config.offDelaySeconds}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onTriggerMotion={handleTriggerMotion}
        onResetTimer={handleResetTimer}
        onCopyCode={handleCopyCode}
        codeCopied={codeCopied}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <SimulationRoom
              config={config}
              setConfig={setConfig}
              isMotionDetected={isMotionDetected}
              setIsMotionDetected={setIsMotionDetected}
              isFanOn={isFanOn}
              setIsFanOn={setIsFanOn}
              timeRemainingSeconds={timeRemainingSeconds}
              setTimeRemainingSeconds={setTimeRemainingSeconds}
              lastMotionTime={lastMotionTime}
              setLastMotionTime={setLastMotionTime}
              onTriggerMotion={handleTriggerMotion}
              onResetTimer={handleResetTimer}
              simulatedTemp={simulatedTemp}
              setSimulatedTemp={setSimulatedTemp}
            />

            {/* Embedded Live Serial Monitor */}
            <SerialMonitor
              logs={serialLogs}
              onClearLogs={() => setSerialLogs([])}
              onSendSerialCommand={handleSendSerialCommand}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <CodeViewer
            config={config}
            setConfig={setConfig}
            isMotionDetected={isMotionDetected}
            isFanOn={isFanOn}
            timeRemainingSeconds={timeRemainingSeconds}
            onCopyCode={handleCopyCode}
            codeCopied={codeCopied}
          />
        )}

        {activeTab === 'wiring' && (
          <div className="space-y-8">
            <HardwareVisualizer
              config={config}
              isMotionDetected={isMotionDetected}
              isFanOn={isFanOn}
            />
            <WiringGuide config={config} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <EnergyAnalytics config={config} setConfig={setConfig} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart Motion Fan Controller | Arduino Uno C++ Code Suite</span>
          <span className="text-slate-400">PIR Motion Sensor (Pin D2) + 5V Relay (Pin D7)</span>
        </div>
      </footer>

    </div>
  );
}
