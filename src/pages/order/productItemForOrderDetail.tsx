import React, { useState, useEffect } from 'react';
import { useHandleFetch } from '../../hooks';




// import lib 
import { Skeleton } from 'antd'



interface Props {
    productId?: any;
    quantity?: any;
    item?: any
    variation?: any;
}

const CartOverLayCartItem = ({
    productId,
    quantity,
    item,
    variation
}: Props) => {


    const [productDetailState, handleProductFetch] = useHandleFetch(
        {},
        'productDetailById'
    );
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [modifiedPrice, setModifiedPrice] = useState('');
    const [selectedVariationId, setSelectedVariationId] = useState(variation);



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







    console.log('modifiedPrice', modifiedPrice);
    return (
        <>

            <Skeleton loading={productDetailState.isLoading}>
                {productDetailState.data && Object.keys(productDetailState.data).length > 0 && (
                    <div className='cart-item' key={''}>


                        <img

                            src={productDetailState.data['cover'] && productDetailState.data['cover']['cover']}
                            alt='Img'
                            style={{
                                cursor: 'pointer',
                            }}
                        />
                        <div className='cart-item-info'>
                            <h4

                            >
                                {productDetailState.data['name']}
                            </h4>
                            <h5
                            >
                                Quantity : {quantity}
                            </h5>
                            <h5
                            >
                                {item['unitPrice']}
                            </h5>


                            {/* {pricingOptions && pricingOptions.length > 0 && pricingOptions.map(tag => (
                            <>
                                <span
                                    onClick={() => handleAttributeChange(tag.value)}
                                    className={selectedVariationId === tag.value ? 'product-attributeTag product-attributeTag-active' : 'product-attributeTag'}>
                                    {tag.label}
                                </span>
                            </>
                        ))} */}

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
            </Skeleton>

        </>
    );
};

// @ts-ignore
export default CartOverLayCartItem;
