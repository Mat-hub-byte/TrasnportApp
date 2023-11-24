import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService);

  //-----------------------------------AUTENTICACION------------------------------------
  getAuth() {  //método de import getAuth from 'firebase/auth' para la instancia de autenticación de Firebase, que es necesaria para llevar a cabo operaciones de autenticación en una aplicación.
    return getAuth();
  }

  //-----acceder------
  /**
   * 
   * @param user 
   * @returns //registra al usuario autenticando el email y el password del user
   */
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //--------------------registro--------------------
  /**
   * 
   * @param user 
   * @returns //crea un usuario con el email y el password del user
   */
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  //--------------------actualizar usuario--------------------
  /**
   * 
   * @param displayName 
   * @returns //actualiza informacion del user autenticado
   */
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //-------- Enviar mail para restablecer contraseña -------
  /**
   * 
   * @param email 
   * @returns // 1 envio con autenticacion al usuario y su email para reestablecer pw
   */
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //-------- Cerrar sesion -------
  /**
   * @method signOut // cierra sesion y elimina datos en el local storage
   */
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user'); //remueve user de locaslstorage
    this.utilsSvc.routerlink('/auth'); //redirije a login
  }

  //---------------------------------------- Base de Datos  ----------------------------------------

  /**
    * 
    * @param path 
    * @param collectionQuery 
    * @returns //Obtener documentos de una collecion
    */
  getCollectionData(path: string, collectionQuery?: any) { //Se utiliza la función query para aplicar una consulta a la referencia de la colección creada en el paso anterior. La consulta se define mediante el objeto collectionQuery
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });

  }

  //--------setear un documento--------
  /**
   * 
   * @param path 
   * @param data 
   * @returns //Setea un documento 
   */
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //--------Actualizar un documento--------
  /**
   * 
   * @param path 
   * @param data 
   * @returns 
   */
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data); //se crea una referencia a un documento en Firestore utilizando la función doc
  }

  //--------Eliminar un documento--------
  /**
   * 
   * @param path 
   * @returns 
   */
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path)); // realiza lo mismo que updateDocument pero sin devolver la data
  }


  //--------obtener un documento-------
  /**
   * 
   * @param path 
   * @returns // Obtiene un doc de Firestore con el mét. en getFirestore from '@angular/fire/firestore';
   */
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  //Agregar un documento
  /**
   * 
   * @param path 
   * @param data 
   * @returns //Agregar un documento a la colección que no existe
   */
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  //========================ALMACENAMIENTO============================

  //=============Subir imagen========
  /**
 * 
 * @param path 
 * @param data_url 
 * @returns uploadString Subir imagen
 * @returns getDownloadURL Almacenamiento 
 */
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    }
    )
  }

  //===========Obtener ruta de la imagen con su url ======
  /**
   * 
   * @param url 
   * @returns obtiene la url del archivo en storage
   */
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }
  /**
   * 
   * @param path 
   * @returns elemina 1 obj referenciado al path obtenido del storage
   */
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

}


