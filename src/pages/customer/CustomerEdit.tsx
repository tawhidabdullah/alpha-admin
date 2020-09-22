import React, { useState, useEffect } from 'react';
import { Modal, Select, notification, Empty, Form } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import { useHandleFetch } from '../../hooks';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  // firstName: Yup.string()
  //     .label('Firstname')
  //     .required()
  //     .min(2, 'First name must have at least 2 characters '),
  // lastName: Yup.string()
  //     .label('Lastname')
  //     .required()
  //     .min(2, 'Lastname must have at least 2 characters '),
  // phone: Yup.string()
  //     .required('Please tell us your mobile number.')
  //     .max(13, 'Please enter a valid mobile number.'),
  // address1: Yup.string()
  //     .label('Address line 1')
  //     .required()
  //     .min(3, 'Address line 1 must have at least 3 characters '),
  // email: Yup.string().label('Email').email('Please enter a valid email'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Customer Updated',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

interface Props {
  customer: any;
  setvisible: any;
  visible: any;
  setCustomerDetailData: any;
}

const initialValues = {
  phone: '',
  email: '',
  address1: '',
  firstName: '',
  lastName: '',
  dealerCode: '',
};

const QuickEdit = ({
  customer,
  setvisible,
  visible,
  setCustomerDetailData,
}: Props) => {
  const [updateCustomerState, handleUpdateCustomerFetch] = useHandleFetch(
    {},
    'updateCustomer'
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

  const handleSubmit = async (values: any, actions: any) => {
    const updateCustomerRes = await handleUpdateCustomerFetch({
      urlOptions: {
        placeHolders: {
          id: values.id,
        },
      },
      body: {
        phone: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        address1: values.address1.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName,
        country: selectedCountryValue || customer.country,
        city: selectedCityValue || customer.city,
        dealerCode: values.dealerCode.trim(),
      },
    });

    // @ts-ignore
    if (updateCustomerRes && updateCustomerRes.status === 'ok') {
      openSuccessNotification();

      setCustomerDetailData({
        // @ts-ignore
        ...updateCustomerRes,
        id: values.id,
        name: updateCustomerRes.firstName + ' ' + updateCustomerRes.lastName,
      });

      setvisible(false);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!updateCustomerState['isLoading']) {
      const error = updateCustomerState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
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
  }, [updateCustomerState]);

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
  }, [customer]);

  useEffect(() => {
    const setCities = async () => {
      const cityListRes = await handleCityListFetch({
        urlOptions: {
          placeHolders: {
            country: selectedCountryValue || customer.country,
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
  }, [customer.country, selectedCountryValue]);

  const handleCancel = (e: any) => {
    setvisible(false);
  };

  console.log('realCustomer', customer);

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (
      !isValid ||
      !values.firstName ||
      !values.lastName ||
      !values.phone ||
      !values.address1
    ) {
      return true;
    }
    return false;
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...initialValues, ...customer }}
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
            title='Customer Edit'
            visible={visible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              // disabled: getisSubmitButtonDisabled(values, isValid)
            }}
            bodyStyle={{
              margin: '0',
              padding: '10px',
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
                      updateCustomerState.error['error']['firstName'])
                  }
                  errorString={
                    (touched.firstName && errors.firstName) ||
                    (!isSubmitting &&
                      updateCustomerState.error['error']['firstName'])
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
                      updateCustomerState.error['error']['lastName'])
                  }
                  errorString={
                    (touched.lastName && errors.lastName) ||
                    (!isSubmitting &&
                      updateCustomerState.error['error']['lastName'])
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
                  label='Phone *'
                  value={values.phone}
                  name='phone'
                  isError={
                    (touched.phone && errors.phone) ||
                    (!isSubmitting &&
                      updateCustomerState.error['error']['phone'])
                  }
                  errorString={
                    (touched.phone && errors.phone) ||
                    (!isSubmitting &&
                      updateCustomerState.error['error']['phone'])
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
                      updateCustomerState.error['error']['email'])
                  }
                  errorString={
                    (touched.email && errors.email) ||
                    (!isSubmitting &&
                      updateCustomerState.error['error']['email'])
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
                label='Referral Code'
                value={values.dealerCode}
                name='dealerCode'
                isError={
                  (touched.dealerCode && errors.dealerCode) ||
                  (!isSubmitting &&
                    updateCustomerState.error['error']['dealerCode'])
                }
                errorString={
                  (touched.dealerCode && errors.dealerCode) ||
                  (!isSubmitting &&
                    updateCustomerState.error['error']['dealerCode'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('dealerCode');
                }}
              />
            </div>

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <h3 className='inputFieldLabel'>Country *</h3>

                <Form.Item
                  validateStatus={
                    updateCustomerState.error['error']['country'] ? 'error' : ''
                  }
                  help={updateCustomerState.error['error']['country']}
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
                    defaultValue={customer && customer.country}
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
                <h3 className='inputFieldLabel'>City *</h3>
                <Form.Item
                  // noStyle={true}
                  validateStatus={
                    updateCustomerState.error['error']['city'] ? 'error' : ''
                  }
                  help={updateCustomerState.error['error']['city']}
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
                    defaultValue={customer && customer.city}
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
                marginRight: '10px',
              }}
            >
              <Input
                label='Address *'
                value={values.address1}
                name='address1'
                isError={
                  (touched.address1 && errors.address1) ||
                  (!isSubmitting &&
                    updateCustomerState.error['error']['address1'])
                }
                errorString={
                  (touched.address1 && errors.address1) ||
                  (!isSubmitting &&
                    updateCustomerState.error['error']['address1'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('address1');
                }}
              />
            </div>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default QuickEdit;
