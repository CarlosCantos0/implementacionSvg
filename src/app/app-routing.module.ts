import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./shared/shared-module.module').then(m => m.SharedModule),
  },
  // {
  //   path: 'svg',
  //   loadChildren: () => import('./svg-download/svg-download.component').then(m => SvgDownloadComponent)
  // },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
