import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { map } from 'rxjs/operators';
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

  public idu: any;

  constructor(public comentarioService: ComentarioserviceService,
    public auth: AuthService,
    private router: Router

  ) { }

  ngOnInit() {

    this.cargarCalificaciones();


  }

  cargarCalificaciones() {
    this.auth.isAuth().subscribe(user => {
      if (user) {
        this.idu = user.uid;
        this.comentarios = [];
        var contador = 0;
        this.comentarioService.buscarComentariosUsu(this.idu).snapshotChanges().subscribe(comen => {
          if (comen) {
            for (let i = 0; i < comen.length; i++) {
              const data: comen = comen[contador].payload.doc.data() as comen;
              data.id = comen[contador].payload.doc.id;
              this.comentariost[contador] = data;
              contador++;
            }
          }
        })
      }
    });
  }

  calificar(comentarioID: string) {
    console.log(comentarioID);
    this.router.navigate(['home/comentario/' + comentarioID]);
  }

}
