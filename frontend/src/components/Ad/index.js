import {Col, Image, Row, Container, Modal, Button} from "react-bootstrap";
import styles from './style.module.scss';
import React from "react";
import room from './room.jpg';


class Ad extends React.Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  render() {
    return (
      <div className={styles.ad}>
        <Container>
          <Row>
            <Col className={styles.imageCol} sm={6}>
              <a href={this.props.ad.url}>
                <Image className={styles.adMainImage}
                       src={this.props.ad.photos.length > 0 ? this.props.ad.photos[this.props.ad.photos.length - 1].path : room}
                       fluid/>
              </a>
            </Col>
            <Col className={styles.infoCol} sm={6}>
              <h6>MIESZKANIE</h6>
              <h6><strong>Tytuł ogłoszenia: </strong>{this.props.ad.title}</h6>
              {this.props.ad.street ? <p>ul. {this.props.ad.street.name}</p> : null}
              <hr/>
              <ul className={styles.dashed}>
                {this.props.ad.area ? <li> Powierzchnia: <strong>{this.props.ad.area} m2</strong></li> : null}
                {this.props.ad.roomsNumber ?
                  <li> Liczba pokoi: <strong>{this.props.ad.roomsNumber}</strong></li> : null}
                {this.props.ad.floor ? <li> Piętro: <strong>{this.props.ad.floor}</strong></li> : null}
                {this.props.ad.buildingYear ?
                  <li> Rok budowy: <strong>{this.props.ad.buildingYear}</strong></li> : null}
                {this.props.ad.price ? <li> Cena: <strong>{this.props.ad.price} zł</strong></li> : null}
              </ul>
              <Button className={styles.detailsButton} variant="secondary" onClick={this.handleShow}>
                Zobacz szczegóły
              </Button>

              <Modal centered size="lg" style={{opacity: 1}} show={this.state.show} onHide={this.handleClose}>
                <Modal.Body style={{margin: 20}}>
                  <div className={styles.modalHeader}>
                    {this.props.ad.street ? <h1>ul. {this.props.ad.street.name}</h1> : <h1>Wrocław</h1>}
                    <Button className={styles.showSourceButton} href={this.props.ad.url}>
                      Zobacz ogłoszenie na
                      {this.props.ad.source === 'gratka' ? <span> Gratka.pl</span> : null}
                      {this.props.ad.source === 'olx' ? <span> Olx.pl</span> : null}
                      {this.props.ad.source === 'otodom' ? <span> Otodom.pl</span> : null}
                    </Button>
                  </div>
                  <div>
                    <h2>
                      {this.props.ad.roomsNumber > 1 ? <span>Mieszkanie, </span> : <span>Kawalerka, </span>}
                      {this.props.ad.roomsNumber > 1 ? <span>{this.props.ad.roomsNumber} {this.props.ad.roomsNumber < 5 ? <span>pokoje, </span> : <span>pokoi,</span>}</span> : null}
                      <span>{this.props.ad.area} m2</span>
                    </h2>
                    <h2>
                      <span>Czynsz najmu: <strong>{this.props.ad.price}</strong>zł</span>
                    </h2>
                    {/*{this.props.ad.description}*/}
                  </div>
                  <div className={styles.imagesWrapper}>
                    {this.props.ad.photos.length > 0 ? this.props.ad.photos.map(photo => (
                      <div className={styles.imageItem}>
                        <Image className={styles.image} src={photo.path}/>
                      </div>
                    )) : null
                    }
                  </div>
                  <div className={styles.description}>
                    <h2>Opis ogłoszenia:</h2>
                    {this.props.ad.description}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className={styles.button} onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Ad;