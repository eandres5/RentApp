import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { ComentarioI } from 'src/app/models/comentarios.interface';
interface user {
  nombre: string,
  apellido: string,
  celular: string,
  correo: string,
  img: string
}

@Component({
  selector: 'app-showprofile',
  templateUrl: './showprofile.page.html',
  styleUrls: ['./showprofile.page.scss'],
})
export class ShowprofilePage implements OnInit {

  public usersR: any = [];

  comentarios: ComentarioI[];
  comen: any[];
  idu: string;
  idComentario: any;
  calificacionTotal: any;

  public room: any;

  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
    disponible: true,
    fecha: ''
  };

  constructor(
    private articuloService: ArticuloService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private comentarioService: ComentarioserviceService) { }

  ngOnInit() {

    /*
    
    this.comentarioService.getComentarioRoom(id).subscribe(room=>{
      console.log(room);
      this.room = room;
    });
    */
  }
  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData => {
        this.articulo = articuloData;
        //console.log(this.articulo.userId);
        this.datosUsuario(this.articulo.userId);
        this.cargarCalificaciones(this.articulo.userId);
      });
    }

  }

  cargarCalificaciones(idUsuario: string) {
    this.comentarioService.getComentarios().subscribe(res => {
      this.comentarios = [];
      var contador = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i].idPropietarioComen == idUsuario) {
          this.comentarios[contador] = res[i];
          contador++;
          this.idComentario = res[i].id;
          //console.log(this.idComentario);

          this.comentarioService.getComentarioRoom(this.idComentario).subscribe(room => {
            console.log(room);
            this.room = room;

            console.log(this.room.calificacionUsuarios.length);

            var promedio = 0.0;
            var dividir = 0.0;
            for(let i = 0; i < this.room.calificacionUsuarios.length; i++){
              promedio = this.room.calificacionUsuarios[i] + promedio;
              dividir = promedio/this.room.calificacionUsuarios.length;

              this.calificacionTotal = dividir;

              console.log(this.calificacionTotal);
              
            }

          });
        }
      }
    });

  }



  datosUsuario(id: string) {
    this.auth.obtenernombreUsuario(id).subscribe(usa => {
      const data2: user = usa.payload.data() as user;
      this.usersR[0] = data2;
      //console.log(this.usersR);
    });
  }
  navigateArticulo() {
    this.router.navigate(['home/detallever/' + this.articulo.id]);
  }

}
