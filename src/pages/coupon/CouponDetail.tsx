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


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [tagDetailState, handleTagDetailFetch] = useHandleFetch({}, 'couponDetail');
    const [tagProductsState, handleTagProductsFetch] = useHandleFetch({}, 'tagProducts');
    const [tagEditVisible, setTagEditVisible] = useState(false);


    const params = useParams();
    const history = useHistory();
    const tagId = params['id'];

    useEffect(() => {

        const getBrandDetail = async () => {
            await handleTagDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: tagId
                    }
                }
            })
        };

        getBrandDetail();

    }, [tagId]);






    console.log('tagDetailState', tagDetailState);

    console.log('brandParams', params);


    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                    Coupon Detail
                </h3>

                {tagDetailState.done && tagDetailState.data && (Object.keys(tagDetailState.data).length > 0) && (
                    <>
                        <CouponEdit
                            tagEditVisible={tagEditVisible}
                            setTagEditVisible={setTagEditVisible}
                            tagDetailData={tagDetailState.data}
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
                {tagDetailState.done && tagDetailState.data && !(Object.keys(tagDetailState.data).length > 0) && (
                    <Empty description='No Coupon found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {tagDetailState.done && tagDetailState.data && (Object.keys(tagDetailState.data).length > 0) && (
                    <div className='brandDetailContainer__header'>

                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {tagDetailState.data['name']}
                            </h2>
                            <h3>
                                {tagDetailState.data['description']}
                            </h3>
                            {tagDetailState.data['code'] && (
                                <h3>
                                    CODE:
                                    <span>
                                        {tagDetailState.data['code']}
                                    </span>

                                </h3>
                            )}
                            {tagDetailState.data['code'] && (
                                <h3>
                                    CODE:
                                    <span>
                                        {tagDetailState.data['code']}
                                    </span>

                                </h3>
                            )}

                            {tagDetailState.data['amount'] && (
                                <h3>
                                    AMOUT:
                                    <span>
                                        {tagDetailState.data['amount']}
                                    </span>

                                </h3>
                            )}

                            {tagDetailState.data['freeDelivery'] && (
                                <h3>
                                    FREE DELIVERY:
                                    <span>
                                        {tagDetailState.data['freeDelivery']}
                                    </span>

                                </h3>
                            )}


                        </div>
                    </div>
                )}

            </Skeleton>

            {/* <div className='brandDetailContainer__heading'>
                <h3>
                    Ordered Products
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                {tagDetailState.done && tagDetailState.data && tagDetailState.data['orderedProducts'] && !(tagDetailState.data['orderedProducts'].length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this coupon' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>

                )}

                {tagDetailState.done && tagDetailState.data && Object.keys(tagDetailState.data).length > 0 && (
                    <>
                        {tagDetailState.data['orderedProducts'] && tagDetailState.data['orderedProducts'].length > 0 &&
                            tagDetailState.data['orderedProducts'].map(product => {
                                return (
                                    <CouponProducts productId={product['_id']} />
                                )
                            })}
                    </>
                )}


            </div> */}
            {tagDetailState.done && tagDetailState.data && Object.keys(tagDetailState.data).length > 0 && tagDetailState.data['freeProducts'] && (
                <div className='brandDetailContainer__heading'>
                    <h3>
                        Free Products
                       </h3>
                </div>
            )
            }

            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                {tagDetailState.done && tagDetailState.data && tagDetailState.data['freeProducts'] && !(tagDetailState.data['freeProducts'].length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this coupon' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {tagDetailState.done && tagDetailState.data && Object.keys(tagDetailState.data).length > 0 && (
                    <>
                        {tagDetailState.data['freeProducts'] && tagDetailState.data['freeProducts'].length > 0 &&
                            tagDetailState.data['freeProducts'].map(product => {
                                return (
                                    <CouponProducts
                                        quantity={product.quantity}
                                        productId={product['_id']} />
                                )
                            })}
                    </>
                )}

            </div>
        </div>
    )
}

export default NewBrandDetail
