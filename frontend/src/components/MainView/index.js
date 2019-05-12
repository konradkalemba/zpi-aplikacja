import React, { Component } from "react";
import MapScreen from "../MapView/index.js"
import {Col, Row} from "react-bootstrap"
import MapView from "../MapView/index";
import OrderView from "../OrderView/index";


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
                    <Col sm={3} fluid style={{ paddingLeft: 2, paddingRight: 1 }}>
                        <React.Fragment>
                            <OrderView/>
                        </React.Fragment>
                    </Col>
                    <Col sm={9} fluid style={{ paddingLeft: 1, paddingRight: 4 }}>
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