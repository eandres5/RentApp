import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComentarioI } from 'src/app/models/comentarios.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioserviceService } from 'src/app/services/comentarioservice.service';

@Component({
  selector: 'app-rentados',
  templateUrl: './rentados.page.html',
  styleUrls: ['./rentados.page.scss'],
})
export class RentadosPage implements OnInit {

  comentarios: ComentarioI[];
  public idu: any;

  constructor(public comentarioService: ComentarioserviceService,
              public auth: AuthService,
              private router: Router
              
    ) { }

  ngOnInit() {
    
    this.comentarioService.getComentarios().subscribe(res=>{
      this.comentarios = res;
    });
  }

  calificar(comentarioID: string){
    console.log(comentarioID);
    this.router.navigate(['home/comentario/' + comentarioID]);
  }

}
