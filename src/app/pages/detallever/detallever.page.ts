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
        this.chatsR=[];
        for (let i = 0; i < chats.length; i++) {
          if(chats[i].users.uidp==user.uid 
            || chats[i].users.userr==user.uid){
            this.chatsR[i]=chats[i];
          }
        }
        this.c=[];
        for(let i=0; i<this.chatsR.length;i++){
          if(this.chatsR[i].nombre==nombre&&this.chatsR[i].img==img){
            console.log(this.chatsR[i].nombre);
            this.c[0]=this.chatsR[i];
          }
          if(this.c.length==0){
            console.log("no existe chat");
            this.auth.registrarChat(this.articulo.titulo,this.articulo.descripcion,this.articulo.img,this.articulo.userId);
            this.router.navigate(['home/chatgeneral']);
          }else{
            console.log("existe chat");
            this.router.navigate(['home/chatgeneral']);
          }
        }
      })
    });
  }

}
