import { Injectable } from '@angular/core';

//importamos los modulos de angular y firebase
//import libraries angular and firebase

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TaskI } from '../models/task.interface';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private articuloCollection: AngularFirestoreCollection<TaskI>;
  private articulos: Observable<TaskI[]>;

  constructor(private afs: AngularFirestore){
    this.articuloCollection = afs.collection<TaskI>('articulos');
    this.articulos = this.articuloCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
        });
      })
    );
  }

  getArticulos(): Observable<TaskI[]>{
    return this.articulos;
  }

  getArticulo(id: string): Observable<TaskI>{
    return this.articuloCollection.doc<TaskI>(id).valueChanges().pipe(
      take(1),
      map(articulo=>{
        articulo.id = id;
        return articulo;
      })
    );
  }

  getArticuloUsu(userId: string): Observable<TaskI>{
    console.log(userId);
    return this.articuloCollection.doc<TaskI>(userId).valueChanges().pipe(
      take(1),
      map(articulo=>{
        articulo.userId = userId;
        return articulo;
      })
    );
  }
  addArticulo(articulo: TaskI): Promise<DocumentReference>{
    return this.articuloCollection.add(articulo);
  }

  updateArticulo(articulo: TaskI, id: string): Promise<void>{
    //si no funciona asi prueba con articulo.title, articulo.descripcion etc etc
    return this.articuloCollection.doc(id).update(articulo);
  }

  deleteArticulo(id: string): Promise<void>{
    return this.articuloCollection.doc(id).delete();
  }



  /*
  private articulosCollection: AngularFirestoreCollection<TaskI>;
  private articulos: Observable<TaskI[]>;
  
  constructor(db: AngularFirestore) {
    this.articulosCollection = db.collection<TaskI>('articulos');
    this.articulos = this.articulosCollection.snapshotChanges().pipe(map(
      actions =>{
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data}
        });
      }
    ));
   }
   */
  

   /*
   getArticulos(){
     return this.articulos;
   }

   getArticulo(id: string){
     return this.articulosCollection.doc<TaskI>(id).valueChanges();
   }

   //create function CRUD
   updateArticulo(articulo: TaskI, id: string){
     return this.articulosCollection.doc(id).update(articulo);
   }

   addArticulo(articulo: TaskI){
     return this.articulosCollection.add(articulo);
   }

   removeArticulo(articulo: TaskI, id: string){
     return this.articulosCollection.doc(id).delete();
   }
   */
}
