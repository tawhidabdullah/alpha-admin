import React, { useState, useEffect } from 'react';
import { useHandleFetch } from '../../hooks';


// import lib 




interface Props {
    setProductList?: any;
    productList?: any;
    productId?: any;
    quantity?: any;
    item?: any
    variation?: any;
}

const CartOverLayCartItem = ({
    productList,
    setProductList,
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



    console.log('productDetailStateByOrder',productDetailState); 
    
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


    const convertAttributeValuesToStringValue = (attribute) => {
        const value = [];

        let attributeValues = Object.values(attribute);
        attributeValues.forEach(attributeValue => {
            // @ts-ignore
            value.push(attributeValue)
        })

        return value.join(',');
    };




    const getPricingOptions = (pricing) => {
        if (pricing && pricing.length > 0) {
            const pricingOptions = [];

            pricing.forEach(pricingItem => {

                if (Object.values(pricingItem.attribute).length > 0 && pricingItem._id) {
                    let pricingOption = {
                        value: pricingItem._id,
                        label: `${convertAttributeValuesToStringValue(pricingItem.attribute) || ''}`
                    }
                    // @ts-ignore
                    pricingOptions.push(pricingOption)
                }

            })

            return pricingOptions;
        }
        else return false
    };

    const pricingOptions = item && Object.keys(item).length > 0 ? getPricingOptions(item.pricing) : [];


    console.log('pricingOptions', pricingOptions);

    const handleAttributeChange = (tagId) => {
        setSelectedVariationId(tagId);

        const positionInAttribute = () => {
            return productList.map(item => item._id).indexOf(productId);
        }

        const index = positionInAttribute();

        const updatedItem = Object.assign({}, productList[index], { ...item, quantity: 1 });
        const updateAttributeList = [...productList.slice(0, index), updatedItem, ...productList.slice(index + 1)];
        setProductList(updateAttributeList);

    }


    useEffect(() => {

        const getPriceByVariationId = (id) => {
            const pricing = item && Object.keys(item).length > 0 ? item.pricing : false;
            if (pricing) {
                const priceItem = pricing.find(pricingItem => pricingItem._id === id);
                console.log('priceItem', id);

                if (priceItem && priceItem.price.regular) {
                    return priceItem.price.offer
                        && parseInt(priceItem.price.offer)
                        ? priceItem.price.offer : priceItem.price.regular
                }
                else return false;
            }
        }

        if (selectedVariationId) {
            const price = getPriceByVariationId(selectedVariationId);
            setModifiedPrice(price);
        }

    }, [selectedVariationId]);



    console.log('modifiedPrice', modifiedPrice);
    return (
        <>
            Hello there
            {item && Object.keys(item).length > 0 && (
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

                        src={item['cover'] && item['cover']}
                        alt='Img'
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <div className='cart-item-info'>
                        <h4

                        >
                            {item['name']}
                        </h4>
                        <h5
                        >
                            {modifiedPrice || item['price']}
                        </h5>


                        {pricingOptions && pricingOptions.length > 0 && pricingOptions.map(tag => (
                            <>
                                <span
                                    onClick={() => handleAttributeChange(tag.value)}
                                    className={selectedVariationId === tag.value ? 'product-attributeTag product-attributeTag-active' : 'product-attributeTag'}>
                                    {tag.label}
                                </span>
                            </>
                        ))}

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
