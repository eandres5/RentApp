import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';

interface comen {
  id: string;
  idPropietarioComen: string,
  nombre: string,
  apellido: string,
  usuarios: {}
}
@Component({
  selector: 'app-rentados',
  templateUrl: './rentados.page.html',
  styleUrls: ['./rentados.page.scss'],
})
export class RentadosPage implements OnInit {

  comentarios: ComentarioI[];
  comentarios2: ComentarioI[];
  comentariost: any = [];
  ids: any = [];
  
  cargar: any;

  comentariosId: any = [];
  idComentarioPropietario: string;
  public idu: any;
  
  constructor(public comentarioService: ComentarioserviceService,
    public auth: AuthService,
    private router: Router,
    public navCtrl: NavController, 
    private modalCtrl: ModalController

  ) { 
  }

  ngOnInit() {

    this.cargarCalificaciones();
    this.cargarIdUsuarioActivo();
  }

  ngOnDestroy() {
    this.cargar.unsubscribe();
  }

  cargarCalificaciones() {
    this.cargar = this.auth.isAuth().subscribe(user => {
      if (user) {
        this.idu = user.uid;
        this.comentarios = [];
        
        var contador = 0;
        this.comentarioService.buscarComentariosUsu(this.idu).snapshotChanges().subscribe(comen => {
          console.log(comen);
          console.log(contador);
          this.comentariost = [];
          if (comen) {
            for (let i = 0; i < comen.length; i++) {
              const data: comen = comen[contador].payload.doc.data() as comen;
              data.id = comen[contador].payload.doc.id;
              this.comentariost[contador] = data;
              contador++;
            }
          }
          contador = 0;
        })
      }
    });
  }

  cargarIdUsuarioActivo(){
    this.comentarioService.getComentarios().subscribe(res=>{
      this.comentariosId = res;
      for (let i = 0; i < this.comentariosId.length; i++) {
        if (this.comentariosId[i].idPropietarioComen == this.idu) {
          this.idComentarioPropietario = this.comentariosId[i].id;
          break;
        }
      }
    });
  }

  calificar(comentarioID: string, idUsuario: string) {
    console.log(comentarioID);
    console.log(idUsuario);
    console.log(this.idComentarioPropietario);
    
    this.router.navigate(['home/comentario/' + comentarioID + "/"+ idUsuario + "/" + this.idComentarioPropietario]);
  }

  directToNewPage() {
    this.navCtrl.navigateRoot('/home/rentados');
  }

}
