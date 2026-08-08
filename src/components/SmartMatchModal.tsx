import React from 'react';
import { LostFoundItem, SmartMatchPair } from '../types';
import { X, Sparkles, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

interface SmartMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchPairs: SmartMatchPair[];
  onSelectPair: (item: LostFoundItem) => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  isOpen,
  onClose,
  matchPairs,
  onSelectPair,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Smart Match Assistant</h2>
            <p className="text-xs text-slate-500">
              Cross-referencing lost item reports against found listings using AI similarity algorithms.
            </p>
          </div>
        </div>

        {/* Matches List */}
        {matchPairs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 p-6">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 text-base mb-1">No High-Confidence Matches Right Now</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              As soon as new lost or found items are reported with overlapping categories, locations, or descriptions, potential matches will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {matchPairs.length} Candidate Pair(s) Identified
            </p>

            {matchPairs.map((pair, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm"
              >
                {/* Confidence bar header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                      {pair.confidenceScore}% Match Confidence
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Category: <strong className="text-slate-800">{pair.lostItem.category}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Pair #{index + 1}
                  </span>
                </div>

                {/* Side by Side Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  
                  {/* Lost Item Side */}
                  <div className="bg-white p-4 rounded-xl border border-red-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded">
                          Lost Report
                        </span>
                        <span className="text-[11px] text-slate-400">{pair.lostItem.timeAgo}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base mb-1">{pair.lostItem.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {pair.lostItem.location}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg">
                        "{pair.lostItem.description}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPair(pair.lostItem);
                      }}
                      className="mt-3 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 py-2 rounded-lg transition-colors text-center"
                    >
                      View Lost Details
                    </button>
                  </div>

                  {/* Found Item Side */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                          Found Listing
                        </span>
                        <span className="text-[11px] text-slate-400">{pair.foundItem.timeAgo}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base mb-1">{pair.foundItem.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {pair.foundItem.location}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg">
                        "{pair.foundItem.description}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPair(pair.foundItem);
                      }}
                      className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 py-2 rounded-lg transition-colors text-center"
                    >
                      View Found Details
                    </button>
                  </div>

                </div>

                {/* Match Reasons Pill List */}
                <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Match Evidence:</span>
                  {pair.matchReasons.map((reason, rIdx) => (
                    <span
                      key={rIdx}
                      className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium border border-indigo-100 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-indigo-600" /> {reason}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Assistant
          </button>
        </div>

      </div>
    </div>
  );
};
