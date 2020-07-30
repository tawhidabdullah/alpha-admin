import React from 'react';

// import components 
import TextArea from "../../components/Field/TextArea";
import Input from "../../components/Field/Input";


// import lib 
import { Button, notification } from 'antd';

import { Formik } from 'formik';
import * as Yup from 'yup';

import {
    CheckCircleOutlined,
    InfoCircleFilled
} from '@ant-design/icons';


// import hooks
import { useHandleFetch } from "../../hooks";

const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'SMS sent successfully',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <InfoCircleFilled style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    name: '',
    description: '',
}


interface Props {

}

const SMSConfiguaration = (props: Props) => {
    const [configureSMSStata, handleconfigureSMSFetch] = useHandleFetch({}, 'configureSMS');


    const handleSubmit = async (values: any, actions: any) => {
        const addTagRes = await handleconfigureSMSFetch({
            urlOptions: {
                placeHolders: {
                    id: values.id,
                }
            },
            body: {
                name: values.name.trim(),
                description: values.description,
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            openSuccessNotification();


            actions.resetForm();
        }
        else {
            openErrorNotification();
        }


        actions.setSubmitting(false);

    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }

    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            // validationSchema={validationSchema}
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
                        <Input
                            label='Title'
                            value={values.name}
                            name='name'
                            isError={(touched.name && errors.name) ||
                                (!isSubmitting && configureSMSStata.error['error']['name'])}

                            errorString={(touched.name && errors.name) ||
                                (!isSubmitting && configureSMSStata.error['error']['name'])}
                            onChange={(e: any) => {
                                handleChange(e);
                                setFieldTouched('name');
                            }}
                        />
                        <TextArea
                            label='Description'
                            value={values.description}
                            name='description'
                            isError={(touched.description && errors.description) ||
                                (!isSubmitting && configureSMSStata.error['error']['description'])}

                            errorString={(touched.description && errors.description) ||
                                (!isSubmitting && configureSMSStata.error['error']['description'])}
                            onChange={(e: any) => {
                                handleChange(e);
                                setFieldTouched('description');
                            }}
                        />
                    </>
                )}
        </Formik>

    )
}

export default SMSConfiguaration
