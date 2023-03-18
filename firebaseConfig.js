import {initializeApp, getApps, getApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyCRFVKeZBaLLM_4IOse224NYe5YTsvl1rQ',
    authDomain: 'webchat-f730f.firebaseapp.com',
    projectId: 'webchat-f730f',
    storageBucket: 'webchat-f730f.appspot.com',
    messagingSenderId: '985547033722',
    appId: '1:985547033722:web:3f1e7595c8263a5740ffc3'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
