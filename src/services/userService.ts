import { User as FirebaseUser } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, UserData, UserStatus } from '../types/user';

const USERS_COLLECTION = 'users';

/**
 * Firestoreのユーザーデータを取得
 */
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data() as UserData;
    return {
      uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      status: data.status,
      createdAt: data.createdAt?.toDate() || new Date(),
      approvedAt: data.approvedAt?.toDate(),
      approvedBy: data.approvedBy,
      rejectedAt: data.rejectedAt?.toDate(),
      rejectedBy: data.rejectedBy,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

/**
 * 新規ユーザーを作成（初回ログイン時）
 */
export async function createUser(firebaseUser: FirebaseUser): Promise<User> {
  const userData: UserData = {
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    status: 'pending',
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), userData);

  return {
    uid: firebaseUser.uid,
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
    status: 'pending',
    createdAt: new Date(),
  };
}

/**
 * 既存ユーザーを取得、なければ作成
 */
export async function getOrCreateUser(firebaseUser: FirebaseUser): Promise<User> {
  let user = await getUserData(firebaseUser.uid);

  if (!user) {
    user = await createUser(firebaseUser);
  }

  return user;
}

/**
 * ユーザーを承認
 */
export async function approveUser(uid: string, approvedBy: string): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      status: 'approved',
      approvedAt: serverTimestamp(),
      approvedBy,
    });
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}

/**
 * ユーザーを拒否
 */
export async function rejectUser(uid: string, rejectedBy: string): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectedBy,
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
}

/**
 * すべてのユーザーを取得（管理者用）
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));

    return usersSnapshot.docs.map(doc => {
      const data = doc.data() as UserData;
      return {
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        approvedAt: data.approvedAt?.toDate(),
        approvedBy: data.approvedBy,
        rejectedAt: data.rejectedAt?.toDate(),
        rejectedBy: data.rejectedBy,
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * 承認待ちユーザーを取得
 */
export async function getPendingUsers(): Promise<User[]> {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data() as UserData;
      return {
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting pending users:', error);
    throw error;
  }
}
