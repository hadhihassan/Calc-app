import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ArrowUpRight, RotateCw, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './ui/Card';

export const HistoryList = ({ refreshTrigger }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/actions/history', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setHistoryItems(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-full max-h-[640px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HistoryIcon size={18} className="text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-100">History</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {historyItems.length}
          </span>
        </div>
        <button
          type="button"
          onClick={fetchHistory}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Refresh history"
          id="btn-refresh-history"
        >
          <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 mt-2 pr-1">
        {loading && historyItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading history...
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No calculations recorded yet.
          </div>
        ) : (
          historyItems.map((item) => (
            <div
              key={item._id}
              className="py-3 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded bg-slate-800 text-indigo-300 font-mono font-bold flex items-center justify-center text-sm shrink-0">
                  {item.operation}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-mono text-slate-200 truncate">
                    {item.expression}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {formatTimestamp(item.createdAt)}
                    </span>
                    <span className="text-emerald-400 font-medium uppercase text-[10px] flex items-center gap-0.5">
                      <CheckCircle2 size={10} />
                      {item.status || 'ok'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
