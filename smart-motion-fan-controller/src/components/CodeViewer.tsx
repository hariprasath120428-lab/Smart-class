import React, { useState } from 'react';
import { Cpu, Copy, Check, Download, Sliders, RefreshCw, Sparkles, BookOpen, Terminal } from 'lucide-react';
import { SimulationConfig } from '../types';
import { generateArduinoCode } from '../lib/codeGenerator';

interface CodeViewerProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  isMotionDetected: boolean;
  isFanOn: boolean;
  timeRemainingSeconds: number;
  onCopyCode: () => void;
  codeCopied: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  config,
  setConfig,
  isMotionDetected,
  isFanOn,
  timeRemainingSeconds,
  onCopyCode,
  codeCopied,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'settings'>('code');

  const generatedCode = generateArduinoCode(config);

  const handleDownloadIno = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart_motion_fan_controller.ino';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine active highlighted step in code based on live simulation state
  const getActiveCodeStep = () => {
    if (isMotionDetected) {
      return 'motion_detected';
    }
    if (isFanOn && !isMotionDetected) {
      return 'counting_down';
    }
    if (!isFanOn) {
      return 'fan_off_idle';
    }
    return 'loop';
  };

  const activeStep = getActiveCodeStep();

  return (
    <div className="space-y-6">
      
      {/* Top Controller Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Arduino C++ Source Code & State Machine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time execution step highlighter based on sensor input and millis() timer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'code' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              C++ Code
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Code</span>
            </button>
          </div>

          <button
            onClick={onCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all"
          >
            {codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{codeCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadIno}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download .INO</span>
          </button>
        </div>
      </div>

      {activeTab === 'code' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Code View Box (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl font-mono text-xs overflow-x-auto relative">
            
            {/* Header file badge */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>smart_motion_fan_controller.ino</span>
              </span>
              <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
                Arduino Uno R3 Target
              </span>
            </div>

            {/* Formatted Code Block */}
            <pre className="text-slate-300 leading-relaxed space-y-1">
              <code>{generatedCode.split('\n').map((line, index) => {
                let isHighlighted = false;
                let highlightStyle = '';

                if (activeStep === 'motion_detected' && line.includes('digitalWrite(RELAY_PIN,')) {
                  isHighlighted = true;
                  highlightStyle = 'bg-emerald-950/90 text-emerald-300 border-l-4 border-emerald-400 px-2 rounded-r font-bold';
                } else if (activeStep === 'counting_down' && line.includes('millis() - lastMotionTime > OFF_DELAY')) {
                  isHighlighted = true;
                  highlightStyle = 'bg-cyan-950/90 text-cyan-300 border-l-4 border-cyan-400 px-2 rounded-r font-bold';
                } else if (activeStep === 'fan_off_idle' && line.includes('Turning fan OFF')) {
                  isHighlighted = true;
                  highlightStyle = 'bg-amber-950/90 text-amber-300 border-l-4 border-amber-400 px-2 rounded-r font-bold';
                }

                return (
                  <div key={index} className={`flex items-start ${isHighlighted ? highlightStyle : 'hover:bg-slate-900/50 px-1 rounded'}`}>
                    <span className="w-8 select-none text-slate-600 text-right pr-3">{index + 1}</span>
                    <span className="flex-1">{line}</span>
                  </div>
                );
              })}</code>
            </pre>
          </div>

          {/* Explanation Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Line-by-Line Logic Explanation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Line-by-Line Explanation</span>
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-mono text-cyan-400 font-bold block">1. const int PIR_PIN = {config.pirPin};</span>
                  <p className="text-slate-400 text-[11px]">
                    Reads digital HIGH (5V) when motion is detected by the HC-SR501 PIR sensor.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-mono text-cyan-400 font-bold block">2. const int RELAY_PIN = {config.relayPin};</span>
                  <p className="text-slate-400 text-[11px]">
                    Controls the 5V relay module coil. Most relay modules use Active LOW logic (<code className="text-amber-300">LOW = ON</code>).
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-mono text-cyan-400 font-bold block">3. lastMotionTime = millis();</span>
                  <p className="text-slate-400 text-[11px]">
                    Resets timer stamp to current uptime every time motion is re-triggered.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-mono text-cyan-400 font-bold block">4. millis() - lastMotionTime &gt; OFF_DELAY</span>
                  <p className="text-slate-400 text-[11px]">
                    Non-blocking timer logic. Calculates time elapsed since motion stopped before turning off relay.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Non-Blocking millis() is Better Than delay() */}
            <div className="bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-800/50 rounded-2xl p-4 shadow-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Why millis() Timer is Essential</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Using <code className="text-amber-300 font-mono">delay(30000)</code> would freeze the Arduino for 30 seconds, preventing it from detecting new motion or accepting input. The <code className="text-cyan-300 font-mono">millis()</code> method keeps the system fully responsive!
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Settings Customizer Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Customize Code Parameters & Hardware Wiring</h3>
            <p className="text-xs text-slate-400">Modify pins and timers; code updates instantly.</p>
          </div>

          <div className="space-y-4">
            {/* PIR Pin Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">PIR Sensor Pin:</label>
                <select
                  value={config.pirPin}
                  onChange={(e) => setConfig((prev) => ({ ...prev, pirPin: Number(e.target.value) }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                >
                  {[2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map((pin) => (
                    <option key={pin} value={pin}>Digital Pin D{pin}</option>
                  ))}
                </select>
              </div>

              {/* Relay Pin Selection */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 block">Relay Control Pin:</label>
                <select
                  value={config.relayPin}
                  onChange={(e) => setConfig((prev) => ({ ...prev, relayPin: Number(e.target.value) }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pin) => (
                    <option key={pin} value={pin}>Digital Pin D{pin}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Off Delay Timer Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-medium text-slate-300">Off-Delay Timer (seconds):</label>
                <span className="font-mono font-bold text-cyan-400">{config.offDelaySeconds}s ({config.offDelaySeconds * 1000} ms)</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={config.offDelaySeconds}
                onChange={(e) => setConfig((prev) => ({ ...prev, offDelaySeconds: Number(e.target.value) }))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Relay Active Polarity */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Relay Trigger Logic:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, relayActiveMode: 'LOW' }))}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    config.relayActiveMode === 'LOW'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Active LOW (Standard)</span>
                  <span className="text-[10px] text-slate-400">LOW = Fan ON, HIGH = Fan OFF</span>
                </button>

                <button
                  onClick={() => setConfig((prev) => ({ ...prev, relayActiveMode: 'HIGH' }))}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                    config.relayActiveMode === 'HIGH'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Active HIGH</span>
                  <span className="text-[10px] text-slate-400">HIGH = Fan ON, LOW = Fan OFF</span>
                </button>
              </div>
            </div>

            {/* Additional Features Toggle */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">Optional Hardware Modules:</span>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">DHT11 Temperature Sensor Guard</span>
                  <span className="text-[10px] text-slate-400">Only turn fan ON when motion detected AND temp &gt; threshold</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableTempSensor}
                  onChange={(e) => setConfig((prev) => ({ ...prev, enableTempSensor: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Buzzer Audio Alert</span>
                  <span className="text-[10px] text-slate-400">Short chirp on motion detection pin D{config.buzzerPin}</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableBuzzer}
                  onChange={(e) => setConfig((prev) => ({ ...prev, enableBuzzer: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-400"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('code')}
                className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:bg-cyan-400 transition-all"
              >
                View Generated Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
