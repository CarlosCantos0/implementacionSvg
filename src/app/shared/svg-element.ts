import { SVGObject } from "./models/svg-object.model";

export abstract class BaseSVG implements SVGObject{
  nextId: number = 0;
  x: number = 45;
  y: number = 45;
  width: number = 100;
  height: number = 100;
  fill: string = 'none';
  stroke: string = 'black';

  abstract render(): void; // Método abstracto para renderizar el objeto SVG
}
