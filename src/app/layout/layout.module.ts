import { SalasService } from './../services/salas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';

import { IonicModule } from '@ionic/angular';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpModule } from '@angular/http';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpModule,
  
    LayoutRoutingModule
  ],
  declarations: [LayoutComponent, SidebarComponent],
  providers: [SalasService]
})
export class LayoutModule {}