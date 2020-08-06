import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';

@Component({
  selector: 'app-detallearticulo',
  templateUrl: './detallearticulo.page.html',
  styleUrls: ['./detallearticulo.page.scss'],
})
export class DetallearticuloPage implements OnInit {

  darkMode; boolean = true;
  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };

  constructor(private router: Router,
    private popoverctrl: PopoverController
  ) { }

  ngOnInit() {
  }



  /*programacion barra arriba popover y btn salir btn dark mode*/
  async mostrarpop(evento) {

    const popover = await this.popoverctrl.create({
      component: MorebtnComponent,
      event: evento,
      translucent: true,
      mode: 'ios'
    });

    return await popover.present();
  }

  cerrarSesion() {
    this.router.navigate(['']);
    this.popoverctrl.dismiss();
  }

  modoOscuro() {
    this.darkMode = this.darkMode;
    document.body.classList.toggle('dark');
  }

}
