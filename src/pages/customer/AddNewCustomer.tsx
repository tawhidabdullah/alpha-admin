import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import {
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Modal,
  Empty,
  Form,
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
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  // firstName: Yup.string()
  // 	.label('First name')
  // 	.required()
  // 	.min(2, 'First name must have at least 2 characters '),
  // lastName: Yup.string()
  // 	.label('Lastname')
  // 	.required()
  // 	.min(2, 'Last name must have at least 2 characters '),
  // phone: Yup.string()
  // 	.required('Please tell us your mobile number.')
  // 	.max(13, 'Please enter a valid mobile number.'),
  // password: Yup.string()
  // 	.label('Password')
  // 	.required()
  // 	.min(6, 'Password must have at least 6 characters'),
  // address1: Yup.string()
  // 	.label('Address line 1')
  // 	.required()
  // 	.min(3, 'Address line 1 must have at least 3 characters '),
  // email: Yup.string().label('Email').email('Please enter a valid email'),
});

const initialValues = {
  phone: '',
  email: '',
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  zipCode: '',
  password: '',
};

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Customer Created!',
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
  addNewCategoryVisible: any;
  setAddNewCategoryVisible: any;
  customerList?: any;
  setCustomerList?: any;
}

const AddNewCategory = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  customerList,
  setCustomerList,
}: Props) => {
  const [addCustomerState, handleAddCustomerFetch] = useHandleFetch(
    {},
    'addCustomer'
  );
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

  const handleSubmit = async (values: any, actions: any) => {
    const addCustomerRes = await handleAddCustomerFetch({
      body: {
        phone: values.phone,
        email: values.email,
        password: values.password,
        address1: values.address1,
        address2: values.address2,
        firstName: values.firstName,
        lastName: values.lastName,
        country: selectedCountryValue,
        city: selectedCityValue,
      },
    });

    // @ts-ignore
    if (addCustomerRes && addCustomerRes.status === 'ok') {
      openSuccessNotification();

      setCustomerList([
        {
          id: addCustomerRes['_id'] || '',
          key: addCustomerRes['_id'] || '',
          name: addCustomerRes['firstName'] + ' ' + addCustomerRes['lastName'],
          // @ts-ignore
          ...addCustomerRes,
        },
        ...customerList,
      ]);
      setAddNewCategoryVisible(false);
      actions.resetForm();
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

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
            value: country.name,
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

  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (
      !isValid ||
      !values.firstName ||
      !values.lastName ||
      !values.password ||
      !values.phone ||
      !values.address1
    ) {
      return true;
    }
    return false;
  };

  console.log('cityListState', cityListState);

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...initialValues }}
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
              margin: '0',
              padding: '10px',
            }}
            title='Add New Customer'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Create'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              // disabled: getisSubmitButtonDisabled(values, isValid)
            }}
          >
            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='First Name *'
                  value={values.firstName}
                  name='firstName'
                  isError={
                    (touched.firstName && errors.firstName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['firstName'])
                  }
                  errorString={
                    (touched.firstName && errors.firstName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['firstName'])
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
                      addCustomerState.error['error']['lastName'])
                  }
                  errorString={
                    (touched.lastName && errors.lastName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['lastName'])
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
                    (!isSubmitting && addCustomerState.error['error']['phone'])
                  }
                  errorString={
                    (touched.phone && errors.phone) ||
                    (!isSubmitting && addCustomerState.error['error']['phone'])
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
                    (!isSubmitting && addCustomerState.error['error']['email'])
                  }
                  errorString={
                    (touched.email && errors.email) ||
                    (!isSubmitting && addCustomerState.error['error']['email'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('email');
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginRight: '10px',
              }}
            >
              <Input
                label='Password'
                type='password'
                value={values.password}
                name='password'
                isError={
                  (touched.password && errors.password) ||
                  (!isSubmitting && addCustomerState.error['error']['password'])
                }
                errorString={
                  (touched.password && errors.password) ||
                  (!isSubmitting && addCustomerState.error['error']['password'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('password');
                }}
              />
            </div>

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <h3 className='inputFieldLabel'>Country</h3>

                <Form.Item
                  validateStatus={
                    addCustomerState.error['error']['country'] ? 'error' : ''
                  }
                  help={addCustomerState.error['error']['country']}
                  // noStyle={true}
                >
                  <Select
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
                          <Option value={option.value}>{option.name}</Option>
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
                    addCustomerState.error['error']['city'] ? 'error' : ''
                  }
                  help={addCustomerState.error['error']['city']}
                >
                  <Select
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
                          <Option value={option.value}>{option.name}</Option>
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
                      addCustomerState.error['error']['address1'])
                  }
                  errorString={
                    (touched.address1 && errors.address1) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['address1'])
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
                      addCustomerState.error['error']['address2'])
                  }
                  errorString={
                    (touched.address2 && errors.address2) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['address2'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('address2');
                  }}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddNewCategory;
