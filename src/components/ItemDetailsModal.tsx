import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { CATEGORY_COLORS, STATUS_STYLES } from '../utils/helpers';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Tag, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Share2, 
  Check
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: LostFoundItem | null;
  onClose: () => void;
  onOpenClaim: (item: LostFoundItem) => void;
  onMarkReturned: (itemId: string) => void;
  potentialMatches: LostFoundItem[];
  onSelectMatchedItem: (item: LostFoundItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onOpenClaim,
  onMarkReturned,
  potentialMatches,
  onSelectMatchedItem,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];
  const statusStyle = STATUS_STYLES[item.status];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white shadow-sm border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image / Banner */}
        <div className={`w-full h-56 ${categoryStyle.bg} relative flex items-center justify-center overflow-hidden shrink-0`}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <div className={`w-16 h-16 rounded-2xl ${categoryStyle.accent} text-white flex items-center justify-center font-bold text-2xl mx-auto mb-2 shadow-md`}>
                {item.category.charAt(0)}
              </div>
              <span className={`text-sm font-bold ${categoryStyle.text}`}>
                {item.category}
              </span>
            </div>
          )}

          {/* Status overlay badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyle.bg} ${statusStyle.text} shadow-sm`}>
              {statusStyle.label}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-slate-800 border border-slate-200 shadow-sm`}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Title + Reward */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-700">{item.location}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{item.timeAgo}</span>
              </p>
            </div>

            {item.status === 'Lost' && item.reward && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-2xl flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <Gift className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-600">Reward Offered</div>
                  <div className="text-base font-bold text-amber-900">{item.reward}</div>
                </div>
              </div>
            )}
          </div>

          {/* Item Description */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Description & Details
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {item.color && (
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                  <Tag className="w-3 h-3" /> Color Tag
                </div>
                <div className="text-sm font-bold text-slate-800">{item.color}</div>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" /> Date Logged
              </div>
              <div className="text-sm font-bold text-slate-800">
                {new Date(item.dateReported).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                <User className="w-3 h-3" /> Reported By
              </div>
              <div className="text-sm font-bold text-slate-800 truncate">
                {item.reporterName} ({item.reporterType})
              </div>
            </div>
          </div>

          {/* Distinctive Marks Notice if present */}
          {item.distinctiveMarks && (
            <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block text-blue-900 mb-0.5">Verification Key Hint:</span>
                {item.distinctiveMarks}
              </div>
            </div>
          )}

          {/* Potential Matches Box */}
          {potentialMatches.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Smart Match Suggestions ({potentialMatches.length})</span>
              </div>
              <p className="text-xs text-indigo-700 mb-3">
                Our algorithm detected {potentialMatches.length} matching {item.status === 'Lost' ? 'found' : 'lost'} item(s) in this category!
              </p>
              <div className="space-y-2">
                {potentialMatches.slice(0, 2).map((match) => (
                  <div
                    key={match.id}
                    onClick={() => onSelectMatchedItem(match)}
                    className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center justify-between hover:border-indigo-300 cursor-pointer transition-all shadow-sm"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{match.title}</div>
                      <div className="text-xs text-slate-500">{match.location} • {match.timeAgo}</div>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reporter Contact Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Contact Handler</div>
                <div className="text-sm font-bold text-slate-800">{item.reporterContact}</div>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share Item'}</span>
            </button>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {item.status === 'Found' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Claim This Item
              </button>
            )}

            {item.status === 'Lost' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> I Found This Item!
              </button>
            )}

            {item.status !== 'Returned' && (
              <button
                onClick={() => onMarkReturned(item.id)}
                className="py-3 px-5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm transition-colors border border-slate-200"
              >
                Mark as Returned
              </button>
            )}

            <button
              onClick={onClose}
              className="py-3 px-5 bg-white text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors border border-slate-200"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
