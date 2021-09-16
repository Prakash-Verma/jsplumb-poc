import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { ElementComponent } from './components/element/element.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ElementComponent,
    DrawingComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
