import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/*

import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFireStorageModule } from '@angular/fire/storage';

//importacion para uso de camara
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';

//importaciones de pipes
import { PipesModule } from './pipes/pipes.module';

//importacion de formularios

//importacion de FirebaseLogin
import { AngularFireAuthModule } from "@angular/fire/auth";

//Forms
import {FormsModule} from '@angular/forms';
//Componentes
import {SmsComponent} from './pages/sms/sms.component';
//FCM
import { FCM } from '@ionic-native/fcm';
//@ionic-native/fcm/ngx'
//HTTP
import { HttpClientModule } from '@angular/common/http';

*/
//importacion de angular


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
