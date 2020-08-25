import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';


// import third party ui lib
import { notification, Modal } from 'antd';

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
import OrderedProductsSelectProducts from "./OrderedProductsSelectProducts";
import OrderedProductsSelectedProductItems from "./OrderedProductsSelectedProductItems";
import FreeSelectProducts from "./FreeSelectProducts";
import FreeSelectedProductItems from "./FreeSelectedProductItems";

const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Coupon Created',
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
    "name": "",
    "code": "",
    "minimumOrder": null,
    "amount": "",
    "amountType": "",
    "orderedProducts": [],
    "freeDelivery": true,
    "freeProducts": []
}



interface Props {
    addNewCategoryVisible?: any;
    setAddNewCategoryVisible?: any;
    tagList?: any;
    setTagList?: any;

}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, tagList, setTagList }: Props) => {

    const [addCouponState, handleAddCouponStateFetch] = useHandleFetch({}, 'addCoupon');
    const [myImages, setmyImages] = useState(false);
    const [visibleMedia, setvisibleMedia] = useState(false);
    const [coverImageId, setCoverImageId] = useState('');
    const [productIds, setProductIds] = useState([]);
    const [productList, setProductList] = useState([]);
    const [freeProductIds, setFreeProductIds] = useState([]);
    const [freeProductList, setFreeProductList] = useState([]);



    const handleSubmit = async (values: any, actions: any) => {

        const orderedProducts = productList.length > 0 ? productList.map(product => {
            return {
                _id: product._id,
                variation: product.variation,
                quantity: product.quantity,
            }
        }) : [];


        const freeProducts = freeProductList.length > 0 ? freeProductList.map(product => {
            return {
                _id: product._id,
                variation: product.variation,
                quantity: product.quantity,
            }
        }) : [];


        const addTagRes = await handleAddCouponStateFetch({
            urlOptions: {
                placeHolders: {
                    id: values.id,
                }
            },
            body: {
                name: values.name.trim(),
                code: values.code.trim(),
                minimumOrder: values.minimumOrder.trim(),
                amount: values.amount.trim(),
                amountType: values.amountType.trim(),
                freeDelivery: false,
                orderedProducts: orderedProducts,
                freeProducts: freeProducts,
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            openSuccessNotification();

            setTagList([{
                id: addTagRes['id'] || '',
                key: addTagRes['id'] || '',
                name: addTagRes['name'] || '',
                description: addTagRes['description'] || '',
            },...tagList])
            actions.resetForm();
            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification();
        }


        actions.setSubmitting(false);

    };


    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }




    useEffect(() => {
        if (!addCouponState['isLoading']) {
            const error = addCouponState['error'];
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
    }, [addCouponState])





    useEffect(() => {

        if (productIds.length > 0) {
            if (productIds.length > productList.length) {
                const variation = productIds[productIds.length - 1]['pricing'].length > 0 && productIds[productIds.length - 1]['pricing'][0]['_id'];
                console.log('variation', variation)

                setProductList([...productList, {
                    ...productIds[productIds.length - 1],
                    _id: productIds[productIds.length - 1]['id'],
                    variation: variation,
                    quantity: 1
                }]);
            }


            else if (productIds.length < productList.length) {
                console.log('productIds', productIds);
                console.log('productList', productList);

                const newProductList = productList.filter(item => {
                    let isTrue = false;
                    productIds.forEach(product => {
                        if (product.id === item._id) {
                            isTrue = true;
                        }
                    });
                    return isTrue;
                })
                setProductList(newProductList);

            }

        }
        else {
            setProductList([]);
        }
        // console.log('productIds', productIds)


    }, [productIds])



    useEffect(() => {

        if (freeProductIds.length > 0) {
            if (freeProductIds.length > freeProductList.length) {
                const variation = freeProductIds[freeProductIds.length - 1]['pricing'].length > 0 && freeProductIds[freeProductIds.length - 1]['pricing'][0]['_id'];
                console.log('variation', variation)

                setFreeProductList([...freeProductList, {
                    ...freeProductIds[freeProductIds.length - 1],
                    _id: freeProductIds[freeProductIds.length - 1]['id'],
                    variation: variation,
                    quantity: 1
                }]);
            }


            else if (freeProductIds.length < freeProductList.length) {
                console.log('freeProductIds', freeProductIds);
                console.log('productList', productList);

                const newProductList = freeProductList.filter(item => {
                    let isTrue = false;
                    freeProductIds.forEach(product => {
                        if (product.id === item._id) {
                            isTrue = true;
                        }
                    });
                    return isTrue;
                })
                setFreeProductList(newProductList);

            }

        }
        else {
            setFreeProductList([]);
        }
        // console.log('freeProductIds', freeProductIds)


    }, [freeProductIds])



    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }




    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...initialValues }
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
                            width={'45vw'}
                            style={{
                                top: '40px'
                            }}
                            title="Add New Coupon"
                            visible={addNewCategoryVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Create'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                        >

                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Name'
                                        value={values.name}
                                        name='name'
                                        isError={(touched.name && errors.name) ||
                                            (!isSubmitting && addCouponState.error['error']['name'])}

                                        errorString={(touched.name && errors.name) ||
                                            (!isSubmitting && addCouponState.error['error']['name'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('name');
                                        }}
                                    />
                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Code'
                                        value={values.code}
                                        name='code'
                                        isError={(touched.code && errors.code) ||
                                            (!isSubmitting && addCouponState.error['error']['code'])}

                                        errorString={(touched.code && errors.code) ||
                                            (!isSubmitting && addCouponState.error['error']['code'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('code');
                                        }}
                                    />
                                </div>

                            </div>

                            <Input
                                label='Minimum Order'
                                value={values.minimumOrder}
                                name='minimumOrder'
                                isError={(touched.minimumOrder && errors.minimumOrder) ||
                                    (!isSubmitting && addCouponState.error['error']['minimumOrder'])}

                                errorString={(touched.minimumOrder && errors.minimumOrder) ||
                                    (!isSubmitting && addCouponState.error['error']['minimumOrder'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('minimumOrder');
                                }}
                            />



                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Amount'
                                        value={values.amount}
                                        name='amount'
                                        isError={(touched.amount && errors.amount) ||
                                            (!isSubmitting && addCouponState.error['error']['amount'])}

                                        errorString={(touched.amount && errors.amount) ||
                                            (!isSubmitting && addCouponState.error['error']['amount'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('amount');
                                        }}
                                    />
                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Amount Type'
                                        value={values.amountType}
                                        name='amountType'
                                        isError={(touched.amountType && errors.amountType) ||
                                            (!isSubmitting && addCouponState.error['error']['amountType'])}

                                        errorString={(touched.amountType && errors.amountType) ||
                                            (!isSubmitting && addCouponState.error['error']['amountType'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('amountType');
                                        }}
                                    />
                                </div>




                            </div>




                            <h3 className='inputFieldLabel'>
                                Ordered Products
                                </h3>

                            <OrderedProductsSelectProducts
                                setProductIds={setProductIds}
                                productIds={productIds}
                            />

                            <div style={{
                                marginTop: "15px"
                            }}></div>

                            <h3 className='inputFieldLabel'>
                                Selected Ordered Products
                                </h3>

                            <OrderedProductsSelectedProductItems
                                productList={productList}
                                setProductList={setProductList}
                            />


                            <h3 className='inputFieldLabel'>
                                Free Products
                                </h3>

                            <OrderedProductsSelectProducts
                                setProductIds={setFreeProductIds}
                                productIds={freeProductIds}
                            />

                            <div style={{
                                marginTop: "15px"
                            }}></div>

                            <h3 className='inputFieldLabel'>
                                Selected Free Products
                                </h3>

                            <OrderedProductsSelectedProductItems
                                productList={freeProductList}
                                setProductList={setFreeProductList}
                            />



                        </Modal>

                        <MediaLibrary
                            setvisible={setvisibleMedia}
                            visible={visibleMedia}
                            setmyImages={setmyImages}
                            myImages={myImages}
                            isModalOpenForImages={true}

                        />
                    </>
                )}
        </Formik>
    );
};

export default AddNewBrand;
