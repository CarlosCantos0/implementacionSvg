import { Component, OnDestroy, OnInit } from '@angular/core';
import { DibujarService, Formas, Fuentes, Svg } from '../../shared/services/dibujar.service';
import { Subscription } from 'rxjs';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-download',
  templateUrl: './svg-download.component.html',
  styleUrls: ['./svg-download.component.css']
})
export class SvgDownloadComponent implements OnInit, OnDestroy {

  rellenadoFigura: boolean = false;
  fuentesDisponibles: Fuentes[] = ['Arial', 'sans-serif', 'serif', 'monospace', 'Times New Roman'];
  formas: SafeHtml[] = [];
  almacenFormas: Svg[] = [];
  formaSeleccionada: Formas = '';
  formaRecuperada: Formas = '';
  private formaSubscription: Subscription = new Subscription();

  svg: Svg = {
    id: 0,
    forma: '',
    coordX: 150,
    coordY: 150,
    width: 200,
    height: 200,
    color: '#000000',
    textoIntroducido: '',
    fuente: 'Arial',
    tamanoLetra: 20,
    x1: 0,
    y1: 0,
    x2: 200,
    y2: 200,
    stroke: '#000000',
    strokeWidth: 2,
  };

  constructor(
    private dibujar: DibujarService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Suscripción al servicio para obtener la forma seleccionada
    this.formaSubscription = this.dibujar.obtenerFormaSubject().subscribe((forma: string) => {
      this.formaSeleccionada = forma as Formas;
      this.svg.forma = this.formaSeleccionada;
    });

    // Suscripción al servicio para recuperar una forma previamente seleccionada
    this.dibujar.recuperarForma().subscribe((forma) => {
      this.formaRecuperada = forma;
      this.svg.forma = this.formaRecuperada;
    });
  }

  // Cambia el estado del checkbox y notifica al servicio
  getRellenado() {
    this.rellenadoFigura = !this.rellenadoFigura;
    this.dibujar.setBoleano(this.rellenadoFigura);
  }

  // Genera la vista previa en el componente
  generarSvgCompleto(): SafeHtml {
    this.formas = this.dibujar.getFormasAlmacenadas();
    const contenidoSvg = this.formas.join('');
    const svgCompleto = this.dibujar.contenedor + contenidoSvg + '</svg';
    const sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(svgCompleto);
    return sanitizedSvg;
  }

  // Limpia la lista de formas generadas
  resetFormas() {
    this.formas.length = 0;
  }

  ngOnDestroy(): void {
    this.formaSubscription.unsubscribe();
  }

  // Define la forma del SVG que vamos a crear
  definirForma(): void {
    this.svg.forma = this.formaSeleccionada;
  }

  // Genera y almacena un nuevo objeto SVG
  formarSvg(): void {
    const nuevoSvg: Svg = { ...this.svg }; // Clonar el objeto this.svg
    const svgString = this.dibujar.updateSvgContent(nuevoSvg);
    this.dibujar.formarSvg(svgString);
    this.almacenFormas.push(nuevoSvg);
  }

  // Llama al método para generar el SVG y permite su descarga
  descargarSVG() {
    if (this.formas.length === 0) return;

    this.dibujar.downloadCustomSvg();
  }
}
