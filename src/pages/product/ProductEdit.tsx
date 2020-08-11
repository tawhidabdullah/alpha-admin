import React, { useState, useEffect } from 'react';

// import hooks 
import { useHandleFetch } from '../../hooks';


// import libraries 
import { Formik } from 'formik';
import * as Yup from 'yup';
import { message, Tooltip, Modal, Tabs, Empty, Badge, Spin } from 'antd';

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
    InfoCircleOutlined
} from '@ant-design/icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import DatePicker from "../../components/Field/DatePicker";
import { openSuccessNotification, openErrorNotification } from "../../components/Notification";
import Tags from "./Tags";
import Brands from "./Brands";
import Categories from "./Categories";
import Pricing from "./Pricing";

const { TabPane } = Tabs;

const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});


const initialValues = {
    name: '',
    description: '',
    model: '',
    unit: '',
    regular: '',
    offer: '',
    available: '',
    minimum: '',
    image: [],
    url: '',
    cover: '',
    pricing: [],
    venue: '',
    date: '',
    time: '',
    purchaseLimit: null
}

interface Props {
    productEditVisible?: any;
    setProductEditVisible?: any;
    productDetailData?: any;
}

const AddNewProduct = ({ productEditVisible, setProductEditVisible, productDetailData }: Props) => {

    const [updateProductState, handleUpdateProductFetch] = useHandleFetch({}, 'updateProduct');
    const [productDetailState, handleProductDetailFetch] = useHandleFetch({}, 'productDetailById');
    const [attachImageToItemMultipleState, handleAttachImageToItemMultipleFetch] = useHandleFetch({}, 'attachImageToItemMultiple');
    const [attachImageToItemSingleState, handleAttachImageToItemSingleFetch] = useHandleFetch({}, 'attachImageToItemSingle');
    const [detachImageFromItemMultipleState, handleDetachImageFromItemMultipleFetch] = useHandleFetch({}, 'detachImageFromItemMultiple');
    const [detachImageFromItemSingleState, handleDetachImageFromItemSingleFetch] = useHandleFetch({}, 'detachImageFromItemSingle');
    const [setImageAsThumbnailToItemState, handleSetImageAsThumbnailToItemFetch] = useHandleFetch({}, 'setImageAsThumbnailToItem');



    const [visible, setvisible] = useState(false);
    const [myImages, setmyImages] = useState(false);
    const [myThumbnailImage, setmyThumbnailImage] = useState(false);
    const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
    const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
    const [categoryids, setcategoryIds] = useState([]);
    const [tagIds, setTagIds] = useState([]);
    const [brandId, setBrandId] = useState('');
    const [pricing, setPricing] = useState([]);
    const [coverImageId, setCoverImageId] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [date, setDateFeild] = useState('');
    const [time, setTimeFeild] = useState('');
    const [description, setDescription] = useState('');





    useEffect(() => {

        const getProductDetail = async () => {
            await handleProductDetailFetch({
                urlOptions: {
                    placeHolders: {
                        id: productDetailData.id
                    }
                }
            })
        };

        getProductDetail();

    }, [productDetailData]);

    useEffect(() => {

        if (productDetailData && productDetailData.brand) {
            setBrandId(productDetailData.brand['id']);
        }
        else {
            setBrandId('');
        }
        if (productDetailData && productDetailData.tags && productDetailData.tags.length > 0) {
            // const tagIds = productDetailData.tags.map(item => item.id);
            setSelectedTags(productDetailData.tags);
        }
        else {
            setSelectedTags([]);

        }
        if (productDetailData && productDetailData.category && productDetailData.category.length > 0) {
            const categoryIds = productDetailData.category.map(item => item.id);
            setCategoryOptions(categoryIds);
        }
        else {
            setCategoryOptions([]);

        }

        if (productDetailData && productDetailData.pricing && productDetailData.pricing) {
            setPricing(productDetailData.pricing)
        }
        else {
            setPricing([]);

        }


        if (productDetailData && productDetailData.date && productDetailData.date) {
            setDateFeild(productDetailData.date)
        }
        else {
            setDateFeild('');

        }

        if (productDetailData && productDetailData.time && productDetailData.time) {
            setTimeFeild(productDetailData.time);
        }
        else {
            setTimeFeild('');
        }



    }, [productDetailData]);



    useEffect(() => {
        if (productDetailState.done && Object.keys(productDetailState).length > 0) {

            const images = productDetailState.data.image;
            if (images && images.length > 0) {
                setmyImages(images);
            }

            if (productDetailState.data.cover && productDetailState.data.cover['id']) {
                // @ts-ignore
                setmyImages([productDetailState.data.cover, ...images]);
                console.log('catcat', [productDetailState.data.cover, ...images]);
                setCoverImageId(productDetailState.data.cover['id']);
            }

        }
    }, [productDetailState])


    useEffect(() => {
        console.log('thumnail', myImages);
        // @ts-ignore
        if (myImages && myImages[0] && myImages.length < 2) {
            console.log('thumnail2', myImages);

            if (coverImageId !== myImages[0].id) {
                setCoverImageId(myImages[0].id);
                handleSetImageAsThumnail(myImages[0]);
            }

        }

    }, [myImages])


    const handleDetachSingleImage = async id => {
        await handleDetachImageFromItemSingleFetch({
            urlOptions: {
                placeHolders: {
                    imageId: id,
                    collection: 'product',
                    itemId: productDetailData.id
                }
            }
        });
    }



    const handleSetImageAsThumnail = async image => {

        const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
            urlOptions: {
                placeHolders: {
                    imageId: image.id,
                    collection: 'product',
                    itemId: productDetailData.id
                }
            }
        });

        console.log('thumbnailRes', thumbnailRes);

        // @ts-ignore
        if (thumbnailRes && thumbnailRes.status === 'ok') {
            openSuccessNotification('Seted as thumbnail!')
            // const positionInBrand = () => {
            //     return productList.map(item => item.id).indexOf(productDetailData.id);
            // }

            // const index = positionInBrand();

            // const prevItem = productList.find(item => item.id === productDetailData.id);

            // if (prevItem) {
            //     console.log('prevItem--', prevItem, 'image--', image);
            //     const updatedItem = Object.assign({}, productList[index], { ...prevItem, cover: image.cover });
            //     const updateProductList = [...productList.slice(0, index), updatedItem, ...productList.slice(index + 1)];
            //     setProductList(updateProductList);

            // }
        }
        else {
            openErrorNotification("Couldn't set as thumbnail, Something went wrong")
        }

    }






    const makeEmptyCategoryOptions = (setEmpty) => {
        setEmpty([]);
    }

    const handleSubmit = async (values: any, actions: any) => {
        // @ts-ignore
        const imagesIds = myImages ? myImages.map(image => {
            return image.id;
        }) : [];

        const updatedProductRes = await handleUpdateProductFetch({
            urlOptions: {
                placeHolders: {
                    id: productDetailData.id
                }
            },
            body: {
                name: values.name.trim(),
                description: description,
                model: values.model,
                unit: values.unit,
                category: categoryOptions,
                tags: tagIds,
                brand: brandId,
                image: imagesIds,
                cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
                pricing: pricing,
            },
        });


        // @ts-ignore
        if (updatedProductRes && updatedProductRes.status === 'ok') {
            openSuccessNotification('Product Updated');
            setProductEditVisible(false);

            console.log('updatedProductRes', updatedProductRes);
            // setProductList([...productList, {
            //     id: updatedProductRes['id'] || '',
            //     key: updatedProductRes['id'] || '',
            //     name: updatedProductRes['name'] || '',
            //     description: updatedProductRes['description'] || '',
            //     // @ts-ignore
            //     ...updatedProductRes
            // }])
            // @ts-ignore
            setmyImages([]);
            setCoverImageId('');
            setPricing([]);
            setTagIds([]);
            setSelectedTags([]);
            setBrandId("");
            setcategoryIds([]);
            setCategoryOptions([]);
            actions.resetForm();
        }
        else {
            // openErrorNotification();
        }

        actions.setSubmitting(false);


    };



    useEffect(() => {
        if (!updateProductState['isLoading']) {
            const error = updateProductState['error'];
            if (error['isError'] && Object.keys(error['error']).length > 0) {


                const errors =
                    Object.values(error['error']).length > 0
                        ? Object.values(error['error'])
                        : [];
                errors.forEach((err, i) => {
                    if (typeof err === 'string') {
                        openErrorNotification(err)
                    }
                    else if (typeof err === 'object') {
                        if (err && Object.keys(err).length > 0) {
                            const errs = Object.values(err);
                            errs.forEach(err => {
                                openErrorNotification(err)
                            })

                        }
                    }
                });
            }
        }
    }, [updateProductState])


    const handleCancel = (e: any) => {
        setProductEditVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !(pricing.length > 0) || !isValid) {
            return true;
        }
        return false;
    }


    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }

    const handleDeleteFromSelectedImage = () => {

    };

    const handleThumbnailImageDelete = (id) => {
        // @ts-ignore
        const newImages = myThumbnailImage && myThumbnailImage.filter(image => {
            return image.id !== id;
        })

        if (newImages.length > 0) {
            setmyThumbnailImage(newImages);

        }
        else setmyThumbnailImage(false);
    }





    const handleAddPricing = (priceItem) => {

        setPricing([{
            ...priceItem,
            id: pricing.length
        }, ...pricing])
        message.info('Product Pricing Added');
    }


    const handleDeletePricing = (id) => {
        const newPricing = pricing.filter(item => item.id !== id);
        setPricing(newPricing);
        message.info('Product Pricing Deleted');
    }



    const isCategoryInValid = () => {
        if (updateProductState.error['error']['category'] && !categoryids && categoryids.length) {
            return true;
        }
        else if (categoryids && categoryids.length > 0) {
            return false;
        }
    }

    const handleDateChange = (date, dateString) => {
        setDateFeild(dateString);
        // console.log('date', date, dateString);
    }

    const handleTimeChange = (date, dateString) => {
        setTimeFeild(dateString);
        // console.log('date', date, dateString);
    }


    console.log('productDetailData', productDetailData);
    console.log('productDetailState', productDetailState);


    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...initialValues, ...productDetailData }
            }
        >
            {({
                handleChange,
                values,
                handleSubmit,
                errors,
                isValid,
                isSubmitting,
                touched,
                handleBlur,
                setFieldTouched,
                handleReset,
            }) => (
                    <>
                        <Modal
                            style={{
                                top: '40px',

                            }}
                            bodyStyle={{
                                margin: 0,
                                padding: 0,
                            }}
                            width={'70vw'}
                            title="Product Detail"
                            visible={productEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            destroyOnClose={true}
                            okText='Update'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                        >


                            <section className='addProductGridContainer'>
                                <div className='addProductGridContainer__left'>
                                    <div className='addProductGridContainer__name'>
                                        <div className='addProductGridContainer__item-header'>
                                            <h3>
                                                Product Information
			</h3>

                                            <div className={values.name && values.name.length > 2 ? 'checkicon-active' : 'checkicon'}>
                                                <CheckCircleOutlined />
                                            </div>
                                        </div>
                                        <div className='addProductGridContainer__item-body'>
                                            <Input
                                                label='Title'
                                                value={values.name}
                                                name='name'
                                                isError={(touched.name && errors.name) ||
                                                    (!isSubmitting && updateProductState.error['error']['name'])}

                                                errorString={(touched.name && errors.name) ||
                                                    (!isSubmitting && updateProductState.error['error']['name'])}
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                    setFieldTouched('name');
                                                }}
                                            />
                                            {/* <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div style={{
                                                    width: '48%',
                                                }}>
                                                    <DatePicker
                                                        time={time}
                                                        date={date}
                                                        label='Date'
                                                        onChange={handleDateChange} />

                                                </div>
                                                <div style={{
                                                    width: '48%'
                                                }}>

                                                    <DatePicker
                                                        time={time}
                                                        date={date}
                                                        withTime={true}
                                                        placeholder='Select time'
                                                        label='Time'
                                                        onChange={handleTimeChange} />

                                                </div>
                                            </div>
                                            <div style={{
                                                marginBottom: '15px'
                                            }}></div>

                                            <TextArea
                                                rows={1}
                                                label='Venue'
                                                value={values.venue}
                                                name='venue'
                                                isError={(touched.venue && errors.venue) ||
                                                    (!isSubmitting && updateProductState.error['error']['venue'])}

                                                errorString={(touched.venue && errors.venue) ||
                                                    (!isSubmitting && updateProductState.error['error']['venue'])}
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                    setFieldTouched('venue');
                                                }}
                                            />



                                            <Input
                                                label='Purchase Limit'
                                                value={values.purchaseLimit}
                                                type='number'
                                                name='purchaseLimit'
                                                isError={(touched.purchaseLimit && errors.purchaseLimit) ||
                                                    (!isSubmitting && updateProductState.error['error']['purchaseLimit'])}

                                                errorString={(touched.purchaseLimit && errors.purchaseLimit) ||
                                                    (!isSubmitting && updateProductState.error['error']['purchaseLimit'])}
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                    setFieldTouched('purchaseLimit');
                                                }}
                                            /> */}



                                            <h3 className='inputFieldLabel'>
                                                Description
                               </h3>

                                            <div style={{
                                                width: '100%',
                                                maxWidth: '100%'
                                            }}>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={description}
                                                    onInit={editor => {
                                                        // You can store the "editor" and use when it is needed.
                                                        console.log('Editor is ready to use!', editor);
                                                    }}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setDescription(data);
                                                    }}
                                                    onBlur={(event, editor) => {
                                                        console.log('Blur.', editor);
                                                    }}
                                                    onFocus={(event, editor) => {
                                                        console.log('Focus.', editor);
                                                    }}
                                                />
                                            </div>

                                            {/* <Input
												label='Model Number'
												value={values.model}
												name='model'
												isError={(touched.model && errors.model) ||
													(!isSubmitting && updateProductState.error['error']['model'])}

												errorString={(touched.model && errors.model) ||
													(!isSubmitting && updateProductState.error['error']['model'])}
												onChange={(e: any) => {
													handleChange(e);
													setFieldTouched('model');
												}}
											/>


											<Input
												label='Unit'
												value={values.unit}
												name='unit'
												isError={(touched.unit && errors.unit) ||
													(!isSubmitting && updateProductState.error['error']['unit'])}

												errorString={(touched.unit && errors.unit) ||
													(!isSubmitting && updateProductState.error['error']['unit'])}
												onChange={(e: any) => {
													handleChange(e);
													setFieldTouched('unit');
												}}
											/> */}

                                        </div>

                                    </div>

                                    <div className='addProductGridContainer__price'>
                                        <div className='addProductGridContainer__item-header'>
                                            <h3>
                                                Product Pricing
			</h3>

                                            <div className={pricing && pricing.length > 0 ? 'checkicon-active' : 'checkicon'}>
                                                <CheckCircleOutlined />
                                            </div>
                                        </div>


                                        <div className='addProductGridContainer__item-body'>

                                            <Tabs
                                                animated={true}
                                                tabPosition="top"
                                                type='card'
                                                defaultActiveKey='2'
                                            >

                                                <TabPane tab="Add Variation" key="1">
                                                    <Pricing handleAddPricing={handleAddPricing} />
                                                </TabPane>
                                                <TabPane tab="Pricing List" key="2">
                                                    <div className='addProductGridContainer__item-body-pricingContainer'>

                                                        {pricing.length > 0 && pricing.map(item => {
                                                            return (
                                                                <div className='addProductGridContainer__item-body-pricingContainer-item'>
                                                                    <div className='addProductGridContainer__item-body-pricingContainer-item-edit'>
                                                                        {/* <span>
							<EditOutlined />
							</span> */}
                                                                        <span className='d' onClick={() => handleDeletePricing(item.id)}>
                                                                            <DeleteOutlined />
                                                                        </span>
                                                                    </div>
                                                                    <div className='addProductGridContainer__item-body-pricingContainer-item-two'>
                                                                        <div>
                                                                            <h3>
                                                                                Price
						</h3>
                                                                            <div className='addProductGridContainer__item-body-pricingContainer-item-body'>


                                                                                {item.price.offer ? (
                                                                                    <>
                                                                                        <h4 >
                                                                                            {item.price.offer}

                                                                                        </h4>
																			/
																			<h5 style={{
                                                                                            textDecoration: "line-through"
                                                                                        }}>

                                                                                            {item.price.regular}
                                                                                        </h5>
                                                                                    </>
                                                                                ) : (
                                                                                        <h4>
                                                                                            {item.price.regular}

                                                                                        </h4>
                                                                                    )}


                                                                            </div>
                                                                        </div>

                                                                        {item.stock && (
                                                                            <div>
                                                                                <Badge
                                                                                    overflowCount={999}
                                                                                    count={item.stock.available}>
                                                                                    <h3>
                                                                                        Stock
									</h3>
                                                                                </Badge>
                                                                                <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                                                                    <div>
                                                                                        <h6>
                                                                                            min
																							<Badge
                                                                                                className="site-badge-count-4"
                                                                                                overflowCount={999}
                                                                                                count={item.stock.minimum} />
                                                                                        </h6>


                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        )}



                                                                    </div>

                                                                    {item.attribute
                                                                        && Object.values(item.attribute).length > 0 && (
                                                                            <>
                                                                                <h3>
                                                                                    Attributes
						</h3>
                                                                                <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                                                                    {item.attribute
                                                                                        && Object.keys(item.attribute).length > 0
                                                                                        && Object.keys(item.attribute).map(attributeItem => {
                                                                                            return (
                                                                                                <div>
                                                                                                    <h6>
                                                                                                        {attributeItem}
                                                                                                    </h6>
                                                                                                    <h4>
                                                                                                        {item.attribute[attributeItem]}
                                                                                                    </h4>
                                                                                                </div>
                                                                                            )
                                                                                        })}
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                </div>
                                                            )
                                                        })}


                                                        {!(pricing.length > 0) && <div style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Empty description='No Pricing added' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                        </div>}
                                                    </div>
                                                </TabPane>

                                            </Tabs>

                                            <div className='addProductGridContainer__item-body-container'>

                                            </div>

                                        </div>
                                    </div>


                                    <div className='addProductGridContainer__image'>

                                        <div className='addProductGridContainer__item-header'>
                                            <h3>
                                                Image
			</h3>

                                            <Tooltip
                                                placement="left" title={'Click on the image to select cover image, By default 1st image is selected as cover'}>
                                                <a href='###'>
                                                    <InfoCircleOutlined />
                                                </a>
                                            </Tooltip>
                                        </div>

                                        <div
                                            style={{
                                                padding: "10px"
                                            }}
                                            className='aboutToUploadImagesContainer'>
                                            {productDetailState.isLoading && (
                                                <div style={{
                                                    padding: '20px 0'
                                                }}>
                                                    <Spin />
                                                </div>
                                            )}
                                            {productDetailState.done && (
                                                <>
                                                    {myImages &&
                                                        // @ts-ignore
                                                        myImages.length > 0 && myImages.map((image, index) => {
                                                            return (
                                                                <div className='aboutToUploadImagesContainer__item'>
                                                                    <div
                                                                        className='aboutToUploadImagesContainer__item-imgContainer'
                                                                        onClick={() => {
                                                                            setCoverImageId(image.id);
                                                                            handleSetImageAsThumnail(image);
                                                                        }}
                                                                    >
                                                                        <img src={image.cover} alt={image.alt} />
                                                                    </div>

                                                                    <span
                                                                        onClick={() => {
                                                                            handleImagesDelete(image.id)
                                                                            handleDetachSingleImage(image.id)
                                                                        }

                                                                        }
                                                                        className='aboutToUploadImagesContainer__item-remove'>
                                                                        <CloseOutlined />
                                                                    </span>


                                                                    {coverImageId === image.id ? (
                                                                        <span className='aboutToUploadImagesContainer__item-cover'>
                                                                            <CheckOutlined />
                                                                        </span>
                                                                    ) : !coverImageId && index === 0 && (
                                                                        <span className='aboutToUploadImagesContainer__item-cover'>
                                                                            <CheckOutlined />
                                                                        </span>
                                                                    )}


                                                                </div>
                                                            )
                                                        })}


                                                    <Tooltip
                                                        title={'Attach images'}>

                                                        <div
                                                            onClick={() => {
                                                                setvisible(true);
                                                                setisModalOpenForImages(true);
                                                                setisModalOpenForThumbnail(false);
                                                            }}
                                                            className='aboutToUploadImagesContainer__uploadItem'>
                                                            {/* <FileAddOutlined />
													<FileImageTwoTone />
													<FileImageOutlined /> */}
                                                            <FileImageFilled />
                                                            {/* <h5>
												     Select From Library
											<     /h5> */}
                                                            <span className='aboutToUploadImagesContainer__uploadItem-plus'>
                                                                <PlusOutlined />
                                                            </span>
                                                        </div>
                                                    </Tooltip>
                                                </>
                                            )}

                                        </div>
                                    </div>

                                </div>
                                <div className='addProductGridContainer__right'>
                                    <div className='addProductGridContainer__category'>

                                        <div className='addProductGridContainer-rightItemContainer'>
                                            <div className='addProductGridContainer-rightItemContainer-header'>
                                                <h3>
                                                    Categories
				</h3>

                                                <Tooltip
                                                    color='red'
                                                    visible={updateProductState.error['error']['category'] && !(categoryids.length > 0)}
                                                    placement="left" title={'Select at least one category'}>
                                                    <div className={!(categoryids.length > 0)
                                                        && !updateProductState.error['error']['category'] ? 'checkicon' : updateProductState.error['error']['category'] ? 'checkicon-error' : 'checkicon-active'}>
                                                        <CheckCircleOutlined />
                                                    </div>
                                                </Tooltip>

                                            </div>
                                            <div className='addProductGridContainer-rightItemContainer-body'>
                                                <Categories
                                                    setCategoryOptions={setCategoryOptions}
                                                    categoryOptions={categoryOptions}
                                                    setcategoryIds={setcategoryIds} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className='addProductGridContainer__tag'>
                                        <div className='addProductGridContainer-rightItemContainer'>
                                            <div className='addProductGridContainer-rightItemContainer-header'>
                                                <h3>
                                                    Tags
				</h3>
                                            </div>
                                            <div className='addProductGridContainer-rightItemContainer-body'>
                                                <Tags
                                                    setSelectedTags={setSelectedTags}
                                                    selectedTags={selectedTags}
                                                    setTagIds={setTagIds} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='addProductGridContainer__brand'>
                                        <div className='addProductGridContainer-rightItemContainer'>
                                            <div className='addProductGridContainer-rightItemContainer-header'>
                                                <h3>
                                                    Brand
				</h3>
                                            </div>
                                            <div className='addProductGridContainer-rightItemContainer-body'>
                                                <Brands
                                                    productDetailState={productDetailState}
                                                    brandId={brandId}
                                                    setBrandId={setBrandId} />
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            </section>


                        </Modal>

                        <MediaLibrary
                            setvisible={setvisible}
                            visible={visible}
                            setmyImages={setmyImages}
                            myImages={myImages}
                            setmyThumbnailImage={setmyThumbnailImage}
                            isModalOpenForThumbnail={isModalOpenForThumbnail}
                            isModalOpenForImages={isModalOpenForImages}

                        />
                    </>
                )}
        </Formik>




    );
};

export default AddNewProduct;




/*


Product variation ---->

Price [title]
	[regular input field] [offer inputfield]

Stock [title]
	[available input field] [minimum inputfield]

default [default can be set to true]

attributes [title]
	[add attributes name]
		[add attrubutes value]

	[add attributes name]
		[add attrubutes value

*///