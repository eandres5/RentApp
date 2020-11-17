import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController , Platform} from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

@Component({
  selector: 'app-morebtn',
  templateUrl: './morebtn.component.html',
  styleUrls: ['./morebtn.component.scss'],
})
export class MorebtnComponent implements OnInit {

  darkMode: boolean = true;
  uid: string;
  veri: boolean =false;
  constructor(private router: Router,
              private popoverctrl: PopoverController, private auth: AuthService, private db: AngularFirestore ) { }

  ngOnInit() {
    this.auth.isAuth().subscribe(user=> {
      if (user){this.uid=user.uid;}  
      }
    )
  }

  /*programacion de la barra de arriba*/

  cerrarSesion(){
    console.log(this.uid)
    this.auth.logout(this.uid);
    this.popoverctrl.dismiss();
  }

  modoOscuro(){
    this.darkMode = this.darkMode;
    document.body.classList.toggle('dark');
  }

  navigateProfile(){
    this.router.navigate(['profile']);
  }
}
