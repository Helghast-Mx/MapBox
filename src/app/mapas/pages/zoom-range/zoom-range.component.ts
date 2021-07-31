import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width : 100%;
      height : 100%
    }

    .row {
      background-color: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 10px;
      z-index:999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements  AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa! : ElementRef;
  mapa! : mapboxgl.Map;
  zoomLevel : number = 10;
  center : [number, number] = [ -99.07054756409308, 19.450236815624002 ]
  constructor() {}

  // REGLA DE ORO
    // cuando implementamos un listener, por ejemplo un on() y sea un evento que siempre este escuchando algo
    // debemos  destruirlo cuando el componente se destruya
     
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});

  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // el container va a hacer el ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });
      // colocamos un listener que nos ayuda y nos avisa cuando el zoom cambia, se coloca con el metodo on()
      // colocaremos cuando cambia el zoom
      this.mapa.on('zoom', (event)=> {
        this.zoomLevel = this.mapa.getZoom();
       
      })

      this.mapa.on('zoomend', (event)=> {
        if( this.mapa.getZoom() > 18 ){
          this.mapa.zoomTo( 18 )
        }
      })

      // Movimiento del mapa

      this.mapa.on( 'move', (event)=>{
        const target = event.target;
        const { lng, lat } = target.getCenter()
        this.center = [lng, lat]
        
      } )
  }

  zoomOut(){
   this.mapa.zoomOut()
   
  }
  zoomIn(){

    this.mapa.zoomIn()
  }

  zoomCambio( valor:string ){
    this.mapa.zoomTo( Number(valor) )
  }

}
