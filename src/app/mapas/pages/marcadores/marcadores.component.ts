import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color  : string;
  marker ?: mapboxgl.Marker;
  centro ?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
     .mapa-container {
      width : 100%;
      height : 100%
    }

    .list-group {
      
      position : fixed; 
      top: 20px;
      right: 20px;
      z-index: 999;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa! : ElementRef;
  mapa! : mapboxgl.Map;
  zoomLevel : number = 15;
  center : [number, number] = [ -99.07054756409308, 19.450236815624002 ]
  marcadores : MarcadorColor [] = [];

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // el container va a hacer el ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      // const markerHtml : HTMLElement = document.createElement('div');
      // markerHtml.innerHTML = 'Hola'

      // const marker = new mapboxgl.Marker({
      //   element : markerHtml
      // })
      // const marker = new mapboxgl.Marker()
      //   .setLngLat( this.center )
      //   .addTo( this.mapa )
      this.leerLocalStorage();
  }

  agregarMarcador(){
    // color hexadecimal de manera aleatoria
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable : true,
      color : color
    })
      .setLngLat( this.center )
      .addTo( this.mapa )
      this.marcadores.push( {
        color : color,
        marker: nuevoMarcador
      } )
      this.saveMarkerLocalStorage()
      nuevoMarcador.on('dragend', ()=>{
        this.saveMarkerLocalStorage();
      })
  }

  irMarcador( latLon : any ){
    const target = latLon.marker._lngLat
    // const { lng, lat } = target
    // console.log(  target )
     this.mapa.flyTo({
       center : target
     })
    this.saveMarkerLocalStorage()

    
  }
// -----------------------------------------------------
  // solucion del profe

  // irMarcador( latLon : mapboxgl.Marker ){
  //   this.mapa.flyTo({
  //      center : latLon.getLngLat()
  //    })
  // }

  saveMarkerLocalStorage(){
    const lngLatArr : MarcadorColor[] = [];
    this.marcadores.forEach(m =>{
      const color = m.color
      const { lng, lat } = m.marker!.getLngLat()

      lngLatArr.push({
        color: color,
        centro: [lng,lat]
      })
      
    })

    const locals = localStorage.setItem('marcadores', JSON.stringify(lngLatArr))
    // console.log(  lngLatArr  )
  }

  leerLocalStorage(){
    if( !localStorage.getItem('marcadores') ){
      return;
    }

    const lngLatArr : MarcadorColor[] =JSON.parse(localStorage.getItem('marcadores')!) ;
    // console.log(  lngLatArr  )
    lngLatArr.forEach( m=>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat( m.centro! )
      .addTo(this.mapa)

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', ()=>{
        this.saveMarkerLocalStorage();
      })
    } )
  }

  borrarMarcador( i : number ){
    // console.log(  ` borrando `,  )
    this.marcadores[i].marker?.remove()
    this.marcadores.splice( i, 1 )
    this.saveMarkerLocalStorage()
  }

}
