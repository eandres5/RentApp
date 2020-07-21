import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: any;
  password: any;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  verificacionLogin(){
    this.router.navigate(['home']);
  }

  resetPassword(){

  }

  navigateIndex(){
    this.router.navigate(['']);
  }
}
