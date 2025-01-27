import React, { Component } from "react";
import MapScreen from "../MapView/index.js"
import {Col, Row} from "react-bootstrap"
import MapView from "../MapView/index";
import AdView from "../AdView/index";


class MainView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            mapView: true
        }
    }

    render() {
        return (
            <div className={'container-fluid'}>
                <Row>
                    <Col sm={4} fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <React.Fragment>
                            <AdView/>
                        </React.Fragment>
                    </Col>
                    <Col sm={8} fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <React.Fragment>
                            <MapScreen/>
                        </React.Fragment>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MainView