import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { notification, Button } from 'antd';

import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';

const validationSchema = Yup.object().shape({
  title: Yup.string().label('Title').required('Site title can not be empty'),
  adminEmail: Yup.string()
    .label('Admin Email')
    .required('Admin Email can not be empty'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Site Info Updated',
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

const initialValues = {
  metaTitle: '',
  metaTags: '',
  metaDescription: '',
  injectHTML: '',
};

interface Props {}

const UpdateSiteSEO = ({}: Props) => {
  const [
    UpdateSiteSettingsState,
    handleUpdateSiteSettingsFetch,
  ] = useHandleFetch({}, 'updateSiteSEO');
  const [siteSettingsState, handlSiteSettingsFetch] = useHandleFetch(
    {},
    'getSiteSEO'
  );

  useEffect(() => {
    const getSiteSettings = async () => {
      const siteSettingsRes = await handlSiteSettingsFetch({});
    };
    getSiteSettings();
  }, [UpdateSiteSettingsState]);

  // console.log('siteSettingsState', siteSettingsState);

  const handleSubmit = async (values: any, actions: any) => {
    const addSiteInfoRes = await handleUpdateSiteSettingsFetch({
      body: {
        metaTitle: values.metaTitle,
        metaTags: values.metaTags,
        metaDescription: values.metaDescription,
        injectHTML: values.injectHTML
      },
    });

    // @ts-ignore
    if (addSiteInfoRes && addSiteInfoRes.status === 'ok') {
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
    if (!values.metaTitle || !values.metaTags || !isValid) {
      return true;
    }
    return false;
  };

  const getInitialValues = () => {
    if (
      siteSettingsState.data &&
      Object.keys(siteSettingsState.data).length > 0
    ) {
      return { ...siteSettingsState.data };
    } else {
      return initialValues;
    }
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
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
                label='Meta Title'
                value={values.metaTitle}
                name='metaTitle'
                isError={
                  (touched.metaTitle && errors.metaTitle) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaTitle'])
                }
                errorString={
                  (touched.metaTitle && errors.metaTitle) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaTitle'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('metaTitle');
                }}
              />
            </div>
            <div className='siteInfoContainer__item-item'>
              <Input
                label='Meta Tags'
                value={values.metaTags}
                name='metaTags'
                isError={
                  (touched.metaTags && errors.metaTags) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaTags'])
                }
                errorString={
                  (touched.metaTags && errors.metaTags) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaTags'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('metaTags');
                }}
              />
            </div>
            <div className='siteInfoContainer__item-item-left'>
              <TextArea
                label='Meta Description'
                value={values.metaDescription}
                name='metaDescription'
                isError={
                  (touched.metaDescription && errors.metaDescription) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaDescription'])
                }
                errorString={
                  (touched.metaDescription && errors.metaDescription) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['metaDescription'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('metaDescription');
                }}
              />
            </div>

     

          </div>

          <div 
              className='siteInfoContainer__item-item'>
              <TextArea
                rows={8}
                label='Inject HTML ( Inside <head></head> Tag )'
                value={values.injectHTML}
                name='injectHTML'
                isError={
                  (touched.injectHTML && errors.injectHTML) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['injectHTML'])
                }
                errorString={
                  (touched.injectHTML && errors.injectHTML) ||
                  (!isSubmitting &&
                    UpdateSiteSettingsState.error['error']['injectHTML'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('injectHTML');
                }}
              />
            </div>



          <div
            style={{
              marginTop: '10px',
            }}
          ></div>

          <Button
            onClick={(e: any) => handleSubmit(e)}
            loading={isSubmitting}
            // disabled={getisSubmitButtonDisabled(values, isValid)}
            className='btnPrimaryClassNameoutline'
          >
            Update
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

export default UpdateSiteSEO;
//
