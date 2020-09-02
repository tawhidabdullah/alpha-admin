import React, { useState, useEffect } from 'react';
import { Modal, Select, notification, Form, Empty, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import { useHandleFetch } from '../../hooks';
import OrderInvoice from "./OrderInvoice.jsx";
import ProductItemForOrderDetail from "./productItemForOrderDetail";
import SelectProducts from "./OrderProductIds";
import SelectedProductItems from "../productBundle/SelectedProductItems";

const { Option } = Select;


const validationSchema = Yup.object().shape({});




const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Order Updated',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};




const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


interface Props {
    customer: any;
    setTagEditVisible: any;
    tagEditVisible: any;
}

const QuickEdit = ({ customer, setTagEditVisible, tagEditVisible }: Props) => {
    const [updateOrderState, handleUpdateOrderFetch] = useHandleFetch({}, 'updateOrder');

    console.log('customerVie', customer);

    const [selectedCountryValue, setselectedCountryValue] = useState('');
    const [selectedCityValue, setselectedCityValue] = useState('');

    const [countryOptions, setcountryOptions] = useState([]);
    const [cityOptions, setcityOptions] = useState([]);

    const [countryListState, handleCountryListFetch] = useHandleFetch(
        [],
        'countryList'
    );

    const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

    const [countryList, setCountryList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [productIds, setProductIds] = useState([]);
    const [productList, setProductList] = useState([]);




    const handleSubmit = async (values: any, actions: any) => {
        // console.log('selectedCityValue', selectedCityValue); 
        // console.log('cooles', customer)



        const addRegionRes = await handleUpdateOrderFetch({
            urlOptions: {
                placeHolders: {
                    id: customer.id,
                }
            },
            body: {
                billingAddress: {
                    phone: values.phone,
                    email: values.email,
                    address1: values.address1,
                    address2: values.address2,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    city: selectedCityValue || customer['shippingAddress']['city'],
                    country: selectedCountryValue || customer['shippingAddress']['country'],
                },
                products: productList || customer.products,
                customerId: customer.customerId
                // charge
            },
        });

        // @ts-ignore
        if (addRegionRes && addRegionRes.status === 'ok') {
            openSuccessNotification();

            // const positionInTag = () => {
            //     return orderList.map(item => item.id).indexOf(customer.id);
            // }

            // const index = positionInTag();

            // const updatedItem = Object.assign({}, orderList[index], { ...addRegionRes });
            // const updateRegionList = [...orderList.slice(0, index), updatedItem, ...orderList.slice(index + 1)];
            // setOrderList(updateRegionList);

        }
        else {
            openErrorNotification();
        }

        actions.setSubmitting(false);
        setTagEditVisible(false)

    };


    const onChangeCity = (value) => {
        setselectedCityValue(value);
    }

    const onChangeCountry = (value) => {
        setselectedCountryValue(value);
    }

    useEffect(() => {
        const setCountries = async () => {
            const CountryListRes = await handleCountryListFetch({});

            // @ts-ignore
            if (CountryListRes && CountryListRes.length > 0) {
                // @ts-ignore
                const countryOptions = CountryListRes.map((country) => {
                    return {
                        value: country.name,
                        name: country.name
                    };
                });
                setcountryOptions(countryOptions);
            }
        };

        setCountries();
    }, []);


    useEffect(() => {
        const setCities = async () => {
            const cityListRes = await handleCityListFetch({
                urlOptions: {
                    placeHolders: {
                        country: selectedCountryValue,
                    },
                },
            });

            // @ts-ignore
            if (cityListRes && cityListRes.length > 0) {
                // @ts-ignore
                const cityOptions = cityListRes.map((city) => {
                    return {
                        value: city.name,
                        name: city.name
                    };
                });
                setcityOptions(cityOptions);
            }
        };

        setCities();
    }, [selectedCountryValue]);




    useEffect(()=>{
        if(customer && customer['products'] && customer['products'].length > 0){
            const productIds = customer['products'].map(item => item); 
            setProductIds(productIds); 
            const productList = customer.products.map(item => {
                return {
                    _id: item.id,
                    variation: item.variation,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice 
                }
            }); 
           setProductList(productList); 

        }; 
        
        console.log('customermy',customer);
    },[customer])


    console.log('productList',productList)
    console.log('productIds',productIds)

    

    useEffect(() => {

        if (productIds && productIds.length > 0 && productList) {
            if (productIds.length > productList.length) {
                const variation = productIds[productIds.length - 1]['pricing'] && productIds[productIds.length - 1]['pricing'].length > 0 && productIds[productIds.length - 1]['pricing'][0]['_id'];
                console.log('variation', variation)

                console.log('productIdsvariation',productIds)
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


    }, [productIds]); 


    console.log('productList',productList)

    const handleCancel = (e: any) => {
        setTagEditVisible(false);
    };



    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!isValid ||
            !values.firstName ||
            !values.LastName) {

            return true;
        }
        return false;
    }

    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...customer.shippingAddress ? customer.shippingAddress : {} }
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
                            title="Order Edit"
                            visible={tagEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Update'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                // disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                            bodyStyle={{
                                margin: '0',
                                padding: '10px'
                            }}
                            width={'70vw'}
                        >


                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='First Name'
                                        value={values.firstName}
                                        name='firstName'
                                        isError={(touched.firstName && errors.firstName) ||
                                            (!isSubmitting && updateOrderState.error['error']['firstName'])}

                                        errorString={(touched.firstName && errors.firstName) ||
                                            (!isSubmitting && updateOrderState.error['error']['firstName'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('firstName');
                                        }}
                                    />
                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Last Name'
                                        value={values.lastName}
                                        name='lastName'
                                        isError={(touched.lastName && errors.lastName) ||
                                            (!isSubmitting && updateOrderState.error['error']['lastName'])}

                                        errorString={(touched.lastName && errors.lastName) ||
                                            (!isSubmitting && updateOrderState.error['error']['lastName'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('lastName');
                                        }}
                                    />
                                </div>




                            </div>



                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Phone'
                                        value={values.phone}
                                        name='phone'
                                        isError={(touched.phone && errors.phone) ||
                                            (!isSubmitting && updateOrderState.error['error']['phone'])}

                                        errorString={(touched.phone && errors.phone) ||
                                            (!isSubmitting && updateOrderState.error['error']['phone'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('phone');
                                        }}
                                    />
                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Email'
                                        value={values.email}
                                        name='email'
                                        isError={(touched.email && errors.email) ||
                                            (!isSubmitting && updateOrderState.error['error']['email'])}

                                        errorString={(touched.email && errors.email) ||
                                            (!isSubmitting && updateOrderState.error['error']['email'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('email');
                                        }}
                                    />
                                </div>
                            </div>


                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <h3 className='inputFieldLabel'>
                                        Country
									</h3>


                                    <Form.Item
                                        validateStatus={(updateOrderState.error['error']['country']) ? "error" : ""}
                                        help={updateOrderState.error['error']['country']}
                                    // noStyle={true}
                                    >
                                        <Select
                                            defaultValue={values.country}
                                            notFoundContent={<Empty description='No Country Found' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder='Select a Country'
                                            optionFilterProp='children'
                                            onChange={onChangeCountry}
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {countryListState.done &&
                                                countryListState.data.length > 0 &&
                                                countryOptions.map((option) => {
                                                    return <Option value={option.value}>{option.name}</Option>;
                                                })}
                                        </Select>

                                    </Form.Item>




                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <h3 className='inputFieldLabel'>
                                        City
                                    </h3>
                                    <Form.Item
                                        // noStyle={true}
                                        validateStatus={(updateOrderState.error['error']['city']) ? "error" : ""}
                                        help={updateOrderState.error['error']['city']}

                                    >
                                        <Select
                                            defaultValue={values.city}
                                            className='selectClassName'
                                            notFoundContent={<Empty description='First Select a Country' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder='Select a city'
                                            optionFilterProp='children'
                                            onChange={onChangeCity}
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {cityListState.done &&
                                                cityListState.data.length > 0 &&
                                                cityOptions.map((option) => {
                                                    return <Option value={option.value}>{option.name}</Option>;
                                                })}
                                        </Select>
                                    </Form.Item>
                                </div>

                            </div>

                            <div style={{
                                marginTop: '12px'
                            }}></div>



                            <div className='dubbleRowInputs'>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Address'
                                        value={values.address1}
                                        name='address1'
                                        isError={(touched.address1 && errors.address1) ||
                                            (!isSubmitting && updateOrderState.error['error']['address1'])}

                                        errorString={(touched.address1 && errors.address1) ||
                                            (!isSubmitting && updateOrderState.error['error']['address1'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('address1');
                                        }}
                                    />
                                </div>
                                <div className='dubbleRowInputs__item'>
                                    <Input
                                        label='Address 2'
                                        value={values.address2}
                                        name='address2'
                                        isError={(touched.address2 && errors.address2) ||
                                            (!isSubmitting && updateOrderState.error['error']['address2'])}

                                        errorString={(touched.address2 && errors.address2) ||
                                            (!isSubmitting && updateOrderState.error['error']['address2'])}
                                        onChange={(e: any) => {
                                            handleChange(e);
                                            setFieldTouched('address2');
                                        }}
                                    />
                                </div>

                            </div>

                            <div style={{
                                marginTop: '12px'
                            }}></div>

                                <h3 className='inputFieldLabel'>
                                        Products
                                </h3>

                               {customer.products && customer.products.length > 0 && <> 
                                <SelectProducts
                                    setProductIds={setProductIds}
                                    productIds={productIds}
                                />

                                <div style={{
                                    marginTop: "15px"
                                }}></div>

                                <h3 className='inputFieldLabel'>
                                    Selcted Products
                                </h3>

                                <SelectedProductItems
                                    productList={productList}
                                    setProductList={setProductList}
                                />
                               </>}


                        <div style={{
                                marginTop: '20px'
                        }}></div>

                        <Button
                        onClick={() => setShowInvoice(true)}
                        className='btnPrimaryClassNameoutline'
                        >
                            Generate Invoice
                        
                        </Button>

                         <div style={{
                                marginBottom: '20px'
                            }}></div>

                            <OrderInvoice
                            id={customer.id}
                            setShowInvoice={setShowInvoice}
                            showInvoice={showInvoice} 
                            />

                            


                        </Modal>

                    </>
                )}



        </Formik>
    );
};


export default QuickEdit;
