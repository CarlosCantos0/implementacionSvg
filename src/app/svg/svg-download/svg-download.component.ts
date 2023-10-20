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
  formas: SafeHtml[] = [];      //Guardamos lo que vamos a insertar en el HTML safeHtml por el XSS(Cross-Site Scripting)
  almacenFormas: Svg[] = [];    //Guardamos las formas para luego encapsularlas entre etiquetas svg
  formaSeleccionada: Formas = '';
  formaRecuperada: Formas = localStorage.getItem('formaSeleccionada') as Formas; //Recuperar la forma del LocalStorage
  private formaSubscription: Subscription = new Subscription(); //Subscripcion al evento para saber la forma que va a tomar mi figura
  id: number = 0;

  //Definimos los atributos que darán la forma a nuestro SVG
  svg: Svg = {
    id: this.id,
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

  //Inyectamos el servicio y el sanitizer para "sanar" el HTML que insertamos a través del [InnerHtml]
  constructor(
    private dibujar: DibujarService,
    private sanitizer: DomSanitizer
  ) {}

  //Llamamos a los métodos para subscribirse al evento de la forma e inicializar el SVG con la forma seleccionada
  ngOnInit(): void {
    this.inicializarFormaSubscription();
    this.inicializarSvg();
  }

  // Cambia el estado del checkbox de rellenado y notifica al servicio
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

  // Limpia la lista de formas generadas para limpiar la vista previa
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

  //Nos subscribimos para obtener la forma desde el servicio
  private inicializarFormaSubscription() {
    this.formaSubscription = this.dibujar.obtenerFormaSubject().subscribe((forma: string) => {
      this.formaSeleccionada = forma as Formas;
      this.svg.forma = this.formaSeleccionada;
    });
  }

  private inicializarSvg() {
    // Configurar las propiedades iniciales de svg
    this.svg.id = this.id++;
    if (this.formaRecuperada) {
      this.formaSeleccionada = this.formaRecuperada;
      this.definirForma();
    }
  }

  // Genera y almacena un nuevo objeto SVG
  generarSvg(): void {
    const nuevoSvg: Svg = { ...this.svg }; // Clonar el objeto this.svg
    const svgString = this.dibujar.updateSvgContent(nuevoSvg);  //Le damos el valor a svgString con la cadena que vamos a insertar en el HTML
    this.dibujar.guardarSvg(svgString);  //Se lo pasamos al servicio para añadirlo al arreglo
    this.almacenFormas.push(nuevoSvg);  //añadimos la nueva forma a mi array en el cual luego encapsulo el contenido con etiquetas <svg>
  }

  // Llama al método para generar el contenido SVG y posteriormente permite su descarga
  descargarSVG() {
    if (this.formas.length === 0) return;

    this.dibujar.downloadCustomSvg();
  }
}
