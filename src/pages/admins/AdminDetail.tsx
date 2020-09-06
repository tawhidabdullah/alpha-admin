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
import AdminEdit from "./AdminEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [tagDetailState, handleTagDetailFetch] = useHandleFetch({}, 'adminDetail');
    const [tagProductsState, handleTagProductsFetch] = useHandleFetch({}, 'tagProducts');
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
                    Admin Detail
                </h3>

                {tagDetailState.done && tagDetailData && (Object.keys(tagDetailData).length > 0) && (
                    <>
                        <AdminEdit
                            tagEditVisible={tagEditVisible}
                            setTagEditVisible={setTagEditVisible}
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
                    <Empty description='No Admin found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        </div>
    )
}

export default NewBrandDetail
