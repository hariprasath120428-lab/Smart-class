import React, { useState, useEffect, useRef } from 'react';
import { Fan, User, Radio, Zap, Clock, ShieldAlert, Sparkles, Sliders, Play, Square, RefreshCw, Thermometer, Info } from 'lucide-react';
import { SimulationConfig } from '../types';

interface SimulationRoomProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  isMotionDetected: boolean;
  setIsMotionDetected: (val: boolean) => void;
  isFanOn: boolean;
  setIsFanOn: (val: boolean) => void;
  timeRemainingSeconds: number;
  setTimeRemainingSeconds: React.Dispatch<React.SetStateAction<number>>;
  lastMotionTime: number;
  setLastMotionTime: (val: number) => void;
  onTriggerMotion: () => void;
  onResetTimer: () => void;
  simulatedTemp: number;
  setSimulatedTemp: (val: number) => void;
}

export const SimulationRoom: React.FC<SimulationRoomProps> = ({
  config,
  setConfig,
  isMotionDetected,
  setIsMotionDetected,
  isFanOn,
  setIsFanOn,
  timeRemainingSeconds,
  setTimeRemainingSeconds,
  lastMotionTime,
  setLastMotionTime,
  onTriggerMotion,
  onResetTimer,
  simulatedTemp,
  setSimulatedTemp,
}) => {
  // Person room positioning (0-100 percentage)
  const [personInRoom, setPersonInRoom] = useState<boolean>(true);
  const [personPosition, setPersonPosition] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [continuousMotion, setContinuousMotion] = useState<boolean>(false);
  const roomRef = useRef<HTMLDivElement>(null);

  // PIR Sensor beam coverage zone (around center x: 20-80, y: 20-80)
  const isInsideBeam = personInRoom && personPosition.x >= 20 && personPosition.x <= 80 && personPosition.y >= 25 && personPosition.y <= 85;

  // Handle continuous motion simulation or walking animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (continuousMotion && personInRoom) {
      interval = setInterval(() => {
        // Slight random movement simulating human breathing/fidgeting/walking in room
        setPersonPosition((prev) => ({
          x: Math.max(25, Math.min(75, prev.x + (Math.random() - 0.5) * 8)),
          y: Math.max(30, Math.min(80, prev.y + (Math.random() - 0.5) * 8)),
        }));
        onTriggerMotion();
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [continuousMotion, personInRoom, onTriggerMotion]);

  // Click room canvas to move person
  const handleRoomClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!roomRef.current) return;
    const rect = roomRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPersonPosition({ x, y });
    setPersonInRoom(true);

    // If moved inside PIR cone area, trigger motion
    if (x >= 20 && x <= 80 && y >= 25 && y <= 85) {
      onTriggerMotion();
    }
  };

  const handleWalkIn = () => {
    setPersonInRoom(true);
    setPersonPosition({ x: 50, y: 50 });
    onTriggerMotion();
  };

  const handleWalkOut = () => {
    setPersonInRoom(false);
    setContinuousMotion(false);
    setIsMotionDetected(false);
  };

  // Calculate percentage of timer
  const timerPercentage = Math.min(100, Math.max(0, (timeRemainingSeconds / config.offDelaySeconds) * 100));

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert / Explanation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-base font-bold text-white">Live Room Environment Simulation</h2>
            </div>
            <p className="text-xs text-slate-400">
              Click anywhere inside the room to move the person into the PIR motion sensor detection cone.
            </p>
          </div>

          {/* Quick Timer Presets */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Off-Delay:</span>
            </span>
            {[5, 15, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setConfig((prev) => ({ ...prev, offDelaySeconds: sec }));
                  setTimeRemainingSeconds(sec);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  config.offDelaySeconds === sec
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Room Visualizer & Live Telemetry Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2D Interactive Room Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
            
            {/* Header info bar above canvas */}
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">PIR Cone Field:</span>
                <span className={`px-2 py-0.5 rounded ${isInsideBeam ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'}`}>
                  {isInsideBeam ? 'ACTIVE BEAM INTERRUPT' : 'No Beam Interrupt'}
                </span>
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <span>Relay D7 Pin:</span>
                <span className={`font-bold ${
                  isFanOn
                    ? (config.relayActiveMode === 'LOW' ? 'text-amber-400' : 'text-emerald-400')
                    : 'text-slate-500'
                }`}>
                  {isFanOn ? (config.relayActiveMode === 'LOW' ? 'LOW (Active)' : 'HIGH (Active)') : (config.relayActiveMode === 'LOW' ? 'HIGH (Idle)' : 'LOW (Idle)')}
                </span>
              </div>
            </div>

            {/* Interactive Room Canvas Box */}
            <div
              ref={roomRef}
              onClick={handleRoomClick}
              className="relative w-full h-80 sm:h-96 rounded-xl border border-slate-800 bg-slate-950/80 cursor-crosshair overflow-hidden group select-none shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 1) 100%), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 24px 24px, 24px 24px',
              }}
            >
              
              {/* PIR Sensor Mounted on Top Wall */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                {/* PIR Sensor Module Hardware Box */}
                <div className="bg-slate-800 border-2 border-slate-700 px-3 py-1.5 rounded-b-lg shadow-lg flex items-center gap-2 text-[10px] font-mono text-slate-200">
                  <div className="relative flex items-center justify-center">
                    {/* Fresnal Dome */}
                    <div className="w-5 h-5 rounded-full bg-slate-200/90 border border-slate-400 shadow-inner flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isMotionDetected ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-cyan-300">HC-SR501 PIR</div>
                    <div className="text-[9px] text-slate-400">Pin {config.pirPin} Signal</div>
                  </div>
                  {/* PIR Status LED */}
                  <div className={`w-2.5 h-2.5 rounded-full ${isMotionDetected ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-700'}`} title={isMotionDetected ? 'PIR Output HIGH' : 'PIR Output LOW'} />
                </div>

                {/* PIR Fresnel Detection Field Beam Cone */}
                <div
                  className={`w-[260px] sm:w-[340px] h-[220px] sm:h-[260px] pointer-events-none transition-all duration-300 origin-top ${
                    isMotionDetected
                      ? 'bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-transparent border-x border-amber-500/30'
                      : 'bg-gradient-to-b from-cyan-500/10 via-cyan-500/5 to-transparent border-x border-cyan-500/15'
                  }`}
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  }}
                />
              </div>

              {/* Ceiling/Wall Smart Fan Visualizer */}
              <div className="absolute top-4 right-6 z-20 flex flex-col items-center">
                {/* Fan Box Frame */}
                <div className="relative p-3 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-xl flex flex-col items-center">
                  
                  {/* Relay Indicator Badge */}
                  <div className="absolute -top-2.5 -left-2 bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-300 flex items-center gap-1 shadow">
                    <div className={`w-2 h-2 rounded-full ${isFanOn ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-600'}`} />
                    <span>Relay {config.relayActiveMode === 'LOW' ? 'LOW' : 'HIGH'}</span>
                  </div>

                  {/* Fan Blades */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    {/* Spinning Blades */}
                    <div
                      className={`w-full h-full text-cyan-400 transition-all ${
                        isFanOn ? 'animate-spin' : 'opacity-60'
                      }`}
                      style={{ animationDuration: isFanOn ? '0.4s' : '0s' }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                        <circle cx="50" cy="50" r="10" className="text-slate-200" />
                        <path d="M50 40 C 40 20, 20 10, 50 10 C 60 20, 60 40, 50 40 Z" />
                        <path d="M50 60 C 60 80, 80 90, 50 90 C 40 80, 40 60, 50 60 Z" />
                        <path d="M40 50 C 20 60, 10 80, 10 50 C 20 40, 40 40, 40 50 Z" />
                        <path d="M60 50 C 80 40, 90 20, 90 50 C 80 60, 60 60, 60 50 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Airflow Particles */}
                  {isFanOn && (
                    <div className="absolute -bottom-6 flex justify-center space-x-1 pointer-events-none">
                      <div className="w-1 h-4 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-5 bg-cyan-300/80 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1 h-4 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}

                  <div className="text-[10px] font-bold text-slate-300 mt-1">
                    {isFanOn ? 'FAN ACTIVE (50W)' : 'FAN STOPPED'}
                  </div>
                </div>
              </div>

              {/* Dynamic Person Avatar */}
              {personInRoom ? (
                <div
                  className="absolute z-30 transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                  style={{ left: `${personPosition.x}%`, top: `${personPosition.y}%` }}
                >
                  <div className="relative group">
                    {/* Motion Ripple Effect when active */}
                    {isMotionDetected && (
                      <div className="absolute -inset-3 bg-amber-500/30 rounded-full animate-ping" />
                    )}

                    {/* Person Icon Badge */}
                    <div className={`p-2.5 rounded-full border-2 shadow-xl flex items-center justify-center transition-all ${
                      isInsideBeam
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.6)]'
                        : 'bg-blue-600 text-white border-blue-400'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>

                    {/* Tooltip Label */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-md">
                      {isInsideBeam ? 'In Motion Range' : 'Out of Sensor Field'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  <span>Room is Empty (No Motion Detected)</span>
                </div>
              )}

              {/* Click Instruction Hint */}
              <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800 pointer-events-none">
                💡 Click canvas to reposition person
              </div>
            </div>

            {/* Realtime Sensor Signal State & Wiring Status Footer */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PIR SENSOR (PIN {config.pirPin})</span>
                <span className={`font-bold ${isMotionDetected ? 'text-red-400' : 'text-slate-400'}`}>
                  {isMotionDetected ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">RELAY (PIN {config.relayPin})</span>
                <span className={`font-bold ${isFanOn ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isFanOn ? (config.relayActiveMode === 'LOW' ? 'LOW (ON)' : 'HIGH (ON)') : (config.relayActiveMode === 'LOW' ? 'HIGH (OFF)' : 'LOW (OFF)')}
                </span>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MILLIS TIMER</span>
                <span className="font-bold text-cyan-400">
                  {lastMotionTime === 0 ? '0 ms' : `${Math.round(performance.now() - lastMotionTime)} ms`}
                </span>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">STATE LOGIC</span>
                <span className="font-bold text-indigo-400">
                  {isFanOn ? (isMotionDetected ? 'RUNNING (REFRESHED)' : 'COUNTDOWN') : 'STANDBY'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Controller Controls & Timer Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Timer Countdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">30s Off-Delay Timer</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                OFF_DELAY = {config.offDelaySeconds * 1000}ms
              </span>
            </div>

            {/* Countdown Bar & Visual Dial */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Remaining Time:</span>
                <span className={`font-bold text-sm ${timeRemainingSeconds <= 5 && timeRemainingSeconds > 0 ? 'text-amber-400 animate-pulse' : 'text-cyan-300'}`}>
                  {isFanOn ? `${timeRemainingSeconds} seconds` : 'Timer Idle'}
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isMotionDetected
                      ? 'bg-emerald-400 w-full shadow-[0_0_8px_#34d399]'
                      : timeRemainingSeconds <= 5
                      ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${isFanOn ? timerPercentage : 0}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                When motion stops, the Arduino keeps the fan running for <span className="text-cyan-300 font-semibold">{config.offDelaySeconds}s</span> to allow person to sit or walk back before turning OFF.
              </p>
            </div>

            {/* Room Occupancy Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">Occupancy Actions:</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleWalkIn}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-all active:scale-95 shadow"
                >
                  <User className="w-4 h-4" />
                  <span>Enter Room</span>
                </button>

                <button
                  onClick={handleWalkOut}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-all active:scale-95"
                >
                  <Square className="w-4 h-4" />
                  <span>Leave Room</span>
                </button>
              </div>

              <button
                onClick={() => setContinuousMotion(!continuousMotion)}
                className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all border ${
                  continuousMotion
                    ? 'bg-amber-950 text-amber-300 border-amber-700 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{continuousMotion ? 'Stop Auto-Motion Walk' : 'Simulate Continuous Motion'}</span>
              </button>
            </div>

            {/* Temperature Guard Extension (Optional Feature) */}
            {config.enableTempSensor && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span>DHT11 Temperature Guard</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{simulatedTemp}°C</span>
                </div>
                
                <input
                  type="range"
                  min="20"
                  max="40"
                  value={simulatedTemp}
                  onChange={(e) => setSimulatedTemp(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />

                <p className="text-[10px] text-slate-400">
                  Threshold: <span className="text-slate-200 font-semibold">{config.tempThreshold}°C</span>. Fan will only turn ON if temperature is ≥ {config.tempThreshold}°C.
                </p>
              </div>
            )}

          </div>

          {/* Code Logic Quick Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>How the Logic Works:</span>
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li>PIR Motion Pin 2 reads <code className="text-amber-300">HIGH</code> on motion.</li>
              <li>Arduino turns Relay Pin 7 <code className="text-emerald-300">LOW</code> (turns Fan ON).</li>
              <li>`lastMotionTime` is updated with current `millis()`.</li>
              <li>When no motion, if <code className="text-cyan-300">millis() - lastMotionTime &gt; 30000</code>, fan turns OFF!</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
