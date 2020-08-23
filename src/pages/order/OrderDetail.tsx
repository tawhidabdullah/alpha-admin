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

import { Skeleton, Empty, Popconfirm, Upload, message, Switch, Select, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal } from 'antd';


// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import OrderEdit from "./OrderEdit";
import { OrderDetail } from '.';


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [tagDetailState, handleTagDetailFetch] = useHandleFetch({}, 'orderDetail');
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
        getBrandDetail()  ;
    }, [tagId]);


    console.log('orderDetailState', tagDetailState)

    useEffect(() => {
        const getTagProducts = async () => {
            await handleTagProductsFetch({
                urlOptions: {
                    placeHolders: {
                        id: tagId
                    }
                }
            })
        };

        getTagProducts();

    }, [tagId]);




    console.log('orderDetailState', tagDetailState);

    console.log('brandParams', params);


    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                    Order Detail
                </h3>

                {tagDetailState.done && tagDetailState.data && (Object.keys(tagDetailState.data).length > 0) && (
                    <>
                        <OrderEdit
                            tagEditVisible={tagEditVisible}
                            setTagEditVisible={setTagEditVisible}
                            customer={tagDetailState.data}
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
                    <Empty description='No Order found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
                            {tagDetailState.data['url'] && (
                                <h3>
                                    URL:
                                    <span>
                                        {tagDetailState.data['url']}
                                    </span>

                                </h3>
                            )}

                            {tagDetailState['data']['country'] && (
                                <h3>
                                    COUNTRY:
                                    <span>
                                        {tagDetailState['data']['country']}
                                    </span>
                                </h3>
                            )}


                            {tagDetailState['data']['city'] && (
                                <h3>
                                    CITY:
                                    <span>
                                        {tagDetailState['data']['city']}
                                    </span>
                                </h3>
                            )}
                        


                            {tagDetailState['data']['address1'] && (
                                <h3>
                                    ADDRESS:
                                    <span>
                                        {tagDetailState['data']['address1']}
                                    </span>
                                </h3>
                            )}
                         

                            {tagDetailState['data']['phone'] && (
                                <h3>
                                    PHONE:
                                    <span>
                                        {tagDetailState['data']['phone']}
                                    </span>
                                </h3>
                            )}

                             {tagDetailState['data']['email'] && (
                                <h3>
                                    EMAIL:
                                    <span>
                                        {tagDetailState['data']['email']}
                                    </span>
                                </h3>
                            )}


                            {tagDetailState['data']['paymentMethod'] && (
                                <h3>
                                    PAYMENT METHOD:
                                    <span>
                                        {tagDetailState['data']['paymentMethod']}
                                    </span>
                                </h3>
                            )}


                            {tagDetailState['data']['paymentStatus'] && (
                                <h3>
                                    PAYMENT STATUS:
                                    <span>
                                        {tagDetailState['data']['paymentStatus']}
                                    </span>
                                </h3>
                            )}

                            
                        {tagDetailState['data']['status'] && (
                                <h3>
                                    ORDER STATUS:
                                    <span>
                                        {tagDetailState['data']['status']}
                                    </span>
                                </h3>
                            )}

                      
                        </div>
                    </div>
                )}

            </Skeleton>


            <div className='brandDetailContainer__heading'>
                    <h3>
                        Products
                    </h3>
                </div>

          
           
            <div className='brandDetailContainer__body'>


                {tagDetailState.done 
                    && tagDetailState.data 
                    && (Object.keys(tagDetailState.data).length > 0) 
                    && tagDetailState.data['products'] && !(tagDetailState.data['products'].length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this order' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}


                {tagDetailState.done 
                    && tagDetailState.data 
                    && (Object.keys(tagDetailState.data).length > 0) 
                    && tagDetailState.data['products'] 
                    && tagDetailState.data['products'].length > 0 && (
                <>
                        <Table
                            style={{
                                paddingTop: '10px',
                                borderRadius: '5px !important',
                                overflow: 'hidden',
                                boxShadow: '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)'
                            }}
                            // expandable={{
                            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                            //     rowExpandable: record => record.name !== 'Not Expandable',
                            //   }}
                            // bordered={true}
                            size='small'
                            // pagination={false}
                            dataSource={tagDetailState.data['products']}
                            tableLayout={'auto'}
                            onHeaderRow={column => {
                                return {
                                    style: {
                                        color: 'red !important'
                                    }

                                };
                            }}
                        >
                            <Column
                                title=""
                                dataIndex="cover"
                                key="id"
                                width={'80px'}

                                className='classnameofthecolumn'

                                render={(cover, record: any) => (
                                    <>
                                        <img
                                            onClick={() => {
                                                history.push(`/admin/product/${record.id}`)
                                            }}
                                            src={cover} alt='cover img' style={{
                                                height: '40px',
                                                width: '40px',
                                                objectFit: "contain",
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }} />
                                    </>
                                )}
                            />

                            <Column
                                title="Name"
                                dataIndex="name"
                                key="id"
                                className='classnameofthecolumn'
                                render={(text, record: any) => (
                                    <>
                                        <h4
                                            onClick={() => {
                                                history.push(`/admin/product/${record.id}`)
                                            }}
                                            style={{
                                                fontWeight: 400,
                                                color: '#555',
                                                cursor: 'pointer'

                                            }}>
                                            {text}
                                        </h4>


                                    </>
                                )}

                            />


                            <Column
                                title="Price"
                                dataIndex="price"
                                key="id"
                                className='classnameofthecolumn'

                            />





                            
                            <Column
                                title="Available"
                                dataIndex="available"
                                key="id"
                                className='classnameofthecolumn'

                            />


                            <Column
                                title="Minimum"
                                dataIndex="minimum"
                                key="id"
                                className='classnameofthecolumn'

                            />


                        </Table>

                </>
            )}


            </div>
        </div>
    )
}

export default NewBrandDetail
