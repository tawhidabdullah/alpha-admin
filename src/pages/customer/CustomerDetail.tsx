import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router";


// import hooks
import { useHandleFetch } from "../../hooks";

// import 
import Moment from "react-moment";

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
import CustomerEdit from "./CustomerEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [customerDetailState, handleCustomerDetailFetch] = useHandleFetch({}, 'customerDetail');
    const [orderListState, handleOrderListFetch] = useHandleFetch({}, 'orderListForCustomer');
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [customerDetailData,setCustomerDetailData] = useState({}); 


    const params = useParams();
    const history = useHistory();
    const customerId = params['id'];

    useEffect(() => {

        const getCustomerDetail = async () => {
            const customerDetailDataRes = await handleCustomerDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: customerId
                    }
                }
            });

            // @ts-ignore
            if(customerDetailDataRes){
                // @ts-ignore
                setCustomerDetailData(customerDetailDataRes); 
            }

            console.log('customerDetailDataRes',customerDetailDataRes)
        };

        getCustomerDetail();

    }, [customerId]);



    useEffect(() => {
        const getOrderList = async () => {
            await handleOrderListFetch({
                urlOptions: {
                    params: {
                        customerId: customerId
                    }
                }
            })
        };

        getOrderList();

    }, [customerId]);




    console.log('customerDetailData', customerDetailData);



    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                    Customer Detail
                </h3>

                {customerDetailState.done && customerDetailData && (Object.keys(customerDetailData).length > 0) && (
                    <>
                        <CustomerEdit
                            visible={tagEditVisible}
                            setvisible={setTagEditVisible}
                            customer={customerDetailData}
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
                loading={customerDetailState.isLoading}>
                {customerDetailState.done && customerDetailData && !(Object.keys(customerDetailData).length > 0) && (
                    <Empty description='No Customer found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {customerDetailState.done && customerDetailData && (Object.keys(customerDetailData).length > 0) && (
                    <div className='brandDetailContainer__header'>

                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {customerDetailData['name']}
                            </h2>
                            <h3>
                                {customerDetailData['description']}
                            </h3>

                            {customerDetailData['country'] && (
                                <h3>
                                    COUNTRY:
                                    <span>
                                        {customerDetailData['country']}
                                    </span>
                                </h3>
                            )}


                            {customerDetailData['city'] && (
                                <h3>
                                    CITY:
                                    <span>
                                        {customerDetailData['city']}
                                    </span>
                                </h3>
                            )}
                        


                            {customerDetailData['address1'] && (
                                <h3>
                                    ADDRESS:
                                    <span>
                                        {customerDetailData['address1']}
                                    </span>
                                </h3>
                            )}
                         

                            {customerDetailData['phone'] && (
                                <h3>
                                    PHONE:
                                    <span>
                                        {customerDetailData['phone']}
                                    </span>
                                </h3>
                            )}

                             {customerDetailData['email'] && (
                                <h3>
                                    EMAIL:
                                    <span>
                                        {customerDetailData['email']}
                                    </span>
                                </h3>
                            )}

                        </div>
                    </div>
                )}

            </Skeleton>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Orders 
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {orderListState.isLoading && <DataTableSkeleton />}
                {orderListState.done && !(orderListState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Orders exists for this Customer ' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {orderListState.done && orderListState.data && orderListState.data.length > 0 && (
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
                            dataSource={orderListState.data}
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
          title="Name"
          dataIndex="name"
          key="id"
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>

              <h4
                onClick={() => {
                  // setvisible(true)
                  history.push(`/admin/order/${record.id}`)
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
                title="Country" 
                dataIndex="country" 
                key="id" 
                className='classnameofthecolumn'
                
                    />


                <Column
                title="City" 
                dataIndex="city" 
                key="id" 
                className='classnameofthecolumn'
                />

                <Column
                title="Created" 
                dataIndex="date_created" 
                key="id" 
                className='classnameofthecolumn'
                render={(text, record: any) => (
            <>

              <h4
                style={{
                  fontWeight: 400,
                  color: '#555',

                }}>
                  <Moment  withTitle>
                    {text}
                  </Moment>
              </h4>
            </>
          )}
            />


          <Column
            width={150}
           title="Status" 
           dataIndex="status" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record: any) => (
            <>

             <a href='##'>
              <span
              style={{
                fontSize:'12px'
              }}
                >
                {text}
             </span> 
            </a>
            </>
          )}
            />


                        </Table>
                    </>
                )}

            </div>
        </div>
    )
}

export default NewBrandDetail
