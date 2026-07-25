import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Copy, Check, Download, Play, Shield, Pause } from 'lucide-react';
import { SerialLog } from '../types';

interface SerialMonitorProps {
  logs: SerialLog[];
  onClearLogs: () => void;
  onSendSerialCommand: (cmd: string) => void;
}

export const SerialMonitor: React.FC<SerialMonitorProps> = ({
  logs,
  onClearLogs,
  onSendSerialCommand,
}) => {
  const [inputCmd, setInputCmd] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCmd.trim()) return;
    onSendSerialCommand(inputCmd);
    setInputCmd('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-white text-sm">Arduino Serial Monitor</h3>
            <p className="text-[11px] text-slate-400">Baud Rate: 9600 baud | COM4 (Simulated)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              autoScroll ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {autoScroll ? 'Auto-Scroll: ON' : 'Auto-Scroll: OFF'}
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
            title="Copy Logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 rounded-lg border border-slate-700 transition-all"
            title="Clear Monitor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output Log Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-52 sm:h-64 font-mono text-xs overflow-y-auto space-y-1 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
            Waiting for Arduino Serial output... Trigger motion to see logs.
          </div>
        ) : (
          logs.map((log) => {
            let textColor = 'text-slate-300';
            if (log.type === 'motion') textColor = 'text-emerald-400 font-bold';
            if (log.type === 'off') textColor = 'text-amber-400 font-bold';
            if (log.type === 'system') textColor = 'text-cyan-400 font-semibold';

            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/60 px-1 rounded">
                <span className="text-slate-600 text-[10px] select-none shrink-0">[{log.timestamp}]</span>
                <span className={`flex-1 ${textColor}`}>{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>

      {/* Serial Input Send Field */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          placeholder="Send custom serial string (e.g. 'TEST_MOTION' or 'GET_STATUS')..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold border border-slate-700 transition-all"
        >
          Send
        </button>
      </form>

    </div>
  );
};
