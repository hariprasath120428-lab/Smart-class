import React from 'react';
import { BookOpen, Cpu, ShieldAlert, CheckCircle2, Wrench, Zap, HelpCircle, Layers } from 'lucide-react';
import { SimulationConfig } from '../types';

interface WiringGuideProps {
  config: SimulationConfig;
}

export const WiringGuide: React.FC<WiringGuideProps> = ({ config }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Step-by-Step Hardware Build & Assembly Guide</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Follow this detailed tutorial to connect your Arduino Uno, PIR Sensor, and Relay Module safely.
        </p>
      </div>

      {/* Grid: BOM Parts List & Step-by-Step Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bill of Materials (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Bill of Materials (BOM)</span>
          </h3>

          <ul className="space-y-2.5 text-xs">
            <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Arduino Uno R3</span>
                <span className="text-[10px] text-slate-400">or Nano / NodeMCU / ESP32</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold">1x</span>
            </li>

            <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">HC-SR501 PIR Sensor</span>
                <span className="text-[10px] text-slate-400">Pyroelectric Infrared Motion Module</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">1x</span>
            </li>

            <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">5V Relay Module</span>
                <span className="text-[10px] text-slate-400">Optocoupler isolation (Active LOW)</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">1x</span>
            </li>

            <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Jumper Wires</span>
                <span className="text-[10px] text-slate-400">Male-to-Female & Male-to-Male</span>
              </div>
              <span className="font-mono text-slate-400 font-bold">6x</span>
            </li>

            <li className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">5V Power Supply / USB Cable</span>
                <span className="text-[10px] text-slate-400">Powers Arduino & Sensor</span>
              </div>
              <span className="font-mono text-slate-400 font-bold">1x</span>
            </li>
          </ul>

          {/* PIR Potentiometer Adjustment Tips */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-amber-300 block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>HC-SR501 Potentiometer Dials:</span>
            </span>
            <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
              <li><strong className="text-slate-200">Sx (Sensitivity):</strong> Turn fully counter-clockwise for ~3 meters, or clockwise up to 7 meters detection range.</li>
              <li><strong className="text-slate-200">Tx (Time Delay):</strong> Turn fully counter-clockwise to minimize sensor hardware delay (~3s) so the software Arduino `OFF_DELAY` handles the timing cleanly!</li>
              <li><strong className="text-slate-200">Jumper Mode:</strong> Set jumper to position "H" (Repeat Trigger mode) so continuous motion keeps output HIGH.</li>
            </ul>
          </div>
        </div>

        {/* Step-by-Step Instructions (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Assembly Steps</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Step 1 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-xs">1</span>
                <span>Connect PIR Motion Sensor to Arduino</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-8">
                Locate the 3 pins under the HC-SR501 dome (labeled VCC, OUT, GND).
              </p>
              <ul className="pl-8 space-y-1 text-[11px] text-slate-400 font-mono">
                <li>• Connect PIR <strong className="text-red-400">VCC</strong> pin to Arduino <strong className="text-red-400">5V</strong> pin</li>
                <li>• Connect PIR <strong className="text-amber-300">OUT</strong> signal pin to Arduino <strong className="text-amber-300">Digital Pin D{config.pirPin}</strong></li>
                <li>• Connect PIR <strong className="text-slate-400">GND</strong> pin to Arduino <strong className="text-slate-400">GND</strong> pin</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xs">2</span>
                <span>Connect 5V Relay Module Control Input</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-8">
                The relay module isolates the low-voltage Arduino circuit from the fan power line.
              </p>
              <ul className="pl-8 space-y-1 text-[11px] text-slate-400 font-mono">
                <li>• Connect Relay <strong className="text-red-400">VCC</strong> pin to Arduino <strong className="text-red-400">5V</strong> pin</li>
                <li>• Connect Relay <strong className="text-emerald-300">IN</strong> input signal pin to Arduino <strong className="text-emerald-300">Digital Pin D{config.relayPin}</strong></li>
                <li>• Connect Relay <strong className="text-slate-400">GND</strong> pin to Arduino <strong className="text-slate-400">GND</strong> pin</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-800 flex items-center justify-center text-xs">3</span>
                <span>Wire Fan Load Across Relay Terminals (COM & NO)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-8">
                The Relay acts like an automatic light switch.
              </p>
              <ul className="pl-8 space-y-1 text-[11px] text-slate-400 font-mono">
                <li>• Connect one wire of the Fan power source to Relay <strong className="text-amber-300">COM (Common)</strong> terminal.</li>
                <li>• Connect the Fan power wire to Relay <strong className="text-amber-300">NO (Normally Open)</strong> terminal.</li>
                <li>• Leave <strong className="text-slate-500">NC (Normally Closed)</strong> disconnected.</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-xs">4</span>
                <span>Upload Arduino C++ Code via Arduino IDE</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] pl-8">
                Open Arduino IDE, select board "Arduino Uno", choose your COM port, paste the generated code, and click Upload. Open Serial Monitor at 9600 baud to verify motion logs!
              </p>
            </div>

          </div>

          {/* Troubleshooting FAQ */}
          <div className="border-t border-slate-800 pt-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Troubleshooting FAQ</span>
            </h4>

            <div className="space-y-2 text-xs">
              <details className="bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                <summary className="font-bold text-slate-200 text-[11px]">Q: Why does the fan stay ON continuously without turning off?</summary>
                <p className="text-slate-400 text-[11px] mt-1 pl-3 leading-relaxed">
                  1. Check if your relay is Active LOW (LOW = ON). If your code sets pin HIGH expecting it to turn OFF, ensure <code className="text-amber-300">digitalWrite(RELAY_PIN, HIGH);</code> is used for turning off.<br />
                  2. Ensure the Tx delay pot on the PIR sensor is turned fully counter-clockwise to allow Arduino code timer to take precedence.
                </p>
              </details>

              <details className="bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                <summary className="font-bold text-slate-200 text-[11px]">Q: Why does the fan turn on immediately when Arduino powers up?</summary>
                <p className="text-slate-400 text-[11px] mt-1 pl-3 leading-relaxed">
                  In <code className="text-cyan-300">setup()</code>, standard Arduino digital output pins boot up in LOW state before execution. Writing <code className="text-amber-300">digitalWrite(RELAY_PIN, HIGH);</code> immediately after <code className="text-cyan-300">pinMode(RELAY_PIN, OUTPUT);</code> keeps the fan OFF during bootup.
                </p>
              </details>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
