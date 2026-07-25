import React from 'react';
import { ShieldCheck, Cpu, Zap, Info, Radio, Fan, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SimulationConfig } from '../types';

interface HardwareVisualizerProps {
  config: SimulationConfig;
  isMotionDetected: boolean;
  isFanOn: boolean;
}

export const HardwareVisualizer: React.FC<HardwareVisualizerProps> = ({
  config,
  isMotionDetected,
  isFanOn,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Schematic Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Interactive Circuit & Wiring Diagram</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Arduino Uno R3 + HC-SR501 PIR Sensor + 5V Relay Module + Fan Power Switch.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
            PIR: <strong className="text-amber-400">Pin D{config.pirPin}</strong>
          </span>
          <span className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
            Relay: <strong className="text-emerald-400">Pin D{config.relayPin}</strong>
          </span>
        </div>
      </div>

      {/* Visual Hardware Schematic Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden relative">
        <div className="text-xs text-slate-400 font-mono mb-4 flex items-center justify-between">
          <span className="text-slate-300 font-bold">Wokwi-Style Hardware Schematic Simulation</span>
          <span className="text-cyan-400 font-semibold">Live Signals Active</span>
        </div>

        {/* Board & Components Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* 1. HC-SR501 PIR Motion Sensor Module Box */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                <span>PIR HC-SR501 Sensor</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isMotionDetected ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'}`}>
                {isMotionDetected ? 'OUT = HIGH (5V)' : 'OUT = LOW (0V)'}
              </span>
            </div>

            {/* Fresnel Dome Art */}
            <div className="relative w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-400 shadow-inner flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full border-2 border-slate-300 transition-all ${
                isMotionDetected ? 'bg-red-500 animate-ping shadow-[0_0_20px_#ef4444]' : 'bg-slate-300'
              }`} />
              <div className="absolute inset-0 rounded-full border border-slate-400/50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.1) 100%)' }} />
            </div>

            {/* Potentiometer Adjusters */}
            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-3">
              <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-center">
                <span className="block font-bold text-slate-300">Sx Pot</span>
                <span>Sensitivity</span>
              </div>
              <div className="bg-slate-950 p-1.5 rounded border border-slate-800 text-center">
                <span className="block font-bold text-slate-300">Tx Pot</span>
                <span>Hardware Delay</span>
              </div>
            </div>

            {/* Pins Output */}
            <div className="w-full pt-2 flex justify-around text-xs font-mono font-bold border-t border-slate-800/80">
              <span className="text-red-400" title="VCC -> Arduino 5V">VCC (5V)</span>
              <span className="text-amber-400" title={`OUT -> Arduino Pin D${config.pirPin}`}>OUT (D{config.pirPin})</span>
              <span className="text-slate-400" title="GND -> Arduino GND">GND</span>
            </div>
          </div>

          {/* 2. Arduino Uno Microcontroller Box */}
          <div className="bg-slate-900 border-2 border-cyan-800/60 rounded-2xl p-4 flex flex-col items-center justify-between space-y-4 shadow-2xl relative bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Arduino Uno R3</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                MCU Active
              </span>
            </div>

            {/* Microchip Representation */}
            <div className="w-32 h-16 bg-slate-950 border-2 border-slate-800 rounded-lg flex items-center justify-center p-2 relative shadow-inner">
              <div className="w-full h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                ATmega328P
              </div>
              <div className="absolute -left-1 top-2 bottom-2 w-1 bg-amber-500/80 rounded" />
            </div>

            {/* Microcontroller Pin Status Indicators */}
            <div className="w-full space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Digital Pin D{config.pirPin} (PIR IN):</span>
                <span className={`font-bold ${isMotionDetected ? 'text-red-400' : 'text-slate-500'}`}>
                  {isMotionDetected ? 'HIGH (1)' : 'LOW (0)'}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Digital Pin D{config.relayPin} (Relay OUT):</span>
                <span className={`font-bold ${isFanOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isFanOn ? (config.relayActiveMode === 'LOW' ? 'LOW (0)' : 'HIGH (1)') : (config.relayActiveMode === 'LOW' ? 'HIGH (1)' : 'LOW (0)')}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono text-center">
              Powered via 5V USB / DC Barrel Jack
            </div>
          </div>

          {/* 3. 5V Relay Module & Fan Power Circuit */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>5V Relay Module</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isFanOn ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {isFanOn ? 'COIL CLOSED (ON)' : 'COIL OPEN (OFF)'}
              </span>
            </div>

            {/* Relay Coil Cuboid */}
            <div className="w-24 h-20 bg-blue-950 border-2 border-blue-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1 relative shadow-lg">
              <div className="text-[10px] font-bold text-blue-200">SRD-05VDC-SL-C</div>
              <div className={`w-3 h-3 rounded-full ${isFanOn ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]' : 'bg-slate-700'}`} />
              <div className="text-[9px] font-mono text-slate-300">
                {isFanOn ? 'Contact: COM-NO' : 'Contact: COM-NC'}
              </div>
            </div>

            {/* Fan Load Output Connection */}
            <div className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Fan className={`w-5 h-5 text-cyan-400 ${isFanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '0.8s' }} />
                <span className="font-bold text-slate-200">AC/DC Fan</span>
              </div>
              <span className={`font-bold ${isFanOn ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isFanOn ? 'SPINNING' : 'STOPPED'}
              </span>
            </div>

            <div className="w-full pt-2 flex justify-around text-xs font-mono font-bold border-t border-slate-800/80">
              <span className="text-blue-400" title={`IN -> Arduino Pin D${config.relayPin}`}>IN (D{config.relayPin})</span>
              <span className="text-red-400" title="VCC -> Arduino 5V">VCC (5V)</span>
              <span className="text-slate-400" title="GND -> Arduino GND">GND</span>
            </div>
          </div>

        </div>

        {/* Pin Connection Table */}
        <div className="mt-8 border-t border-slate-800 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Complete Hardware Pin Connections Table</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Component</th>
                  <th className="p-3">Component Pin</th>
                  <th className="p-3">Arduino Pin</th>
                  <th className="p-3">Wire Color Standard</th>
                  <th className="p-3">Function / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-amber-400">PIR Motion Sensor</td>
                  <td className="p-3 font-bold">VCC</td>
                  <td className="p-3 text-red-400 font-bold">5V</td>
                  <td className="p-3 text-red-400">Red (+5V)</td>
                  <td className="p-3 text-slate-400">Powers motion detector IC</td>
                </tr>

                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-amber-400">PIR Motion Sensor</td>
                  <td className="p-3 font-bold">OUT</td>
                  <td className="p-3 text-amber-300 font-bold">Digital Pin D{config.pirPin}</td>
                  <td className="p-3 text-amber-300">Yellow / Orange</td>
                  <td className="p-3 text-slate-400">Output HIGH signal (3.3V/5V) on motion</td>
                </tr>

                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-amber-400">PIR Motion Sensor</td>
                  <td className="p-3 font-bold">GND</td>
                  <td className="p-3 text-slate-400 font-bold">GND</td>
                  <td className="p-3 text-slate-400">Black / Blue</td>
                  <td className="p-3 text-slate-400">Common Ground</td>
                </tr>

                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-emerald-400">5V Relay Module</td>
                  <td className="p-3 font-bold">IN</td>
                  <td className="p-3 text-emerald-300 font-bold">Digital Pin D{config.relayPin}</td>
                  <td className="p-3 text-emerald-300">Blue / Green</td>
                  <td className="p-3 text-slate-400">Relay switch control ({config.relayActiveMode === 'LOW' ? 'Active LOW' : 'Active HIGH'})</td>
                </tr>

                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-emerald-400">5V Relay Module</td>
                  <td className="p-3 font-bold">VCC</td>
                  <td className="p-3 text-red-400 font-bold">5V</td>
                  <td className="p-3 text-red-400">Red (+5V)</td>
                  <td className="p-3 text-slate-400">Powers optocoupler & relay coil</td>
                </tr>

                <tr className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-emerald-400">5V Relay Module</td>
                  <td className="p-3 font-bold">COM & NO</td>
                  <td className="p-3 text-slate-400">Mains AC / DC Line</td>
                  <td className="p-3 text-slate-400">Black / Brown Wire</td>
                  <td className="p-3 text-slate-400">Interrupts Fan Phase line (Normally Open)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Electrical Safety Warning */}
        <div className="mt-6 bg-amber-950/40 border border-amber-700/60 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Safety Notice for 220V / 110V Mains Fans:</span>
            <p className="text-amber-300/80 text-[11px] leading-relaxed">
              When controlling a high-voltage household ceiling fan (110V-240V AC), make sure to turn off main circuit breakers before wiring. Keep high-voltage AC wires isolated from Arduino low-voltage DC pins.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
