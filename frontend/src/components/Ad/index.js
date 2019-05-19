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
            <a href={props.ad.url}>
              <Image className={styles.adImage} src={props.ad.photos.length > 0 ? props.ad.photos[props.ad.photos.length-1].path : room} fluid/>
            </a>
          </Col>
          <Col className={styles.infoCol} sm={6}>
            <h6>MIESZKANIE</h6>
            <h6><strong>Tytuł ogłoszenia: </strong>{props.ad.title}</h6>
            {props.ad.street ?  <p>ul. {props.ad.street.name}</p> : null}
            <hr/>
            <ul className={styles.dashed}>
              {props.ad.area ? <li> Powierzchnia: <strong>{props.ad.area} m2</strong></li> : null}
              {props.ad.roomsNumber ? <li> Liczba pokoi: <strong>{props.ad.roomsNumber}</strong></li> : null}
              {props.ad.floor ? <li> Piętro: <strong>{props.ad.floor}</strong></li> : null}
              {props.ad.buildingYear ? <li> Rok budowy: <strong>{props.ad.buildingYear}</strong></li> : null}
              {props.ad.price ? <li> Cena: <strong>{props.ad.price} zł</strong></li> : null}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ad;