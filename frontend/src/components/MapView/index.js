import React, { Component } from 'react'
import L from 'leaflet';
import styles from './style.module.scss';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Ad from '../Ad';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    ads: state.ads
});

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ads: [],
            lat: 51.109,
            lng: 17.034,
            zoom: 14,
        }
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
                    {this.props.ads.filter(ad => ad.street).map(ad => {
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

export default connect(
    mapStateToProps
)(MapView);