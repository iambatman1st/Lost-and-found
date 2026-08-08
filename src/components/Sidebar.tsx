import React from 'react';
import { Category, ItemStatus } from '../types';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/helpers';
import { 
  Laptop, 
  Shirt, 
  BookOpen, 
  Watch, 
  Trophy, 
  Package, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Archive,
  BookMarked
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  selectedStatus: ItemStatus | 'All';
  onSelectStatus: (status: ItemStatus | 'All') => void;
  categoryCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  onOpenGuideModal: () => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Electronics: <Laptop className="w-4 h-4" />,
  Clothing: <Shirt className="w-4 h-4" />,
  'School Supplies': <BookOpen className="w-4 h-4" />,
  Accessories: <Watch className="w-4 h-4" />,
  'Sports Equipment': <Trophy className="w-4 h-4" />,
  Other: <Package className="w-4 h-4" />
};

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  categoryCounts,
  statusCounts,
  onOpenGuideModal,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0 overflow-y-auto">
      {/* Categories Navigation */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Categories
        </h3>
        <nav className="space-y-1">
          {/* All Items */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedCategory === 'All' ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              />
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" /> All Items
              </span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
              {categoryCounts['All'] || 0}
            </span>
          </button>

          {/* Individual Categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const style = CATEGORY_COLORS[cat];
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm transition-colors ${
                  isSelected
                    ? `${style.bg} ${style.text} font-semibold`
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? style.accent : 'bg-slate-300'
                    }`}
                  />
                  <span className="flex items-center gap-2">
                    {CATEGORY_ICONS[cat]}
                    {cat}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter by Status */}
      <div className="mb-6 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Status Filter
        </h3>
        <div className="space-y-1 text-sm">
          <button
            onClick={() => onSelectStatus('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedStatus === 'All'
                ? 'bg-slate-100 font-bold text-slate-900'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Statuses</span>
            <span className="text-xs font-semibold text-slate-400">
              {statusCounts['All'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectStatus('Found')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedStatus === 'Found'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Found Items
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
              {statusCounts['Found'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectStatus('Lost')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedStatus === 'Lost'
                ? 'bg-red-50 text-red-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Lost Reports
            </span>
            <span className="text-xs font-semibold text-red-700 bg-red-100/60 px-2 py-0.5 rounded-full">
              {statusCounts['Lost'] || 0}
            </span>
          </button>

          <button
            onClick={() => onSelectStatus('Returned')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedStatus === 'Returned'
                ? 'bg-slate-200 text-slate-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Archive className="w-3.5 h-3.5 text-slate-500" /> Returned / Closed
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {statusCounts['Returned'] || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Guide Card */}
      <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <BookMarked className="w-4 h-4 text-blue-600" /> Recovery Tips
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Lost something recently or found an item? Check our verification and claim safety tips.
        </p>
        <button
          onClick={onOpenGuideModal}
          className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:shadow-sm hover:border-slate-300 transition-all"
        >
          View Guide
        </button>
      </div>
    </aside>
  );
};
