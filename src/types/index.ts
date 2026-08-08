export type Category = 
  | 'Electronics'
  | 'Clothing'
  | 'School Supplies'
  | 'Accessories'
  | 'Sports Equipment'
  | 'Other';

export type ItemStatus = 'Lost' | 'Found' | 'Returned';

export type LocationSpot = 
  | 'Central Cafeteria'
  | 'Main Library'
  | 'Student Union'
  | 'Indoor Sports Court'
  | 'North Parking Lot'
  | 'Science Building - Floor 2'
  | 'Campus Park'
  | 'Security Desk'
  | 'Other Location';

export interface ClaimRequest {
  id: string;
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  proofDescription: string;
  dateSubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface LostFoundItem {
  id: string;
  title: string;
  category: Category;
  status: ItemStatus;
  location: string;
  spot: LocationSpot;
  coordinates: { x: number; y: number }; // Percentage coordinates on interactive map
  dateReported: string; // ISO string or relative time
  timeAgo: string;
  description: string;
  color?: string;
  reward?: string;
  imageUrl?: string;
  reporterName: string;
  reporterContact: string;
  reporterType: 'Student' | 'Staff' | 'Visitor';
  distinctiveMarks?: string;
  claims?: ClaimRequest[];
  viewsCount: number;
}

export interface SmartMatchPair {
  lostItem: LostFoundItem;
  foundItem: LostFoundItem;
  confidenceScore: number; // 0 to 100
  matchReasons: string[];
}
