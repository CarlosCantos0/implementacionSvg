import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDragNdDrop]'
})
export class DragNdDropDirective {

  private initialMouseX = 150;
  private initialMouseY = 150;

  private draggingElements: { [key: string]: { element: HTMLElement, offsetX: number, offsetY: number } } = {};


  constructor(private el: ElementRef, private renderer: Renderer2) {}


  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {

  console.log('onMouseDown')

  const target = event.target as HTMLElement;

  if (target.tagName === 'svg') {
    const svgId = target.getAttribute('id');
    console.log(svgId)
    const svgElement = svgId ? document.getElementById(svgId) : null;
    console.log(svgElement)
    if (svgElement) {
      const initialMouseX = event.clientX;
      const initialMouseY = event.clientY;

      const boundingBox = svgElement.getBoundingClientRect();
      const offsetX = initialMouseX - boundingBox.left;
      const offsetY = initialMouseY - boundingBox.top;

      svgElement.style.position = 'absolute';
      svgElement.style.left = `${boundingBox.left}px`;
      svgElement.style.top = `${boundingBox.top}px`;

      // Establece un nuevo z-index para que el elemento arrastrado esté en la parte superior
      svgElement.style.zIndex = '1000';

      const onMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        svgElement.style.left = `${newX}px`;
        svgElement.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        svgElement.style.position = 'static'; // Restaura la posición original
        svgElement.style.zIndex = 'auto'; // Restaura el z-index
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    //console.log('onMouseMove')
    for (const svgId in this.draggingElements) {
      if (this.draggingElements.hasOwnProperty(svgId)) {
        console.log(svgId)
        const info = this.draggingElements[svgId];
        const newX = event.clientX - info.offsetX;
        const newY = event.clientY - info.offsetY;
        info.element.style.left = `${newX}px`;
        info.element.style.top = `${newY}px`;
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    console.log('onMouseUp')

    for (const svgId in this.draggingElements) {
      if (this.draggingElements.hasOwnProperty(svgId)) {
        const info = this.draggingElements[svgId];
        info.element.style.position = 'static';
        info.element.style.zIndex = 'auto';
      }
    }
    this.draggingElements = {}; // Limpiar la lista de elementos arrastrados
  }
}
