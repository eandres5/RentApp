import { Component, OnInit, HostBinding } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { AuthService } from '../../services/auth.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { async } from '@angular/core/testing';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.page.html',
  styleUrls: ['./articulos.page.scss'],
})
export class ArticulosPage implements OnInit {

  @HostBinding('class') classes = 'row';

  articulos: TaskI[];
  textoBuscar: String = '';

  idu: string;

  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
    disponible: true,
    fecha: '',
  }

  constructor(private popoverctrl: PopoverController,
              private articuloService: ArticuloService,
              private router: Router,
              private fcm:FCM,public Authservicies: AuthService,
              private auth:AuthService,
              public Authservice: AuthService) { }

  ngOnInit() {
    
    
    /*this.fcm.getToken().then(token=>{
      console.log(token);
      this.saveToken(token);
    });*/

    this.articulosSinUsu();

  }

  articulosSinUsu(){
    this.articuloService.getArticulos().subscribe( arti=>{
      this.Authservice.isAuth().subscribe(user=>{
        this.articulos=[];
        var cont=0;
        for (let i = 0; i < arti.length; i++) {
          if(arti[i].userId!==user.uid){
            this.articulos[cont]=arti[i];
            cont++;
          }
        }
        console.log(this.articulos);
        
      })
      
    });
  }


  saveToken(token){
    this.Authservicies.updateToken(token);
  }


  detalles(id: string) {
    this.router.navigate(['home/detallever/' + id]);
  }

  // filtro 
  buscar(event) {
    this.textoBuscar = event.detail.value;
    console.log(event);
    console.log(this.textoBuscar);
  }

  //boton more
  async mostrarpop(evento) {

    const popover = await this.popoverctrl.create({
      component: MorebtnComponent,
      event: evento,
      translucent: true,
      mode: 'ios'
    });

    return await popover.present();
  }

}
