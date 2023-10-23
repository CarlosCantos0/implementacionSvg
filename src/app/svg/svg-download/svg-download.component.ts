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

  aplicarRelleno: boolean = false;
  fuentesDisponibles: Fuentes[] = ['Arial', 'sans-serif', 'serif', 'monospace', 'Times New Roman'];
  formas: SafeHtml[] = [];      //Guardamos lo que vamos a insertar en el HTML safeHtml por el XSS(Cross-Site Scripting)
  formaSeleccionada: Formas = '';
  formaRecuperada: Formas = localStorage.getItem('formaSeleccionada') as Formas; //Recuperar la forma del LocalStorage
  private formaSubscription: Subscription = new Subscription(); //Subscripcion al evento para saber la forma que va a tomar mi figura
  id: number = 0;
  edicionActiva: boolean = false;

  formasAlmacen: Svg[] = [];

  //Definimos los atributos que darán la forma a nuestro SVG
  svg: Svg = {
    rellenado: false,
    id: this.id,
    forma: '',
    coordX: 150,
    coordY: 150,
    width: 200,
    height: 200,
    fill: '#000000',
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
    this.formasAlmacen = this.dibujar.getFormasAlmacenadas();
    console.log(this.formasAlmacen)
  }

  ngOnDestroy(): void {
    this.formaSubscription.unsubscribe();
  }

  // Llamamos al método y nos subscribimos para obtener la forma desde el servicio
  private inicializarFormaSubscription() {
    this.formaSubscription = this.dibujar.obtenerFormaSubject().subscribe((forma: string) => {  //Recibe el valor Subject del servicio
      this.formaSeleccionada = forma as Formas;   //Asignamos el valor que hemos recibido a formaSeleccionada
      this.definirForma();                        //Le asignamos el valor a nuestro SVG
    });
  }

  // Revisa si hay algun valor en el localStorage, si es así le asigna este valor a nuestro svg a través del método definirForma
  private inicializarSvg() {
    // Configurar las propiedades iniciales de svg
    if (this.formaRecuperada) {
      this.formaSeleccionada = this.formaRecuperada;
      this.definirForma();
    }
  }

  // Cambia el estado del checkbox de rellenado y notifica al servicio
  getRellenado(): void {
    this.aplicarRelleno = !this.svg.rellenado;
    //this.dibujar.setRellenado(this.rellenadoFigura);
    this.svg.rellenado = this.aplicarRelleno;
  }


  // Limpia la lista de formas generadas para limpiar la vista previa
  resetFormas() {
    this.formas.length = 0;
  }

  // Define la forma del SVG que vamos a crear
  definirForma(): void {
    this.svg.forma = this.formaSeleccionada;
  }

  // Genera y almacena un nuevo objeto SVG
  generarSvg(): void {
    this.svg.id = this.id++;
    const nuevoSvg: Svg = { ...this.svg }; // Clonar el objeto this.svg
    const svgString = this.dibujar.updateSvgContent(nuevoSvg);  //Le damos el valor a svgString con la cadena que vamos a insertar en el HTML
    this.dibujar.guardarSvg(svgString);  //Se lo pasamos al servicio para añadirlo al arreglo
    this.formasAlmacen.push(nuevoSvg);
    console.log(this.formasAlmacen)
  }

  // Llama al método del servicio que genera el contenido SVG y posteriormente permite su descarga
  descargarSVG() {
    if (this.formas.length === 0) return;
    this.dibujar.downloadCustomSvg();
  }

  // Genera la vista previa en el componente
  generarSvgCompleto(): SafeHtml {
    this.formas = this.dibujar.getFormasAlmacenadas();  //Array de safeHtml para insertar su contenido en el html
    const contenidoSvg = this.formas.join('');
    const svgCompleto = this.dibujar.contenedor + contenidoSvg + '</svg';
    const sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(svgCompleto);
    return sanitizedSvg;
  }

  editarFigura(event: any) {
    console.log('editar figura')
    event.stopPropagation();
    if (event.target instanceof SVGGElement) {
      const figuraGroup = event.target as SVGGElement;
      const id = figuraGroup.getAttribute('id');
      console.log(id)
      if (id !== null) {
        // Aquí puedes realizar acciones específicas según el tipo de figura
        console.log('Figura id:', id);
        // Resto de la lógica para elementos SVG...
      }
    }
  }
  // // Método para editar los valores asignados de cada figura mediante el ID
  // editarFigura(event: any) {
  //   if (event.target instanceof SVGElement) {
  //     const svgElement = event.target as SVGElement;
  //     const rectElements = svgElement.getElementsByTagName('rect');

  //     // Ahora, rectElements contiene todos los elementos 'rect' en el SVG
  //     Array.from(rectElements).forEach((rect) => {
  //       const id = rect.getAttribute('id');
  //       console.log(id);
  //       if (id !== null) {
  //         const figura = this.dibujar.getFiguraPorId(parseInt(id, 10));
  //         if (figura) {
  //           this.edicionActiva = true;
  //           this.formaSeleccionada = figura.forma;
  //           console.log(this.edicionActiva, this.formaSeleccionada)
  //           if(this.edicionActiva) {
  //             const nuevoColor = 'red';
  //             figura.color = nuevoColor;
  //             this.svg.color = figura.color
  //             console.log(this.svg.color)
  //           }
  //         }
  //       }
  //     });
  //   }
  // }










}
