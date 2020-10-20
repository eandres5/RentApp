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

  deleteArticulo(id: string): Promise<void>{
    return this.articuloCollection.doc(id).delete();
  }

  updateArticulo(titulore: any, id: string): Promise<void>{
    //si no funciona asi prueba con articulo.title, articulo.descripcion etc etc
    return this.articuloCollection.doc(id).update({titulo: titulore}).then(()=>{
      console.log("Actualizado");
    }).catch(function(err){
      console.log(err);
    });
  }

  updateTitulo(id: string, titulor: string): Promise<void>{
    console.log(id);
    return this.articuloCollection.doc(id).update({titulo: titulor});
  }

  updateDescripcion(descripcionR: any, id: string): Promise<void>{
    return this.articuloCollection.doc(id).update({descripcion: descripcionR}).then(()=>{
      console.log("Actualizado");
    }).catch(function(err){
      console.log(err);
    });
  }

  updateTelefono(telefonoR: any, id: string): Promise<void>{
    return this.articuloCollection.doc(id).update({telefono: telefonoR}).then(()=>{
      console.log("Actualizado");
    }).catch(function(err){
      console.log(err);
    });
  }

  updateCosto(costoR: any, id: string): Promise<void>{
    return this.articuloCollection.doc(id).update({costo: costoR}).then(()=>{
      console.log("Actualizado");
    }).catch(function(err){
      console.log(err);
    });
  }

  updateImg(imgR: any, id: string){
    return this.articuloCollection.doc(id).update({img: imgR}).then(()=>{
      console.log("actualizado");
    }).catch(function(err){
      console.log(err);
    });
  }
}
