
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';
import { HttpModule } from '@angular/http';
import { AuthService } from './../../services/auth.service';
import { SalasService } from './../../services/salas.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainPage, ],
  providers: [AuthService, SalasService]
})
export class MainPageModule {}
