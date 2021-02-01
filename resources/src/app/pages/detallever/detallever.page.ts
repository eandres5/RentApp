import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ReadchatsService } from 'src/app/services/readchats.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { UsuariosComentariosI } from 'src/app/models/usuariosComentarios.interface';
import { CandidatosserService } from 'src/app/services/candidatosser.service';


interface user {
  uid: string,
  nombre: string,
  apellido: string,
  celular: string,
  correo: string,
  img: string
}

@Component({
  selector: 'app-detallever',
  templateUrl: './detallever.page.html',
  styleUrls: ['./detallever.page.scss'],
})
export class DetalleverPage implements OnInit {

  public chatsR: any = [];
  public c: any = [];
  public user: string;
  public nombreu: string;

  public comentariosUsuarios: any = [];
  public comenartuid: any = [];
  public comentauid: any = [];
  public usuarioData = [];
  public usuarioData2 = [];

   // variables para los candidatos
   public candidatos: any = [];
   public candidato: any = [];

   public idArticulo : any;
   public usuariosGuardados: any = [];

  comen2: any = [];

  idu: string;

  usuariosComentario: UsuariosComentariosI = {
    idUsuarioRenta: ''
  }

  comentario: ComentarioI = {
    idPropietarioComen: '',
    usuarios: {
      idUsuarioRenta: ''
    },
    nombre: '',
    apellido: ''
  };

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

  constructor(private activatedRoute: ActivatedRoute,
    private articuloService: ArticuloService,
    private auth: AuthService,
    public chatservice: ReadchatsService,
    public comentarioservice: ComentarioserviceService,
    public candidatoService: CandidatosserService,
    private router: Router) { }

