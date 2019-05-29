import React, {Component} from 'react';
import classes from './style.module.scss';
import axios from 'axios';
// import Button from "react-bootstrap/Button";
import Ad from "../Ad/index.js";
import { connect } from 'react-redux';
import { setAds } from '../../actions';

const mapStateToProps = state => ({
  ads: state.ads
});

const mapDispatchToProps = dispatch => ({
  setAds: ads => dispatch(setAds(ads))
});

class AdView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/ads')
      .then(
        (result) => {
          this.props.setAds(result.data);
          this.setState({
            isLoaded: true
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
    const { ads } = this.props;

    return ads.map((ad) => (
      <Ad ad={ad}/>
    ));
  };

  render() {
    return (
      <div className={classes.ordersColumn}>
        {this.renderAds()}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdView);