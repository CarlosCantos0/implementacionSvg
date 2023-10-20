import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

export type Formas = 'cuadrado-rectangulo' | 'linea' | 'texto' | '';
export type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';

export interface Svg {
  id: number;
  forma: Formas;
  coordX: number;
  coordY: number;
  width: number;
  height: number;
  color: string;
  textoIntroducido: string;
  fuente: Fuentes;
  tamanoLetra: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class DibujarService {
  rellenado: boolean = false;
  private formas: string[] = [];
  private formaSubject = new Subject<string>();
  contenedor: string = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600">';

  constructor() {}

  // Cambia el estado del checkbox rellenado
  setBoleano(valor: boolean) {
    this.rellenado = valor;
  }

  // Lee el localStorage para recuperar la última forma seleccionada que se ha guardado
  leerFormaStorage(): Observable<Formas> {
    if (!localStorage) throw new Error('LocalStorage no está disponible');

    const formaRecuperada: Formas | null = localStorage.getItem('formaSeleccionada') as Formas;
    if (!formaRecuperada) {
      console.error('No hay valor en forma del localStorage');
      return of('');
    }

    // Define la forma recuperada
    this.definirForma(formaRecuperada);
    return of(formaRecuperada as Formas);
  }

  // Define la forma seleccionada y la almacena en el localStorage
  definirForma(forma: Formas): void {
    if (forma === '') throw new Error('No has seleccionado ninguna opción!');

    // Notifica a los observadores sobre la forma seleccionada
    this.formaSubject.next(forma);
    localStorage.setItem('formaSeleccionada', forma);

  }

  // Obtiene la forma del Subject (observable)
  obtenerFormaSubject(): Observable<string> {
    return this.formaSubject.asObservable();
  }

  // Añade la forma al array para formar el SVG definitivo
  guardarSvg(forma: string): void {
    if (forma === '') return;
    this.formas.push(forma);
    console.log('servicio formas: ' + this.formas);
  }

  // Obtiene las formas almacenadas
  getFormasAlmacenadas(): string[]{
    if (this.formas.length === 0) return [];
    return this.formas;
  }

  // Genera un SVG personalizado y permite su descarga
  downloadCustomSvg(): void {
    const svgCompleto = this.formas.join('');
    const svgFormado = this.contenedor + svgCompleto + '</svg>';
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
    this.formas = [];
  }

  // Método para generar contenido SVG basado en la forma seleccionada
  updateSvgContent(svg: Svg): string {
    const { forma, coordX, coordY, width, height, color, textoIntroducido, fuente, tamanoLetra, x1, y1, x2, y2, stroke, strokeWidth } = svg;
    let svgContent = '';

    let fillAttribute = this.rellenado ? color : 'none';
    let strokeAttribute = this.rellenado ? stroke : '#000000';

    if (forma === 'cuadrado-rectangulo') {
      svgContent = `<rect x="${coordX}" y="${coordY}" width="${width}" height="${height}" fill="${fillAttribute}" stroke="${color}" stroke-width="${strokeWidth}"`;
      svgContent += ' />';
    } else if (forma === 'texto') {
      svgContent = `<text x="${coordX}" y="${coordY}" font-family="${fuente}" font-size="${tamanoLetra}" fill="${color}">${textoIntroducido}</text>`;
    } else if (forma === 'linea') {
      svgContent = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }

    return svgContent;
  }
}
