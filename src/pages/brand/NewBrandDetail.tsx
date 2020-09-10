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
import BrandEdit from "./BrandEdit";



// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";





const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    roles?: any;
}

const NewBrandDetail = ({roles}: Props) => {
    const [brandDetailState, handleBrandDetailFetch] = useHandleFetch({}, 'brandDetail');
    const [brandProductsState, handleBrandProductsFetch] = useHandleFetch({}, 'brandProducts');

    const params = useParams();
    const history = useHistory();
    const brandId = params['id'];
    const [brandEditVisible, setBrandEditVisible] = useState(false);
    const [brandDetailData, setBrandDetailData] = useState(false);


    useEffect(() => {
        const getBrandDetail = async () => {
            const brandDetailRes = await handleBrandDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: brandId
                    }
                }
            }); 

            // @ts-ignore
            if(brandDetailRes){
                // @ts-ignore
                setBrandDetailData(brandDetailRes)
            }; 


            console.log('brandDetailRes',brandDetailRes);


        };

        getBrandDetail();

    }, [brandId]);

    useEffect(() => {

        const getBrandProducts = async () => {
            await handleBrandProductsFetch({
                urlOptions: {
                    placeHolders: {
                        id: brandId
                    }
                }
            })
        };

        getBrandProducts();

    }, [brandId]);




    console.log('brandProductsState', brandProductsState);

    console.log('brandParams', params);


    return (
        <div className='brandDetailContainer'>




            <div className='brandDetailContainer__heading'>
                <h3>
                    Brand Detail
                </h3>


                {brandDetailState.done && brandDetailData && (Object.keys(brandDetailData).length > 0) && (
                    <>
                        <BrandEdit
                            brandEditVisible={brandEditVisible}
                            setBrandEditVisible={setBrandEditVisible}
                            brandDetailData={brandDetailData}
                            setBrandDetailData={setBrandDetailData}
                        />

                {isAccess('postCatalogue',roles) && (
                    <Button
                    onClick={() => setBrandEditVisible(true)}
                    type='link'
                    icon={<EditOutlined />}
                    >
                        Edit
                </Button>
                    )}

                 
                    </>
                )}

            </div>
            <Skeleton
                avatar paragraph={{ rows: 3 }}
                loading={brandDetailState.isLoading}>
                {brandDetailState.done && brandDetailData && !(Object.keys(brandDetailData).length > 0) && (
                    <Empty description='No Brand found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {brandDetailState.done && brandDetailData && (Object.keys(brandDetailData).length > 0) && (
                    <div className='brandDetailContainer__header'>
                        <div className='brandDetailContainer__header-coverContainer'>
                            <img src={brandDetailData['cover'] && brandDetailData['cover']['cover']} alt="" />
                        </div>
                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {brandDetailData['name']}
                            </h2>
                            <h3>
                                {brandDetailData['description']}
                            </h3>

                            {brandDetailData['url'] && (
                                <h3>
                                    URL:
                                    <span>
                                        {brandDetailData['url']}
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
                {brandProductsState.isLoading && <DataTableSkeleton />}
                {brandProductsState.done && !(brandProductsState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists for this brand' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {brandProductsState.done && brandProductsState.data && brandProductsState.data.length > 0 && (
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
                            dataSource={brandProductsState.data}
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
                                title="Offer Price"
                                dataIndex="offerPrice"
                                key="id"
                                className='classnameofthecolumn'

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



const mapStateToProps = state => ({
    roles: state.globalState,
  })
  
  // @ts-ignore
  export default connect(mapStateToProps, null)(NewBrandDetail);
  
  

