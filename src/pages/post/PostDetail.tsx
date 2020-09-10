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


// import moment
import Moment from "react-moment";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import ProductBundleEdit from "./PostEdit";
import CouponProducts from "../coupon/CouponProducts";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [productDetailState, handleProductDetailFetch] = useHandleFetch({}, 'postDetail');
    const [postDetailData,setPostDetailData] = useState({}); 
    const params = useParams();
    const history = useHistory();
    const productId = params['id'];

    const [productEditVisible, setProductEditVisible] = useState(false);


    useEffect(() => {
        const getProductDetail = async () => {
            const res = await handleProductDetailFetch({
                urlOptions: {
                    params: {
                        categoryOne: '1',
                        tagsOne: '1',
                        imageValue: '1'
                    },
                    placeHolders: {
                        id: productId,
                    }
                }
            }); 

            // @ts-ignore
            if(res) {
                // @ts-ignore
            setPostDetailData(res)
            }
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


    const row = productDetailState.done && postDetailData && postDetailData['image'] ? getImagesInCollumn(postDetailData['image']) : [];


    console.log('postDetailState', productDetailState);
    return (
        <div className='brandDetailContainer'>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Recipe Detail
                </h3>

                {productDetailState.done && postDetailData && (Object.keys(postDetailData).length > 0) && (
                    <>
                         <ProductBundleEdit

                            productDetailData={postDetailData}
                            addNewCategoryVisible={productEditVisible}
                            setAddNewCategoryVisible={setProductEditVisible}
                            setPostDetailData={setPostDetailData}
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
                {productDetailState.done && postDetailData && !(Object.keys(postDetailData).length > 0) && (
                    <Empty description='No Recipe found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {productDetailState.done && postDetailData && (Object.keys(postDetailData).length > 0) && (
                    <>
                        <div className='brandDetailContainer__header'>
                            <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-product'>
                                <img src={postDetailData['cover'] && postDetailData['cover']} alt="" />
                            </div>
                            <div className='brandDetailContainer__header-info'>
                                <h2>
                                    {postDetailData['name']}
                                </h2>
                                <h4>
                                    {postDetailData['price']}
                                </h4>
                                <h3>
                                    {postDetailData['description']}
                                </h3>

                                {postDetailData['startDate'] && (
                                    <h3>
                                        START DATE:
                                        <span>
                                            {postDetailData['url']}
                                        </span>

                                    </h3>
                                )}

                                {postDetailData['endDate'] && (
                                    <h3>
                                        END DATE:
                                        <span>
                                            {postDetailData['url']}
                                        </span>

                                    </h3>
                                )}



                                {postDetailData['url'] && (
                                    <h3>
                                        URL:
                                        <span>
                                            {postDetailData['url']}
                                        </span>

                                    </h3>
                                )}
                                {/* 
                                {postDetailData['tags'] && postDetailData['tags'].length > 0 &&
                                    (<>
                                        <h3>
                                            TAGS:
                                        {postDetailData['tags'].map(tag => {
                                            return (
                                                <span>
                                                    {tag.name}
                                                </span>
                                            )
                                        })}
                                        </h3>

                                    </>)
                                } */}

                                {postDetailData['category2'] && postDetailData['category2'].length > 0 &&
                                    (<>
                                        <h3>
                                            CATEGORIES:
                                        {postDetailData['category2'].map(cat => {
                                            return (
                                                <span
                                                    onClick={() => history.push(`/admin/posts/category/${cat.id}`)}
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


                        {productDetailState.done
                         && postDetailData && Object.keys(postDetailData).length > 0 
                        && postDetailData['products']
                         && postDetailData['products'].length > 0 && (
                            <div className='brandDetailContainer__heading'>
                                <h3>
                                    Products
                               </h3>
                            </div>
                        )
                        }


                        <div className='brandDetailContainer__body'>
                            {productDetailState.done && postDetailData && postDetailData['products'] && !(postDetailData['products'].length > 0) && (
                                <div style={{
                                    marginTop: '100px'
                                }}>
                                    <Empty description='No Products exists for this Recipe' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            )}

                            {productDetailState.done && postDetailData && Object.keys(postDetailData).length > 0 && (
                                <>
                                    {postDetailData['products'] && postDetailData['products'].length > 0 &&
                                        postDetailData['products'].map(product => {
                                            return (
                                                <CouponProducts
                                                    quantity={product.quantity}
                                                    productId={product['_id']} />
                                            )
                                        })}
                                </>
                            )}
                        </div>

                        {postDetailData['image'] && postDetailData['image'].length > 0 && (
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



                    </>
                )}

            </Skeleton>


        </div>
    )
}

export default NewBrandDetail
