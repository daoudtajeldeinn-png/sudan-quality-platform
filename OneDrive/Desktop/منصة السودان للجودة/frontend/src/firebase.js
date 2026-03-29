import { getFirestore } from 'firebase/firestore';
import app, { auth } from './firebase/config';

// Export Firestore instance
export const db = getFirestore(app);

export { auth, app };
