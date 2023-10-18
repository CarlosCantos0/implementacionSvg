// import {  Injectable } from '@angular/core';
// import { BaseSVG } from '../svg-element';
// @Injectable({
//   providedIn: 'root'
// })
// export class SvgObjectService {

//   private svgObjects: BaseSVG[] = [];
//  // public cuadrados: CuadradoComponent[] = [];

//   constructor() {}

//   cargarCoordenadas() {
//     this.cuadrados = [];

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       console.log(key);
//       if (key && key.startsWith('cuadradoCoordenadas-')) {
//         const coordenadasGuardadas = localStorage.getItem(key);
//         if (coordenadasGuardadas) {
//           const coordenadas = JSON.parse(coordenadasGuardadas);

//           // Extraer el número al final de la cadena y convertirlo a un número
//           const matchResult = key.match(/\d+$/);

//           if (matchResult) {
//             const identificador = parseInt(matchResult[0], 10);

//             // Verificar si ya existe un cuadrado con el mismo identificador
//             const cuadradoExistente = this.cuadrados.find(c => c.nextId === identificador);
//             if (cuadradoExistente) {
//               cuadradoExistente.x = coordenadas.x;
//               cuadradoExistente.y = coordenadas.y;
//             } else {
//               // Si no se encuentra, crear un nuevo cuadrado con el identificador
//               const nuevoCuadrado = new CuadradoComponent(this);
//               nuevoCuadrado.nextId = identificador;
//               nuevoCuadrado.x = coordenadas.x;
//               nuevoCuadrado.y = coordenadas.y;
//               this.cuadrados.push(nuevoCuadrado);
//               for (let i = 0; i < this.cuadrados.length; i++ ){
//                 console.log(this.cuadrados[i])
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   guardarCoordenadas(identificador: number, coordenadas: { x: number, y: number }) {
//     localStorage.setItem(`cuadradoCoordenadas-${identificador}`, JSON.stringify(coordenadas));
//   }

//   obtenerCuadrados(): CuadradoComponent[] {
//     return this.cuadrados;
//   }

//     ///LOGICA PARA AÑADIR y ELIMINAR NUEVAS INSTANCIAS DE CUADRADOS AL WORKSPACES

//   crearCuadrado() {
//     const nuevoCuadrado = new CuadradoComponent(this);
//     this.cuadrados.push(nuevoCuadrado);
//     return nuevoCuadrado;
//   }

//   eliminarCuadrado(index: number) {
//     if (index >= 0 && index < this.cuadrados.length) {
//       this.cuadrados.splice(index, 1);
//     }
//   }
//       ///
// }
