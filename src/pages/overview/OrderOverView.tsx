import React, { useState, useEffect } from 'react'



// import libraries 
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

import {
    DeleteOutlined,
    FileAddOutlined,
    CheckCircleOutlined,
    FileImageFilled,
    FileImageOutlined,
    FileImageTwoTone,
    PlusOutlined,
    PlusCircleOutlined,
    CloseOutlined,
    CheckOutlined,
    InfoCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    GoldOutlined,
    ShoppingCartOutlined,
    TagOutlined
} from '@ant-design/icons';


import { useHandleFetch } from "../../hooks";



import { Select, Button, Spin, Empty } from 'antd';
import Moment from "react-moment";

const { Option } = Select;




export const RAINFALL = {
    "2018": [
        {
            month: 1,
            rainfall: 65.4
        },
        {
            month: 2,
            rainfall: 1.6
        },
        {
            month: 3,
            rainfall: 23
        },
        {
            month: 4,
            rainfall: 16.4
        },
        {
            month: 5,
            rainfall: 65.6
        },
        {
            month: 6,
            rainfall: 43.2
        },
        {
            month: 7,
            rainfall: 19.4
        },
        {
            month: 8,
            rainfall: 42.8
        },
        {
            month: 9,
            rainfall: 16.4
        },
        {
            month: 11,
            rainfall: 97.8
        },
        {
            month: 12,
            rainfall: 104.8
        }
    ],
    "2019": [
        {
            month: 1,
            rainfall: 11.2
        },
        {
            month: 2,
            rainfall: 18.6
        },
        {
            month: 3,
            rainfall: 12
        },
        {
            month: 4,
            rainfall: 7.2
        },
        {
            month: 5,
            rainfall: 53.4
        },
        {
            month: 6,
            rainfall: 49.8
        },
        {
            month: 7,
            rainfall: 45.2
        },
        {
            month: 8,
            rainfall: 51.4
        },
        {
            month: 9,
            rainfall: 41
        },
        {
            month: 10,
            rainfall: 24
        },
        {
            month: 11,
            rainfall: 54.4
        },
        {
            month: 12,
            rainfall: 6.2
        }
    ]
};




const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];


export const getMonthNameByOrder = (order: number): string | undefined =>
    MONTHS[order - 1];





export const TooltipContainerStyles = {
    border: 0,
    borderRadius: "8px",
    fontSize: 14,
    boxShadow: "2px 2px 5px 3px rgba(0,0,0,0.15)"
};




interface Props {

}

const localOptions = [
    {
        value: 'category',
        name: 'Category'
    }, {
        value: 'product',
        name: 'Product'
    }
]

const ApiVisits = (props: Props) => {
    const [selectedApiValue, setSelectedApiValue] = useState('date');
    const [orderAnalyticsVisitsState, handleOrderAnalyticsVisitsStateFetch] = useHandleFetch({}, 'getAnalyticsOrders');
    const [orderData, setorderData] = useState([]);


    useEffect(()=>{
        const getAnalyticsOrders = async () => {

            const ordersDataRes =  await handleOrderAnalyticsVisitsStateFetch({
                urlOptions: {
                    params: {
                        metricType: selectedApiValue,
                    }
                }
            }); 

           console.log('ordersDataRes',ordersDataRes); 

           // @ts-ignore
           if(ordersDataRes){
            // @ts-ignore
            setorderData(ordersDataRes);
           }

           };
           getAnalyticsOrders(); 

    },[selectedApiValue]); 


    console.log('orderAnalyticsVisitsState',orderAnalyticsVisitsState);


    const onChange = (value) => {
        setSelectedApiValue(value);
    }


    const options = [
        {
            value: 'date',
            name: 'Date'
        },
        {
            value: 'hour',
            name: 'Hour'
        },
        {
            value: 'dayOfWeek',
            name: 'Day of week'
        },
        {
            value: 'dayOfMonth',
            name: 'Day of month'
        },
         {
            value: 'month',
            name: 'Month'
        },
        {
            value: 'year',
            name: 'Year'
        }
    ]



    const date = new Date();
    const thisMonth = MONTHS[date.getMonth()]
    

    return (
        <div className='overviewContainer__userVisits'>
            <div className='overviewContainer__body-apiVisits-header'>
                <div className='overviewContainer__body-apiVisits-header-info'>
                    <h2>
                        Orders 
                    </h2>

                        <h3>
                          All orders that visited
                        </h3>
                </div>

                <div className='overviewContainer__body-apiVisits-header-controller'>
                <Select
                    bordered={false}
                    showSearch
                    style={{ width: '130px', borderRadius: '6px', color: '#1890ff' }}
                    placeholder='Select an api'
                    optionFilterProp='children'
                    onChange={onChange}
                    defaultValue={selectedApiValue}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        options.map((option) => {
                            return <Option value={option.value}>{option.name}</Option>;
                        })}
                </Select>
            </div>
            </div>

            <div className='overviewContainer__body-body'>
            {orderAnalyticsVisitsState.isLoading && (
            <>

            <div style={{
                margin:'100px 0',
                display:'flex',
                justifyContent:'center',
                alignItems:"center"
            }}>
                <Spin size='large' />
             </div>
            </>
          )}
                {orderAnalyticsVisitsState.done && !(orderAnalyticsVisitsState.data.length > 0) && (
                    <div style={{
                        marginTop: '00px'
                    }}>
                        <Empty description={`No Orders Created`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}


               {orderAnalyticsVisitsState.done && orderData && orderData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={orderData} fontSize={12}>
                        <defs>
                            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1890ff" />
                                <stop offset="100%" stopColor="#3066BE22" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#d6d9da"
                        />
                        <XAxis 
                        dataKey={selectedApiValue} 
                        tickFormatter={selectedApiValue === 'month' && getMonthNameByOrder}
                         />
                        <YAxis
                            // unit="ml"
                            orientation="left"
                            width={20}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={false}
                            contentStyle={TooltipContainerStyles}
                            formatter={(value, name) => [`${value}`, `${name}`]}
                        />
                        <Area
                            dataKey="count"
                            name="Count"
                            unit={selectedApiValue === 'month' ? thisMonth : ''}
                            type="basis"
                            fill="url(#rainGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
               )}


            </div>
            {/* <div className="overviewContainer__body-footer">
                <h3>
                    <span>
                        <CalendarOutlined />
                    </span>

					In the last month
				</h3>
            </div> */}

        </div>
    )
}

export default ApiVisits
