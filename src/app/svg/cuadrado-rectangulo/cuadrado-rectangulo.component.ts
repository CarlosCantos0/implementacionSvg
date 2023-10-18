import { Component, Input, OnInit } from '@angular/core';
import { Formas, Svg } from 'src/app/shared/services/dibujar.service';

import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-cuadrado-rectangulo',
  templateUrl: './cuadrado-rectangulo.component.html',
  styleUrls: ['./cuadrado-rectangulo.component.css'],
  standalone: true,
  imports: [CdkDrag],
})
export class CuadradoRectanguloComponent {
  id: number = 0;
  forma: Formas = '';
  coordX: number = 150;
  coordY: number = 150;
  width: number = 200;
  height: number = 200;
  color: string = '#00000';
  stroke: string = '#00000';
  fill: string = '#00000';
  rellenado: boolean = false;

  static nextId = 0;

  @Input() cuadradosData: CuadradoRectanguloComponent[] = [];

  // ngOnInit() {
  //   // Suscríbete al servicio para obtener los datos de los cuadrados
  //   this.dibujar.cuadrados$.subscribe((data) => {
  //     this.cuadradosData = data;
  //     // this.cuadradosData.push()
  //     console.log('cuadrados data: '+this.cuadradosData)
  //     console.log(data)
  //   });
  //   this.agregarCuadrado()
  // }

  // constructor(
  //   private dibujar: DibujarService,

  //   //private sanitizer: DomSanitizer
  // ) {
  //   this.id = CuadradoRectanguloComponent.nextId++;
  // }

  // agregarCuadrado() {
  //   const cuadrado = (this);
  //   this.dibujar.agregarCuadrado(cuadrado);
  // }



  // render(): SafeHtml {
  // //this.dibujar.getFormasAlmacenadas()
  //   //console.log(this.dibujar.getFormasAlmacenadas());
  //   const formasArray: string[] = this.dibujar.getFormasAlmacenadas(); // Obtén el array de strings
  //   const formasConcatenadas: string = formasArray.join('');
  //   const svgCompleto = this.dibujar.contenedor + formasConcatenadas + '</svg>';
  //   //const sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(svgCompleto);
  //   //console.log(' ' + svgCompleto);
  //   return svgCompleto;

  // }



}
