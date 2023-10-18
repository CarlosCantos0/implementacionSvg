import { Component } from '@angular/core';
import { Formas, Fuentes } from 'src/app/shared/services/dibujar.service';
import { Svg } from '../../shared/services/dibujar.service';

@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})

export class TextoComponent{


  id: number = 0;
  forma: Formas = '';
  coordX: number = 150;
  coordY: number = 150;
  width: number = 150;
  height: number = 150;
  color: string = '';


  textoIntroducido: string = '';
  fuente: Fuentes = '';
  tamanoLetra: number = 20;

  dibujar() {
    if (this.forma === 'texto') {
      let svgString = `<text [id]="${this.id}" x="${this.coordX}" y="${this.coordY}" font-family="${this.fuente}" font-size="${this.tamanoLetra}" fill="${this.color}">${this.textoIntroducido}</text>`;

      return svgString;
    } return;
  }

}
