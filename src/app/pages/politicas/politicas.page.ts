import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.page.html',
  styleUrls: ['./politicas.page.scss'],
})
export class PoliticasPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  navigateSignUp(){
    this.router.navigate(['signup']);
  }

}
