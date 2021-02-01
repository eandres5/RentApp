import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CandidatoI } from '../models/candidato.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidatosserService {

  private candidatoCollection: AngularFirestoreCollection<CandidatoI>;
  private candidatos: Observable<CandidatoI[]>;

  constructor(private afs: AngularFirestore) {
    this.candidatoCollection = afs.collection<CandidatoI>('candidatos');
    this.candidatos = this.candidatoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        });
      })
    );
  }

  getCandidatos() {
    return this.afs.collection('candidatos').snapshotChanges().pipe(map(rooms => {
      return rooms.map(a => {
        const data: CandidatoI = a.payload.doc.data() as CandidatoI;
        data.id = a.payload.doc.id;
        return data;
      })
    }));

  }
  getCandidatosService(): Observable<CandidatoI[]> {
    return this.candidatos;
  }

  agregarCandidato(nombre: string, apellido: string, uid: string, idArticulo: string){
    this.afs.collection('candidatos').add({
      nombre: nombre,
      apellido: apellido,
      idPropietario: uid,
      articulo: firestore.FieldValue.arrayUnion(idArticulo)
    })
  }

  addUsers(idArticulo: any, idCandidato: any){
  
    this.afs.collection('candidatos').doc(idCandidato).update({
      articulo: firestore.FieldValue.arrayUnion(idArticulo),
    });
  }

  deleteUsers(usuarioId: any, idCandidato: any){
    this.afs.collection('candidatos').doc(idCandidato).update({
      usuarios: firestore.FieldValue.arrayRemove(usuarioId),
    });
  }

  buscarUsuCandidatos(uid: string) {
    return this.afs.collection('candidatos', ref => ref.where('articulo', 'array-contains',uid));
  }

}
