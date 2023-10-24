import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

export type Formas = 'cuadrado-rectangulo' | 'linea' | 'texto' | '';
export type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';

export interface Svg {
  rellenado: boolean;
  id: number;
  forma: Formas;
  coordX: number;
  coordY: number;
  width: number;
  height: number;
  fill: string;
  textoIntroducido: string;
  fuente: Fuentes;
  tamanoLetra: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  svgContent: string;
}

@Injectable({
  providedIn: 'root'
})
export class DibujarService {
  rellenado: boolean = false;
  private formasAlmacen: Svg[] = [];  //Almacen compartido con el componente para realizar la descarga y vistaPrevia
  private formaSubject = new Subject<string>();
  contenedor: string = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600">';

  constructor() {}

  // Cambia el estado del checkbox rellenado
  setRellenado(rellenado: boolean):void {
    this.rellenado = rellenado;
  }

  // Lee el localStorage para recuperar la última forma seleccionada que se ha guardado y si es así la asigna como valor
  leerFormaStorage(): Observable<Formas> {
    if (!localStorage) throw new Error('LocalStorage no está disponible');

    const formaRecuperada: Formas | null = localStorage.getItem('formaSeleccionada') as Formas;
    if (!formaRecuperada) {
      console.error('No hay valor en forma del localStorage');
      return of('');
    }

    // Define la forma recuperada
    this.definirForma(formaRecuperada); //Llamamos al método para definir una forma
    return of(formaRecuperada as Formas);
  }

  // Define la forma seleccionada y la almacena en el localStorage
  definirForma(forma: Formas): void {
    if (forma === '') throw new Error('No has seleccionado ninguna opción!');

    // Emite el valor a los componentes subscritos sobre la forma seleccionada
    this.formaSubject.next(forma);
    localStorage.setItem('formaSeleccionada', forma); // Asigna el valor de la forma en el localStorage
  }

  // Obtiene el valor de la forma mediante el Subject (observable)
  obtenerFormaSubject(): Observable<string> {
    return this.formaSubject.asObservable();  //Devolvemos como Observable para que el componente que reciba el valor no pueda emitir valores nuevos
  }

  // Obtiene las formas almacenadas para editarlas posteriormente y realizar la descarga
  getFormasAlmacenadas(): Svg[]{
    return this.formasAlmacen;
  }

  // Genera un SVG personalizado y permite su descarga
  downloadCustomSvg(): void {
    const contenidoSvg = this.formasAlmacen.map(figura => figura.svgContent).join('');
    const svgFormado = this.contenedor + contenidoSvg + '</svg>';
    console.log('completo: ' + svgFormado);  //!! El valor de SVGFormado es el string con el esquema encapsulado del svg generado

    //!! ESTO solo ES PARA HACER LA DESCARGA
    // Crea un Blob y una URL para descargar el SVG
    const blob = new Blob([svgFormado], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);

    // Crea un enlace de descarga y dispara un clic en él
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-svg.svg';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Limpia el enlace, la URL del Blob y el arreglo
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.formasAlmacen = [];
  }

  // Método para generar contenido SVG basado en la forma seleccionada y sus propiedades
  updateSvgContent(svg: Svg): string {
    const { forma, id, coordX, coordY, width, height, stroke, textoIntroducido, fuente, tamanoLetra, x1, y1, x2, y2, strokeWidth } = svg;
    let svgContent = '';

    let fillAttribute = svg.rellenado ? stroke : 'none';

    if (forma === 'cuadrado-rectangulo') {
      svgContent = `<g id="figura-${id}"><rect id="${id}" x="${coordX}" y="${coordY}" width="${width}" height="${height}" fill="${fillAttribute}" stroke="${stroke}" stroke-width="${strokeWidth}" class="cuadrado-rectangulo"`;
      svgContent += ' /></g>';
    } else if (forma === 'texto') {
      svgContent = `<text id="${id}" x="${coordX}" y="${coordY}" font-family="${fuente}" font-size="${tamanoLetra}" fill="${stroke}" class="texto">${textoIntroducido}</text>`;
    } else if (forma === 'linea') {
      svgContent = `<line id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" class="linea" />`;
    }

    svg.svgContent = svgContent;
    return svgContent;
  }

  //Actualiza la lista del almacen y el valor del contenido del SVG para luego poder descargarlo
  actualizarForma(id: number, nuevaForma: Svg): void {
    const index = this.formasAlmacen.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.formasAlmacen[index] = nuevaForma; //Actualiza el objeto svg al nuevo
      this.formasAlmacen[index].svgContent = this.updateSvgContent(nuevaForma); // Actualiza el svgContent
    }
  }
  // Método para limpiar las formas almacenadas
  limpiarFormasAlmacenadas():Svg[] {
    this.formasAlmacen = [];
    return this.formasAlmacen = [];
  }

  //Guardar SVG editado
  agregarForma(nuevoSvg: Svg) {
    const svgString = this.updateSvgContent(nuevoSvg);  // Genera el contenido SVG
    nuevoSvg.svgContent = svgString;
    this.formasAlmacen.push(nuevoSvg);  // Agrega la figura al arreglo de formas
  }

}
