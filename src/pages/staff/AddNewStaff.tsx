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
import DatePicker from '../../components/Field/DatePicker';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  //   firstName: Yup.string()
  //     .label('First name')
  //     .required()
  //     .min(2, 'First name must have at least 2 characters '),
  //   lastName: Yup.string()
  //     .label('Lastname')
  //     .required()
  //     .min(2, 'Last name must have at least 2 characters '),
  //   phone: Yup.string()
  //     .required('Please tell us your mobile number.')
  //     .max(13, 'Please enter a valid mobile number.'),
  //   password: Yup.string()
  //     .label('Password')
  //     .required()
  //     .min(6, 'Password must have at least 6 characters'),
  //   address1: Yup.string()
  //     .label('Address line 1')
  //     .required()
  //     .min(3, 'Address line 1 must have at least 3 characters '),
  //   email: Yup.string().label('Email').email('Please enter a valid email'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  address: '',
  salary: null,
  designation: '',
  fatherName: '',
  motherName: '',
  NID: '',
  phone: '',
  email: '',
  additionalInfo: '',
  joiningDate: '',
};

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Staff Created',
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
    'addStaff'
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
  const [time, setTimeFeild] = useState('');

  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const handleSubmit = async (values: any, actions: any) => {
    const addCustomerRes = await handleAddCustomerFetch({
      body: {
        phone: values.phone,
        email: values.email.trim(),
        password: values.password,
        address: values.address.trim(),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        additionalInfo: values.additionalInfo.trim(),
        NID: values.NID,
        fatherName: values.fatherName.trim(),
        motherName: values.motherName.trim(),
        salary: values.salary,
        designation: values.designation.trim(),
        joiningDate: time,
      },
    });

    // @ts-ignore
    if (addCustomerRes && addCustomerRes.status === 'ok') {
      openSuccessNotification();

      console.log('addCustomerRes', addCustomerRes);
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

  useEffect(() => {
    if (!addCustomerState['isLoading']) {
      const error = addCustomerState['error'];
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
      !addCustomerState['isLoading'] &&
      Object.keys(addCustomerState.data).length > 0
    ) {
      if (addCustomerState['data']['status'] === 'ok') {
        // openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })
        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [addCustomerState]);

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
  const handleTimeChange = (date, dateString) => {
    setTimeFeild(dateString);
    // console.log('date', date, dateString);
  };
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
            title='Add New Staff'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Create'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              //   disabled: getisSubmitButtonDisabled(values, isValid),
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
                  label='Designation *'
                  value={values.designation}
                  name='designation'
                  isError={
                    (touched.designation && errors.designation) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['designation'])
                  }
                  errorString={
                    (touched.designation && errors.designation) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['designation'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('designation');
                  }}
                />
              </div>
              <div className='dubbleRowInputs__item'>
                <Input
                  min={0}
                  type={'number'}
                  label='Salary *'
                  value={values.salary}
                  name='salary'
                  isError={
                    (touched.salary && errors.salary) ||
                    (!isSubmitting && addCustomerState.error['error']['salary'])
                  }
                  errorString={
                    (touched.salary && errors.salary) ||
                    (!isSubmitting && addCustomerState.error['error']['salary'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('salary');
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
                  label='NID'
                  value={values.NID}
                  name='NID'
                  isError={
                    (touched.NID && errors.NID) ||
                    (!isSubmitting && addCustomerState.error['error']['NID'])
                  }
                  errorString={
                    (touched.NID && errors.NID) ||
                    (!isSubmitting && addCustomerState.error['error']['NID'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('NID');
                  }}
                />
              </div>
            </div>

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Father Name'
                  value={values.fatherName}
                  name='fatherName'
                  isError={
                    (touched.fatherName && errors.fatherName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['fatherName'])
                  }
                  errorString={
                    (touched.fatherName && errors.fatherName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['fatherName'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('fatherName');
                  }}
                />
              </div>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Mother Name'
                  value={values.motherName}
                  name='motherName'
                  isError={
                    (touched.motherName && errors.motherName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['motherName'])
                  }
                  errorString={
                    (touched.motherName && errors.motherName) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['motherName'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('motherName');
                  }}
                />
              </div>
            </div>

            <div className='dubbleRowInputs'>
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

              <div className='dubbleRowInputs__item'>
                <DatePicker
                  date={time}
                  placeholder='10/20/2020'
                  label='joining Date'
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Address'
                  value={values.address}
                  name='address'
                  isError={
                    (touched.address && errors.address) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['address'])
                  }
                  errorString={
                    (touched.address && errors.address) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['address'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('address');
                  }}
                />
              </div>

              <div className='dubbleRowInputs__item'>
                <Input
                  label='Additional Info'
                  value={values.additionalInfo}
                  name='additionalInfo'
                  isError={
                    (touched.additionalInfo && errors.additionalInfo) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['additionalInfo'])
                  }
                  errorString={
                    (touched.additionalInfo && errors.additionalInfo) ||
                    (!isSubmitting &&
                      addCustomerState.error['error']['additionalInfo'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('additionalInfo');
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
