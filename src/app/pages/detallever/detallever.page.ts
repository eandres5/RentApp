import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ReadchatsService } from 'src/app/services/readchats.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';
import { ComentarioI } from 'src/app/models/comentarios.interface';


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
  public comen: any = [];

  public usuarioData = [];
  public usuarioData2 = [];

  idu: string;

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
    private router: Router) { }

  ngOnInit() {
    this.auth.isAuth().subscribe(user => {
      if(user){
        this.idu = user.uid;
      }
    });
  }

  regresar() {
    this.router.navigate(['home/articulos']);
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData => {
        this.articulo = articuloData;
        console.log(this.articulo);
      });
    }
  }

  registrarComentario() {
    this.verificarComentario(this.articulo.titulo, this.articulo.img);
  }

  verificarComentario(titulo: string, img: string) {

    this.comentarioservice.getComentarios().subscribe(comentarios => {
      let contador = 0;
      let contador2 = 0;
      for (let i = 0; i < comentarios.length; i++) {
        this.comentariosUsuarios[contador] = comentarios[i];
        contador++;
      }
      console.log(this.comentariosUsuarios);

      for (let i = 0; i < this.comentariosUsuarios.length; i++) {
        if (this.comentariosUsuarios[i].idPropietarioComen == this.articulo.userId) {
          this.comen[contador2] = this.comentariosUsuarios[i];
          contador2++;
        }
      }

      console.log(this.comen);

      if (this.comen.length == 0) {
        console.log("no existe objeto se va ha crear");

        this.auth.obtenernombreUsuario(this.articulo.userId).subscribe(usa => {

          const data: user = usa.payload.data() as user;
          this.usuarioData[0] = data;
          console.log(this.usuarioData);

          this.comentario.nombre = this.usuarioData[0].nombre;
          this.comentario.apellido = this.usuarioData[0].apellido;
          this.comentario.idPropietarioComen = this.articulo.userId;
          this.comentario.usuarios = { idUsuarioRenta: this.idu };
          this.comentarioservice.addComentario(this.comentario);
        });

        this.auth.obtenernombreUsuario(this.idu).subscribe(usa => {

          const data2: user = usa.payload.data() as user;
          this.usuarioData2[0] = data2;
          console.log(this.usuarioData2);

          this.comentario.nombre = this.usuarioData2[0].nombre;
          this.comentario.apellido = this.usuarioData2[0].apellido;
          this.comentario.idPropietarioComen = this.idu;
          this.comentario.usuarios = { idUsuarioRenta: this.articulo.userId };
          this.comentarioservice.addComentario(this.comentario);
        });


      } else if (this.comen.length > 0) {
        console.log("valida que cree al otro usuario");
      }

    });
  }

  registrarChat() {
    this.obtenerChat(this.articulo.titulo, this.articulo.descripcion, this.articulo.img);
  }

  obtenerChat(nombre: string, detalle: string, img: string) {
    this.chatservice.getChats().subscribe(chats => {
      this.auth.isAuth().subscribe(user => {
        console.log(user);
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
            console.log("Entra al if " + this.chatsR[i].nombre);
            this.c[con] = this.chatsR[i];
            con++;
          }
        }
        if (this.c.length == 0) {
          console.log("no existe chat");
          if (this.articulo.userId == this.user) {
            alert("Articulo de su propiedad no puede contactarse a usted mismo");
            this.regresar();
          } else {
            this.auth.registrarChat(this.articulo.titulo, this.articulo.descripcion, this.articulo.img, this.articulo.userId, this.nombreu);
            this.router.navigate(['home/chatgeneral']);
          }
        } else {
          console.log("existe chat");
          this.router.navigate(['home/chatgeneral']);
        }
      })
    });
  }



  navigatePerfil(id: string) {
    this.router.navigate(['home/showprofile/' + id]);
  }

}
