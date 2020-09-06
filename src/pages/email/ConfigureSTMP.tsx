import React, { useState, useEffect } from 'react';
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

const validationSchema = Yup.object().shape({
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
    "fromEmail": "",
    "fromName": "",
    "host": "",
    "encryption":"",
    "port":'',
    "smtpUsername":"",
    "smtpPassword": ""
}



interface Props {
}

const ConfigureSTMP = ({  }: Props) => {

    const [getEmailConfigurationState, handleGetEmailConfigurationFetch] = useHandleFetch({}, 'getEmailConfiguration');
    const [emailConfigurationState, handleEmailConfigurationFetch] = useHandleFetch({}, 'configureEmailSTMP');
 
    const [isAuthenticated,setIsAuthenticated] = useState(true);
    const [configurationData,setConfigurationData] = useState({}); 



    useEffect(() => {
      const getEmailConfiguration = async () => {
          const res = await handleGetEmailConfigurationFetch({});
          // @ts-ignore
          if(res){
              // @ts-ignore
            setConfigurationData(res); 
            setIsAuthenticated(res['authentication'])
          }
      }; 
      getEmailConfiguration(); 
    }, [])


    console.log('getEmailConfigurationState',getEmailConfigurationState)

    const handleSubmit = async (values: any, actions: any) => {
        const addTagRes = await handleEmailConfigurationFetch({
            body: {
                "fromEmail": values.fromEmail.trim(),
                "fromName": values.fromName.trim(),
                "host": values.host.trim(),
                "encryption":values.encryption.trim(),
                "port":values.port,
                "authentication": isAuthenticated,
                "smtpUsername":values.smtpUsername.trim(),
                "smtpPassword": values.smtpPassword.trim()
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
           
        }
        else {
            // openErrorNotification("Something went wrong, Couldn't updated STMP configuration");
        }


        actions.setSubmitting(false);

    };



    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }



    
	useEffect(() => {
		if (!emailConfigurationState['isLoading']) {
			const error = emailConfigurationState['error'];
			if (error['isError'] && Object.keys(error['error']).length > 0) {

				if (error['error']['registerError']) {
					// setServerErrors(error['error']['registerError']);
				} else if (error['error']['checkoutError']) {
					// setServerErrors(error['error']['checkoutError']);
				}

				else {
					// setServerErrors(error['error']);
				}

				const errors =
					Object.values(error['error']).length > 0
						? Object.values(error['error'])
						: [];
				errors.forEach((err, i) => {
					if (typeof err === 'string') {
						openErrorNotification(err);

					}
					else if (typeof err === 'object') {
						if (err && Object.keys(err).length > 0) {
							const errs = Object.values(err);
							errs.forEach(err => {
								openErrorNotification(err);
							})

						}
					}
				});
			}
		}

		if (
			!emailConfigurationState['isLoading'] &&
			Object.keys(emailConfigurationState.data).length > 0
		) {
			if (emailConfigurationState['data']['status'] === 'ok') {
                openSuccessNotification('STMP Configuration Updated!');
				// history.push({
				//   pathname: '/orderDetails',
				//   state: checkoutState['data']
				// })

				// clearCart();
				// setIsModalShown(true);
			}
		}
	}, [emailConfigurationState]);



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
                { ...initialValues, ...configurationData }
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
                                                    label='From Email'
                                                    value={values.fromEmail}
                                                    name='fromEmail'
                                                    isError={(touched.fromEmail && errors.fromEmail) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['fromEmail'])}

                                                    errorString={(touched.fromEmail && errors.fromEmail) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['fromEmail'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('fromEmail');
                                                    }}
                                                     />
												</div>
												<div style={{
													width: '49%'
												}}>

                                                    <Input
                                                    label='From Name'
                                                    value={values.fromName}
                                                    name='fromName'
                                                    isError={(touched.fromName && errors.fromName) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['fromName'])}

                                                    errorString={(touched.fromName && errors.fromName) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['fromName'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('fromName');
                                                    }}
                                                />
												</div>
											</div>
										

                                            <div style={{
												display: 'flex',
												justifyContent: 'space-between'
											}}>
												<div style={{
													width: '49%',
												}}>
                                                      <Input
                                                    label='Host'
                                                    value={values.host}
                                                    name='host'
                                                    isError={(touched.host && errors.host) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['host'])}

                                                    errorString={(touched.host && errors.host) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['host'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('host');
                                                    }}
                                                     />

												  
												</div>
												<div style={{
													width: '49%'
												}}>

                                                    <Input
                                                    label='Encryption'
                                                    value={values.encryption}
                                                    name='encryption'
                                                    isError={(touched.encryption && errors.encryption) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['encryption'])}

                                                    errorString={(touched.encryption && errors.encryption) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['encryption'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('encryption');
                                                    }}
                                                />
												</div>
											</div>
										


                                            <div style={{
												display: 'flex',
												justifyContent: 'space-between'
											}}>
												<div style={{
													width: '49%',
												}}>
												  <Input
                                                    label='STMP Username'
                                                    value={values.smtpUsername}
                                                    name='smtpUsername'
                                                    isError={(touched.smtpUsername && errors.smtpUsername) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['smtpUsername'])}

                                                    errorString={(touched.smtpUsername && errors.smtpUsername) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['smtpUsername'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('smtpUsername');
                                                    }}
                                                    />
												</div>
												<div style={{
													width: '49%'
												}}>

                                                    <Input
                                                    label='STMP Password'
                                                    value={values.smtpPassword}
                                                    name='smtpPassword'
                                                    isError={(touched.smtpPassword && errors.smtpPassword) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['smtpPassword'])}

                                                    errorString={(touched.smtpPassword && errors.smtpPassword) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['smtpPassword'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('smtpPassword');
                                                    }}
                                                />
												</div>
											</div>
										

                                            <div style={{
													width: '49%'
												}}>
                                                  <Input
                                                     type='number'
                                                    label='Port'
                                                    value={values.port}
                                                    name='port'
                                                    isError={(touched.port && errors.port) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['port'])}

                                                    errorString={(touched.port && errors.port) ||
                                                        (!isSubmitting && emailConfigurationState.error['error']['port'])}
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                        setFieldTouched('port');
                                                    }}
                                                    />
                                            </div>

                                        
                                            <Checkbox
                                            value={isAuthenticated}
                                             onChange={handleAuthenticatedChange}>
                                                    <span className='checkBoxFieldLabel'>
                                                        Authentication
                                                    </span>
                                                    
                                                </Checkbox>    



<div style={{
    marginTop:'20px'
}}></div>
                                      <div style={{
                                          display:'block',
                                          marginBottom:'20px',
                                          marginTop:'20px',
                                      }}>
                                                    
                                      <Button

                                        onClick={(e: any) => handleSubmit(e)}
                                        loading={emailConfigurationState.isLoading}
                                        className='btnPrimaryClassNameoutline'
                                        >
                                        Update Email Configuration
                                        </Button>      
                                          </div>      
                    </>
                )}
        </Formik>
    );
};

export default ConfigureSTMP;
