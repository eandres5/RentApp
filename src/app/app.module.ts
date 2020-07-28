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
//importacion de environment firebase
import { firebaseConfig } from '../environments/environment';
//Firebase
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
//importacion de formularios
import {FormsModule} from '@angular/forms';
//HTTP
import { HttpClientModule } from '@angular/common/http';

//@ionic-native/fcm/ngx'
/*
//importacion para uso de camara
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';

//importacion Firebase
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
//importaciones de pipes
import { PipesModule } from './pipes/pipes.module';

//Componentes
import {SmsComponent} from './pages/sms/sms.component';

*/
//importacion de angular


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    HttpClientModule],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
