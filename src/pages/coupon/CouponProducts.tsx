import React, { useEffect } from 'react';

// import hooks
import { useHandleFetch } from "../../hooks";

// import lib
import { useHistory } from "react-router-dom";

import { Skeleton, Empty, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal } from 'antd';



interface Props {
    productId?: any;
    quantity?: any;
}



const CouponProducts = ({
    productId,
    quantity
}: Props) => {

    const history = useHistory();

    const [productDetailState, handleProductFetch] = useHandleFetch(
        {},
        'productDetailById'
    );

    useEffect(() => {
        const getAndSetProduct = async () => {
            await handleProductFetch({
                urlOptions: {
                    placeHolders: {
                        id: productId,
                    },
                },
            });

        };
        getAndSetProduct();
    }, []);


    console.log('productDetailStatecoupon', productDetailState)


    return (
        <Skeleton
            paragraph={{ rows: 2 }}
            loading={productDetailState.isLoading}>
            {productDetailState.data && Object.keys(productDetailState.data).length > 0 && (
                <>
                    <div className='couponDetailProductItem'>
                        <div
                            onClick={() => history.push(`/admin/product/${productId}`)}
                            className='couponDetailProductItem__cover'>
                            <img src={productDetailState.data.cover && productDetailState.data.cover['cover']} alt="" />
                        </div>
                        <div className='couponDetailProductItem__info'>
                            <h2
                                onClick={() => history.push(`/admin/product/${productId}`)}
                            >
                                {productDetailState.data.name}
                            </h2>
                            <h3>
                                {productDetailState.data.price}
                            </h3>
                            <h3>
                                Quantity: {quantity}
                            </h3>
                        </div>
                    </div>
                </>
            )}

        </Skeleton>
    )
}


export default CouponProducts; 