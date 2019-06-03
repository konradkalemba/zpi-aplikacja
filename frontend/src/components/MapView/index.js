import React, { Component } from 'react'
import L from 'leaflet';
import styles from './style.module.scss';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Ad from '../Ad';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import MarkerClusterGroup from 'react-leaflet-markercluster';

const mapStateToProps = state => ({
    ads: state.ads
});

class MarkerIcon extends Component {
    render() {
        let { price } = this.props;
        price = parseFloat(price);

        if (Number.isNaN(price) || price === 0) {
            price = 'Nieznane';
        } else {
            price += ' zł';
        }

        return (
            <div>
                {price}
            </div>
        );
    }
}

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

        const createClusterCustomIcon = function (cluster) {
            let priceMin
            let priceMax
            for (const { options } of cluster.getAllChildMarkers()) {
                const price = parseFloat(options.price)

                if (!Number.isNaN(price) && price !== 0) {
                    if (!priceMin || price < priceMin) {
                        priceMin = price;
                    }
                    if (!priceMax || price > priceMax) {
                        priceMax = price;
                    }
                }
            }

            return L.divIcon({
                html:  ReactDOMServer.renderToString(
                    <div>
                        {cluster.getChildCount()}<br/>
                        {(priceMin && priceMax) &&<small>{priceMin} zł &ndash; {priceMax} zł</small>}
                    </div>
                ),
                className: styles.clusterMarkerIcon,
                iconSize: L.point(40, 40, true),
            });
        }

        return (
            <div className={styles.map}>
                <Map
                    center={position}
                    zoom={this.state.zoom}
                    maxZoom={18}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
                        {this.props.ads.filter(ad => ad.street).map(ad => {
                            return (
                                <Marker
                                    price={ad.price}
                                    position={[ad.street.lat, ad.street.long]}
                                    icon={L.divIcon({
                                        className: styles.markerIcon,
                                        html: ReactDOMServer.renderToString(<MarkerIcon price={ad.price}/>)
                                    })}
                                >
                                    <Popup className={styles.adPopup}><Ad ad={ad} /></Popup>
                                </Marker>
                            )
                        })}
                    </MarkerClusterGroup>
                </Map>
            </div>
        )
    }
}

export default connect(
    mapStateToProps
)(MapView);