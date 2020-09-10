import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router";


// import hooks
import { useHandleFetch } from "../../hooks";

// import lib
import {
    FileOutlined,
    InboxOutlined,
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

import { Skeleton, Empty, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal } from 'antd';


// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import CouponEdit from "./CouponEdit";
import CouponProducts from "./CouponProducts";
import  moment from 'moment'


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [tagDetailState, handleTagDetailFetch] = useHandleFetch({}, 'couponDetail');
    const [tagProductsState, handleTagProductsFetch] = useHandleFetch({}, 'tagProducts');
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [tagDetailData,setTagDetailData] = useState({}); 

    const params = useParams();
    const history = useHistory();
    const tagId = params['id'];

    useEffect(() => {

        const getBrandDetail = async () => {
            const res = await handleTagDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: tagId
                    }
                }
            });

            // @ts-ignore
            if(res){
                // @ts-ignore
                setTagDetailData(res)
            }
        };

        getBrandDetail();

    }, [tagId]);






    console.log('coupondetail', tagDetailState);

    console.log('brandParams', params);


    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                    Coupon Detail
                </h3>

                {tagDetailState.done && tagDetailData && (Object.keys(tagDetailData).length > 0) && (
                    <>
                        <CouponEdit
                            addNewCategoryVisible={tagEditVisible}
                            setAddNewCategoryVisible={setTagEditVisible}
                            category={tagDetailData}
                            setTagDetailData={setTagDetailData}
                        />
                        <Button
                            onClick={() => setTagEditVisible(true)}
                            type='link'
                            icon={<EditOutlined />}
                        >
                            Edit
                      </Button>
                    </>
                )}
            </div>
            <Skeleton
                paragraph={{ rows: 2 }}
                loading={tagDetailState.isLoading}>
                {tagDetailState.done && tagDetailData && !(Object.keys(tagDetailData).length > 0) && (
                    <Empty description='No Coupon found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {tagDetailState.done && tagDetailData && (Object.keys(tagDetailData).length > 0) && (
                    <div className='brandDetailContainer__header'>
                        <div className='brandDetailContainer__header-coverContainer'>
                            <img src={tagDetailData['cover'] && tagDetailData['cover']['cover']} alt="" />
                        </div>
                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {tagDetailData['name']}
                            </h2>
                            <h3>
                                {tagDetailData['description']}
                            </h3>
                            {tagDetailData['code'] && (
                                <h3>
                                    CODE:
                                    <span>
                                        {tagDetailData['code']}
                                    </span>

                                </h3>
                            )}
                          

                            {tagDetailData['amount'] && (
                                <h3>
                                    AMOUT:
                                    <span>
                                        {tagDetailData['amount']}
                                    </span>

                                </h3>
                            )}


                            {tagDetailData['startDate'] && (
                                <h3>
                                    START DATE:
                                    <span>
                                    {moment(tagDetailData['startDate']).format('MMMM Do YYYY, h:mm:ss a')}
                                    </span>

                                </h3>
                            )}



                            {tagDetailData['endDate'] && (
                                <h3>
                                    END DATE:
                                    <span>
                                    {moment(tagDetailData['endDate']).format('MMMM Do YYYY, h:mm:ss a')}
                                    </span>

                                </h3>
                            )}
                        </div>
                    </div>
                )}

            </Skeleton>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Ordered Products
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                {tagDetailState.done && tagDetailData && tagDetailData['orderedProducts'] && !(tagDetailData['orderedProducts'].length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this coupon' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>

                )}

                {tagDetailState.done && tagDetailData && Object.keys(tagDetailData).length > 0 && (
                    <>
                        {tagDetailData['orderedProducts'] && tagDetailData['orderedProducts'].length > 0 &&
                            tagDetailData['orderedProducts'].map(product => {
                                return (
                                    <CouponProducts productId={product['_id']} />
                                )
                            })}
                    </>
                )}
            </div>

            {/* {tagDetailState.done && tagDetailData && Object.keys(tagDetailData).length > 0 && tagDetailData['freeProducts'] && (
                <div className='brandDetailContainer__heading'>
                    <h3>
                        Free Products
                       </h3>
                </div>
            )
            }

            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                {tagDetailState.done && tagDetailData && tagDetailData['freeProducts'] && !(tagDetailData['freeProducts'].length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this coupon' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {tagDetailState.done && tagDetailData && Object.keys(tagDetailData).length > 0 && (
                    <>
                        {tagDetailData['freeProducts'] && tagDetailData['freeProducts'].length > 0 &&
                            tagDetailData['freeProducts'].map(product => {
                                return (
                                    <CouponProducts
                                        quantity={product.quantity}
                                        productId={product['_id']} />
                                )
                            })}
                    </>
                )}

            </div> */}
        </div>
    )
}

export default NewBrandDetail
