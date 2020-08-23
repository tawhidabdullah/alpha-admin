import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from "react-router";


// import hooks
import { useHandleFetch } from "../../hooks";

// import lib
import {
    EditOutlined,
} from '@ant-design/icons';

import { Skeleton, Empty, Button, notification, Table, Space, Input as CoolInput, Tooltip, Modal } from 'antd';



// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import CategoryEdit from "./CategoryEdit";


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;


interface Props {
    productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
    const [categoryDetailState, handleCategoryDetailFetch] = useHandleFetch({}, 'categoryDetail');
    const [categoryProductsState, handleCategoryProductsFetch] = useHandleFetch({}, 'categoryProducts');

    const params = useParams();
    const history = useHistory();
    const categoryId = params['id'];
    const [categoryEditVisible, setCategoryEditVisible] = useState(false);
    const [categoryDetail,setcategoryDetail] = useState({}); 



    useEffect(() => {

        const getCategoryDetail = async () => {
            const categoryDetailDataRes =  await handleCategoryDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: categoryId
                    }
                }
            }); 

            // @ts-ignore
            if(categoryDetailDataRes){
                  // @ts-ignore
                setcategoryDetail(categoryDetailDataRes)

            }

        };

        getCategoryDetail();

    }, [categoryId]);

    useEffect(() => {

        const getCategoryProducts = async () => {
            await handleCategoryProductsFetch({
                urlOptions: {
                    placeHolders: {
                        id: categoryId
                    }
                }
            })
        };

        getCategoryProducts();

    }, [categoryId]);




    console.log('categoryProductsState', categoryProductsState);

    console.log('brandParams', params);


    const getImagesInCollumn = (imgs) => {
        if (!imgs[0]) return false;
        imgs = imgs.map(item => item.cover);
        const columns = {};

        let localIndex = 0;
        let columnNumber = 0;


        imgs.forEach((item, index) => {
            if (localIndex < 3) {
                if (columns[columnNumber]) {
                    columns[columnNumber] = [...columns[columnNumber], item]
                }
                else columns[columnNumber] = [item];

                localIndex = localIndex + 1;
                columnNumber = columnNumber + 1;

            }
            else {
                localIndex = 0;
                columnNumber = 0;
                console.log('localIndex', localIndex)
            }
        });

        return columns;
    }


    const row = categoryDetailState.done && categoryDetail && categoryDetail['image'] ? getImagesInCollumn(categoryDetail['image']) : [];



    return (
        <div className='brandDetailContainer'>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Category Detail
                </h3>

                {categoryDetailState.done && categoryDetail && (Object.keys(categoryDetail).length > 0) && (
                    <>
                        <CategoryEdit
                            categoryEditVisible={categoryEditVisible}
                            setCategoryEditVisible={setCategoryEditVisible}
                            categoryDetailData={categoryDetail}
                            setcategoryDetailData={setcategoryDetail}
                        />

                        <Button
                            onClick={() => setCategoryEditVisible(true)}
                            type='link'
                            icon={<EditOutlined />}
                        >
                            Edit
                      </Button>
                    </>
                )}

            </div>
            <Skeleton
                avatar paragraph={{ rows: 3 }}
                loading={categoryDetailState.isLoading}>
                {categoryDetailState.done && categoryDetail && !(Object.keys(categoryDetail).length > 0) && (
                    <Empty description='No Category found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}



                {categoryDetailState.done && categoryDetail && (Object.keys(categoryDetail).length > 0) && (
                    <>
                        <div className='brandDetailContainer__header'>
                            <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-category'>
                                <img src={categoryDetail['cover'] && categoryDetail['cover']['cover']} alt="" />
                            </div>
                            <div className='brandDetailContainer__header-info'>
                                <h2>
                                    {categoryDetail['name']}
                                </h2>
                                <h3>
                                    {categoryDetail['description']}
                                </h3>
                                <h3>
                                    Category type: <span>
                                        {categoryDetail['type']}
                                    </span>
                                </h3>

                                {categoryDetail['url'] && (
                                    <h3>
                                        URL:
                                        <span>
                                            {categoryDetail['url']}
                                        </span>

                                    </h3>
                                )}

                            </div>
                        </div>


                        {categoryDetail['icon'] && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Icon
                            </h3>
                                </div>

                                <div className='brandDetailContainer__inlineBox'>
                                    <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-icon'>
                                        <img src={categoryDetail['icon'] && categoryDetail['icon']} alt="" />
                                    </div>

                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}


                        {categoryDetail['image'] && categoryDetail['image'].length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Image Gallary
                                   </h3>
                                </div>

                                <div className='brandDetailContainer__imageGallary'>
                                    <div className='imgGallaryContainer'>

                                        <div className="imgGallary-row">
                                            {row && Object.keys(row).map(column => {
                                                return (
                                                    <div className="imgGallary-column">
                                                        {row[column] && row[column].map(img => {
                                                            return <img 
                                                            alt='..'
                                                            src={img} style={{
                                                                width: '100%'
                                                            }} />
                                                        })}

                                                    </div>
                                                )
                                            })}


                                        </div>
                                    </div>

                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}


                        {categoryDetail['subCategory'] && categoryDetail['subCategory'].length > 0 && (
                            <>
                                <div className='brandDetailContainer__heading'>
                                    <h3>
                                        Child Categories
                                   </h3>
                                </div>

                                <div className='smallcatCardContainer'>
                                    {categoryDetail['subCategory'].map(subCat => {
                                        return (
                                            <div
                                                onClick={() => history.push(`/admin/category/${subCat.id}`)}
                                                className='smallcatCardContainer__card'>
                                                <div className='smallcatCardContainer__card-coverbox'>
                                                    <img src={subCat.cover} alt="" />
                                                </div>
                                                <div className='smallcatCardContainer__card-info'>
                                                    <h3>
                                                        {subCat.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>

                                <div style={{
                                    marginBottom: "25px"
                                }}></div>
                            </>
                        )}


                    </>

                )}

            </Skeleton>

            <div className='brandDetailContainer__heading'>
                <h3>
                    Products
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {categoryProductsState.isLoading && <DataTableSkeleton />}
                {categoryProductsState.done && !(categoryProductsState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Products exists in this category' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {categoryProductsState.done && categoryProductsState.data && categoryProductsState.data.length > 0 && (
                    <>
                        <Table
                            style={{
                                paddingTop: '10px',
                                borderRadius: '5px !important',
                                overflow: 'hidden',
                                boxShadow: '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)'
                            }}

                            size='small'
                            dataSource={categoryProductsState.data}
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
                                                // go to product detail
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

export default NewBrandDetail
