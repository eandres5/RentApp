import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatoI } from 'src/app/models/candidato.interface';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { TaskI } from 'src/app/models/task.interface';
import { UsuariosComentariosI } from 'src/app/models/usuariosComentarios.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatosserService } from 'src/app/services/candidatosser.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';

interface arti {
  id: string;
  idPropietario: string;
  articulo: {};
}

interface user {
  uid: string,
  nombre: string,
  apellido: string,
  celular: string,
  correo: string,
  img: string
}

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.page.html',
  styleUrls: ['./candidatos.page.scss'],
})
export class CandidatosPage implements OnInit {

  usuarios: any = [];
  idu: string;

  // variables para los candidatos
  public candidatos: any = [];
  public candidato: any = [];

  public idArticulo: any;
  public idUsuarioArticulo: any;
  public usuariosGuardados: any = [];

  //  variables de comentarios
  public comentariosUsuarios: any = [];
  public comenartuid: any = [];
  public comentauid: any = [];
  public usuarioData = [];
  public usuarioData2 = [];

  comentario: ComentarioI = {
    idPropietarioComen: '',
    usuarios: {
      idUsuarioRenta: ''
    },
    nombre: '',
    apellido: ''
  };

  usuariosComentario: UsuariosComentariosI = {
    idUsuarioRenta: ''
  }

  public chatsR: any = [];
  public c: any = [];
  public user: string;
  public nombreu: string;

  comen2: any = [];

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

  constructor(private candidatosService: CandidatosserService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private comentarioservice: ComentarioserviceService,
    private articuloService: ArticuloService,
    private router: Router) { }

  ngOnInit() {

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.idArticulo = id;

    this.cargarComentarios();
    this.cargarCandidatos(id);
    this.getIdUsuario();
  }

  ngAfterViewInit(): void {

  }

  cargarComentarios() {
    this.comentarioservice.getComentarios2().subscribe(res => {
      this.comentariosUsuarios = res;
    });
  }

  cargarCandidatos(id: string) {
    this.auth.isAuth().subscribe(user => {
      if (user) {
        var contador = 0;
        this.candidatosService.buscarUsuCandidatos(id).snapshotChanges().subscribe(res => {

          if (res) {
            for (let i = 0; i < res.length; i++) {
              const data: arti = res[contador].payload.doc.data() as arti;
              data.id = res[contador].payload.doc.id;
              this.usuariosGuardados[contador] = data;
              contador++;
            }

          }
        });
      }
    });
  }

  getIdUsuario() {

    this.articuloService.getArticulo(this.idArticulo).subscribe(res => {
      this.idUsuarioArticulo = res.userId;
    })
  }


  confirmarRenta(idUsua: string) {

    this.idu = idUsua;

    this.verificarComentario("prueba", "prueba2");

    alert("Ahora puedes calificar al usuario desde mis Rentas!.");
    this.router.navigate(['/home/detallearticulo']);

  }

  verificarComentario(titulo: string, img: string) {

    var usu1 = false;
    var usu2 = false;
    this.comentarioservice.getComen().subscribe(comentarios => {
      var contador = 0;
      var contador2 = 0;
      var contador3 = 0;
      for (let i = 0; i < this.comentariosUsuarios.length; i++) {
        if (this.comentariosUsuarios[i].idPropietarioComen == this.idUsuarioArticulo) {
          this.comenartuid[contador2] = this.comentariosUsuarios[i];
          usu1 = true;
          contador2++;
          
        }
        if (this.comentariosUsuarios[i].idPropietarioComen == this.idu) {
          this.comentauid[contador3] = this.comentariosUsuarios[i];
          usu2 = true;
          contador3++;
          
        }
      }
      contador = 0;
      contador2 = 0;
      contador3 = 0;

      console.log(usu1);
      console.log(usu2);

      this.agregarDocumentoArticulo(usu1, usu2);
      usu1 = false;
      usu2 = false;

    })

  }
  agregarDocumentoArticulo(usu1: boolean, usu2: boolean) {
    if (usu1 == false) {
      console.log("no existe objeto se va ha crear usu1");
      var uidarticuloUsu = this.idUsuarioArticulo;
      this.auth.obtenerDatos(uidarticuloUsu).subscribe(usa => {
        if (usa) {

          const data: user = usa.data() as user;
          this.usuarioData[0] = data;
          this.comentario.nombre = this.usuarioData[0].nombre;
          this.comentario.apellido = this.usuarioData[0].apellido;
          this.comentario.idPropietarioComen = this.idUsuarioArticulo;
          this.comentario.usuarios = { idUsuarioRenta: this.idu };
          var nombreApellido = this.usuarioData[0].nombre + " " + this.usuarioData[0].apellido;
          this.comentarioservice.agregarComen(this.comentario.nombre, this.comentario.apellido, this.comentario.idPropietarioComen, this.comentario.usuarios.idUsuarioRenta);
          uidarticuloUsu = "";
          this.articuloService.updateDisponible(false, this.idArticulo);
          this.articuloService.updateRentadoPor(nombreApellido, this.idArticulo);
        }
      })
    } else {
      if (usu1 == true) {
        console.log("existe 1");
        
        this.usuariosComentario.idUsuarioRenta = this.idu;
        this.articuloService.updateDisponible(false, this.idArticulo);
        this.comentarioservice.addUsers(this.idu, this.comenartuid[0].id);

      }
    }

    if (usu2 == false) {
      console.log("no existe objeto se va ha crear usu2");
      var articulousuaLo = this.idu;
      this.auth.obtenerDatos(articulousuaLo).subscribe(usa => {
        if (usa) {
          const data2: user = usa.data() as user;
          this.usuarioData2[0] = data2;
          this.comentario.nombre = this.usuarioData2[0].nombre;
          this.comentario.apellido = this.usuarioData2[0].apellido;
          this.comentario.idPropietarioComen = this.idu;
          var nombreApellido = this.usuarioData2[0].nombre + " " + this.usuarioData2[0].apellido;
          this.comentario.usuarios = { idUsuarioRenta: this.idUsuarioArticulo };
          this.comentarioservice.agregarComen(this.comentario.nombre, this.comentario.apellido, this.comentario.idPropietarioComen, this.comentario.usuarios.idUsuarioRenta);
          articulousuaLo = "";
          this.articuloService.updateRentadoPor(nombreApellido, this.idArticulo);
        }
      })
    } else {
      if (usu2 == true) {
        var articulousuaLo = this.idu;
        this.auth.obtenerDatos(articulousuaLo).subscribe(usa => {
          if (usa) {
            const data2: user = usa.data() as user;
            this.usuarioData2[0] = data2;
            this.comentario.nombre = this.usuarioData2[0].nombre;
            this.comentario.apellido = this.usuarioData2[0].apellido;
            this.comentario.idPropietarioComen = this.idu;
            var nombreApellido = this.usuarioData2[0].nombre + " " + this.usuarioData2[0].apellido;
            this.comentario.usuarios = { idUsuarioRenta: this.idUsuarioArticulo };
            articulousuaLo = "";
            console.log("existe 2");
            this.usuariosComentario.idUsuarioRenta = this.idUsuarioArticulo;
            this.comentarioservice.addUsers(this.usuariosComentario.idUsuarioRenta, this.comentauid[0].id);
            this.articuloService.updateRentadoPor(nombreApellido, this.idArticulo);
          }
        })

      }
    }
  }

}