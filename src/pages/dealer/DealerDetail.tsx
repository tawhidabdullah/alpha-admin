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

import { Spin, Skeleton, Empty, Popconfirm, Upload, message, Switch, Select, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal } from 'antd';


// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import CustomerEdit from "./DealerEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [customerDetailState, handleCustomerDetailFetch] = useHandleFetch({}, 'dealerDetail');
    const [orderListState, handleOrderListFetch] = useHandleFetch({}, 'dealerOrderList');
    const [registeredCustomerListState, handleRegisteredCustomerListFetch] = useHandleFetch({}, 'dealerRegisteredCustomerList');
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [customerDetailData,setCustomerDetailData] = useState({}); 



    console.log('customerDetailData',customerDetailData); 
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
                    placeHolders: {
                        id: customerId
                    }
                }
            })
        };

        getOrderList();

        const getRegisteredOrderList = async () => {
            await handleRegisteredCustomerListFetch({
                urlOptions: {
                    placeHolders: {
                        id: customerId
                    }
                }
            })
        };

        getRegisteredOrderList();




    }, [customerId]);


    console.log('dealerDetailData', customerDetailData);

    
    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                 Dealer Detail
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
                    <Empty description='No Dealer found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {customerDetailState.done && customerDetailData && (Object.keys(customerDetailData).length > 0) && (
                    <div className='brandDetailContainer__header'>

                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {customerDetailData['name']}
                            </h2>
                           

                           
                            {customerDetailData['code'] && (
                                <h3>
                                    CODE:
                                    <span>
                                        {customerDetailData['code']}
                                    </span>
                                </h3>
                            )}




                            {customerDetailData['commision'] && (
                                <h3>
                                    COMMISSION:
                                    <span>
                                        {customerDetailData['commision']}
                                    </span>
                                </h3>
                            )}

                            {customerDetailData['depositMoney'] && (
                                <h3>
                                    DEPOSIT MONEY:
                                    <span>
                                        {customerDetailData['depositMoney']}
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


                              {customerDetailData['area'] && customerDetailData['area'].length > 0 &&
                                    (<>
                                        <h3>
                                        AREAS:
                                        {customerDetailData['area'].map(cat => {
                                            return (
                                                <span
                                                    // onClick={() => history.push(`/admin/dealer/area/${cat._id}`)}

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
                )}

            </Skeleton>

        <div className='dealerDetailBodyContainer'>
            <div className='dealerDetailBodyContainer__item'>
            <div className='brandDetailContainer__heading'>
                <h3>
                     Orders 
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {orderListState.isLoading && (
                  <>
                  <div style={{
                    margin: '100px'
                  }}>
                  <Spin size='large' />
                  </div>
                  </>
                )}

                                {orderListState.done && !(orderListState.data.length > 0) && (

                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Orders found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
          title="Code"
          dataIndex="shortCode"
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
                #{text}
              </h4>


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
                title="Total Price" 
                dataIndex="total" 
                key="id" 
                className='classnameofthecolumn'
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
            <div className='dealerDetailBodyContainer__item'>
            <div className='brandDetailContainer__heading'>
                <h3>
                     Customers 
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {registeredCustomerListState.isLoading && (
                  <>
                  <div style={{
                    margin: '100px'
                  }}>
                  <Spin size='large' />
                  </div>
                  </>
                )}
                {registeredCustomerListState.done && !(registeredCustomerListState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Customer found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {registeredCustomerListState.done && registeredCustomerListState.data && registeredCustomerListState.data.length > 0 && (
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
                              history.push(`/admin/customer/${record.id}`)
                              // setcategoryDetailVisible(true);
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
           title="Order" 
           dataIndex="orderCount" 
           key="id" 
           className='classnameofthecolumn'
         
            />

        <Column
           title="Total Price" 
           dataIndex="totalOrderPrice" 
           key="id" 
           className='classnameofthecolumn'
         
            />

                        </Table>
                    </>
                )}

            </div>
            </div>
        </div>
        </div>
    )
}

export default NewBrandDetail
