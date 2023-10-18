import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

// Definición de tipos personalizados
export declare type Formas = 'cuadrado-rectangulo' | 'linea' | 'texto' | '';
export declare type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';

export interface Svg {
  id: number,
  forma: Formas,
  coordX: number,
  coordY: number,
  width: number,
  height: number,
  color: string,
  textoIntroducido: string,
  fuente: Fuentes, // Atributo específico para texto
  tamanoLetra: number, // Atributo específico para texto
  x1: number, // Atributo específico para línea
  y1: number, // Atributo específico para línea
  x2: number, // Atributo específico para línea
  y2: number, // Atributo específico para línea
  stroke: string, // Atributo específico para línea
  strokeWidth: number, // Atributo específico para línea
}

@Injectable({
  providedIn: 'root'
})
export class DibujarService {
  constructor() {}

  rellenado: boolean = false;   // CheckBox rellenado

  private formas: string[] = [];
  contenedor: string = '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600">'

  private formaSubject = new Subject<string>();

  // Cambia el estado del checkbox rellenado
  setBoleano(valor: boolean) {
    this.rellenado = valor;
  }

  // Lee el localStorage para recuperar la forma seleccionada
  recuperarForma(): Observable<Formas> {
    if (!localStorage) throw new Error('LocalStorage no está disponible');

    const formaRecuperada: Formas | null = localStorage.getItem('formaSeleccionada') as Formas;
    if (!formaRecuperada) {
      console.error('No hay valor en forma del localStorage');
      return of('');
    }

    if (formaRecuperada) {
      this.definirForma(formaRecuperada);
      return of(formaRecuperada as Formas);
    } else {
      console.error('Valor no válido en forma del localStorage');
      return of('');
    }
  }

  // Define la forma que va a tomar el SVG
  definirForma(forma: Formas): void {
    if (forma === '') throw new Error('No has seleccionado ninguna opción!');

    this.formaSubject.next(forma);
    localStorage.setItem('formaSeleccionada', forma);
  }

  // Obtiene la forma del Subject (observable)
  obtenerFormaSubject() {
    return this.formaSubject.asObservable();
  }

  // Añade la forma al array para formar el SVG definitivo
  formarSvg(forma: string): void {
    this.formas.push(forma);
    console.log('servicio formas: ' + this.formas); // Array de strings con los distintos strings a insertar
  }

  // Obtiene las formas almacenadas
  getFormasAlmacenadas(): string[] {
    if (this.formas.length === 0) return [];
    return this.formas;
  }

  // Genera un SVG personalizado y permite su descarga
  downloadCustomSvg(): void {
    const svgCompleto = this.formas.join('');
    const svgFormado = this.contenedor + svgCompleto + '</svg>';
    console.log('completo: ' + svgFormado);

    const blob = new Blob([svgFormado], { type: 'image/svg+xml' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-svg.svg';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.formas = [];
  }

  // Método para generar contenido SVG basado en la forma seleccionada
  updateSvgContent(svg: Svg): string {
    let svgContent = '';

    let fillAttribute = this.rellenado ? svg.color : 'none';
    let strokeAttribute = this.rellenado ? svg.stroke : '#000000';

    if (svg.forma === 'cuadrado-rectangulo') {
      svgContent = `<rect x="${svg.coordX}" y="${svg.coordY}" width="${svg.width}" height="${svg.height}" fill="${fillAttribute}" stroke="${svg.color}" stroke-width="${svg.strokeWidth}"`;
      svgContent += ' />';
    } else if (svg.forma === 'texto') {
      svgContent = `<text x="${svg.coordX}" y="${svg.coordY}" font-family="${svg.fuente}" font-size="${svg.tamanoLetra}" fill="${svg.color}">${svg.textoIntroducido}</text>`;
    } else if (svg.forma === 'linea') {
      svgContent = `<line x1="${svg.x1}" y1="${svg.y1}" x2="${svg.x2}" y2="${svg.y2}" stroke="${svg.stroke}" stroke-width="${svg.strokeWidth}" />`;
    }

    return svgContent;
  }
}
