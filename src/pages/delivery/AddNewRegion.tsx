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
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import DeliveryCharge from './DeliveryCharge';

const { Option } = Select;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'New Region Added',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

const validationSchema = Yup.object().shape({});

const initialValues = {
  name: '',
  pickUpLocation: '',
  time: '',
};

interface Props {
  addNewCategoryVisible: any;
  setAddNewCategoryVisible: any;
  regionList?: any;
  setRegionList?: any;
}

const AddNewRegion = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  regionList,
  setRegionList,
}: Props) => {
  const [addRegionState, handleRegionFetch] = useHandleFetch({}, 'addRegion');
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

  const [deliveryChargeList, setdeliveryChargeList] = useState([
    {
      minimumOrder: '',
      charge: '',
      id: `${Math.floor(100000 + Math.random() * 900000)}`,
    },
  ]);

  const handleSubmit = async (values: any, actions: any) => {
    // console.log('selectedCityValue', selectedCityValue)

    if (deliveryChargeList.length > 0) {
      const charge = {};

      for (let item of deliveryChargeList) {
        if (charge[item['minimumOrder']] !== '' && item['charge'] !== '') {
          charge[item['minimumOrder']] = item['charge'];
        }
      }

      const addRegionRes = await handleRegionFetch({
        body: {
          name: values.name,
          pickUpLocation: values.pickUpLocation,
          time: values.time,
          country: selectedCountryValue,
          city: selectedCityValue,
          charge,
        },
      });

      // @ts-ignore
      if (addRegionRes && addRegionRes.status === 'ok') {
        openSuccessNotification();

        setRegionList([
          {
            id: addRegionRes['_id'] || '',
            key: addRegionRes['_id'] || '',
            name: addRegionRes['name'] || '',
            // @ts-ignore
            ...addRegionRes,
          },
          ...regionList,
        ]);
        setAddNewCategoryVisible(false);
        actions.resetForm();
      } else {
        openErrorNotification();
      }
    } else {
      const addRegionRes = await handleRegionFetch({
        body: {
          name: values.name,
          pickUpLocation: values.pickUpLocation,
          time: values.time,
          country: selectedCountryValue,
          city: selectedCityValue,
          charge: {},
        },
      });

      // @ts-ignore
      if (addRegionRes && addRegionRes.status === 'ok') {
        openSuccessNotification();

        setRegionList([
          ...regionList,
          {
            id: addRegionRes['id'] || '',
            key: addRegionRes['id'] || '',
            name: addRegionRes['name'] || '',
            // @ts-ignore
            ...addRegionRes,
          },
        ]);
        setAddNewCategoryVisible(false);
        actions.resetForm();
      } else {
        openErrorNotification();
      }
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

  useEffect(() => {
    if (!addRegionState['isLoading']) {
      const error = addRegionState['error'];
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
      !addRegionState['isLoading'] &&
      Object.keys(addRegionState.data).length > 0
    ) {
      if (addRegionState['data']['status'] === 'ok') {
        // openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })
        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [addRegionState]);

  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!isValid || !values.name || !values.pickUpLocation || !values.time) {
      return true;
    }
    return false;
  };

  console.log('region----deliveryChargeList', deliveryChargeList);

  const handleAddDeliveryCharge = () => {
    setdeliveryChargeList([
      ...deliveryChargeList,
      {
        minimumOrder: '',
        charge: '',
        id: `${Math.floor(100000 + Math.random() * 900000)}`,
      },
    ]);
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
            title='Add New Region'
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
                  label='Name'
                  value={values.name}
                  name='name'
                  isError={
                    (touched.name && errors.name) ||
                    (!isSubmitting && addRegionState.error['error']['name'])
                  }
                  errorString={
                    (touched.name && errors.name) ||
                    (!isSubmitting && addRegionState.error['error']['name'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('name');
                  }}
                />
              </div>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Pick up Location'
                  value={values.pickUpLocation}
                  name='pickUpLocation'
                  isError={
                    (touched.pickUpLocation && errors.pickUpLocation) ||
                    (!isSubmitting &&
                      addRegionState.error['error']['pickUpLocation'])
                  }
                  errorString={
                    (touched.pickUpLocation && errors.pickUpLocation) ||
                    (!isSubmitting &&
                      addRegionState.error['error']['pickUpLocation'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('pickUpLocation');
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
                label='Time'
                value={values.time}
                name='time'
                isError={
                  (touched.time && errors.time) ||
                  (!isSubmitting && addRegionState.error['error']['time'])
                }
                errorString={
                  (touched.time && errors.time) ||
                  (!isSubmitting && addRegionState.error['error']['time'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('time');
                }}
              />
            </div>

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <h3 className='inputFieldLabel'>Country</h3>
                <Form.Item
                  validateStatus={
                    addRegionState.error['error']['country'] ? 'error' : ''
                  }
                  help={addRegionState.error['error']['country']}
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
                  validateStatus={
                    addRegionState.error['error']['city'] ? 'error' : ''
                  }
                  help={addRegionState.error['error']['city']}
                >
                  <Select
                    notFoundContent={
                      <Empty
                        description='First Select a Country'
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    }
                    mode='multiple'
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
            <h3 className='inputFieldLabel'>Delivery Charges</h3>

            <Form.Item
              validateStatus={
                addRegionState.error['error']['charge'] ? 'error' : ''
              }
              help={addRegionState.error['error']['charge']}
            >
              {deliveryChargeList.map((deliveryChargeItem) => {
                console.log('deliveryChargeItem-region', deliveryChargeItem);
                return (
                  <DeliveryCharge
                    deliveryChargeItem={deliveryChargeItem}
                    deliveryChargeList={deliveryChargeList}
                    setdeliveryChargeList={setdeliveryChargeList}
                  />
                );
              })}
            </Form.Item>

            <div
              style={{
                marginTop: '5px',
              }}
            ></div>
            <Button
              size='middle'
              onClick={handleAddDeliveryCharge}
              type='dashed'
              icon={<PlusOutlined />}
            >
              Add Charge
            </Button>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddNewRegion;
