import { Directive, HostListener } from '@angular/core';


/// --- para añadir esta directiva al HTML deberemos de utilizar --- \\\
/// --- <div appDrop></div>  -- Utilizamos el selector


@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  constructor() {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    // Lógica para el inicio del arrastre
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    // Lógica para el final del arrastre
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    // Lógica para cuando un objeto se arrastra sobre la zona de soltar
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    // Lógica para cuando se suelta un objeto en la zona de soltar
  }
}