  ngOnInit() {
    this.auth.isAuth().subscribe(user => {
      if (user) {
        this.idu = user.uid;
      }
    });

    this.cargarComentarios();
    this.cargarCandidatos();
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData => {
        this.articulo = articuloData;
      });
    }
  }

  cargarComentarios() {
    this.comentarioservice.getComentarios2().subscribe(res => {
      this.comentariosUsuarios = res;
    });
  }

  cargarCandidatos(){
    this.candidatoService.getCandidatosService().subscribe(res=>{
      this.candidatos = res;
      console.log(this.candidatos);
      
    });
  }

  registrarComentario() {

    this.verificarPropietarioCandidato();
    alert("Espere a que el propietario confirme su Renta, Gracias por usar RENTAPP.");
    // this.chatservice.enviarNotificacionRenta(this.articulo.userId,this.articulo.titulo);

    // this.verificarComentario(this.articulo.titulo, this.articulo.img);
    // alert("Ahora puedes calificar al usuario desde mis Rentas!.");
    this.chatservice.enviarNotificacionRenta(this.articulo.userId,this.articulo.titulo);
  }

  // verificar si existe el objeto candidatos del propietario
  verificarPropietarioCandidato() {
    var usuarioPropietario = false;
    var contador = 0;
    
    for (let i = 0; i < this.candidatos.length; i++) {
      console.log(this.candidatos.length);
      
      if (this.candidatos[i].idPropietario == this.idu) {
        console.log("ya existe, añadir nuevo articulo al objeto");
        this.candidato[contador] = this.candidatos[i];
        usuarioPropietario = true;
        contador++;
        console.log(contador);
        break;
        
      } else {
        console.log("no existe, se crea el objeto y se añade un nueo usuario");
        usuarioPropietario = false;
      }
      
    }
    
    contador = 0;

    console.log(this.candidato);
    
    this.addCandidatoDocument(usuarioPropietario);
  }

  addCandidatoDocument(valor: boolean) {
    if (valor == true) {
      console.log("ya existe, añadir nuevo articulo al objeto");
      console.log(this.candidato[0].id);
      
      this.candidatoService.addUsers(this.articulo.id, this.candidato[0].id);
      // this.candidatoService.deleteUsers(this.idu, this.candidato[0].id);
    }
    if (valor == false) {
      console.log("no existe, se crea el objeto y se añade un nueo usuario");
      var uidarticuloUsu = this.idu;

      this.auth.obtenerDatos(uidarticuloUsu).subscribe(usa => {
        if (usa) {
          const data: user = usa.data() as user;
          this.usuarioData[0] = data;
          this.comentario.nombre = this.usuarioData[0].nombre;
          this.comentario.apellido = this.usuarioData[0].apellido;
          this.comentario.idPropietarioComen = this.idu;
          this.comentario.usuarios = { idUsuarioRenta: this.articulo.id };
          this.candidatoService.agregarCandidato(this.comentario.nombre, this.comentario.apellido, this.comentario.idPropietarioComen, this.comentario.usuarios.idUsuarioRenta);
          uidarticuloUsu = "";

        }
      })
    }
  }

  verificarComentario(titulo: string, img: string) {
    
    var usu1 = false;
    var usu2 = false;
    this.comentarioservice.getComen().subscribe(comentarios => {
      
      var contador = 0;
      var contador2 = 0;
      var contador3 = 0;
      console.log(this.comentariosUsuarios);
      for (let i = 0; i < this.comentariosUsuarios.length; i++) {
        if (this.comentariosUsuarios[i].idPropietarioComen == this.articulo.userId) {
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
      this.agregarDocumentoArticulo(usu1, usu2);
      usu1 = false;
      usu2 = false;

    })

  }
  agregarDocumentoArticulo(usu1: boolean, usu2: boolean) {
    if (usu1 == false) {
      console.log("no existe objeto se va ha crear usu1");
      var uidarticuloUsu = this.articulo.userId;
      this.auth.obtenerDatos(uidarticuloUsu).subscribe(usa => {
        if (usa) {
          const data: user = usa.data() as user;
          this.usuarioData[0] = data;
          this.comentario.nombre = this.usuarioData[0].nombre;
          this.comentario.apellido = this.usuarioData[0].apellido;
          this.comentario.idPropietarioComen = this.articulo.userId;
          this.comentario.usuarios = { idUsuarioRenta: this.idu };
          this.comentarioservice.agregarComen(this.comentario.nombre, this.comentario.apellido, this.comentario.idPropietarioComen, this.comentario.usuarios.idUsuarioRenta);
          uidarticuloUsu = "";

        }
      })
    } else {
      if (usu1 == true) {
        console.log("existe1");
        this.usuariosComentario.idUsuarioRenta == this.idu;
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
          this.comentario.usuarios = { idUsuarioRenta: this.articulo.userId };
          this.comentarioservice.agregarComen(this.comentario.nombre, this.comentario.apellido, this.comentario.idPropietarioComen, this.comentario.usuarios.idUsuarioRenta);
          articulousuaLo = "";
        }
      })
    } else {
      if (usu2 == true) {
        console.log("existe 2");
        this.usuariosComentario.idUsuarioRenta == this.articulo.userId;
        this.comentarioservice.addUsers(this.articulo.userId, this.comentauid[0].id);
      }
    }
  }
  registrarChat() {
    this.obtenerChat(this.articulo.titulo, this.articulo.descripcion, this.articulo.img);
  }

  obtenerChat(nombre: string, detalle: string, img: string) {
    this.chatservice.getChats().subscribe(chats => {
      this.auth.isAuth().subscribe(user => {
        this.user = user.uid;
        this.nombreu = user.displayName;
        var contador = 0;
        this.chatsR = [];
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].users.uidp == user.uid || chats[i].users.userr == user.uid) {
            this.chatsR[contador] = chats[i];
            contador++;
          }
        }

        this.c = [];
        var con = 0
        for (let i = 0; i < this.chatsR.length; i++) {
          if (this.chatsR[i].nombre == nombre && this.chatsR[i].img == img) {
            this.c[con] = this.chatsR[i];
            con++;
          }
        }
        if (this.c.length == 0) {
          if (this.articulo.userId == this.user) {
            alert("Articulo de su propiedad no puede contactarse a usted mismo");
            this.regresar();
          } else {
            this.auth.registrarChat(this.articulo.titulo, this.articulo.descripcion, this.articulo.img, this.articulo.userId, this.nombreu);
            this.router.navigate(['home/chatgeneral']);
          }
        } else {
          this.router.navigate(['home/chatgeneral']);
        }
      })
    });
  }

  regresar() {
    this.router.navigate(['home/articulos']);
  }

  navigatePerfil(id: string) {
    this.router.navigate(['home/showprofile/' + id]);
  }

}