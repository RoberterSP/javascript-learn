import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewsComponent } from './component/views/views.component';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { BodyComponent } from './component/body/body.component';
import { FootComponent } from './component/foot/foot.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewsComponent,
    HeaderComponent,
    HomeComponent,
    BodyComponent,
    FootComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
