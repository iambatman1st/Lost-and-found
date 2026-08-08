import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { X, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface ClaimModalProps {
  item: LostFoundItem | null;
  onClose: () => void;
  onSubmitClaim: (itemId: string, claimData: { name: string; email: string; phone: string; proof: string }) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  onClose,
  onSubmitClaim,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [proof, setProof] = useState('');

  if (!item) return null;

  const isFound = item.status === 'Found';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !proof.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    onSubmitClaim(item.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      proof: proof.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isFound ? `Claim "${item.title}"` : `I Found "${item.title}"`}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isFound
              ? 'To claim this found item, please provide ownership details for verification.'
              : 'Provide your contact info so the owner who lost this item can reach out to you!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Verification / Proof Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              {isFound ? 'Ownership Proof & Details' : 'Where is the item now?'} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder={
                isFound
                  ? 'Describe phone wallpaper, stickers, scratches, contents inside, or specific markings...'
                  : 'Describe where you found it or where you handed it in (e.g., Security Desk / Info Desk)...'
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@campus.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 019-2831"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <strong>Verification Note:</strong> Your request will be transmitted directly to the item reporter ({item.reporterName}).
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
