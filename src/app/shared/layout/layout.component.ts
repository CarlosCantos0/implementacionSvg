import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DibujarService, Formas } from '../services/dibujar.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    //public cuadradoService: SvgObjectService,
    private dibujar: DibujarService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const formaGuardada = localStorage.getItem('formaSeleccionada');
      //console.log('forma guardada: ' + formaGuardada)
      if (formaGuardada !== ''){
        this.dibujar.leerFormaStorage()
      }
  }

  public sidebarItems = [
    { label: 'Rectangulo', icon: 'crop_16_9'},
    { label: 'Cuadrado', icon: 'check_box_outline_blank' },
    { label: 'Texto', icon: 'edit_note'},
    { label: 'Líneas', icon: 'timeline'},
    { label: 'Añadir', icon: 'add'},
  ];

  //Gestionamos que valor pulsamos en el Layout para saber que forma vamos a pintar
  onItemClick(index: number) {
    switch (index) {
      case 0:
        //Al pulsar en el item del sidenav llamamos al método para definir que la forma que vamos a hacer es un rectangulo
        this.dibujar.definirForma('cuadrado-rectangulo');
        break;

      case 1:
        this.dibujar.definirForma('cuadrado-rectangulo');
        break;

      case 2:
        //console.log('Clic en el Texto elemento');
        this.dibujar.definirForma('texto');
        break;

      case 3:
        //console.log('Click en el Líneas elemento');
        this.dibujar.definirForma('linea');
        break;

      case 4:
        this.dibujar.definirForma('');  //Cuando la forma es igual a '' no aparecerá nada o si hay valor en el LocalStorage cogerá este
        break;

    }
  }

  salirWork() {
    console.log('salir work')
    this.router.navigate(['./work-off']);
  }



}
