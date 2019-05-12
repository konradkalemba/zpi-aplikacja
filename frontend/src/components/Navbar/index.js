import React from 'react';
import styles from './styles.module.scss'
import {Navbar, Nav, Col} from "react-bootstrap"


class Index extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg" className={styles.nav}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Index;
