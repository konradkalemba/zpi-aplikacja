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
                        <h6>MIESZKANIE</h6>
                        <h6 className={styles.adTitle}>Przytuly Apartament w centrum</h6>
                        <p>
                            Wrocław, ul. Centralna 3/23
                        </p>
                        <hr/>
                        <ul className={styles.dashed}>
                            <li> Powierzchnia: <strong>44 m2</strong></li>
                            <li> Liczba pokoi: <strong>4</strong></li>
                            <li> Piętro: <strong>2</strong></li>
                            <li> Rok budowy: <strong>2011</strong></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Order;