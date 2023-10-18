import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared-module.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SvgDownloadComponent } from './svg/svg-download/svg-download.component';
import { DragNdDropDirective } from './directives/drag-nd-drop.directive';

import { TextoComponent } from './svg/texto/texto.component';
import { VistaPreviaComponent } from './svg/vista-previa/vista-previa.component';
import { CuadradoRectanguloComponent } from './svg/cuadrado-rectangulo/cuadrado-rectangulo.component';

@NgModule({
    declarations: [
        AppComponent,
        SvgDownloadComponent,
        DragNdDropDirective,
        TextoComponent,
        VistaPreviaComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        DragDropModule,
        CuadradoRectanguloComponent
    ]
})
export class AppModule { }
