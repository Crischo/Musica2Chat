import { AuthService } from './../services/auth.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {
            path: '',
            redirectTo: 'main'
        },
        {
            path: 'main',
            loadChildren: './main/main.module#MainPageModule'
        },
        {
          path: 'blank',
          loadChildren: './blank/blank.module#BlankPageModule'
        },
        { path: 'miembros-sala', loadChildren: './miembros-sala/miembros-sala.module#MiembrosSalaPageModule' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpModule],
  exports: [RouterModule],
  providers: [AuthService]
})
export class LayoutRoutingModule { }