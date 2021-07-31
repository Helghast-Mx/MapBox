import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa {
      height : 100%;
      width : 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    var map = new mapboxgl.Map({
    container: 'mapa', // el container va a hacer el ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [ -99.07054756409308, 19.450236815624002 ],
    zoom: 17
    });
  }

}
