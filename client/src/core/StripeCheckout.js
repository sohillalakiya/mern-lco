import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "../admin/helper/cartHelper";
import { isAutheticated } from "../auth/helper";
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from "../backend";

const StripeCheckout = ({ products, setReload = f => f, reload = undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    })

    const token = isAutheticated() && isAutheticated().token;
    const userId = isAutheticated() && isAutheticated().user._id;

    const getFinalPrice = () => {
        let amount = 0;
        products && products.map((p) => {
            amount = amount + p.price;
        });
        return amount;
    }

    const makePayment = (token) => {
        const body = {
            token,
            products
        };

        const headers = {
            "Content-Type": "application/json"
        };

        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
            .then(response => {
                const {status} = response;
                console.log("STATUS ", status);
                cartEmpty(() => {
                    console.log("CART EMPTY")
                });
                setReload(!reload);
            }).catch(err => console.log(err))
    }

    const showStripeButton = () => {
        return isAutheticated() && products && products.length > 0 ? (
            <StripeCheckoutButton stripeKey={process.env.REACT_APP_STRIPE_PUBLISH} token={makePayment} amount={getFinalPrice() * 100} name="Buy tshirts" billingAddress shippingAddress>
                <button className="btn btn-block btn-success">Pay with stripe</button>
            </StripeCheckoutButton>
        ) : (
            <h3>Please login or add more products to cart</h3>
        )
    }

    return (
        <div>
            <h3 className="text-white">Your stripe bill is  $ {getFinalPrice()}</h3>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckout;