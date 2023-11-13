import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CorsOptions } from 'cors';
// -----FIREBASE------
import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({mode : 'md'}), //Con el mode:'nd' compatibiliza en todos los dispositivos la interface 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Coneccion con Firebase - ver enviroment.firebaseConfig
    HttpClientModule //Utilizado para el llamado a la API
  ],
    
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

