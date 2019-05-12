import React, {Component} from 'react';
import classes from './style.module.scss';
// import axios from 'axios';
// import Button from "react-bootstrap/Button";
import Order from "../Order/index.js";


class OrdersColumn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        //axios.get('http://localhost:3000/orders')
    }

    renderOrders = () => {
        const orders = this.state.orders;
        console.log("Order = " + orders.length);
        return orders.map(() => (
            <Order/>
        ));
    };

    render() {
        return (
            <div className={classes.ordersColumn}>
                {this.renderOrders()}
                <Order/>
                <Order/>
                <Order/>
                <Order/>

            </div>
        )
    }
}

export default OrdersColumn;