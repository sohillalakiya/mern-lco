import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartEmpty, loadCart } from '../admin/helper/cartHelper'
import { getToken, processPayment } from '../admin/helper/paymentBHelper'
import { isAutheticated } from '../auth/helper'
import DropIn from "braintree-web-drop-in-react"
import { createOrder } from '../admin/helper/orderHelper'


function PaymentBCheckout({ products, setReload = f => f, reload = undefined }) {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })

    const userId = isAutheticated() && isAutheticated().user._id;
    const token = isAutheticated() && isAutheticated().token;

    const getMeToken = (userId, token) => {
        getToken(userId, token).then(info => {
            if (info.error) {
                setInfo({ ...info, error: info.error })
            } else {
                const clientToken = info.clientToken;
                setInfo({ clientToken })
            }
        })
    }

    useEffect(() => {
        getMeToken(userId, token)
    }, []);

    const showbtdropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products && products.length > 0 && isAutheticated() ?
                    (
                        <div>
                            <DropIn options={{ authorization: info.clientToken }} onInstance={instance => (info.instance = instance)} />
                            <button className='btn btn-block btn-success' onClick={onPurchase}>Pay with PayPal</button>
                        </div>
                    )
                    : (
                        <h3>Please login or add more products to cart</h3>
                    )}
            </div>
        )
    }

    const onPurchase = () => {
        setInfo({ loading: true })
        let nonce;
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, success: response.success, loading: false });
                        console.log("PAYMENT SUCCESS");

                        const orderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount
                        }

                        createOrder(userId, token, orderData)

                        cartEmpty(() => {
                            console.log("CART EMPTY")
                        });
                        setReload(!reload);

                    })
                    .catch(err => {
                        setInfo({ loading: false, success: false });
                        console.log("PAYMENT FAILED")
                    })
            })
    }

    const getAmount = () => {
        let amount = 0;
        products && products.map((p) => {
            amount = amount + p.price
        });
        return amount;
    }

    return (
        <>
            <h3>Your PayPal bill is ${getAmount()}</h3>
            {showbtdropIn()}
        </>

    )
}

export default PaymentBCheckout