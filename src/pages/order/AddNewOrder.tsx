import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';

// import third party ui lib
import {
  Upload,
  Radio,
  message,
  Select,
  Button,
  notification,
  Empty,
  Steps,
  Form,
  Input as IInput
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  DeleteOutlined,
  FileAddOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  CaretRightFilled,
  UserOutlined,
  InfoCircleOutlined,
  CarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import AddNewOrderSummary from './AddNewOrderSummary';
import CustomersId from './CustomersId';
import AddProducts from './AddProducts';
import { product } from '../../state/ducks';

//import utils
import { getDeliveryChargeTotal } from '.././../utils';
import DeliveryCharge from '../delivery/DeliveryCharge';

const { Option } = Select;
const { Step } = Steps;

const { Search } = IInput;


const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Order Created',
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

const validationSchema = Yup.object().shape({});

const initialValues = {
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  zipCode: '',
  additionalInfo: '',
  country: '',
  city: '',
};

const steps = [
  {
    title: 'Order Information',
    content: '',
    // description: 'Add Customer & Products'
  },
  {
    title: 'Address',
  },
  {
    title: 'Confirm Order',
    content: '',
  },
];

interface Props { }

const AddNewOrder = ({ }: Props) => {
  const [addOrderState, handleOrderFetch] = useHandleFetch({}, 'addOrder');
  const [selectedCountryValue, setselectedCountryValue] = useState('');
  const [selectedCityValue, setselectedCityValue] = useState('');
  const [customerId, setCustomerId] = useState([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState({});

  const [countryOptions, setcountryOptions] = useState([]);
  const [cityOptions, setcityOptions] = useState([]);

  const [countryListState, handleCountryListFetch] = useHandleFetch(
    [],
    'countryList'
  );

  const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

  const [current, setCurrent] = useState(0);
  const [productIds, setProductIds] = useState([]);
  const [productList, setProductList] = useState([]);

  const [productListState, handleProductListFetch] = useHandleFetch(
    {},
    'productList'
  );
  const [customerListState, handleCustomerListFetch] = useHandleFetch(
    {},
    'customerList'
  );

  const [deliveryRegionState, handleDeliveryRegionFetch] = useHandleFetch(
    [],
    'getDeliveryRegion'
  );

  const [deliveryRegionName, setDeliveryRegionName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState({});
  const [regionDeliveryCharge, setregionDeliveryCharge] = useState([]);

  useEffect(() => {
    if (selectedCustomerData && Object.keys(selectedCustomerData).length > 0) {
      setselectedCityValue(selectedCustomerData['city']);
      setselectedCountryValue(selectedCustomerData['country']);
    }
  }, [selectedCustomerData]);

  const isDeliveryChargeExists = (regions) => {
    if (!regions) {
      return false;
    } else return true;
  };

  useEffect(() => {
    const getAndSetShippingDeliveryCharge = async () => {
      const deliveryRegionState = await handleDeliveryRegionFetch({
        urlOptions: {
          placeHolders: {
            cityName: selectedCityValue,
          },
        },
      });
      // @ts-ignore
      setregionDeliveryCharge(deliveryRegionState);
    };

    getAndSetShippingDeliveryCharge();
    console.log('selectedCityValue', selectedCityValue);
  }, [selectedCityValue]);

  const handleDeviliveryRegionChange = (value) => {
    setDeliveryRegionName(value);

    if (
      isDeliveryChargeExists(
        regionDeliveryCharge.length > 0 && regionDeliveryCharge
      )
    ) {
      const deliveryRegions = regionDeliveryCharge;

      const selectedRegion = deliveryRegions.find(
        (region) => region['_id'] === value
      );
      if (selectedRegion) {
        setSelectedRegion(selectedRegion);
      }
    }
  };

  useEffect(() => {
    if (
      isDeliveryChargeExists(
        regionDeliveryCharge.length > 0 && regionDeliveryCharge
      )
    ) {
      const deliveryRegions = regionDeliveryCharge;

      const selectedRegion = deliveryRegions.find(
        (region, index) => 0 === index
      );
      if (selectedRegion) {
        setDeliveryRegionName(selectedRegion['name']);
        setSelectedRegion(selectedRegion);
      }
    }
  }, [regionDeliveryCharge]);

  useEffect(() => {
    const setProducts = async () => {
      const productListRes = await handleProductListFetch({
        urlOptions: {
          params: {
            sortItem: 'added',
            sortOrderValue: '-1',
            productType: 'product',
            pageNumber: 1
          },
        },
      });
    };

    setProducts();
  }, []);

  useEffect(() => {
    const setCustomers = async () => {
      const customerListRes = await handleCustomerListFetch({});
    };
    setCustomers();
  }, []);

  const next = () => {
    const newCurrent = current + 1;
    setCurrent(newCurrent);
  };

  const prev = () => {
    const newCurrent = current - 1;
    setCurrent(newCurrent);
  };

  const handleCheckoutSubmit = async (values: any, actions: any) => {
    const products =
      productList && productList.length > 0
        ? productList.map((item) => {
          return {
            product: item._id,
            quantity: item.quantity,
            variation: item.variation,
          };
        })
        : [];

    const addOrderRes = await handleOrderFetch({
      body: {
        shippingAddress: {
          phone: values.phone,
          email: values.email,
          address1: values.address1,
          address2: values.address2,
          firstName: values.firstName,
          lastName: values.lastName,
          city: selectedCityValue || selectedCustomerData['city'],
          country: selectedCountryValue || selectedCustomerData['country'],
        },
        items: products,
        delivery: deliveryRegionName,
        customerId: customerId,
        // charge
      },
    });

    // @ts-ignore
    if (addOrderRes && addOrderRes.status === 'ok') {
      // openSuccessNotification();

      actions.resetForm();

      setCurrent(0);
      setProductIds([]);
      setProductList([]);
      setCustomerId([]);
      setselectedCityValue('');
      setselectedCountryValue('');
      setDeliveryRegionName('');
      setSelectedRegion({});
      setregionDeliveryCharge([]);
      setSelectedCustomerData({});
    } else {
      openErrorNotification("Couldn't create order, Something went wrong");
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!addOrderState['isLoading']) {
      const error = addOrderState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
        if (error['error']['registerError']) {
          // setServerErrors(error['error']['registerError']);
        } else if (error['error']['checkoutError']) {
          // setServerErrors(error['error']['checkoutError']);
        } else {
          // setServerErrors(error['error']);
        }

        const errors =
          Object.values(error['error']).length > 0
            ? Object.values(error['error'])
            : [];
        errors.forEach((err, i) => {
          if (typeof err === 'string') {
            openErrorNotification(err);
          } else if (typeof err === 'object') {
            if (err && Object.keys(err).length > 0) {
              const errs = Object.values(err);
              errs.forEach((err) => {
                openErrorNotification(err);
              });
            }
          }
        });
      }
    }

    if (
      !addOrderState['isLoading'] &&
      Object.keys(addOrderState.data).length > 0
    ) {
      if (addOrderState['data']['status'] === 'ok') {
        openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })

        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [addOrderState]);

  const onChangeCity = (value) => {
    setselectedCityValue(value);
  };

  const onChangeCountry = (value) => {
    setselectedCountryValue(value);
  };

  useEffect(() => {
    const setCountries = async () => {
      const CountryListRes = await handleCountryListFetch({});

      // @ts-ignore
      if (CountryListRes && CountryListRes.length > 0) {
        // @ts-ignore
        const countryOptions = CountryListRes.map((country) => {
          return {
            value: country.id,
            name: country.name,
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
            name: city.name,
          };
        });
        setcityOptions(cityOptions);
      }
    };

    setCities();
  }, [selectedCountryValue]);

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!isValid || !values.name || !values.pickUpLocation || !values.time) {
      return true;
    }
    return false;
  };

  const handleAddDeliveryCharge = () => { };

  useEffect(() => {
    if (productIds && productIds.length > 0 && productList) {
      if (productIds.length > productList.length) {
        const variation =
          productIds[productIds.length - 1]['pricing'] &&
          productIds[productIds.length - 1]['pricing'].length > 0 &&
          productIds[productIds.length - 1]['pricing'][0]['_id'];

        setProductList([
          ...productList,
          {
            ...productIds[productIds.length - 1],
            _id: productIds[productIds.length - 1]['id'],
            variation: variation,
            quantity: 1,
          },
        ]);
      } else if (productIds.length < productList.length) {
        console.log('productIds', productIds);
        console.log('productList', productList);

        const newProductList = productList.filter((item) => {
          let isTrue = false;
          productIds.forEach((product) => {
            if (product.id === item._id) {
              isTrue = true;
            }
          });
          return isTrue;
        });
        setProductList(newProductList);
      }
    } else {
      setProductList([]);
    }
    // console.log('productIds', productIds)
  }, [productIds]);

  // console.log('productList', productList)
  console.log('selectedCustomerData', selectedCustomerData);



  const handleSearch = (value) => {
    if (value === '') {
      setregionDeliveryCharge(deliveryRegionState.data || []);
    }
    else {
      if (deliveryRegionState?.data?.length > 0) {
        console.log({ 'deliveryRegionState.data': deliveryRegionState.data });
        const newRegionDeliveryCharge = deliveryRegionState?.data?.filter(item => item.name?.toLowerCase()?.includes(value?.toLowerCase()));
        console.log({ 'delivery.data': newRegionDeliveryCharge });

        setregionDeliveryCharge(newRegionDeliveryCharge || [])
      }
    }
  };



  return (
    <Formik
      onSubmit={(values, actions) => handleCheckoutSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...initialValues, ...selectedCustomerData }}
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
            <div className='addOrderContainer'>
              <h3>Add New Order</h3>
              <div className='addOrderContainer__container'>
                <Steps current={current}>
                  {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>

                {current === 0 && (
                  <div className='addOrderContainer__container-OrderInfoContainer'>
                    <div className='addOrderContainer__container-OrderInfoContainer-left'>
                      <h3 style={{}} className='addOrderContainer-sectionTitle'>
                        <span>
                          <UserOutlined />
                        </span>
                      Customers And products
                    </h3>

                      <div
                        style={{
                          marginTop: '15px',
                        }}
                      ></div>

                      <h4 className='inputFieldLabel'>Customer</h4>
                      <CustomersId
                        customerListState={customerListState}
                        setSelectedCustomerData={setSelectedCustomerData}
                        setCustomerId={setCustomerId}
                      />
                      <div
                        style={{
                          marginTop: '15px',
                        }}
                      ></div>
                      <h4 className='inputFieldLabel'>Products</h4>
                      <AddProducts
                        productListState={productListState}
                        productIds={productIds}
                        setProductIds={setProductIds}
                      />
                    </div>
                    <div className='addOrderContainer__container-OrderInfoContainer-right'>
                      <AddNewOrderSummary
                        setProductList={setProductList}
                        productList={productList}
                      />
                    </div>
                  </div>
                )}

                {current === 1 && (
                  <div className='addOrderContainer__container-address'>
                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <Input
                          label='First Name'
                          value={values.firstName}
                          name='firstName'
                          isError={
                            (touched.firstName && errors.firstName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['firstName'])
                          }
                          errorString={
                            (touched.firstName && errors.firstName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['firstName'])
                          }
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
                          isError={
                            (touched.lastName && errors.lastName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['lastName'])
                          }
                          errorString={
                            (touched.lastName && errors.lastName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['lastName'])
                          }
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
                          isError={
                            (touched.phone && errors.phone) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['phone'])
                          }
                          errorString={
                            (touched.phone && errors.phone) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['phone'])
                          }
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
                          isError={
                            (touched.email && errors.email) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['email'])
                          }
                          errorString={
                            (touched.email && errors.email) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['email'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('email');
                          }}
                        />
                      </div>
                    </div>

                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <h3 className='inputFieldLabel'>Country</h3>

                        <Form.Item
                          validateStatus={
                            addOrderState.error['error']['country'] ? 'error' : ''
                          }
                          help={addOrderState.error['error']['country']}
                        // noStyle={true}
                        >
                          <Select
                            defaultValue={values.country}
                            notFoundContent={
                              <Empty
                                description='No Country Found'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder='Select a Country'
                            optionFilterProp='children'
                            onChange={onChangeCountry}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {countryListState.done &&
                              countryListState.data.length > 0 &&
                              countryOptions.map((option) => {
                                return (
                                  <Option value={option.value}>
                                    {option.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='dubbleRowInputs__item'>
                        <h3 className='inputFieldLabel'>City</h3>
                        <Form.Item
                          // noStyle={true}
                          validateStatus={
                            addOrderState.error['error']['city'] ? 'error' : ''
                          }
                          help={addOrderState.error['error']['city']}
                        >
                          <Select
                            defaultValue={values.city}
                            className='selectClassName'
                            notFoundContent={
                              <Empty
                                description='First Select a Country'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder='Select a city'
                            optionFilterProp='children'
                            onChange={onChangeCity}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {cityListState.done &&
                              cityListState.data.length > 0 &&
                              cityOptions.map((option) => {
                                return (
                                  <Option value={option.value}>
                                    {option.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                      }}
                    ></div>

                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <Input
                          label='Address'
                          value={values.address1}
                          name='address1'
                          isError={
                            (touched.address1 && errors.address1) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address1'])
                          }
                          errorString={
                            (touched.address1 && errors.address1) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address1'])
                          }
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
                          isError={
                            (touched.address2 && errors.address2) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address2'])
                          }
                          errorString={
                            (touched.address2 && errors.address2) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address2'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('address2');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {current === 10 && (
                  <div className='addOrderContainer__container-address'>
                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <Input
                          label='First Name'
                          value={values.firstName}
                          name='firstName'
                          isError={
                            (touched.firstName && errors.firstName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['firstName'])
                          }
                          errorString={
                            (touched.firstName && errors.firstName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['firstName'])
                          }
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
                          isError={
                            (touched.lastName && errors.lastName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['lastName'])
                          }
                          errorString={
                            (touched.lastName && errors.lastName) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['lastName'])
                          }
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
                          isError={
                            (touched.phone && errors.phone) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['phone'])
                          }
                          errorString={
                            (touched.phone && errors.phone) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['phone'])
                          }
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
                          isError={
                            (touched.email && errors.email) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['email'])
                          }
                          errorString={
                            (touched.email && errors.email) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['email'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('email');
                          }}
                        />
                      </div>
                    </div>

                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <h3 className='inputFieldLabel'>Country</h3>

                        <Form.Item
                          validateStatus={
                            addOrderState.error['error']['country'] ? 'error' : ''
                          }
                          help={addOrderState.error['error']['country']}
                        // noStyle={true}
                        >
                          <Select
                            defaultValue={'Comoros'}
                            notFoundContent={
                              <Empty
                                description='No Country Found'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder='Select a Country'
                            optionFilterProp='children'
                            onChange={onChangeCountry}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {countryListState.done &&
                              countryListState.data.length > 0 &&
                              countryOptions.map((option) => {
                                return (
                                  <Option value={option.value}>
                                    {option.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className='dubbleRowInputs__item'>
                        <h3 className='inputFieldLabel'>City</h3>
                        <Form.Item
                          // noStyle={true}
                          validateStatus={
                            addOrderState.error['error']['city'] ? 'error' : ''
                          }
                          help={addOrderState.error['error']['city']}
                        >
                          <Select
                            defaultValue={'Dhaka'}
                            className='selectClassName'
                            notFoundContent={
                              <Empty
                                description='First Select a Country'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            }
                            showSearch
                            style={{ width: '100%' }}
                            placeholder='Select a city'
                            optionFilterProp='children'
                            onChange={onChangeCity}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {cityListState.done &&
                              cityListState.data.length > 0 &&
                              cityOptions.map((option) => {
                                return (
                                  <Option value={option.value}>
                                    {option.name}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                      }}
                    ></div>

                    <div className='dubbleRowInputs'>
                      <div className='dubbleRowInputs__item'>
                        <Input
                          label='Address'
                          value={values.address1}
                          name='address1'
                          isError={
                            (touched.address1 && errors.address1) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address1'])
                          }
                          errorString={
                            (touched.address1 && errors.address1) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address1'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('address1');
                          }}
                        />
                      </div>
                      <div className='dubbleRowInputs__item'>
                        <Input
                          label='More specific address'
                          value={values.address2}
                          name='address2'
                          isError={
                            (touched.address2 && errors.address2) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address2'])
                          }
                          errorString={
                            (touched.address2 && errors.address2) ||
                            (!isSubmitting &&
                              addOrderState.error['error']['address2'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('address2');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {current === 2 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '40px',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <AddNewOrderSummary
                      setProductList={setProductList}
                      productList={productList}
                    />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <h3
                        style={{
                          marginTop: '20px',
                          display: 'inline-block',
                          textAlign: 'center',
                        }}
                        className='addOrderContainer-sectionTitle'
                      >
                        <span>
                          <CarOutlined />
                        </span>
                      Delivery Region List ({selectedCityValue})
                    </h3>

                      <Search
                        style={{
                          marginTop: '15px'
                        }}
                        enterButton={false}
                        className="searchbarClassName"
                        placeholder="search region.."
                        onChange={(e) => handleSearch(e.target.value)}
                      />

                      {regionDeliveryCharge && regionDeliveryCharge.length > 0 ? (
                        <>
                          <Radio.Group
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              flexWrap: 'wrap',
                            }}
                            value={deliveryRegionName}
                            defaultValue={deliveryRegionName}
                            name='radiogroup'
                          >
                            {regionDeliveryCharge.map((deliveryRegionItem) => {
                              return (
                                <div
                                  onClick={() =>
                                    handleDeviliveryRegionChange(
                                      deliveryRegionItem._id
                                    )
                                  }
                                  className='deliveryRegionLabelContainer'
                                >
                                  <div className='deliveryRegionLabelContainer__radio'>
                                    <Radio value={deliveryRegionItem._id}></Radio>
                                  </div>
                                  <div className='deliveryRegionLabelContainer__info'>
                                    <h3>{deliveryRegionItem.name}</h3>
                                    <h4>
                                      <span>
                                        <CarOutlined />
                                      </span>
                                      {deliveryRegionItem.pickUpLocation}
                                    </h4>
                                    <h4>
                                      <span>
                                        <ClockCircleOutlined />
                                      </span>
                                      {deliveryRegionItem.time}
                                    </h4>
                                  </div>
                                </div>
                              );
                            })}
                          </Radio.Group>
                        </>
                      ) : (
                          <>
                            <h4
                              style={{
                                textAlign: 'center',
                                color: '#777',
                                marginTop: '50px',
                              }}
                            >
                              Delivery not found
                        </h4>
                          </>
                        )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        marginTop: '40px',
                        marginBottom: '50px',
                      }}
                    >
                      <Button
                        loading={addOrderState.isLoading}
                        style={{
                          marginTop: '10px',
                          marginLeft: '15px',
                        }}
                        className='btnPrimaryClassNameoutline-blue'
                        onClick={(e: any) => handleSubmit(e)}
                      >
                        Place Order
                      <CaretRightOutlined />
                      </Button>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {current > 0 && (
                    <Button
                      style={{ marginRight: '15px', marginTop: '10px' }}
                      // type="primary"
                      className='btnPrimaryClassNameoutline'
                      type='primary'
                      onClick={() => prev()}
                    >
                      <CaretLeftOutlined /> Previous
                    </Button>
                  )}

                  {current < steps.length - 1 && (
                    <>
                      <div>
                        <Button
                          style={{
                            marginTop: '10px',
                          }}
                          className='btnPrimaryClassNameoutline'
                          type='primary'
                          onClick={() => {
                            if (current === 1) {
                              setCurrent(2);
                            } else {
                              next();
                            }
                          }}
                        >
                          Next
                        <CaretRightOutlined />
                        </Button>

                        {/* {current === 1 && <Button
													style={{
														marginTop: '10px',
														marginLeft: '15px'
													}}

													className='btnPrimaryClassNameoutline'
													type="primary" onClick={() => setCurrent(2)}
												>
													Use different address< CaretRightOutlined />

												</Button>
												} */}
                      </div>
                    </>
                  )}

                  {/* {current === steps.length - 1 && (
										<Button
											style={{
												marginTop: '10px',
												marginLeft: '15px'
											}}

											className='btnPrimaryClassNameoutline'
											type="primary" onClick={(e: any) => handleSubmit(e)}
										>
											Place Order
											<CaretRightOutlined />

										</Button>
									)} */}
                </div>

                {/* <div className='addOrderContainer__container-left'>
								
								</div>
								<div className='addOrderContainer__container-right'>
									<AddNewOrderSummary />
								</div> */}
              </div>
            </div>
          </>
        )}
    </Formik>
  );
};

export default AddNewOrder;
