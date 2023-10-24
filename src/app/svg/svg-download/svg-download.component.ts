import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DibujarService, Formas, Fuentes, Svg } from '../../shared/services/dibujar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-svg-download',
  templateUrl: './svg-download.component.html',
  styleUrls: ['./svg-download.component.css']
})
export class SvgDownloadComponent implements OnInit, OnDestroy {

  fuentesDisponibles: Fuentes[] = ['Arial', 'sans-serif', 'serif', 'monospace', 'Times New Roman'];
  formaSeleccionada: Formas = '';
  formaRecuperada: Formas = localStorage.getItem('formaSeleccionada') as Formas; //Recuperar la forma del LocalStorage
  private formaSubscription: Subscription = new Subscription(); //Subscripcion al evento para saber la forma que va a tomar mi figura
  id: number = 0;
  edicionActiva: boolean = false;

  formasAlmacen: Svg[] = [];  //Guardamos las distintas figuras para realizar la vista previa y el svgCompleto
  mostrarFormularioEdicion: boolean = false;
  figuraSeleccionada: Svg = {
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
    svgContent: ''
  };

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
    svgContent: ''
  };

  //Inyectamos el servicio para manejar nuestra lógica
  constructor(
    private dibujar: DibujarService,
    private cd: ChangeDetectorRef
  ) {}

  //Llamamos a los métodos para subscribirse al evento de la forma e inicializar el SVG con la forma seleccionada
  ngOnInit(): void {
    this.inicializarFormaSubscription();
    this.inicializarSvg();
    this.formasAlmacen = this.dibujar.getFormasAlmacenadas();
    //console.log(this.formasAlmacen)
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
    this.figuraSeleccionada.rellenado = !this.figuraSeleccionada.rellenado;
  }


  // Limpia la lista de formas generadas para limpiar la vista previa
  resetFormas() {
    this.formasAlmacen.length = 0;
    this.mostrarFormularioEdicion = false;  //Por si estamos en el modo edición nos sacará de este
  }

  // Define la forma del SVG que vamos a crear
  definirForma(): void {
    this.figuraSeleccionada.forma = this.formaSeleccionada;
  }

  // Genera y almacena un nuevo objeto SVG
  generarSvg(): void {
    this.figuraSeleccionada.id = this.id++;
    const nuevoSvg: Svg = { ...this.figuraSeleccionada }; // Clonar el objeto this.figuraSeleccionada
    const svgString = this.dibujar.updateSvgContent(nuevoSvg);  //Le damos el valor a svgString con la cadena que vamos a insertar en el HTML
    this.formasAlmacen.push(nuevoSvg);  //Añadimos el svg que acabamos de hacer a nuestro almacen de svg's

    this.resetFormulario();// Función para restablecer los valores del formulario
  }

  // Llama al método del servicio que genera el contenido SVG y posteriormente permite su descarga
  descargarSVG() {
    this.dibujar.setRellenado(this.figuraSeleccionada.rellenado);
    this.dibujar.downloadCustomSvg();
    this.resetFormas();  //Llamamos al método para que la vista previa se resetee
  }


  //Método para editar los valores de la figura que seleccionemos con doble click
  editarFigura(figura: Svg) {
    if(figura as Svg)  //Si existe la figura la copiamos y activamos la edicion
    this.dibujar.definirForma(figura.forma)
    this.mostrarFormularioEdicion = true;
    this.figuraSeleccionada = { ...figura};
    console.log('editando figura: ' + figura)
  }

  guardarCambios() {
    if(this.figuraSeleccionada !== null) {
      const figuraIndex = this.formasAlmacen.findIndex((f) => f.id === this.figuraSeleccionada!.id);
      if (figuraIndex !== -1) {

        this.dibujar.actualizarForma(this.figuraSeleccionada.id, this.figuraSeleccionada);
        this.formasAlmacen[figuraIndex] = { ...this.figuraSeleccionada as Svg };
        console.log('Figura actualizada:', this.formasAlmacen[figuraIndex]);

        // Activa la detección de cambios de Angular para actualizar la vista
        this.cd.detectChanges();
      }
      this.mostrarFormularioEdicion = false; // Oculta el formulario de edición
      this.resetFormulario();
    }
  }

  cancelarEdicion() {
    this.mostrarFormularioEdicion = false; // Oculta el formulario de edición
    this.figuraSeleccionada.forma = this.formaSeleccionada;
  }

  resetFormulario() {
    this.figuraSeleccionada.coordX = 150;
    this.figuraSeleccionada.coordY = 150;
    this.figuraSeleccionada.width = 200;
    this.figuraSeleccionada.height = 200;
    this.figuraSeleccionada.fill = '#000000';
    this.figuraSeleccionada.textoIntroducido = '';
    this.figuraSeleccionada.fuente = 'Arial';
    this.figuraSeleccionada.tamanoLetra = 20;
    this.figuraSeleccionada.x1 = 0;
    this.figuraSeleccionada.y1 = 0;
    this.figuraSeleccionada.x2 = 200;
    this.figuraSeleccionada.y2 = 200;
    this.figuraSeleccionada.stroke = '#000000';
    this.figuraSeleccionada.strokeWidth = 2;
  }

}
