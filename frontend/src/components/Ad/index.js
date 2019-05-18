import {Col, Image, Row, Container} from "react-bootstrap";
import styles from './style.module.scss';
import React from "react";
import room from './room.jpg';


const Ad = props => {
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
                            {props.ad.area}
                        </p>
                        <hr/>
                        <ul className={styles.dashed}>
                            <li> Powierzchnia: <strong>{props.ad.area} m2</strong></li>
                            <li> Liczba pokoi: <strong>{props.ad.roomsNumber}</strong></li>
                            <li> Piętro: <strong>{props.ad.floor}</strong></li>
                            <li> Rok budowy: <strong>{props.ad.buildingYear}</strong></li>
                            <li> Cena: <strong>{props.ad.price}</strong></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Ad;