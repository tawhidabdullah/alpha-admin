import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { notification, Button } from 'antd';

import {
    CheckCircleOutlined
} from '@ant-design/icons';


import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";



const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
    .label('New Password')
    .required()
    .min(6, 'New Password must have at least 6 characters'),
  newPassword2: Yup.string()
    .label('Confirm New password')
    .required()
    .min(6, 'Confirm New password must have at least 6 characters')
    .oneOf(
      [Yup.ref('newPassword'), null],
      'Confirm new password must match to new password'
    ),
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
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    name: '',
    phone: '',
    email: '',
    newPass: '',
    password:'',
    newPassword: '',
    newPassword2: '',
}



interface Props {


}

const ChangeAdminPassword = ({ }: Props) => {

    const [UpdateSiteSettingsState, handleUpdateSiteSettingsFetch] = useHandleFetch({}, 'updateAdminCredential');
    const [siteSettingsState, handlSiteSettingsFetch] = useHandleFetch({}, 'getAdminCredential');



    useEffect(() => {
        const getSiteSettings = async () => {
            const siteSettingsRes = await handlSiteSettingsFetch({});

        }
        getSiteSettings();
    }, [UpdateSiteSettingsState])




    // console.log('siteSettingsState', siteSettingsState);

    const handleSubmit = async (values: any, actions: any) => {


        const addSiteInfoRes = await handleUpdateSiteSettingsFetch({
            body: {
                name: values.name,
                phone: values.phone,
                email: values.email,
                password: values.password, 
                newPass: values.newPassword,
                newPassRepeat: values.newPassword2,
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
        }
        else {
            openErrorNotification();
        }




        actions.setSubmitting(false);

    };




    const getInitialValues = () => {
        if (siteSettingsState.data && Object.keys(siteSettingsState.data).length > 0) {
            return { ...siteSettingsState.data }
        }
        else {
            return initialValues
        }
    }


    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            enableReinitialize={true}
            initialValues={
                getInitialValues()
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

                        <div className='siteInfoContainer__item'>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    type='text'
                                    label='Name'
                                    value={values.name}
                                    name='name'
                                    isError={(touched.name && errors.name) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['name'])}

                                    errorString={(touched.name && errors.name) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['name'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('name');
                                    }}
                                />
                            </div>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    type='text'
                                    label='Phone'
                                    value={values.phone}
                                    name='phone'
                                    isError={(touched.phone && errors.phone) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['phone'])}

                                    errorString={(touched.phone && errors.phone) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['phone'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('phone');
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{
                            width: '90%',
                            paddingRight: '30px'
                        }}>
                                     <Input
                                    type='text'
                                    label='Email'
                                    value={values.email}
                                    name='email'
                                    isError={(touched.email && errors.email) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['email'])}

                                    errorString={(touched.email && errors.email) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['email'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('email');
                                    }}
                                />
                        </div>


                        <div style={{
                            width: '90%',
                            paddingRight: '30px'
                        }}>
                                    <Input
                                    type='password'
                                    label='Password (Enter current password to update credentials)'
                                    value={values.password}
                                    name='password'
                                    isError={(touched.password && errors.password) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['password'])}

                                    errorString={(touched.password && errors.password) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['password'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('password');
                                    }}
                                />
                        </div>


                        <div className='siteInfoContainer__item'>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    type='password'
                                    label='New Password'
                                    value={values.newPassword}
                                    name='newPassword'
                                    isError={(touched.newPassword && errors.newPassword) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['newPassword'])}

                                    errorString={(touched.newPassword && errors.newPassword) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['newPassword'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('newPassword');
                                    }}
                                />
                            </div>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    type='password'
                                    label='Confirm New Password'
                                    value={values.newPassword2}
                                    name='newPassword2'
                                    isError={(touched.newPassword2 && errors.newPassword2) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['newPassword2'])}

                                    errorString={(touched.newPassword2 && errors.newPassword2) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['newPassword2'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('newPassword2');
                                    }}
                                />
                            </div>
                        </div>


                        <div style={{
                            marginTop: '10px'
                        }}></div>

                        <Button

                            onClick={(e: any) => handleSubmit(e)}
                            loading={isSubmitting}
                            // disabled={getisSubmitButtonDisabled(values, isValid)}
                            className='btnPrimaryClassNameoutline'
                        >
                          Update Credentials
                            </Button>

                        <div style={{
                            marginBottom: '10px'
                        }}></div>

                    </>
                )}
        </Formik >




    );
};

export default ChangeAdminPassword;
//