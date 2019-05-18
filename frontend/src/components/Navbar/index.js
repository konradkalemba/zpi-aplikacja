import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss'
import homieLogo from '../../assets/images/homieLogo.png'
import Button from "react-bootstrap/es/Button";

class Navbar extends PureComponent {
    render() {
        return (
            <div className={styles.navbar}>
                <img className={styles.homieLogo} src={homieLogo} alt={'homieLogo'}/>
                <Button className={styles.addAd}><span className={styles.text}>+ Dodaj ogłoszenie</span></Button>
            </div>
        );
    }
}

Navbar.propTypes = {};

export default Navbar;