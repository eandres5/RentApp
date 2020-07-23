import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-morebtn',
  templateUrl: './morebtn.component.html',
  styleUrls: ['./morebtn.component.scss'],
})
export class MorebtnComponent implements OnInit {

  darkMode: boolean = true;

  constructor(private router: Router,
              private popoverctrl: PopoverController) { }

  ngOnInit() {

  }

  /*programacion de la barra de arriba*/

  cerrarSesion(){
    this.router.navigate(['']);
    this.popoverctrl.dismiss();
  }

  modoOscuro(){
    this.darkMode = this.darkMode;
    document.body.classList.toggle('dark');
  }
}
