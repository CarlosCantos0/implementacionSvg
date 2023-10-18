import { Component, Input } from '@angular/core';
import { Formas, Svg } from 'src/app/shared/services/dibujar.service';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css'],
  template: `<line [attr.id]="linea.id" [attr.x1]="linea.x1" [attr.y1]="linea.y1" [attr.x2]="linea.x2" [attr.y2]="linea.y2" [attr.stroke]="linea.stroke" [attr.stroke-width]="linea.strokeWidth" />`,
  standalone: true,
  imports: [CdkDrag]
})
export class LineaComponent implements Svg{

  @Input()
  linea!: Svg;

  id: number = 0;
  forma: Formas = '';
  coordX: number = 150;
  coordY: number = 150;
  width: number = 200;
  height: number = 200;
  color: string = '#000000';

  // Atributos específicos para línea
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  stroke: string = '#000000';
  strokeWidth: number = 4;

  dibujar(svg: Svg): string {
    if (svg.forma === 'linea') {
      let svgString = `<line [id]="${this.id}" x1="${this.x1}" y1="${this.y1}" x2="${this.x2}" y2="${this.y2}" stroke="${this.stroke}" stroke-width="${this.strokeWidth}" />`;

      return svgString;
    } return '';
  }

}
