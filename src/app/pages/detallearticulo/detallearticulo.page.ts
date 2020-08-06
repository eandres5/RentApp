import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverController, AlertController, ToastController } from '@ionic/angular';
import { MorebtnComponent } from 'src/app/components/morebtn/morebtn.component';
import { TaskI } from 'src/app/models/task.interface';
import { ArticuloService } from 'src/app/services/articulo.service';

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
  };

  articulos: TaskI[];

  textoBuscar: String = '';
  textoArticulo: String = '';

  constructor(private router: Router,
    private popoverctrl: PopoverController,
    private activatedRoute: ActivatedRoute, 
    private articuloService: ArticuloService,
    public alertController: AlertController,
    public toastController: ToastController
    
  ) { }

  ngOnInit() {
    this.articuloService.getArticulos().subscribe(res=> this.articulos =res);
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
            console.log('Confirm Cancel: blah');
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

    /*
     const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.articuloService.getArticulo(id).subscribe(articuloData =>{
        this.articulo = articuloData;
      });
    }
    */ 
    /*
    this.articuloService.deleteArticulo(this.articulo.id).then(() => {
      this.router.navigateByUrl('/');
    }, err => {
    });
     */
    
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
