import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/services/articulo.service';
import { TaskI } from 'src/app/models/task.interface';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-detallever',
  templateUrl: './detallever.page.html',
  styleUrls: ['./detallever.page.scss'],
})
export class DetalleverPage implements OnInit {

  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
  };

  constructor(private activatedRoute: ActivatedRoute,
              private articuloService: ArticuloService,
              private auth:AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  regresar(){
    this.router.navigate(['home/articulos']);
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
        console.log(this.articulo);
      });
    }
  }

  registrarChat(){
    this.auth.registrarChat(this.articulo.titulo,this.articulo.descripcion,this.articulo.img,this.articulo.userId);
    this.router.navigate(['home/chatgeneral']);
  }

}
