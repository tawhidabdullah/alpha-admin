import React, { useState, useEffect } from 'react';
import { Modal, Select, notification, Button, Form } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  CheckCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import { useHandleFetch } from '../../hooks';
import DeliveryCharge from './DeliveryCharge';
import { category } from '../../state/ducks';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  // name: Yup.string()
  // 	.label('Name')
  // 	.required()
  // 	.min(2, 'Name must have at least 2 characters '),
  // pickUpLocation: Yup.string()
  // 	.label('Pick up Location')
  // 	.required()
  // 	.min(2, 'Pick up Location must have at least 2 characters '),
  // time: Yup.string()
  // 	.label('Time')
  // 	.required()
  // 	.min(2, 'Time must have at least 2 characters '),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Region Updated!',
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
  regionList?: any;
  setRegionList?: any;
}

const QuickEdit = ({
  customer,
  setvisible,
  visible,
  setRegionList,
  regionList,
}: Props) => {
  const [updateRegionState, handleUpdateRegionFetch] = useHandleFetch(
    {},
    'updateRegion'
  );

  console.log('DeliveryRegion', customer);

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

  const [deliveryChargeList, setdeliveryChargeList] = useState([]);

  useEffect(() => {
    if (customer.charge && Object.keys(customer.charge).length > 0) {
      const deliveryChargeListFromRegionDetail = [];
      const chargeKeys = Object.keys(customer.charge);
      chargeKeys.forEach((chargeKey) => {
        deliveryChargeListFromRegionDetail.push({
          minimumOrder: chargeKey,
          charge: customer.charge[chargeKey],
          id: `${Math.floor(100000 + Math.random() * 900000)}`,
        });
      });
      setdeliveryChargeList(deliveryChargeListFromRegionDetail);
    }
  }, [customer]);

  console.log('deliveryCharge333', customer);

  const handleSubmit = async (values: any, actions: any) => {
    // console.log('selectedCityValue',selectedCityValue)
    const charge = {};

    if (deliveryChargeList.length > 0) {
      for (let item of deliveryChargeList) {
        if (charge[item['minimumOrder']] !== '' && item['charge'] !== '') {
          charge[item['minimumOrder']] = item['charge'];
        }
      }
    }
    const addRegionRes = await handleUpdateRegionFetch({
      urlOptions: {
        placeHolders: {
          id: customer.id,
        },
      },
      body: {
        name: values.name,
        pickUpLocation: values.pickUpLocation,
        time: values.time,
        country: selectedCountryValue || customer.country,
        city: selectedCityValue || customer.city,
        charge,
      },
    });

    // @ts-ignore
    if (addRegionRes && addRegionRes.status === 'ok') {
      openSuccessNotification();

      const positionInTag = () => {
        return regionList.map((item) => item.id).indexOf(customer.id);
      };

      const index = positionInTag();

      // @ts-ignore
      const updatedItem = Object.assign({}, regionList[index], {
        // @ts-ignore
        ...addRegionRes,
      });
      const updateRegionList = [
        ...regionList.slice(0, index),
        updatedItem,
        ...regionList.slice(index + 1),
      ];
      setRegionList(updateRegionList);
      setvisible(false);

      setdeliveryChargeList([]);
      setselectedCityValue('');
      setselectedCountryValue('');
      setcountryOptions([]);
      setcityOptions([]);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!updateRegionState['isLoading']) {
      const error = updateRegionState['error'];
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
      !updateRegionState['isLoading'] &&
      Object.keys(updateRegionState.data).length > 0
    ) {
      if (updateRegionState['data']['status'] === 'ok') {
        // openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })
        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [updateRegionState]);

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
            country: selectedCountryValue || customer.countryName,
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
  }, [customer.countryName, selectedCountryValue]);

  const handleCancel = (e: any) => {
    setvisible(false);

    setdeliveryChargeList([]);
    setselectedCityValue('');
    setselectedCountryValue('');
    setcountryOptions([]);
    setcityOptions([]);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!isValid || !values.name || !values.pickUpLocation || !values.time) {
      return true;
    }
    return false;
  };

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
      initialValues={{ ...customer }}
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
            title='Region Edit'
            visible={visible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
            destroyOnClose={true}
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
                  label='Name'
                  value={values.name}
                  name='name'
                  isError={
                    (touched.name && errors.name) ||
                    (!isSubmitting && updateRegionState.error['error']['name'])
                  }
                  errorString={
                    (touched.name && errors.name) ||
                    (!isSubmitting && updateRegionState.error['error']['name'])
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
                      updateRegionState.error['error']['pickUpLocation'])
                  }
                  errorString={
                    (touched.pickUpLocation && errors.pickUpLocation) ||
                    (!isSubmitting &&
                      updateRegionState.error['error']['pickUpLocation'])
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
                  (!isSubmitting && updateRegionState.error['error']['time'])
                }
                errorString={
                  (touched.time && errors.time) ||
                  (!isSubmitting && updateRegionState.error['error']['time'])
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
                    updateRegionState.error['error']['country'] ? 'error' : ''
                  }
                  help={updateRegionState.error['error']['country']}
                >
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder='Select a Country'
                    optionFilterProp='children'
                    defaultValue={customer && customer.countryName}
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
                    updateRegionState.error['error']['country'] ? 'error' : ''
                  }
                  help={updateRegionState.error['error']['country']}
                >
                  <Select
                    mode='multiple'
                    showSearch
                    style={{ width: '100%' }}
                    placeholder='Select a city'
                    optionFilterProp='children'
                    defaultValue={customer && customer.city}
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
                updateRegionState.error['error']['country'] ? 'error' : ''
              }
              help={updateRegionState.error['error']['country']}
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

export default QuickEdit;
