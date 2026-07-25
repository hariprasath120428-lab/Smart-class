import React, { useState } from 'react';
import { Zap, DollarSign, Leaf, Sparkles, TrendingDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SimulationConfig } from '../types';

interface EnergyAnalyticsProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

export const EnergyAnalytics: React.FC<EnergyAnalyticsProps> = ({ config, setConfig }) => {
  const [unmanagedHoursPerDay, setUnmanagedHoursPerDay] = useState<number>(10); // Standard wasted hours when fan left running
  const [smartActiveHoursPerDay, setSmartActiveHoursPerDay] = useState<number>(3); // Actual room occupancy hours

  // Calculations
  const wastedHoursDaily = Math.max(0, unmanagedHoursPerDay - smartActiveHoursPerDay);
  
  // Power in Kilowatts
  const fanKw = config.fanWattage / 1000;

  const unmanagedKwhDaily = fanKw * unmanagedHoursPerDay;
  const smartKwhDaily = fanKw * smartActiveHoursPerDay;
  const kwhSavedDaily = unmanagedKwhDaily - smartKwhDaily;

  const kwhSavedMonthly = kwhSavedDaily * 30;
  const kwhSavedYearly = kwhSavedDaily * 365;

  const moneySavedMonthly = kwhSavedMonthly * config.electricityRate;
  const moneySavedYearly = kwhSavedYearly * config.electricityRate;

  // Approx 0.85 kg CO2 per kWh
  const co2SavedKgYearly = Math.round(kwhSavedYearly * 0.85);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Power & Financial Savings Calculator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimate how much electricity and money you save by automatically turning off fans when room is vacant.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 font-medium px-2">Currency:</span>
          {['₹', '$', '€', '£'].map((curr) => (
            <button
              key={curr}
              onClick={() => setConfig((prev) => ({ ...prev, currencySymbol: curr }))}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                config.currencySymbol === curr ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Parameters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders & Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Simulation Assumptions
          </h3>

          {/* Fan Power Rating */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Fan Power Rating (Watts):</label>
              <span className="font-mono font-bold text-amber-400">{config.fanWattage} Watts</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={config.fanWattage}
              onChange={(e) => setConfig((prev) => ({ ...prev, fanWattage: Number(e.target.value) }))}
              className="w-full accent-amber-400"
            />
            <p className="text-[10px] text-slate-500">Typical ceiling fan = 50W-75W, Desk fan = 35W.</p>
          </div>

          {/* Unmanaged Daily Hours */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Unmanaged Fan Run Time (Hours/Day):</label>
              <span className="font-mono font-bold text-red-400">{unmanagedHoursPerDay} hrs/day</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={unmanagedHoursPerDay}
              onChange={(e) => setUnmanagedHoursPerDay(Number(e.target.value))}
              className="w-full accent-red-400"
            />
            <p className="text-[10px] text-slate-500">Hours the fan is left running when people leave room without turning off.</p>
          </div>

          {/* Actual Occupied Hours */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Actual Occupy Time with Motion Sensor:</label>
              <span className="font-mono font-bold text-emerald-400">{smartActiveHoursPerDay} hrs/day</span>
            </div>
            <input
              type="range"
              min="1"
              max={unmanagedHoursPerDay}
              value={smartActiveHoursPerDay}
              onChange={(e) => setSmartActiveHoursPerDay(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
            <p className="text-[10px] text-slate-500">Fan runs only during actual motion + 30s delay.</p>
          </div>

          {/* Electricity Tariff Rate */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <label className="text-slate-300 font-medium">Electricity Tariff Rate per kWh:</label>
              <span className="font-mono font-bold text-cyan-400">{config.currencySymbol}{config.electricityRate.toFixed(2)} / kWh</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={config.electricityRate}
              onChange={(e) => setConfig((prev) => ({ ...prev, electricityRate: Number(e.target.value) }))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Savings Results Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Big Highlight Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Monthly Money Saved */}
            <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/80 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                <span>Monthly Money Saved</span>
                <span className="p-1 bg-emerald-900/60 rounded border border-emerald-700/80">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                {config.currencySymbol}{moneySavedMonthly.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400">
                {config.currencySymbol}{moneySavedYearly.toFixed(2)} saved every year per fan!
              </p>
            </div>

            {/* Monthly kWh Saved */}
            <div className="bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-800/80 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                <span>Monthly Power Saved</span>
                <span className="p-1 bg-cyan-900/60 rounded border border-cyan-700/80">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                {kwhSavedMonthly.toFixed(1)} kWh
              </div>
              <p className="text-[11px] text-slate-400">
                Wasted time eliminated: <strong className="text-amber-300">{wastedHoursDaily * 30} hours/month</strong>
              </p>
            </div>

          </div>

          {/* Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Direct Comparison: Standard vs Smart Fan</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Row 1: Daily Run Time */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Daily Run Time:</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-red-400 line-through">{unmanagedHoursPerDay} hrs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-emerald-400 font-bold">{smartActiveHoursPerDay} hrs</span>
                </div>
              </div>

              {/* Row 2: Daily Energy Consumed */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Daily Energy Consumed:</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-red-400">{unmanagedKwhDaily.toFixed(2)} kWh</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-emerald-400 font-bold">{smartKwhDaily.toFixed(2)} kWh</span>
                </div>
              </div>

              {/* Row 3: Environmental CO2 Saved */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Annual CO₂ Carbon Offset:</span>
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  ~{co2SavedKgYearly} kg CO₂ / year
                </span>
              </div>
            </div>

            {/* ROI Payback Period Box */}
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Payback Period Estimate:</span>
                <p className="text-slate-300 text-[11px]">
                  An Arduino Uno + HC-SR501 + 5V Relay kit costs under $8 (₹600). The system pays for itself in energy savings within 2 to 4 months!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
