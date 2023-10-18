import { Component, OnInit } from '@angular/core';
import { Subscription, count } from 'rxjs';
import { DibujarService, Formas } from 'src/app/shared/services/dibujar.service';
import { CuadradoRectanguloComponent } from '../cuadrado-rectangulo/cuadrado-rectangulo.component';

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.css']
})
export class VistaPreviaComponent implements OnInit {

  formaSeleccionada: Formas = '';
  private formaSubscription: Subscription = new Subscription;
  forma: Formas = '';
  contador = 0;
  cuadrados: number[] = [];
  svgString: string = ' <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600"><rect id="0" x="150" y="150" width="200" height="200" stroke-width="2.5" stroke="#000000 " fill="none"/><rect x="250" y="250" width="200" height="200" stroke-width="2.5" stroke="#000000 " fill="none"/><rect x="250" y="250" width="200" height="200" stroke-width="2.5" stroke="#000000 " fill=""/><rect x="250" y="250" width="200" height="200" stroke-width="2.5" stroke="#000000 " fill="#d28383"/><text x="250" y="250" font-family="Arial" font-size="20" fill="#d28383">Hola 123</text><text x="500" y="250" font-family="Arial" font-size="20" fill="#d28383">Hola 123</text></svg>';
  svgElements = this.parseSVGString(this.svgString);


  constructor( private dibujar: DibujarService) {}



  ngOnInit(): void {
    this.formaSubscription = this.dibujar.obtenerFormaSubject().subscribe((forma: string) => {
      this.formaSeleccionada = forma as Formas;
      this.forma = this.formaSeleccionada;
      if (this.forma === 'cuadrado-rectangulo') {
        this.contador++;
        this.cuadrados = Array(this.contador).fill(0);
        //console.log(this.cuadrados)
      }
    })
    //console.log(this.contadorElementosSvg());
    this.contadorElementosSvg();
  }
  ngOnDestroy(): void {
    this.formaSubscription.unsubscribe();
  }

  contadorElementosSvg() {
    const svgElements = this.parseSVGString(this.svgString);
    console.log(svgElements);

    let index = 0;

    let counts = { rect: [] as CuadradoRectanguloComponent[], text: 0, line: 0 };

    svgElements.forEach((element: Element) => {
      const elementString = element.outerHTML;

      if (elementString.startsWith('<rect')) {
        //const cuadradoRectangulo = this.parseRectElement(element);
        //console.log(cuadradoRectangulo);
        //counts.rect.push(cuadradoRectangulo);
        //console.log('counts: ' + counts.rect)
      } else if (elementString.startsWith('<text')) {
        counts.text++;
      } else if (elementString.startsWith('<line')) {
        counts.line++;
      }
    });

    //this.dibujar.updateCuadradosData(counts.rect)
    return counts.rect;
  }

  //!! ESTE METODO FUNCIONA PERO ACCEDE A LOS MÉTODOS TANTAS VECES COMO CUADRADOS NUEVOS CREAMOS
  // private parseRectElement(element: Element): CuadradoRectanguloComponent {
  //   const rectAttributes = element.attributes;

  //   const cuadradoRectangulo = new CuadradoRectanguloComponent(this.dibujar);  //error por pasarle por parametro this.dibujar

  //   cuadradoRectangulo.id = parseInt(rectAttributes.getNamedItem('id')?.value || '0', 10);
  //   cuadradoRectangulo.forma = 'cuadrado-rectangulo';
  //   cuadradoRectangulo.coordX = parseFloat(rectAttributes.getNamedItem('x')?.value || '0');
  //   cuadradoRectangulo.coordY = parseFloat(rectAttributes.getNamedItem('y')?.value || '0');
  //   cuadradoRectangulo.width = parseFloat(rectAttributes.getNamedItem('width')?.value || '0');
  //   cuadradoRectangulo.height = parseFloat(rectAttributes.getNamedItem('height')?.value || '0');
  //   cuadradoRectangulo.color = rectAttributes.getNamedItem('stroke')?.value || '';

  //   console.log('coord: ' + cuadradoRectangulo.coordX);


  //   return cuadradoRectangulo;
  // }


  parseSVGString(svgString: string): Element[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElements = Array.from(doc.documentElement.children);
    //console.log(svgElements);
    //svgElements.forEach((elemento) => {
     //console.log(elemento.outerHTML);
    //})
    return svgElements;
  }



  //TODO! Sacar info del string/array html y aplicar en mi componente cuadrado-rectangulo




}
