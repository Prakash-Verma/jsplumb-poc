import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OuiIconModule } from '@oncehub/ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ConnectorMenuComponent } from './components/connector-menu/connector-menu.component';
import { ElementComponent } from './components/element/element.component';
import { GroupComponent } from './components/group/group.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './components/notification/notification.service';
import { PlumbService } from './services/plumb.service';
import { RoutingRuleComponent } from './components/routing-rule/routing-rule.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ElementComponent,
    GroupComponent,
    NotificationComponent,
    ConnectorMenuComponent,
    RoutingRuleComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, OuiIconModule],
  providers: [PlumbService, NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
