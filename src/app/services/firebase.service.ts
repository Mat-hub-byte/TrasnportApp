import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { retry } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);



  //-----------------------------------AUTENTICACION------------------------------------
  getAuth() {
    return getAuth();
  }

  //-----acceder------

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //--------------------registro--------------------

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  //--------------------actualizar usuario--------------------
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //-------- Enviar mail para restablecer contraseña -------

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //-------- Cerrar sesion -------

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('item');
    this.utilsSvc.routerlink('/auth');
  }

  //---------------------------------------- Base de Datos  ----------------------------------------

  //--------setear un documento--------
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //--------obtener un documento-------

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


}
