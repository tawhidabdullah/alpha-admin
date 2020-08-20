import React, { useState, useEffect } from 'react'




// import lib 

import { ResponsiveContainer, PieChart, Tooltip, Pie, Cell } from "recharts";


// import hooks
import { useHandleFetch } from "../../hooks";

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

import { Select, Button, Spin, Empty } from 'antd';

const { Option } = Select;




interface Props {

}

const localOptions = [
    {
        value: 'browser',
        name: 'Browser'
    },
    {
        value: 'device',
        name: 'Device'
    },
    {
        value: 'os',
        name: 'OS'
    }, {
        value: 'platform',
        name: 'Platform'
    },
  

];


export const AGE_GROUP = [
    {
        device: "18-24",
        percentage: 14
    },
    {
        device: "25-34",
        percentage: 24
    },
    {
        device: "35-44",
        percentage: 22
    },
    {
        device: "45-54",
        percentage: 18
    },
    {
        device: "55-64",
        percentage: 16
    },
    {
        device: "65+",
        percentage: 6
    }
];

export const COLORS = [
    '#1890ff',
    '#20A39E',
    '#61D095',
    '#FFBA49',
    '#EF5B5B',
    '#A4036F',
];




export const TooltipContainerStyles = {
    border: 0,
    borderRadius: "8px",
    fontSize: 14,
    boxShadow: "2px 2px 5px 3px rgba(0,0,0,0.15)"
};




const PlatformVisits = (props: Props) => {
    const [options, setoptions] = useState(localOptions);
    const [selectedApiValue, setSelectedApiValue] = useState('browser');


    const [demoGraphicVisitsState, handleDemoGraphicVisitsStateFetch] = useHandleFetch({}, 'getAnalyticsDemographicVisits');


    const [demographicData, setdemographicData] = useState([]);

    useEffect(()=>{
        const getDemoGraphicVisitsValue = async () => {
            const demograpicVisitsDataRes =  await handleDemoGraphicVisitsStateFetch({
                urlOptions: {
                    params: {
                        metricType: selectedApiValue,
                    }
                }
            }); 
           };

           getDemoGraphicVisitsValue(); 

    },[selectedApiValue])



    useEffect(()=>{
        if(demoGraphicVisitsState.done && demoGraphicVisitsState.data){
            setdemographicData(demoGraphicVisitsState.data); 
        }; 
    },[demoGraphicVisitsState])



    console.log('demoGraphicVisitsState',demoGraphicVisitsState)
    console.log('demographicData',demographicData)


    const onChange = (value) => {
        setSelectedApiValue(value);
    }

    const RADIAN = Math.PI / 180;


    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        value,
        name,
        index,
        percent,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN) - 10;
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        console.log('percent..',percent);
        return (
            <text x={x} y={y} fill="white" fontSize={12} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };



    return (
        <div className='overviewContainer__body-platformVisits'>
            <div className='overviewContainer__body-platformVisits-header'>
                <div className='overviewContainer__body-platformVisits-header-info'>
                    <h2>
                        Demographic
                        </h2>
                    <h3>
                       {selectedApiValue} demography
                        </h3>
                </div>
                <div className='overviewContainer__body-platformVisits-header-controller'>
                    <Select
                        bordered={false}
                        showSearch
                        style={{ width: '130px', borderRadius: '6px', color: '#1890ff' }}
                        placeholder='Select Type'
                        optionFilterProp='children'
                        onChange={onChange}
                        defaultValue={'browser'}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {
                            options.map((option) => {
                                return <Option value={option.value}>{option.name}</Option>;
                            })}
                    </Select>
                </div>
            </div>

            <div className="overviewContainer__body-body">

            {demoGraphicVisitsState.isLoading && (
            <>
                <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:"center",
                    marginTop:'100px',
                    marginBottom:'100px',
                }}>
                <Spin
                size='large'
                />
                </div>

            </>
        )}
                {demoGraphicVisitsState.done && !(demoGraphicVisitsState.data.length > 0) && (
                    <div style={{
                        marginTop: '00px'
                    }}>
                        <Empty description={`No Visits for ${selectedApiValue}`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}


                    {demoGraphicVisitsState.done && demographicData && demographicData.length > 0 && (
                        <ResponsiveContainer width="100%" height={300}>
                        <PieChart fontSize={14}>
                            <Tooltip
                                cursor={false}
                                contentStyle={TooltipContainerStyles}
                                formatter={(value, name) => [`${value}`, `${name}`]}
                            />

                            <Pie
                                dataKey="count"
                                data={demographicData}
                                outerRadius={100}
                                innerRadius={40}
                                name={selectedApiValue}
                                nameKey={selectedApiValue}
                                unit="%"
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {demographicData && demographicData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
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

export default PlatformVisits


// http://localhost:5000/admin/analytics/user?metric=day?start=date&end=datae
// /http://localhost:5000/admin/analytics/item?type=product&item=534534534534&metric=day