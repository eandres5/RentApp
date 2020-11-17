import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, AlertController, ToastController } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';
import { AuthService } from 'src/app/services/auth.service';

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
    disponible: true,
    fecha: ''
  };

  articulos: TaskI[];

  idu: string;

  textoBuscar: String = '';
  textoArticulo: String = '';

  constructor(private router: Router,
    private popoverctrl: PopoverController,
    private activatedRoute: ActivatedRoute, 
    private articuloService: ArticuloService,
    public alertController: AlertController,
    public toastController: ToastController,
    private auth:AuthService,
    public Authservice: AuthService
    
  ) { }

  ngOnInit() {
    
    this.auth.isAuth().subscribe(user=>{
      if(user){
      this.idu=user.uid;
      this.articulo.userId=this.idu;
      }
    });

    this.articulosUsu();

  }

  articulosUsu(){
    this.articuloService.getArticulos().subscribe( arti=>{
      this.Authservice.isAuth().subscribe(user=>{
        if(user){
          this.articulos=[];
          var cont=0;
          for (let i = 0; i < arti.length; i++) {
            if(arti[i].userId==user.uid){
              this.articulos[cont]=arti[i];
              cont++;
            }
          }
        }
      })
      
    });
  }

  editararticulo(id: string){
    this.router.navigate(['home/articuloeditar/' + id]);
  }


  async eliminarArticulo(id: string){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar',
      message: '¿Esta seguro de eliminar este artículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.eliminar(id);
          }
        }
      ]
    });

    await alert.present();
    
  }

  //mensaje inferior de eliminacion
  async eliminar(id: string){
    this.articuloService.deleteArticulo(id).then(() => {
      this.router.navigateByUrl('/home/detallearticulo');
    }, err => {
    });
    const toast = await this.toastController.create({
      color: 'dark',
      message: 'Artículo eliminado correctamente',
      duration: 2000
    });
    toast.present();
  }

  // filtro 
  buscar(event){
    this.textoBuscar = event.detail.value;
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
