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
    title: Yup.string()
        .label('Title')
        .required('Site title can not be empty'),
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
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    title: '',
    adminName: '',
    adminEmail: '',
}



interface Props {


}

const UpdateSiteinfo = ({ }: Props) => {

    const [UpdateSiteSettingsState, handleUpdateSiteSettingsFetch] = useHandleFetch({}, 'updateSiteSettings');
    const [siteSettingsState, handlSiteSettingsFetch] = useHandleFetch({}, 'siteSettings');



    useEffect(() => {
        const getSiteSettings = async () => {
            const siteSettingsRes = await handlSiteSettingsFetch({});

            console.log('siteSettingsRes', siteSettingsRes)
        }
        getSiteSettings();
    }, [UpdateSiteSettingsState])


    console.log('siteSettingsState', siteSettingsState);

    const handleSubmit = async (values: any, actions: any) => {


        const addSiteInfoRes = await handleUpdateSiteSettingsFetch({

            body: {
                title: values.title,
                adminName: values.adminName,
                adminEmail: values.adminEmail,
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





    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.title || !values.adminEmail || !isValid) {
            return true;
        }
        return false;
    }





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
                        {console.log('errors', errors)}
                        <div className='siteInfoContainer__item'>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    label='Site Title'
                                    value={values.title}
                                    name='title'
                                    isError={(touched.title && errors.title) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['title'])}

                                    errorString={(touched.title && errors.title) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['title'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('title');
                                    }}
                                />
                            </div>
                            <div className='siteInfoContainer__item-item'>
                                <Input
                                    label='Admin Name'
                                    value={values.adminName}
                                    name='adminName'
                                    isError={(touched.adminName && errors.adminName) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['adminName'])}

                                    errorString={(touched.adminName && errors.adminName) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['adminName'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('adminName');
                                    }}
                                />
                            </div>
                            <div className='siteInfoContainer__item-item-left'>
                                <Input
                                    label='Admin Email'
                                    value={values.adminEmail}
                                    name='adminEmail'
                                    isError={(touched.adminEmail && errors.adminEmail) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['adminEmail'])}

                                    errorString={(touched.adminEmail && errors.adminEmail) ||
                                        (!isSubmitting && UpdateSiteSettingsState.error['error']['adminEmail'])}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                        setFieldTouched('adminEmail');
                                    }}
                                />

                            </div>

                        </div>

                        <Button
                            type='primary'
                            onClick={(e: any) => handleSubmit(e)}
                            loading={isSubmitting}
                            disabled={getisSubmitButtonDisabled(values, isValid)}

                        >
                            Update
                        </Button>
                    </>
                )}
        </Formik >




    );
};

export default UpdateSiteinfo;
