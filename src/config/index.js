// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytes,
	deleteObject,
} from 'firebase/storage'
import {
	getFirestore,
	doc,
	setDoc,
	getDocs,
	getDoc,
	addDoc,
	collection,
	query,
	where,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore'
import {
	getAuth,
	FacebookAuthProvider,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyC_U2OnfC84d9vTINElh1lqQXjPRenDRVc',
	authDomain: 'hanime-shop.firebaseapp.com',
	projectId: 'hanime-shop',
	storageBucket: 'hanime-shop.appspot.com',
	messagingSenderId: '13304886795',
	appId: '1:13304886795:web:f81a57304f7675987cf90e',
	measurementId: 'G-G85KSCJYFY',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {
	db,
	storage,
	analytics,
	auth,
	ref,
	addDoc,
	where,
	query,
	updateDoc,
	deleteDoc,
	getDownloadURL,
	deleteObject,
	uploadBytes,
	doc,
	setDoc,
	getDoc,
	getDocs,
	collection,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	FacebookAuthProvider,
}
