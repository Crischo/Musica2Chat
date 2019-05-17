import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MiembrosSalaPage } from './miembros-sala.page';
import { HttpModule } from '@angular/http';
import { CallNumber } from "@ionic-native/call-number/ngx";

const routes: Routes = [
  {
    path: '',
    component: MiembrosSalaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MiembrosSalaPage],
  providers: [CallNumber]
})
export class MiembrosSalaPageModule {}
