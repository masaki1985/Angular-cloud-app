import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonpModule } from "@angular/http";
import { Ng2BootstrapModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    JsonpModule,
    Ng2BootstrapModule.forRoot()
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
