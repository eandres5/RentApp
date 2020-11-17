import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
interface user{
  nombre: string,
  apellido: string,
  celular: string,
  correo: string, 
  img: string
}

@Component({
  selector: 'app-showprofile',
  templateUrl: './showprofile.page.html',
  styleUrls: ['./showprofile.page.scss'],
})
export class ShowprofilePage implements OnInit {
  public usersR : any =[];
  articulo: TaskI = {
    id: '',
    titulo: '',
    descripcion: '',
    img: '',
    telefono: '',
    costo: '',
    userId: '',
    disponible: true,
    fecha: ''
  };
  constructor(
    private articuloService: ArticuloService,private activatedRoute: ActivatedRoute,private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
        console.log(this.articulo.userId);
        this.datosUsuario(this.articulo.userId);
      });
  } 
   }
   datosUsuario(id:string){
    this.auth.obtenernombreUsuario(id).subscribe(usa=>{
      const data2 : user = usa.payload.data() as user;
      this.usersR[0]=data2;
      console.log(this.usersR);
    });
  }
  navigateArticulo(){
     this.router.navigate(['home/detallever/' + this.articulo.id]);
 
     
  }
  
}
