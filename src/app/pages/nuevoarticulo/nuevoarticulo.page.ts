import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';

@Component({
  selector: 'app-nuevoarticulo',
  templateUrl: './nuevoarticulo.page.html',
  styleUrls: ['./nuevoarticulo.page.scss'],
})
export class NuevoarticuloPage implements OnInit {

  darkMode: boolean = true;

  constructor(private router: Router,
              private popoverctrl: PopoverController) { }

  ngOnInit() {
  }


  /*programacion barra arriba popover y btn salir btn dark mode*/
  async mostrarpop(evento){
    
    const popover = await this.popoverctrl.create({
      component: MorebtnComponent,
      event: evento,
      translucent: true,
      mode: 'ios'
    });

    return await popover.present();
  }
  
  cerrarSesion(){
    this.router.navigate(['']);
    this.popoverctrl.dismiss();
  }

  modoOscuro(){
    this.darkMode = this.darkMode;
    document.body.classList.toggle('dark');
  }
}
