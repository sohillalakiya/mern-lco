import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import { addProductToCart, removeItemFromCart } from '../admin/helper/cartHelper';
import ImageHelper from './helper/ImageHelper';

const Card = ({ product, addToCart = true, removeFromCart = false, setReload = f => f, reload = undefined }) => {

    const [getRedirect, setGetRedirect] = useState(false);
    const [count, setCount] = useState(product.count)

    const cardTitle = product ? product.name : "A photo from pixel"
    const cardDescription = product ? product.description : "Default description"
    const cardPrice = product ? product.price : "Default Price"

    const addItemToCart = () => {
        addProductToCart(product, () => setGetRedirect(true))
    }

    const getARedirect = (redirect) => {
        if (redirect) {
            return <Redirect to="/cart" />
        }
    }

    const showAddToCart = (addToCart) => {
        return (
            addToCart && (
                <button onClick={addItemToCart} className="btn btn-block btn-outline-success mt-2 mb-2">
                    Add to Cart
                </button>
            )
        )
    }

    const showRemoveFromCart = (removeFromCart) => {
        return (
            removeFromCart && (
                <button onClick={() => {
                    removeItemFromCart(product._id)
                    setReload(!reload)
                }
                } className="btn btn-block btn-outline-danger mt-2 mb-2">
                    Remove from cart
                </button>
            )
        )
    }

    return (
        <div className="card text-white bg-dark border border-info ">
            {getARedirect(getRedirect)}
            <div className="card-header lead">{cardTitle}</div>
            <div className="card-body">
                <ImageHelper product={product} />
                <p className="lead bg-success font-weight-normal text-wrap">
                    {cardDescription}
                </p>
                <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
                <div className="row">
                    <div className="col-12">
                        {showAddToCart(addToCart)}
                    </div>
                    <div className="col-12">
                        {showRemoveFromCart(removeFromCart)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card