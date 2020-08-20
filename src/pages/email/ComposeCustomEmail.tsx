import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip,Checkbox  } from 'antd';

import {
    FileOutlined,
    InboxOutlined,
    FileAddOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CheckOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    FileImageFilled
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Tag Created',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    "recipient": "",
    "subject": "",
}



interface Props {
}

const ComposeCustomEmail = ({  }: Props) => {

    const [sendCustomerEmailState, handleSendCustomEmailFetch] = useHandleFetch({}, 'sendCustomEmail');
 
    const [isAuthenticated,setIsAuthenticated] = useState(true);
    const [html,sethtml] = useState('');


    const handleSubmit = async (values: any, actions: any) => {
        const addTagRes = await handleSendCustomEmailFetch({
            body: {
                "recipient": values.recipient.trim(),
                "subject": values.subject.trim(),
               
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            openSuccessNotification('Email Sent!');
        }
        else {
            openErrorNotification("Something went wrong, Couldn't send email");
        }


        actions.setSubmitting(false);

    };



    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }



    const handleAuthenticatedChange = (e) => {
        setIsAuthenticated(e.target.checked);
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

                                         	<div style={{
												display: 'flex',
												justifyContent: 'space-between'
											}}>
												<div style={{
													width: '49%',
												}}>
												  <Input
                                                    label='To'
                                                    value={values.recipient}
                                                    name='recipient'
                                                    isError={(touched.recipient && errors.recipient) ||
                                                        (!isSubmitting && sendCustomerEmailState.error['error']['recipient'])}

                                                    errorString={(touched.recipient && errors.recipient) ||
                                                        (!isSubmitting && sendCustomerEmailState.error['error']['recipient'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('recipient');
                                                    }}
                                                     />
												</div>
												<div style={{
													width: '49%'
												}}>

                                                    <Input
                                                    label='Subject'
                                                    value={values.subject}
                                                    name='subject'
                                                    isError={(touched.subject && errors.subject) ||
                                                        (!isSubmitting && sendCustomerEmailState.error['error']['subject'])}

                                                    errorString={(touched.subject && errors.subject) ||
                                                        (!isSubmitting && sendCustomerEmailState.error['error']['subject'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('subject');
                                                    }}
                                                />
												</div>
											</div>
										



            <h3 className='inputFieldLabel'>
                Body
            </h3>


        <CKEditor
        editor={ClassicEditor}
        data={html}
        onInit={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
            const data = editor.getData();
            sethtml(data);
        }}
        onBlur={(event, editor) => {
            console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
            console.log('Focus.', editor);
        }}
        />
    

                                       <div style={{
                                           marginTop:'20px'
                                       }}></div>         
                                          <Button

                                            onClick={(e: any) => handleSubmit(e)}
                                            loading={sendCustomerEmailState.isLoading}
                                            className='btnPrimaryClassNameoutline'
                                            >
                                            Send
                                            </Button>     

                                            
                                       <div style={{
                                           marginTop:'10px'
                                       }}></div>       
                    </>
                )}
        </Formik>
    );
};

export default ComposeCustomEmail;
