import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { ComentarioI } from '../models/comentarios.interface';
import { firestore } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ComentarioserviceService {

  private comentarioCollection: AngularFirestoreCollection<ComentarioI>;
  private comentarios: Observable<ComentarioI[]>;

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

  addComentario(comentario: ComentarioI): Promise<DocumentReference>{
    return this.comentarioCollection.add(comentario);
  }
  
  guadarComentario(comentario: any, idComentario: any){
    this.afs.collection('comentarios').doc(idComentario).update({
      comentariosUsuarios: firestore.FieldValue.arrayUnion(comentario),
    });
  }

  guadarCalificacion(calificacion: any, idComentario: any){
    this.afs.collection('comentarios').doc(idComentario).update({
      calificacionUsuarios: firestore.FieldValue.arrayUnion(calificacion),
    });
  }
  addUsers(usuariId: String){

  }

}
