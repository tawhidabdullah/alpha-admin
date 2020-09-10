import React,{useState, useEffect} from 'react'


// import hooks
import { useHandleFetch } from "../../../hooks";

// import components
import { DataTableSkeleton } from "../../../components/Placeholders";

// 


// import lib
import {
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Area,
    Line
} from "recharts";

import { useHistory } from "react-router-dom";
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
    CheckCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';

import { Skeleton, Empty, Popconfirm, Upload, message, Switch, Select, Button, notification, Table, Space, Input as CoolInput, Modal, Spin } from 'antd';


const { Option } = Select;

const { Column, ColumnGroup } = Table;



interface Props {
    
}

const localOptions = [
    {
        value: 'category',
        name: 'Category'
    },
     {
        value: 'product',
        name: 'Product'
    }

]



const WEEEK = [
    "Sat",
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thur",
    "Fri"
];


export const getWeekNameByOrder = (order: number): string | undefined =>
    WEEEK[order - 1];

export const TooltipContainerStyles = {
    border: 0,
    borderRadius: "8px",
    fontSize: 14,
    boxShadow: "2px 2px 5px 3px rgba(0,0,0,0.15)"
};


const DeliveryRegionReport = (props: Props) => {
    const history = useHistory(); 
  
    const [orderAnalyticsVisitsState, handleOrderAnalyticsVisitsStateFetch] = useHandleFetch({}, 'getAnalyticsOrders');
    const [orderData, setorderData] = useState([]);


    useEffect(()=>{
        const getAnalyticsOrders = async () => {

            const ordersDataRes =  await handleOrderAnalyticsVisitsStateFetch({
                urlOptions: {
                    params: {
                        metricType: 'deliveryRegion',
                    }
                }
            }); 

           // @ts-ignore
           if(ordersDataRes && ordersDataRes.length > 0){
               // @ts-ignore
               const orderData = ordersDataRes.map(item => {
                   return {
                       ...item,
                       name: item['deliveryRegion'] && Object.keys(item['deliveryRegion']).length > 0 ? item['deliveryRegion']['name'] : 'Region Name'
                   }
               })
            // @ts-ignore
            setorderData(orderData);
           }
           else {
            setorderData([]);
           }

           };
           getAnalyticsOrders(); 

    },[]); 


    console.log('orderListByDeliveryRegion',orderAnalyticsVisitsState);


    return (

        <div className='overviewContainer__body-apiVisits'>
        <div className='overviewContainer__body-apiVisits-header'>
            <div className='overviewContainer__body-apiVisits-header-info'>
                <h2>
                  BY DELIVERY REGION
                </h2>
                <h3>
                      Order report by delivery region
                </h3>
            </div>
        </div>

        <div className='overviewContainer__body-body'>    
        {orderAnalyticsVisitsState.isLoading && (
            <>
            <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:"center",
                margin:"100px 0"
            }}>
            <Spin
            size='large'
             />
                </div>

            </>
        )}

        
             {orderAnalyticsVisitsState.done && orderData && orderData.length > 0 && (
                 <>
                 
                 <Table
                 pagination={{ defaultPageSize: 5}}
                            style={{
                            }}
                            // expandable={{
                            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                            //     rowExpandable: record => record.name !== 'Not Expandable',
                            //   }}
                            // bordered={true}
                            size='small'
                            // pagination={false}
                            dataSource={orderData}
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
                                       <a href='##'>
                                       <h4
                                            onClick={() => {
                                                // history.push(`/admin/${selectedApiValue && selectedApiValue.toLowerCase()}/${record.itemId}`)
                                            }}  
                                            style={{
                                                fontWeight: 400,
                                                color: '#555',
                                                textTransform:'uppercase',
                                                cursor: 'pointer'
                                            }}>
                                            {text || `Deleted`}
                                        </h4>
                                       </a>
                                    </>
                                )}
                            />

                            <Column
                                title="Count"
                                dataIndex="count"
                                key="id"
                                className='classnameofthecolumn'

                            />


                        </Table>

                 </>
                     )}


                {orderAnalyticsVisitsState.done && !(orderAnalyticsVisitsState.data.length > 0) && (
                    <div style={{
                        marginTop: '00px'
                    }}>
                        <Empty description={`No Visits for date`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

            

        </div>
        <div className="overviewContainer__body-footer">
            <h3>
                <span>
                    <CalendarOutlined />
                </span>

                            In the last month
                     </h3>
        </div>

    </div>

    )
}

export default DeliveryRegionReport
