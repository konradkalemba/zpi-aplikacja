import React, {Component} from 'react';
import classes from './style.module.scss';
import axios from 'axios';
// import Button from "react-bootstrap/Button";
import Ad from "../Ad/index.js";


class AdView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000')
      .then(
        (result) => {
          console.log(result.data);
          this.setState({
            isLoaded: true,
            ads: result.data
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }


  renderAds = () => {
    const ads = this.state.ads;
    console.log("Ad = " + ads.length);
    return ads.map((ad) => (
      <Ad ad={ad}/>
    ));
  };

  render() {
    return (
      <div className={classes.ordersColumn}>
        {this.renderAds()}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
        {/*<Order/>*/}
      </div>
    )
  }
}

export default AdView;