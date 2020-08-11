import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router";


// import hooks
import { useHandleFetch } from "../../hooks";

// import lib
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import { Skeleton, Empty, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal, Badge } from 'antd';



// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import ProductEdit from "./ProductEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [productDetailState, handleProductDetailFetch] = useHandleFetch({}, 'productDetailById');

    const params = useParams();
    const history = useHistory();
    const productId = params['id'];
    const [productEditVisible, setProductEditVisible] = useState(false);


    useEffect(() => {

        const getProductDetail = async () => {
            await handleProductDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: productId
                    }
                }
            })
        };

        getProductDetail();

    }, [productId]);




    console.log('productDetailState', productDetailState);

    console.log('brandParams', params);

    const getImagesInCollumn = (imgs) => {
        if (!imgs[0]) return false;
        imgs = imgs.map(item => item.cover);
        const columns = {};

        let localIndex = 0;
        let columnNumber = 0;


        imgs.forEach((item, index) => {
            if (localIndex < 3) {
                if (columns[columnNumber]) {
                    columns[columnNumber] = [...columns[columnNumber], item]
                }
                else columns[columnNumber] = [item];

                localIndex = localIndex + 1;
                columnNumber = columnNumber + 1;

            }
            else {
                localIndex = 0;
                columnNumber = 0;
                console.log('localIndex', localIndex)
            }
        });

        return columns;
    }


    const row = productDetailState.done && productDetailState.data && productDetailState.data['image'] ? getImagesInCollumn(productDetailState.data['image']) : [];

    return (
        <div className='brandDetailContainer'>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Product Detail
                </h3>

                {productDetailState.done && productDetailState.data && (Object.keys(productDetailState.data).length > 0) && (
                    <>
                        <ProductEdit
                            productEditVisible={productEditVisible}
                            setProductEditVisible={setProductEditVisible}
                            productDetailData={productDetailState.data}
                        />
                        <Button
                            onClick={() => setProductEditVisible(true)}
                            type='link'
                            icon={<EditOutlined />}
                        >
                            Edit
                      </Button>
                    </>
                )}

            </div>
            <Skeleton
                avatar paragraph={{ rows: 3 }}
                loading={productDetailState.isLoading}>
                {productDetailState.done && productDetailState.data && !(Object.keys(productDetailState.data).length > 0) && (
                    <Empty description='No Product found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {productDetailState.done && productDetailState.data && (Object.keys(productDetailState.data).length > 0) && (
                    <>
                        <div className='brandDetailContainer__header'>
                            <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-product'>
                                <img src={productDetailState.data['cover'] && productDetailState.data['cover']['cover']} alt="" />
                            </div>
                            <div className='brandDetailContainer__header-info'>
                                <h2>
                                    {productDetailState.data['name']}
                                </h2>
                                <h4>
                                    {productDetailState.data['price']}
                                </h4>
                                <h3>
                                    {productDetailState.data['description']}
                                </h3>


                                {productDetailState.data['url'] && (
                                    <h3>
                                        URL:
                                        <span>
                                            {productDetailState.data['url']}
                                        </span>

                                    </h3>
                                )}
                                {/* 
                                {productDetailState.data['tags'] && productDetailState.data['tags'].length > 0 &&
                                    (<>
                                        <h3>
                                            TAGS:
                                        {productDetailState.data['tags'].map(tag => {
                                            return (
                                                <span>
                                                    {tag.name}
                                                </span>
                                            )
                                        })}
                                        </h3>

                                    </>)
                                } */}

                                {productDetailState.data['category'] && productDetailState.data['category'].length > 0 &&
                                    (<>
                                        <h3>
                                            CATEGORIES:
                                        {productDetailState.data['category'].map(cat => {
                                            return (
                                                <span
                                                    onClick={() => history.push(`/admin/category/${cat.id}`)}

                                                >
                                                    {cat.name}
                                                </span>
                                            )
                                        })}
                                        </h3>

                                    </>)
                                }

                            </div>
                        </div>


                        {productDetailState.data['icon'] && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Icon
                            </h3>
                                </div>

                                <div className='brandDetailContainer__inlineBox'>
                                    <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-icon'>
                                        <img src={productDetailState.data['icon'] && productDetailState.data['icon']} alt="" />
                                    </div>

                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}

                        {productDetailState.data['pricing'] && productDetailState.data['pricing'].length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Pricing
                                   </h3>
                                </div>

                                <div className='brandDetailContainer__pricing'>
                                    <div className='addProductGridContainer__item-body-pricingContainer'>
                                        {productDetailState.data['pricing'].map(item => {
                                            return (
                                                <div className='addProductGridContainer__item-body-pricingContainer-item'>

                                                    <div className='addProductGridContainer__item-body-pricingContainer-item-two'>
                                                        <div>
                                                            <h3>
                                                                Price
    </h3>
                                                            <div className='addProductGridContainer__item-body-pricingContainer-item-body'>


                                                                {item.price.offer ? (
                                                                    <>
                                                                        <h4 >
                                                                            {item.price.offer}

                                                                        </h4>
                                                        /
                                                        <h5 style={{
                                                                            textDecoration: "line-through"
                                                                        }}>

                                                                            {item.price.regular}
                                                                        </h5>
                                                                    </>
                                                                ) : (
                                                                        <h4>
                                                                            {item.price.regular}

                                                                        </h4>
                                                                    )}


                                                            </div>
                                                        </div>

                                                        {item.stock && (
                                                            <div>
                                                                <Badge
                                                                    overflowCount={999}
                                                                    count={item.stock.available}>
                                                                    <h3>
                                                                        Stock
                </h3>
                                                                </Badge>
                                                                <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                                                    <div>
                                                                        <h6>
                                                                            min
                                                                        <Badge
                                                                                className="site-badge-count-4"
                                                                                overflowCount={999}
                                                                                count={item.stock.minimum} />
                                                                        </h6>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )}



                                                    </div>

                                                    {item.attribute
                                                        && Object.values(item.attribute).length > 0 && (
                                                            <>
                                                                <h3>
                                                                    Attributes
    </h3>
                                                                <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                                                    {item.attribute
                                                                        && Object.keys(item.attribute).length > 0
                                                                        && Object.keys(item.attribute).map(attributeItem => {
                                                                            return (
                                                                                <div>
                                                                                    <h6>
                                                                                        {attributeItem}
                                                                                    </h6>
                                                                                    <h4>
                                                                                        {item.attribute[attributeItem]}
                                                                                    </h4>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                </div>
                                                            </>
                                                        )}

                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}



                        {productDetailState.data['image'] && productDetailState.data['image'].length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Image Gallary
                                   </h3>
                                </div>

                                <div className='brandDetailContainer__imageGallary'>
                                    <div className='imgGallaryContainer'>

                                        <div className="imgGallary-row">
                                            {row && Object.keys(row).map(column => {
                                                return (
                                                    <div className="imgGallary-column">
                                                        {row[column] && row[column].map(img => {
                                                            return <img src={img} style={{
                                                                width: '100%'
                                                            }} />
                                                        })}

                                                    </div>
                                                )
                                            })}


                                        </div>
                                    </div>

                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}

                        {productDetailState.data['brand'] && Object.keys(productDetailState.data['brand']).length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Brand
                                   </h3>
                                </div>

                                <div
                                    onClick={() => history.push(`/admin/brand/${productDetailState.data['brand']['id']}`)}

                                    className='brandDetailContainer__brand'>
                                    <div className='brandDetailContainer__brand-coverbox'>
                                        <img src={productDetailState.data['brand']['cover'] && productDetailState.data['brand']['cover']} alt="" />
                                    </div>
                                    <div className='brandDetailContainer__brand-info'>
                                        <h2>
                                            {productDetailState.data['brand']['name']}
                                        </h2>
                                        <h3>
                                            {productDetailState.data['brand']['description']}
                                        </h3>
                                    </div>
                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}


                        {productDetailState.data['primaryCategory'] && Object.keys(productDetailState.data['primaryCategory']).length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Primary Category
                                   </h3>
                                </div>

                                <div
                                    onClick={() => history.push(`/admin/category/${productDetailState.data['primaryCategory']['id']}`)}
                                    className='brandDetailContainer__brand'>
                                    <div className='brandDetailContainer__brand-coverbox'>
                                        <img src={productDetailState.data['primaryCategory']['cover'] && productDetailState.data['primaryCategory']['cover']} alt="" />
                                    </div>
                                    <div className='brandDetailContainer__brand-info'>
                                        <h2>
                                            {productDetailState.data['primaryCategory']['name']}
                                        </h2>
                                        <h3>
                                            {productDetailState.data['primaryCategory']['description']}
                                        </h3>
                                    </div>
                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}

                    </>

                )}

            </Skeleton>


        </div>
    )
}

export default NewBrandDetail
