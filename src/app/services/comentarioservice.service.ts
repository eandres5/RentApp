import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { ComentarioI } from '../models/comentarios.interface';
import { firestore } from 'firebase';
import { MensajeComentarioI } from '../models/mensajeComentario.interface';
import { UsuariosComentariosI } from '../models/usuariosComentarios.interface';


@Injectable({
  providedIn: 'root'
})
export class ComentarioserviceService {

  private comentarioCollection: AngularFirestoreCollection<ComentarioI>;
  private comentarios: Observable<ComentarioI[]>;
  private comentario: ComentarioI;

  constructor(private afs: AngularFirestore) { 
    this.comentarioCollection = afs.collection<ComentarioI>('comentarios');
    this.comentarios = this.comentarioCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
        });
      })
    );
  }
  getComentarioss(){
    return this.afs.collection('comentarios').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data:  ComentarioI  =a.payload.doc.data() as ComentarioI;
        data.id= a.payload.doc.id;
        return data;
      })
    }));
    
  }
  getComentarios(): Observable<ComentarioI[]>{
    return this.comentarios;
  }

  getComentario(id: string): Observable<ComentarioI>{
    return this.comentarioCollection.doc<ComentarioI>(id).valueChanges().pipe(
      take(1),
      map(comenta=>{
        comenta.id = id;
        return comenta;
      })
    );
  }

  getComentarios2(){

    return this.comentarioCollection.snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data: ComentarioI =a.payload.doc.data() as ComentarioI;
        data.id= a.payload.doc.id;
        return data;
      })
    }));
  }

  getComentarioRoom(idComentario: string){
    return this.comentarioCollection.doc(idComentario).valueChanges();
  }

  addComentario(comentario: ComentarioI): Promise<DocumentReference>{
    return this.comentarioCollection.add(comentario);
  }
  
  guadarComentario(comentario: MensajeComentarioI, idComentario: any){
    this.afs.collection('comentarios').doc(idComentario).update({
      comentariosUsuarios: firestore.FieldValue.arrayUnion(comentario),
    });
  }

  guadarCalificacion(calificacion: any, idComentario: any){
    this.afs.collection('comentarios').doc(idComentario).update({
      calificacionUsuarios: firestore.FieldValue.arrayUnion(calificacion),
    });
  }
  
  addUsers(usuarioId: any, idComentario: any){
  
    this.afs.collection('comentarios').doc(idComentario).update({
      usuarios: firestore.FieldValue.arrayUnion(usuarioId),
    });
  }
  getComen(){
    return this.afs.collection('comentarios').get();
  }
  
  agregarComen(nombre:string,apellido:string,idPropietarioComen: string, uid: string){
    console.log("uno");
    this.afs.collection('comentarios').add({nombre:nombre,
      apellido:apellido,
      idPropietarioComen:idPropietarioComen,
      usuarios: firestore.FieldValue.arrayUnion(uid)
    })
  }

  buscarComentariosUsu(uid: string){
    return this.afs.collection('comentarios',ref => ref.where('usuarios', 'array-contains',uid));
  }
  }