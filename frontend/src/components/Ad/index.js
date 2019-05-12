import {Col, Image, Row, Container} from "react-bootstrap";
import styles from './style.module.scss';
import React from "react";
import room from './room.jpg';


function Order() {
    return (
        <div className={styles.ad}>
            <Container>
                <Row>
                    <Col className={styles.imageCol} sm={6}>
                        <Image className={styles.adImage} src={room} fluid/>
                    </Col>
                    <Col className={styles.infoCol} sm={6}>
                        <h6>Mieszkanie</h6>
                        <h6>Przytuly Apartament w centrum</h6>
                        <p>
                            Wrocław, ul. Centralna 3/23
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Order;