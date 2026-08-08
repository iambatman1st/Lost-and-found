import React, { useState, useEffect, useMemo } from 'react';
import { Category, ItemStatus, LostFoundItem } from './types';
import { INITIAL_ITEMS } from './data/initialItems';
import { calculateSmartMatches, formatRelativeTime } from './utils/helpers';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ReportModal } from './components/ReportModal';
import { ClaimModal } from './components/ClaimModal';
import { SmartMatchModal } from './components/SmartMatchModal';
import { GuideModal } from './components/GuideModal';
import { MapView } from './components/MapView';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Filter, SlidersHorizontal, RefreshCw, SearchX, Sparkles, Grid, MapPin } from 'lucide-react';

const STORAGE_KEY = 'FOUNDIT_ITEMS_V1';

export default function App() {
  // Load items from localStorage or fallback to seed data
  const [items, setItems] = useState<LostFoundItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load items from storage:', e);
    }
    return INITIAL_ITEMS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to storage:', e);
    }
  }, [items]);

  // Filtering & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Modal States
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<LostFoundItem | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostFoundItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSmartMatchModalOpen, setIsSmartMatchModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Compute category & status counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    for (const item of items) {
      counts[item.status] = (counts[item.status] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Compute Smart Match pairs across all open items
  const smartMatches = useMemo(() => {
    return calculateSmartMatches(items);
  }, [items]);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'All' && item.status !== selectedStatus) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesDesc = item.description.toLowerCase().includes(query);
          const matchesLoc = item.location.toLowerCase().includes(query);
          const matchesCat = item.category.toLowerCase().includes(query);
          const matchesColor = item.color ? item.color.toLowerCase().includes(query) : false;

          return matchesTitle || matchesDesc || matchesLoc || matchesCat || matchesColor;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
        } else if (sortOrder === 'oldest') {
          return new Date(a.dateReported).getTime() - new Date(b.dateReported).getTime();
        } else {
          return b.viewsCount - a.viewsCount;
        }
      });
  }, [items, selectedCategory, selectedStatus, searchQuery, sortOrder]);

  // Handle open item details & increment view count
  const handleOpenItemDetails = (item: LostFoundItem) => {
    setSelectedItemForDetails(item);
    // Increment view count
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, viewsCount: i.viewsCount + 1 } : i))
    );
  };

  // Handle Submit New Item
  const handleAddItem = (
    newItemData: Omit<LostFoundItem, 'id' | 'viewsCount' | 'timeAgo'>
  ) => {
    const newItem: LostFoundItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      viewsCount: 1,
      timeAgo: 'Just now'
    };

    setItems((prev) => [newItem, ...prev]);
    addToast(
      'success',
      'Report Published!',
      `Your ${newItem.status.toLowerCase()} report for "${newItem.title}" is now active.`
    );
  };

  // Handle Submit Claim
  const handleSubmitClaim = (
    itemId: string,
    claimData: { name: string; email: string; phone: string; proof: string }
  ) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    addToast(
      'success',
      'Request Submitted!',
      `Your verification claim for "${item.title}" was sent to ${item.reporterName}.`
    );
  };

  // Handle Mark Item as Returned
  const handleMarkReturned = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: 'Returned' as const } : i))
    );
    if (selectedItemForDetails?.id === itemId) {
      setSelectedItemForDetails((prev) => (prev ? { ...prev, status: 'Returned' as const } : null));
    }
    addToast('info', 'Status Updated', 'Item marked as Returned & Closed.');
  };

  // Reset to default sample dataset
  const handleResetSampleData = () => {
    if (confirm('Reset all lost & found items back to original demo dataset?')) {
      setItems(INITIAL_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      addToast('info', 'Dataset Reset', 'Restored demo items.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      
      {/* Header Bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSmartMatchModal={() => setIsSmartMatchModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        smartMatchesCount={smartMatches.length}
      />

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Categories Sidebar */}
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          categoryCounts={categoryCounts}
          statusCounts={statusCounts}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
        />

        {/* Main Feed Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#F8FAFC] flex flex-col">
          
          {/* Section Header with Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedCategory === 'All' ? 'Recent Findings & Reports' : `${selectedCategory} Items`}
                </h2>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100"
                  >
                    Clear Filter ✕
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}{' '}
                {selectedStatus !== 'All' ? `with status "${selectedStatus}"` : 'in lost & found inventory'}
              </p>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Smart Match Banner Pill */}
              {smartMatches.length > 0 && (
                <button
                  onClick={() => setIsSmartMatchModalOpen(true)}
                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{smartMatches.length} Smart Match Suggestions</span>
                </button>
              )}

              {/* View mode toggle for smaller screens */}
              <div className="md:hidden flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg ${viewMode === 'map' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Order Dropdown */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'popular')}
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="popular">Sort: Most Viewed</option>
                </select>
              </div>

              {/* Reset Data Button */}
              <button
                onClick={handleResetSampleData}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors shadow-sm"
                title="Reset sample data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Grid View vs Map View */}
          {viewMode === 'map' ? (
            <div className="flex-1 min-h-0">
              <MapView
                items={filteredItems}
                onSelectItem={handleOpenItemDetails}
              />
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">No Matching Items Found</h3>
              <p className="text-sm text-slate-500 max-w-md mb-6">
                We couldn't find anything matching your search criteria. Try adjusting your category or search terms, or report a lost item.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                  }}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Reset Search Filters
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
                >
                  + Report New Item
                </button>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isMatchedPair = smartMatches.some(
                  (pair) => pair.lostItem.id === item.id || pair.foundItem.id === item.id
                );

                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isMatched={isMatchedPair}
                    onOpenDetails={handleOpenItemDetails}
                    onActionClick={(itemToAct) => setSelectedItemForClaim(itemToAct)}
                  />
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedItemForDetails}
        onClose={() => setSelectedItemForDetails(null)}
        onOpenClaim={(item) => setSelectedItemForClaim(item)}
        onMarkReturned={handleMarkReturned}
        potentialMatches={
          selectedItemForDetails
            ? smartMatches
                .filter(
                  (m) =>
                    m.lostItem.id === selectedItemForDetails.id ||
                    m.foundItem.id === selectedItemForDetails.id
                )
                .map((m) =>
                  m.lostItem.id === selectedItemForDetails.id ? m.foundItem : m.lostItem
                )
            : []
        }
        onSelectMatchedItem={(item) => setSelectedItemForDetails(item)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitItem={handleAddItem}
        existingItems={items}
      />

      {/* Claim Modal */}
      <ClaimModal
        item={selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
        onSubmitClaim={handleSubmitClaim}
      />

      {/* Smart Match Assistant Modal */}
      <SmartMatchModal
        isOpen={isSmartMatchModalOpen}
        onClose={() => setIsSmartMatchModalOpen(false)}
        matchPairs={smartMatches}
        onSelectPair={(item) => handleOpenItemDetails(item)}
      />

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Toast Alerts */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
