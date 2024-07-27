import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TmNgOdometerModule } from 'tm-ng-odometer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { Hpolo011Component } from './hpolo/hpolo011/hpolo011.component';

@NgModule({
  declarations: [
    AppComponent,
    IntersectionObserverDirective,
    Hpolo011Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TmNgOdometerModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
