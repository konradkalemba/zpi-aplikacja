import {Col, Image, Row, Container} from "react-bootstrap";
import './style.module.scss';
import React from "react";
import room from './room.jpg';


function Order(props) {
    return (
        <Container className={'order'}>
            <Row>
                <Col sm={6}>
                    <Image src={room} fluid/>
                </Col>
                <Col sm={6}>
                    <h6>Mieszkanie</h6>
                    <h6>Przytuly Apartament w centrum</h6>
                    <p>
                        Wrocław, ul. Centralna 3/23
                    </p>
                </Col>
            </Row>
        </Container>

    );
}

export default Order;