import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user$: Observable<User>;

  constructor(      
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
    ) { 
      // Get the auth state, then fetch the Firestore user document or return null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }

    // Sign in function
    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
    }
  
    // Update data function
    private updateUserData(user) {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
      
      let listOfPeople: string[];

      const data = { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        listOfPeople,
      } 
  
      return userRef.set(data, { merge: true })
  
    }
  
    // Sign out
    async signOut() {
      await this.afAuth.signOut();
      this.router.navigate(['/']);
    }
}
