import React, { useState, useEffect } from 'react';
import { useHandleFetch } from '../../hooks';

interface Props {
    setProductList?: any;
    productList?: any;
    productId?: any;
    quantity?: any;
    item?: any
}

const CartOverLayCartItem = ({
    productList,
    setProductList,
    productId,
    quantity,
    item
}: Props) => {


    const [productDetailState, handleProductFetch] = useHandleFetch(
        {},
        'productDetailById'
    );
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        const getAndSetProduct = async () => {
            const product = await handleProductFetch({
                urlOptions: {
                    placeHolders: {
                        id: productId,
                    },
                },
            });

            // @ts-ignore
            setProduct(product);
            setIsLoading(false);
        };
        getAndSetProduct()
    }, []);



    // useEffect(() => {
    //     const positionInAttribute = () => {
    //         return attributeList.map(item => item.id).indexOf(attribute.id);
    //     }

    //     const index = positionInAttribute();

    //     const updatedItem = Object.assign({}, attributeList[index], { ...attributeItem });
    //     const updateProductList = [...attributeList.slice(0, index), updatedItem, ...attributeList.slice(index + 1)];
    //     setProductList(updateProductList);

    // }, [attributeItem])


    const handleAttributeDelete = () => {

        const updateProductList = productList.filter(item => item._id !== productId);
        setProductList(updateProductList);
    }




    const handleChangeQuantity = async (value) => {
        if (value === 'minus') {
            if (quantity === 1) {
                return;
            }

            const positionInAttribute = () => {
                return productList.map(item => item._id).indexOf(productId);
            }

            const index = positionInAttribute();

            const updatedItem = Object.assign({}, productList[index], { ...item, quantity: --quantity });
            const updateAttributeList = [...productList.slice(0, index), updatedItem, ...productList.slice(index + 1)];
            setProductList(updateAttributeList);


        } else {
            const positionInAttribute = () => {
                return productList.map(item => item._id).indexOf(productId);
            }

            const index = positionInAttribute();

            const updatedItem = Object.assign({}, productList[index], { ...item, quantity: ++quantity });
            const updateAttributeList = [...productList.slice(0, index), updatedItem, ...productList.slice(index + 1)];
            setProductList(updateAttributeList)


        }
    };




    return (
        <>
            {productDetailState.done && Object.keys(productDetailState.data).length > 0 && (
                <div className='cart-item' key={''}>
                    <div className='cart-item-quantityCounter'>
                        <i
                            onClick={() => {
                                handleChangeQuantity('plus');
                            }}
                            className='fa fa-chevron-up'

                        ></i>
                        <p className='item-amount'>{quantity}</p>
                        <i
                            onClick={() => {
                                handleChangeQuantity('minus');
                            }}
                            className='fa fa-chevron-down'

                        ></i>
                    </div>


                    <img

                        src={product['cover']}
                        alt='productImg'
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <div className='cart-item-info'>
                        <h4


                        >
                            {product['name']}
                        </h4>
                        <h5
                        >
                            ${product['offerPrice'] ? product['offerPrice'] : product['regularPrice']}
                        </h5>
                        {/* <span
             style={{
               display: 'inline-block',
               background: '#fafafa',
               padding: '3px 3px',
               borderRadius: 1,
               fontSize: '12px',
               marginRight: '5px',
               color: '#777',
               marginTop: '5px'
             }}
           >
             15KG
             </span> */}

                    </div>
                    {/* <span
                        onClick={handleAttributeDelete}
                        className='remove-item' >
                        <i className='fa fa-times'></i>
                    </span> */}

                </div>
            )}
        </>
    );
};

// @ts-ignore
export default CartOverLayCartItem;
