import React from 'react';
import { Search, Plus, Sparkles, MapPin, Grid, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenReportModal: () => void;
  onOpenSmartMatchModal: () => void;
  onOpenGuideModal: () => void;
  viewMode: 'grid' | 'map';
  onToggleViewMode: (mode: 'grid' | 'map') => void;
  smartMatchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenReportModal,
  onOpenSmartMatchModal,
  onOpenGuideModal,
  viewMode,
  onToggleViewMode,
  smartMatchesCount,
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 shrink-0 gap-4 z-20 sticky top-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSearchChange('')}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 text-white font-black text-xl">
          F
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">
          FoundIt<span className="text-blue-600">.</span>
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Search for items (e.g., "iPhone", "Toyota keys", "notebook")'
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* View Toggle */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onToggleViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => onToggleViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Campus Map
          </button>
        </div>

        {/* AI Smart Match Assistant Trigger */}
        <button
          onClick={onOpenSmartMatchModal}
          className="relative flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700 px-3.5 py-2 rounded-full text-xs font-bold hover:bg-indigo-100 transition-all"
          title="Smart Match Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="hidden lg:inline">Smart Match</span>
          {smartMatchesCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
              {smartMatchesCount}
            </span>
          )}
        </button>

        {/* Guide Modal Trigger */}
        <button
          onClick={onOpenGuideModal}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          title="Safety & Claim Guide"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        {/* Report Button */}
        <button
          onClick={onOpenReportModal}
          className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>
    </header>
  );
};
