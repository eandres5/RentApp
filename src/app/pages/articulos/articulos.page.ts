import { Component, OnInit, HostBinding } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
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

  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '', 
    telefono: '',
    costo: '',
    userId: '',
  }

  constructor(private popoverctrl: PopoverController,
              private articuloService: ArticuloService,
              private router: Router) { }

  ngOnInit() {
    this.articuloService.getArticulos().subscribe(res=> {
      this.articulos = res;
    });
  }


  detalles(id: string){
    this.router.navigate(['home/detallever/' + id]);
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
