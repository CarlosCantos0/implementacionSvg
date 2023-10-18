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
      if (formaGuardada){
        this.dibujar.recuperarForma()
      }
  }

  public sidebarItems = [
    { label: 'Rectangulo', icon: 'crop_16_9'},
    { label: 'Cuadrado', icon: 'check_box_outline_blank' },
    { label: 'Texto', icon: 'edit_note'},
    { label: 'Líneas', icon: 'timeline'},
    { label: 'Añadir', icon: 'add'},
  ];


  onItemClick(index: number) {
    switch (index) {
      case 0:
        //Al pulsar en el item del sidenav llamamos al método para definir que la forma que vamos a hacer es un rectangulo
        this.dibujar.definirForma('cuadrado-rectangulo');
        break;

      case 1:
        //Al pulsar en el item del sidenav llamamos al método para definir que la forma que vamos a hacer es un cuadrado
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
        //Llamamos al método para definir que la forma que vamos a hacer es un cuadrado
        this.dibujar.definirForma('');
        break;

    }
  }

  salirWork() {
    console.log('salir work')
    this.router.navigate(['./work-off']);
  }



}
