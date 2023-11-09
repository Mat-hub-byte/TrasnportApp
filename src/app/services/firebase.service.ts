import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData,query} from '@angular/fire/firestore';
import { Observable, retry } from 'rxjs';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {getStorage,uploadString,ref,getDownloadURL} from 'firebase/storage'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http:HttpClient){}
    getAll(): Observable<any>{
      return this.http.get<any>('https://www.cultura.gob.ar/api/v2.0/museos/');
    
  }
  
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)
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


   //Obtener documentos de una collecion
   getCollectionData(path:string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref,collectionQuery), {idField:'id'});

   }

  //--------setear un documento--------
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //--------obtener un documento-------

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  //Agregar un documento

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


    //ALMACENAMIENTO

    //Subir imagen

    async uploadImage(path: string, data_url:string){
      return uploadString(ref(getStorage(),path), data_url,'data_url').then(()=>{ 
      return getDownloadURL(ref(getStorage(),path))}
    )}

    

  }


