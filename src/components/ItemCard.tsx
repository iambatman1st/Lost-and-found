import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { CATEGORY_COLORS, STATUS_STYLES } from '../utils/helpers';
import { MapPin, Clock, Eye, Sparkles, Gift } from 'lucide-react';

interface ItemCardProps {
  item: LostFoundItem;
  onOpenDetails: (item: LostFoundItem) => void;
  onActionClick: (item: LostFoundItem) => void;
  isMatched?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onOpenDetails,
  onActionClick,
  isMatched,
}) => {
  const [imageError, setImageError] = useState(false);
  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];
  const statusStyle = STATUS_STYLES[item.status];

  const handleCardClick = () => {
    onOpenDetails(item);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onActionClick(item);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-md hover:border-slate-200 cursor-pointer relative ${
        item.status === 'Returned' ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Smart Match Indicator Badge */}
      {isMatched && (
        <div className="absolute -top-2.5 left-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow flex items-center gap-1 z-10">
          <Sparkles className="w-3 h-3" /> Potential Match
        </div>
      )}

      {/* Image / Thumbnail Container */}
      <div className={`w-full h-36 ${categoryStyle.bg} rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative group shrink-0`}>
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className={`w-12 h-12 rounded-full ${categoryStyle.accent} text-white flex items-center justify-center font-bold text-lg mb-1 shadow-sm`}>
              {item.category.charAt(0)}
            </div>
            <span className={`text-xs font-bold ${categoryStyle.text}`}>
              {item.category}
            </span>
          </div>
        )}

        {/* Reward tag if lost and has reward */}
        {item.status === 'Lost' && item.reward && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
            <Gift className="w-3 h-3" /> {item.reward}
          </div>
        )}
      </div>

      {/* Header Info: Category + Status Badge */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${categoryStyle.text}`}>
          {item.category}
        </span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h4>

      {/* Location */}
      <p className="text-sm text-slate-500 mb-3 flex items-center gap-1 line-clamp-1">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{item.location}</span>
      </p>

      {/* Metadata Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-2 border-t border-slate-50">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {item.timeAgo}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-slate-400" />
          {item.viewsCount} views
        </span>
      </div>

      {/* Action Button */}
      {item.status === 'Found' ? (
        <button
          onClick={handleButtonClick}
          className="mt-auto w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm"
        >
          Claim Item
        </button>
      ) : item.status === 'Lost' ? (
        <button
          onClick={handleButtonClick}
          className="mt-auto w-full py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-bold transition-colors border border-blue-200"
        >
          I Found This
        </button>
      ) : (
        <div className="mt-auto w-full py-2.5 bg-slate-50 text-slate-400 rounded-xl text-sm font-bold text-center border border-dashed border-slate-200">
          Closed
        </div>
      )}
    </div>
  );
};
