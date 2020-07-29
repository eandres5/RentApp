import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//FCM
import { FCM } from '@ionic-native/fcm/ngx';
//@ionic-native/fcm/ngx'

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFireStorageModule } from '@angular/fire/storage';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireAuthModule } from "@angular/fire/auth";

import { Camera } from '@ionic-native/camera/ngx';

/*

import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFireStorageModule } from '@angular/fire/storage';

//importacion para uso de camara


//importaciones de pipes
import { PipesModule } from './pipes/pipes.module';

//importacion de formularios

//importacion de FirebaseLogin


//Forms
import {FormsModule} from '@angular/forms';
//Componentes
import {SmsComponent} from './pages/sms/sms.component';

*/
//importacion de angular


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    //AngularFireModule.initializeApp(firebaseConfigLogin), 
    HttpClientModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
