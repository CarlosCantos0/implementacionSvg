import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SvgDownloadComponent } from '../svg/svg-download/svg-download.component';
import { VistaPreviaComponent } from '../svg/vista-previa/vista-previa.component';

const routes: Routes = [
  {
  path: '',     //localhost:4200/space
    component: LayoutComponent,    //Fijarse bien cual importa
    children: [
      { path: 'svg-download', component: SvgDownloadComponent  },
      { path: 'work', component: VistaPreviaComponent},
      { path: '**', redirectTo: 'svg-download'},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedModuleRoutingModule { }
