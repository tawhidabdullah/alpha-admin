import React,{useState, useEffect} from 'react'


// import hooks
import { useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";

// 


// import lib
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

import { Skeleton, Empty, Popconfirm, Upload, message, Switch, Select, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal, Spin } from 'antd';


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


const PageVisits = (props: Props) => {

    const history = useHistory(); 


    const [options, setoptions] = useState(localOptions);
    const [selectedApiValue, setSelectedApiValue] = useState('product');
    const [pageVisitsState, handlePageVisitsStateFetch] = useHandleFetch({}, 'getAnalyticsPageVisits');


    useEffect(()=>{
        const getPageVisitsValue = async () => {
            const pageVisitsDataRes =  await handlePageVisitsStateFetch({
                urlOptions: {
                    params: {
                        visitType: selectedApiValue,
                        item: 'item',
                    }
                }
            }); 
           };

           getPageVisitsValue(); 

    },[selectedApiValue])

    const onChange = (value) => {
        setSelectedApiValue(value);
    }


    console.log('pageVisitsState',pageVisitsState)


    return (

        <div className='overviewContainer__body-apiVisits'>
        <div className='overviewContainer__body-apiVisits-header'>
            <div className='overviewContainer__body-apiVisits-header-info'>
                <h2>
                    Popularity
                    </h2>
                <h3>
                      All {selectedApiValue} that were visited
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
        {pageVisitsState.isLoading && (
            <>
            <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:"center"
            }}>
            <Spin
            size='large'
             />
                </div>

            </>
        )}
                {pageVisitsState.done && !(pageVisitsState.data.length > 0) && (
                    <div style={{
                        marginTop: '00px'
                    }}>
                        <Empty description={`No Visits for ${selectedApiValue}`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {pageVisitsState.done && pageVisitsState.data && pageVisitsState.data.length > 0 && (
                    <>
                        <Table
                            style={{
                            }}
                            // expandable={{
                            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                            //     rowExpandable: record => record.name !== 'Not Expandable',
                            //   }}
                            // bordered={true}
                            size='small'
                            // pagination={false}
                            dataSource={pageVisitsState.data}
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
                                                console.log('myRecord',record);
                                                history.push(`/admin/${selectedApiValue && selectedApiValue.toLowerCase()}/${record.itemId}`)
                                            }}  
                                            style={{
                                                fontWeight: 400,
                                                color: '#555',
                                                textTransform:'uppercase',
                                                cursor: 'pointer'
                                            }}>
                                            {text}
                                        </h4>
                                       </a>
                                    </>
                                )}
                            />

                            <Column
                                title="Count"
                                dataIndex="visit"
                                key="id"
                                className='classnameofthecolumn'

                            />


                        </Table>
                    </>
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

export default PageVisits
