import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import {AuthService} from 'src/app/services/auth.service';
import {ReadchatsService} from 'src/app/services/readchats.service';

@Component({
  selector: 'app-detallever',
  templateUrl: './detallever.page.html',
  styleUrls: ['./detallever.page.scss'],
})
export class DetalleverPage implements OnInit {
  public chatsR : any =[];
  public c: any =[];
  public user: string;
  public nombreu: string;
  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };

  constructor(private activatedRoute: ActivatedRoute,
              private articuloService: ArticuloService,
              private auth:AuthService,public chatservice: ReadchatsService,
              private router: Router) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['home/articulos']);
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
        console.log(this.articulo);
      });
    }
  }

  registrarChat(){
    this.obtenerChat(this.articulo.titulo,this.articulo.descripcion,this.articulo.img);
  }
  obtenerChat(nombre: string, detalle:string, img:string){
    this.chatservice.getChats().subscribe( chats=>{
      this.auth.isAuth().subscribe(user=>{
        console.log(user);
        this.user=user.uid;
        this.nombreu= user.displayName;
        var contador=0;
        this.chatsR=[];
        for (let i = 0; i < chats.length; i++) {
          if(chats[i].users.uidp==user.uid 
            || chats[i].users.userr==user.uid){
            this.chatsR[contador]=chats[i];
            contador++;
          }
        }
        
        this.c=[];
        var con=0
        for(let i=0; i<this.chatsR.length;i++){
          if(this.chatsR[i].nombre==nombre&&this.chatsR[i].img==img){
            console.log("Entra al if"+this.chatsR[i].nombre);
            this.c[con]=this.chatsR[i];
            con++;
          }
        }
        if(this.c.length==0){
          console.log("no existe chat");
          if(this.articulo.userId==this.user){
            alert("Articulo de su propiedad no puede contactarse a usted mismo");
            this.regresar();
          }else{
            this.auth.registrarChat(this.articulo.titulo,this.articulo.descripcion,this.articulo.img,this.articulo.userId, this.nombreu);
            this.router.navigate(['home/chatgeneral']);
          }
        }else{
          console.log("existe chat");
          this.router.navigate(['home/chatgeneral']);
        }
      })
    });
  }
  navigatePerfil(id: string){
    this.router.navigate(['home/showprofile/' + id]);
  }

}
