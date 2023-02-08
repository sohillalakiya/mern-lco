import React, { useEffect, useState } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";
import { loadCart } from "../admin/helper/cartHelper";
import StripeCheckout from "./StripeCheckout";
import PaymentBCheckout from "./PaymentBCheckout";

const Cart = () => {

    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])


    const loadAllProducts = () => {
        return (
            <div>
                <h2>This is for load all products</h2>
                {products && products.map((product, index) => {
                    return (
                        <Card product={product} addToCart={false} removeFromCart={true} key={index} setReload={setReload} reload={reload} />
                    )
                })}
            </div>
        )
    }

    const loadCheckout = () => {
        return (
            <>
                <h2>Stripe Payment Method</h2>
                {<StripeCheckout products={products} setReload={setReload} />}
                <br/>
                <h2>BrainTree (PayPal) Payment Method</h2>
                <PaymentBCheckout products={products} setReload={setReload} />
            </>
        )
    }


    return (
        <Base title="Cart Page" description="Ready to check out">
            <div className="row text-center">
                <div className="col-6">{products && products.length > 0 ? loadAllProducts() : (<h3>No products in cart</h3>)}</div>
                <div className="col-6">{loadCheckout()}</div>
            </div>
        </Base >
    );
}

export default Cart;
