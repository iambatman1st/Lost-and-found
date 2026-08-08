import React, { useState } from 'react';
import { Category, ItemStatus, LocationSpot, LostFoundItem } from '../types';
import { CATEGORIES } from '../utils/helpers';
import { X, Upload, Sparkles, MapPin, Tag, Plus } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitItem: (newItem: Omit<LostFoundItem, 'id' | 'viewsCount' | 'timeAgo'>) => void;
  existingItems: LostFoundItem[];
}

const SAMPLE_IMAGE_PRESETS: Record<Category, string[]> = {
  Electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'
  ],
  'School Supplies': [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80'
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80'
  ],
  'Sports Equipment': [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=600&q=80'
  ],
  Other: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  ]
};

const LOCATION_SPOTS: LocationSpot[] = [
  'Central Cafeteria',
  'Main Library',
  'Student Union',
  'Indoor Sports Court',
  'North Parking Lot',
  'Science Building - Floor 2',
  'Campus Park',
  'Security Desk',
  'Other Location'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitItem,
  existingItems,
}) => {
  const [status, setStatus] = useState<ItemStatus>('Found');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const [spot, setSpot] = useState<LocationSpot>('Central Cafeteria');
  const [locationDetail, setLocationDetail] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [reward, setReward] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGE_PRESETS['Electronics'][0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reporterType, setReporterType] = useState<'Student' | 'Staff' | 'Visitor'>('Student');
  const [distinctiveMarks, setDistinctiveMarks] = useState('');

  if (!isOpen) return null;

  // Handle custom image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Find live matches during typing
  const liveMatches = title.trim().length > 2
    ? existingItems.filter(i => 
        i.status !== status &&
        i.category === category &&
        i.title.toLowerCase().includes(title.toLowerCase())
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !reporterName.trim() || !reporterContact.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const fullLocation = locationDetail ? `${spot} - ${locationDetail}` : spot;
    const finalImage = customImage || imageUrl;

    onSubmitItem({
      title: title.trim(),
      category,
      status,
      location: fullLocation,
      spot,
      coordinates: {
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20
      },
      dateReported: new Date().toISOString(),
      description: description.trim(),
      color: color.trim() || undefined,
      reward: status === 'Lost' && reward.trim() ? reward.trim() : undefined,
      imageUrl: finalImage,
      reporterName: reporterName.trim(),
      reporterContact: reporterContact.trim(),
      reporterType,
      distinctiveMarks: distinctiveMarks.trim() || undefined,
      claims: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Report an Item</h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit details so others can quickly find or claim lost belongings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Status Toggle: Lost vs Found */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setStatus('Found')}
                className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  status === 'Found'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I Found Something
              </button>
              <button
                type="button"
                onClick={() => setStatus('Lost')}
                className={`py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  status === 'Lost'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                I Lost Something
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Item Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., "Silver Sony Headphones", "Red Scarf"'
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as Category;
                  setCategory(newCat);
                  if (SAMPLE_IMAGE_PRESETS[newCat]) {
                    setImageUrl(SAMPLE_IMAGE_PRESETS[newCat][0]);
                  }
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live match warning if user is entering a title that matches opposite items */}
          {liveMatches.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Potential Existing Match Found!</span>
                There is already a {liveMatches[0].status.toLowerCase()} report for "
                <span className="font-bold">{liveMatches[0].title}</span>" at {liveMatches[0].location}. Check if it's yours before submitting!
              </div>
            </div>
          )}

          {/* Location Spot & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location Area <span className="text-red-500">*</span>
              </label>
              <select
                value={spot}
                onChange={(e) => setSpot(e.target.value as LocationSpot)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {LOCATION_SPOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Specific Spot / Area Detail
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder='e.g., "Table near booth #4", "2nd floor desk"'
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinguishing features, contents, brand, condition..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Optional Specs: Color, Reward, Distinctive Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Color Tag
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder='e.g., "Blue", "Black"'
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {status === 'Lost' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder='e.g., "$25"'
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className={status === 'Lost' ? 'col-span-1' : 'col-span-2'}>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                Key Verification Marks (Secret)
              </label>
              <input
                type="text"
                value={distinctiveMarks}
                onChange={(e) => setDistinctiveMarks(e.target.value)}
                placeholder='e.g., "Engraved initials DM on back"'
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo / Image Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
              Item Photo
            </label>
            <div className="space-y-3">
              {/* Preset Stock Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Preset Photo:</span>
                {(SAMPLE_IMAGE_PRESETS[category] || []).map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomImage(null);
                      setImageUrl(url);
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      !customImage && imageUrl === url
                        ? 'border-blue-600 ring-2 ring-blue-300'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload Custom File Input */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{customImage ? 'Change Uploaded Photo' : 'Upload Custom Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {customImage && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    ✓ Custom Photo Selected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reporter Contact Information */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Reporter Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Email / Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="contact@campus.edu"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Affiliation
                </label>
                <select
                  value={reporterType}
                  onChange={(e) => setReporterType(e.target.value as 'Student' | 'Staff' | 'Visitor')}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Staff">Faculty / Staff</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Submit Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
