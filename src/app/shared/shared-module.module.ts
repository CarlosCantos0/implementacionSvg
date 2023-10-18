import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared-module-routing.module';
import { DragDropDirective } from './directives/drag-drop.directive';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from '../material/material.module';
import { CuadradoRectanguloComponent } from '../svg/cuadrado-rectangulo/cuadrado-rectangulo.component';





@NgModule({
  declarations: [
    DragDropDirective,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
    MaterialModule,
  ],
  exports:[],
  providers: [
  ]
})
export class SharedModule { }
