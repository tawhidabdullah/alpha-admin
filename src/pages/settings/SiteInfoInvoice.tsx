import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { notification, Button } from 'antd';

import { CheckCircleOutlined } from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
// import MediaLibrary from "../../components/MediaLibrary";

const validationSchema = Yup.object().shape({
  invoiceTitle: Yup.string()
    .label('Title')
    .required('Invoice title is required'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Invoice Info Updated',
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

const initialValues = {
  invoiceTitle: '',
  address: '',
  phone: '',
  email: '',
  additionalText: '',
};

interface Props {}

const UpdateSiteinfo = ({}: Props) => {
  const [
    updateInfovSettingsState,
    handleUpdateInvoiceSettingsFetch,
  ] = useHandleFetch({}, 'updateInvoiceSettings');
  const [InvoiceSettingsState, handlSiteInvoiceSettingsFetch] = useHandleFetch(
    {},
    'invoiceSettingsDetail'
  );

  useEffect(() => {
    const getSiteSettings = async () => {
      const siteSettingsRes = await handlSiteInvoiceSettingsFetch({});

      // console.log('siteSettingsRes', siteSettingsRes)
    };
    getSiteSettings();
  }, [updateInfovSettingsState]);

  const handleSubmit = async (values: any, actions: any) => {
    const updateInvoiceRes = await handleUpdateInvoiceSettingsFetch({
      body: {
        invoiceTitle: values.invoiceTitle,
        address: values.address,
        phone: values.phone,
        email: values.email,
        additionalText: values.additionalText,
      },
    });

    // @ts-ignore
    if (updateInvoiceRes && updateInvoiceRes.status === 'ok') {
      openSuccessNotification();

      // setBrandList([...brandList, {
      //     id: addBrandRes['id'] || '',
      //     key: addBrandRes['id'] || '',
      //     name: addBrandRes['name'] || '',
      //     description: addBrandRes['description'] || '',
      //     // @ts-ignore
      //     ...addBrandRes
      // }]);

      actions.resetForm();
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.invoiceTitle || !isValid) {
      return true;
    }
    return false;
  };

  const getInitialValues = () => {
    if (
      InvoiceSettingsState.data &&
      Object.keys(InvoiceSettingsState.data).length > 0
    ) {
      return { ...InvoiceSettingsState.data };
    } else {
      return initialValues;
    }
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      enableReinitialize={true}
      initialValues={getInitialValues()}
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
          <div className='siteInfoContainer__item'>
            <div className='siteInfoContainer__item-item'>
              <Input
                label='Company Name'
                value={values.invoiceTitle}
                name='invoiceTitle'
                isError={
                  (touched.invoiceTitle && errors.invoiceTitle) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['invoiceTitle'])
                }
                errorString={
                  (touched.invoiceTitle && errors.invoiceTitle) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['invoiceTitle'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('invoiceTitle');
                }}
              />
            </div>
            <div className='siteInfoContainer__item-item'>
              <Input
                label='Phone Number'
                value={values.phone}
                name='phone'
                isError={
                  (touched.phone && errors.phone) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['phone'])
                }
                errorString={
                  (touched.phone && errors.phone) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['phone'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('phone');
                }}
              />
            </div>
            <div className='siteInfoContainer__item-item'>
              <Input
                label='Email'
                value={values.email}
                name='email'
                isError={
                  (touched.email && errors.email) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['email'])
                }
                errorString={
                  (touched.email && errors.email) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['email'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('email');
                }}
              />
            </div>

            <div className='siteInfoContainer__item-item'>
              <Input
                label='Additional Text'
                value={values.additionalText}
                name='additionalText'
                isError={
                  (touched.additionalText && errors.additionalText) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['additionalText'])
                }
                errorString={
                  (touched.additionalText && errors.additionalText) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['additionalText'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('additionalText');
                }}
              />
            </div>

            <div className='siteInfoContainer__item-item-left'>
              <TextArea
                label='Address'
                value={values.address}
                name='address'
                isError={
                  (touched.address && errors.address) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['address'])
                }
                errorString={
                  (touched.address && errors.address) ||
                  (!isSubmitting &&
                    updateInfovSettingsState.error['error']['address'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('address');
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '10px',
            }}
          ></div>

          <Button
            onClick={(e: any) => handleSubmit(e)}
            loading={isSubmitting}
            disabled={getisSubmitButtonDisabled(values, isValid)}
            className='btnPrimaryClassNameoutline'
          >
            Update Invoice Info
          </Button>

          <div
            style={{
              marginBottom: '10px',
            }}
          ></div>
        </>
      )}
    </Formik>
  );
};

export default UpdateSiteinfo;
