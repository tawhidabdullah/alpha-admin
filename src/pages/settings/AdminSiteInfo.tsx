import React, { useState } from 'react';
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
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
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


    const handleSubmit = async (values: any, actions: any) => {


        const addBrandRes = await handleUpdateSiteSettingsFetch({

            body: {
                title: values.title,
                adminName: values.adminName,
                adminEmail: values.adminEmail,
            },
        });

        // @ts-ignore
        if (addBrandRes && addBrandRes.status === 'ok') {
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
        if (!values.name && !values.description || !isValid) {
            return true;
        }
        return false;
    }






    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...initialValues }
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
                                    name='name'
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

                        <Button type='primary'>
                            Update
                        </Button>
                    </>
                )}
        </Formik>




    );
};

export default UpdateSiteinfo;
