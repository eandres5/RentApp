import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
interface user{
  nombre: string,
  apellido: string,
  celular: string,
  correo: string, 
  img: string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public usersR : any =[];
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.datosUsuario();
  }
  datosUsuario(){
    this.auth.isAuth().subscribe(us=>{
     this.auth.obtenernombreUsuario(us.uid).subscribe(usa=>{
       const data2 : user = usa.payload.data() as user;
       this.usersR[0]=data2;
       console.log(this.usersR);
     });
   }
     )
  }
  navigateArticulos(){
    this.router.navigate(['home/articulos']);
  }
}
