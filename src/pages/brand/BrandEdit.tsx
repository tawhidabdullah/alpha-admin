import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip, Spin } from 'antd';

import {
    FileOutlined,
    InboxOutlined,
    FileAddOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CheckOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    FileImageFilled
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import MetaTags from "../../pages/category/MetaTags";

const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Brand Updated',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    name: '',
	bnName: '',
	description: '',
	bnDescription: '',
	metaTitle: '',
	bnMetaTitle: '',
	metaDescription: '',
	bnMetaDescription: '',
	metaTags: '',
	bnMetaTags: '',
	image: [],
	url: '',
	cover: ''
}



interface Props {
    brandDetailData?: any;
    brandEditVisible?: any;
    setBrandEditVisible?: any;
    setBrandDetailData?:any; 
}

const AddNewBrand = ({ brandDetailData, brandEditVisible, setBrandEditVisible,setBrandDetailData }: Props) => {

    const [updateBrandState, handleUpdateBrandFetch] = useHandleFetch({}, 'updateBrand');
    const [attachImageToItemMultipleState, handleAttachImageToItemMultipleFetch] = useHandleFetch({}, 'attachImageToItemMultiple');
    const [attachImageToItemSingleState, handleAttachImageToItemSingleFetch] = useHandleFetch({}, 'attachImageToItemSingle');
    const [detachImageFromItemMultipleState, handleDetachImageFromItemMultipleFetch] = useHandleFetch({}, 'detachImageFromItemMultiple');
    const [detachImageFromItemSingleState, handleDetachImageFromItemSingleFetch] = useHandleFetch({}, 'detachImageFromItemSingle');
    const [setImageAsThumbnailToItemState, handleSetImageAsThumbnailToItemFetch] = useHandleFetch({}, 'setImageAsThumbnailToItem');


    const [myImages, setmyImages] = useState(false);
    const [visibleMedia, setvisibleMedia] = useState(false);
    const [coverImageId, setCoverImageId] = useState('');
    const [myGoddamnImages, setMyGoddamnImages] = useState([]);
	const [tags,setTags] = useState([]);
	const [bnTags,setBnTags] = useState([]);




    useEffect(() => {
        if (brandDetailData && Object.keys(brandDetailData).length > 0) {

            const images = brandDetailData.image;
            if (images && images.length > 0) {
                setmyImages(images);
                setMyGoddamnImages(images);
            }

            if (brandDetailData.cover && brandDetailData.cover['id']) {
                // @ts-ignore
                setmyImages([brandDetailData.cover]);
                setCoverImageId(brandDetailData.cover['id']);
            }
        }
    }, [brandDetailData]); 


    useEffect(() => {
        // @ts-ignore
        if (myImages && myImages[0] && myImages.length < 2) {

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
                    collection: 'brand',
                    itemId: brandDetailData.id
                }
            }
        });
    }



    const handleSetImageAsThumnail = async image => {

        const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
            urlOptions: {
                placeHolders: {
                    imageId: image.id,
                    collection: 'brand',
                    itemId: brandDetailData.id
                }
            }
        });


        // @ts-ignore
        if (thumbnailRes && thumbnailRes.status === 'ok') {
            openSuccessNotification('Seted as thumbnail!')
            // const positionInBrand = () => {
            //     return brandList.map(item => item.id).indexOf(brandDetailData.id);
            // }

            // const index = positionInBrand();

            // const prevItem = brandList.find(item => item.id === productRecord.id);

            // if (prevItem) {
            //     const updatedItem = Object.assign({}, brandList[index], { ...prevItem, cover: image.cover });
            //     const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];
            //     setBrandList(updateBrandList);
            // }
        }
        else {
            openErrorNotification("Couldn't set as thumbnail, Something went wrong")
        }

    }



    
    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }



    



    const handleSubmit = async (values: any, actions: any) => {

        console.log('myReadyToGoImages', myImages);

        if (brandDetailData && Object.keys(brandDetailData).length > 0) {
            // @ts-ignore
            const images = myImages && myImages.length > 0 ? myImages.map(item => item.id) : [];

            if (images[0] && images.length > 1) {
                await handleAttachImageToItemMultipleFetch({
                    urlOptions: {
                        placeHolders: {
                            collection: 'brand',
                            itemId: brandDetailData.id
                        }
                    },
                    body: {
                        image: images
                    }
                });
            }
            else if (images[0] && images.length < 1) {
                await handleAttachImageToItemSingleFetch({
                    urlOptions: {
                        placeHolders: {
                            imageId: images[0].id,
                            collection: 'brand',
                            itemId: brandDetailData.id
                        }
                    }
                });
            }
        }





        const updateBrandRes = await handleUpdateBrandFetch({
            urlOptions: {
                placeHolders: {
                    id: brandDetailData.id
                }
            },
            body: {
                name: values.name.trim(),
                description: values.description,
            },
        });

        // @ts-ignore
        if (updateBrandRes && updateBrandRes.status === 'ok') {
            console.log('updateBrandRes',updateBrandRes);
            setBrandDetailData({
                ...brandDetailData,
                // @ts-ignore
                ...updateBrandRes
            })
            openSuccessNotification();
            setBrandEditVisible(false);


            // const positionInBrand = () => {
            //     return brandList.map(item => item.id).indexOf(productRecord.id);
            // }

            // const index = positionInBrand();
            // const updatedItem = Object.assign({}, brandList[index], { ...updateBrandRes });
            // console.log('updateBrandList', updatedItem)

            // const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];

            // setBrandList(updateBrandList);


            actions.resetForm();

        }
        else {
            openErrorNotification();
        }

        actions.setSubmitting(false);
    };



    const onSwitchChange = (checked: any) => {
        // console.log(checked);
    };


    const handleCancel = (e: any) => {
        setBrandEditVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }




    console.log('myImages', myImages); 


    useEffect(()=>{

        if(brandDetailData && Object.keys(brandDetailData).length > 0){
            const metaTags = brandDetailData.metaTags && brandDetailData.metaTags.split(','); 

            console.log('localMetaTags',metaTags);
           
            const bnMetaTags = brandDetailData.bn && brandDetailData.bn['metaTags'] && brandDetailData.bn['metaTags'].split(','); 
            setTags(metaTags || [])
            setBnTags(bnMetaTags || [])
        }

    },[])

    console.log('brandEdit',brandDetailData);

    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...initialValues, 
                    ...brandDetailData,
                    ...( brandDetailData && Object.keys(brandDetailData).length > 0 && {
                        bnMetaTitle: brandDetailData['bn']
                        && brandDetailData['bn'].metaTitle
                        && brandDetailData['bn'].metaTitle,
                        bnMetaDescription: brandDetailData['bn'] &&  brandDetailData['bn'].metaDescription && brandDetailData['bn'].metaDescription,
                        bnName: brandDetailData['bn'] && brandDetailData['bn'].name && brandDetailData['bn'].name,
                        bnDescription: brandDetailData['bn'] && brandDetailData['bn'].description && brandDetailData['bn'].description,
                    })
                }
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
                                top: '40px'
                            }}
                            title="Brand Edit"
                            visible={brandEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Update'
                            okButtonProps={{
								loading: isSubmitting,
								htmlType: "submit",
							}}
                        >
                					<Input
								label='Name'
								value={values.name}
								name='name'
								placeHolder={'microsoft,apple'}
								isError={(touched.name && errors.name) ||
									(!isSubmitting && updateBrandState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && updateBrandState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>

							<Input
								label='BN Name'
								value={values.bnName}
								placeHolder={'প্রান,নোকিয়া'}
								name='bnName'
								isError={(touched.bnName && errors.bnName) ||
									(!isSubmitting && updateBrandState.error['error']['bnName'])}

								errorString={(touched.bnName && errors.bnName) ||
									(!isSubmitting && updateBrandState.error['error']['bnName'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnName');
								}}
							/>


							<TextArea
								label='Description'
								value={values.description}
								name='description'
								placeholder={'This brand...'}
								isError={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
								}}
							/>

							<TextArea
								label='BN Description'
								value={values.bnDescription}
								placeholder={'এই ব্র্যান্ড...'}
								name='bnDescription'
								isError={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnDescription'])}

								errorString={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnDescription');
								}}
							/>

                            <div
                                style={{
                                    marginTop: '20px'
                                }}
                            />


                            <div className='addproductSection-left-header'

                                style={{
                                    marginBottom: '-5px'
                                }}
                            >
                                <h3 className='inputFieldLabel'>
                                    Cover
                                </h3>
                                {/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
                            </div>


                            <div className='aboutToUploadImagesContainer'>

                                {brandDetailData && Object.keys(brandDetailData).length > 0 && (
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


{ 
									!myImages || 
									// @ts-ignore
									(myImages && !(myImages && myImages.length > 0)) ? (
										<>
										<Tooltip
									title={'Attach images'}>

									<div
										onClick={() => {
											setvisibleMedia(true);
										}}
										className='aboutToUploadImagesContainer__uploadItem'>
										<FileImageFilled />
										<span className='aboutToUploadImagesContainer__uploadItem-plus'>
											<PlusOutlined />
										</span>
									</div>
								</Tooltip>
										</>
									) : ""}
                                    </>
                                )}


                            </div>


                            <Input
								label='Meta title'
								value={values.metaTitle}
								placeHolder={'category...'}
								name='metaTitle'
								isError={(touched.metaTitle && errors.metaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['metaTitle'])}

								errorString={(touched.metaTitle && errors.metaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['metaTitle'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('metaTitle')
								}}
							/>

							<Input
								label='BN Meta title'
								value={values.bnMetaTitle}
								placeHolder={'ক্যাটাগড়ি...'}
								name='bnMetaTitle'
								isError={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaTitle'])}

								errorString={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaTitle'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaTitle');
								}}
							/>

							<TextArea
								label='Meta description'
								value={values.metaDescription}
								placeholder={'meta...'}
								name='metaDescription'
								isError={(touched.metaDescription && errors.metaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['metaDescription'])}

								errorString={(touched.metaDescription && errors.metaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['metaDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('metaDescription');
								}}
							/>

							<TextArea
								label='BN Meta Description'
								value={values.bnMetaDescription}
								placeholder={'এইয় মেট...'}
								name='bnMetaDescription'
								isError={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaDescription'])}

								errorString={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaDescription');
								}}
							/>

							<h3 className='inputFieldLabel'>
							Meta Tags (grocery,fashion)
							</h3>

							<MetaTags
							// @ts-ignore
							setTags={setTags}
							tags={tags}
							 />

							<div style={{
								marginTop:'15px'
							}}></div>

							<h3 className='inputFieldLabel'>
							BN Meta Tags (মুদিখানা,ফ্যাশন)
							</h3>

							<MetaTags
							// @ts-ignore
							setTags={setBnTags}
							tags={bnTags}
							 />


                        </Modal>

                        <MediaLibrary
                            setvisible={setvisibleMedia}
                            visible={visibleMedia}
                            setmyImages={setmyImages}
                            myImages={myImages}
                            myGoddamnImages={myGoddamnImages}
                            setMyGoddamnImages={setMyGoddamnImages}
                            isModalOpenForImages={false}

                        />
                    </>
                )}
        </Formik>




    );
};

export default AddNewBrand;
