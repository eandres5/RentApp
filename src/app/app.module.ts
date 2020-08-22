import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//FCM
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
//importacion de environment firebase

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
//No cambiar esta linea de codigo jamas
import { environment } from '../environments/environment';

import { Camera } from '@ionic-native/camera/ngx';

/*
//importacion para uso de camara


//importacion Firebase
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
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

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import {ChatComponent} from 'src/app/components/chat/chat.component';

//importacion del modulo de pipes
import { PipesModule } from './pipes/pipes.module';


@NgModule({
  declarations: [AppComponent,ChatComponent],
  entryComponents: [AppComponent,ChatComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    PipesModule,
    HttpClientModule],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    Camera,
    WebView,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
