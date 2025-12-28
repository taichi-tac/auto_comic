export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  status: UserStatus;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
}

export interface UserData {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  status: UserStatus;
  createdAt: any; // Firestore Timestamp
  approvedAt?: any;
  approvedBy?: string;
  rejectedAt?: any;
  rejectedBy?: string;
}
