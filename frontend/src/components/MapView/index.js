import React, { Component } from 'react'
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

export default class SimpleExample extends Component{
    state = {
        lat: 51.109,
        lng: 17.034,
        zoom: 14,
    };

    render() {
        const position = [this.state.lat, this.state.lng];

        return (
            <div id={'map'}>
                <Map
                    center={position}
                    zoom={this.state.zoom}>
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </Map>
            </div>
        )
    }
}