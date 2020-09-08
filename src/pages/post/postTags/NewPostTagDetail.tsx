import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router";


// import hooks
import { useHandleFetch } from "../../../hooks";

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
import { DataTableSkeleton } from "../../../components/Placeholders";
import TagEdit from "./TagEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [tagDetailState, handleTagDetailFetch] = useHandleFetch({}, 'postTagDetail');
    const [tagProductsState, handleTagProductsFetch] = useHandleFetch({}, 'tagPostList');
    const [tagEditVisible, setTagEditVisible] = useState(false);
    const [tagDetailData,setTagDetailData] = useState({}); 

    

    const params = useParams();
    const history = useHistory();
    const tagId = params['id'];

    useEffect(() => {

        const getBrandDetail = async () => {
            const tagDetailRes =  await handleTagDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: tagId
                    }
                }
            }); 

            // @ts-ignore
            if(tagDetailRes){
                console.log('tagDetailRes',tagDetailRes);
                // @ts-ignore
                setTagDetailData(tagDetailRes);
            }
        };

        getBrandDetail();

    }, [tagId]);

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




    console.log('tagProductsState', tagProductsState);

    console.log('brandParams', params);


    return (
        <div className='brandDetailContainer'>
            <div className='brandDetailContainer__heading'>
                <h3>
                    Recipe Tag Detail
                </h3>

                {tagDetailState.done && tagDetailData && (Object.keys(tagDetailData).length > 0) && (
                    <>
                        <TagEdit
                            addNewCategoryVisible={tagEditVisible}
                            setAddNewCategoryVisible={setTagEditVisible}
                            tagDetailData={tagDetailData}
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
                    <Empty description='No Recipe Tag found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}

                {tagDetailState.done && tagDetailData && (Object.keys(tagDetailData).length > 0) && (
                    <div className='brandDetailContainer__header'>

                        <div className='brandDetailContainer__header-info'>
                            <h2>
                                {tagDetailData['name']}
                            </h2>
                            <h3>
                                {tagDetailData['description']}
                            </h3>
                            {tagDetailData['url'] && (
                                <h3>
                                    URL:
                                    <span>
                                        {tagDetailData['url']}
                                    </span>

                                </h3>
                            )}
                        </div>
                    </div>
                )}

            </Skeleton>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Recipes 
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                
                {tagProductsState.done && !(tagProductsState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Recipes found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {tagProductsState.done && tagProductsState.data && tagProductsState.data.length > 0 && (
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
                            dataSource={tagProductsState.data}
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
                                                history.push(`/admin/posts/${record.id}`)
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
                                                history.push(`/admin/posts/${record.id}`)
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

export default NewBrandDetail
