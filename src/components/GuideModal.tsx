import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, MapPin, Search } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lost & Found Recovery Guide</h2>
            <p className="text-xs text-slate-500">
              Essential tips for verifying ownership, safe exchanges, and quick item recovery.
            </p>
          </div>
        </div>

        {/* Guide Content */}
        <div className="space-y-6 text-slate-700 text-sm">
          
          {/* Section 1: Verifying Ownership */}
          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" /> 1. How to Verify Ownership Safely
            </h3>
            <ul className="space-y-2 text-xs text-blue-950 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Ask for non-visible details:</strong> Request wallpaper images, lock screen photos, engraved initials, or serial numbers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Check notebook/document contents:</strong> Ask for class professor names or specific chapter titles written inside.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Key Fobs & Wallets:</strong> Verify student ID numbers or key chain attachments without revealing them beforehand.</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Safe Meetup Spots */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" /> 2. Recommended Safe Meetup Points
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Always arrange exchanges in well-lit, high-traffic public locations or designated campus facilities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800 text-center">
                Central Campus Security Desk
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800 text-center">
                Student Union Info Hub
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800 text-center">
                Main Library Front Desk
              </div>
            </div>
          </div>

          {/* Section 3: Safety Warnings */}
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
            <h3 className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> 3. Fraud Prevention & Scams
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-900 leading-relaxed">
              <li>• Never send wire transfers or money before seeing the lost item in person.</li>
              <li>• If offering a cash reward, hand it over only upon successful item receipt.</li>
              <li>• Report suspicious or fraudulent claims immediately to Campus Security.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-colors"
          >
            Got It, Thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
