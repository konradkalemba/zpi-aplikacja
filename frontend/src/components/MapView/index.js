import React, { Component } from 'react'
import L from 'leaflet';
import styles from './style.module.scss';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios';
import Ad from '../Ad'

export default class SimpleExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: [],
            lat: 51.109,
            lng: 17.034,
            zoom: 14,
        }
    }


    componentDidMount() {
        axios.get('http://localhost:3000')
            .then(
                (result) => {
                    console.log(result.data);
                    this.setState({
                        isLoaded: true,
                        ads: result.data
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        return (
            <div className={styles.map}>
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
                    {this.state.ads.filter(ad => ad.street).map(ad => {
                        return (
                            <Marker position={[ad.street.lat, ad.street.long]}>
                                <Popup className={styles.adPopup}><Ad ad={ad} /></Popup>
                            </Marker>
                        )
                    })}
                </Map>
            </div>
        )
    }
}