import React from 'react';
import { Fan, Cpu, Volume2, VolumeX, Play, RotateCcw, Copy, Check, ShieldCheck, Zap } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isFanOn: boolean;
  isMotionDetected: boolean;
  timeRemainingSeconds: number;
  offDelaySeconds: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onTriggerMotion: () => void;
  onResetTimer: () => void;
  onCopyCode: () => void;
  codeCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isFanOn,
  isMotionDetected,
  timeRemainingSeconds,
  offDelaySeconds,
  soundEnabled,
  setSoundEnabled,
  onTriggerMotion,
  onResetTimer,
  onCopyCode,
  codeCopied,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Brand & Status */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md text-white flex items-center justify-center">
              <Fan className={`w-6 h-6 ${isFanOn ? 'animate-spin' : ''}`} style={{ animationDuration: isFanOn ? '0.8s' : '0s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">Smart Motion Fan Controller</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-medium">
                  Arduino C++
                </span>
              </div>
              <p className="text-xs text-slate-400">PIR Motion Sensor + Relay Automated Shutdown Logic</p>
            </div>
          </div>

          {/* Realtime Status Pills */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Fan Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isFanOn
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isFanOn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <Fan className={`w-3.5 h-3.5 ${isFanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '1s' }} />
              <span>{isFanOn ? 'FAN: ON (Power Active)' : 'FAN: OFF (Standby)'}</span>
            </div>

            {/* Sensor Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isMotionDetected
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isMotionDetected ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{isMotionDetected ? 'PIR: MOTION DETECTED' : 'PIR: No Motion'}</span>
            </div>

            {/* Timer Badge */}
            {isFanOn && !isMotionDetected && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800/80 text-xs font-mono font-semibold">
                <Zap className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>OFF in {timeRemainingSeconds}s</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerMotion}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-medium shadow transition-all active:scale-95"
              title="Simulate human motion near the PIR sensor"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Trigger Motion</span>
            </button>

            <button
              onClick={onResetTimer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-all active:scale-95"
              title="Force Fan OFF immediately"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
              title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-lg text-xs font-medium transition-all"
            >
              {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{codeCopied ? 'Copied .INO' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-xs rounded-t-lg transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Fan className="w-4 h-4" />
            <span>Interactive Simulator & Room</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-xs rounded-t-lg transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Arduino C++ Code & Logic</span>
          </button>

          <button
            onClick={() => setActiveTab('wiring')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-xs rounded-t-lg transition-all whitespace-nowrap ${
              activeTab === 'wiring'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Circuit Wiring Schematic</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-xs rounded-t-lg transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Energy & Cost Savings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
