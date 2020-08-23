import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip } from 'antd';

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
import AccessCheckbox from "./AccessCheckbox";

const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
    phone: Yup.string()
    .required('Please tell us your mobile number.')
    .max(13, 'Please enter a valid mobile number.'),
   password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters'),
  passwordConfirmation: Yup.string()
    .label('Confirm password')
    .required()
    .min(6, 'Confirm password must have at least 6 characters')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Admin Created',
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
    name: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    access: [],
}


const plainOptions = [
    'getCatalogue', 'postCatalogue', 
    'getDelivery', 'postDelivery', 
    'getOrder', 'postOrder',
    'getBlog', 'postBlog', 
    'getPage', 'postPage',
    'analytics',
    'accounts'
];


interface Props {
    addNewCategoryVisible?: any;
    setAddNewCategoryVisible?: any;
    tagList?: any;
    setTagList?: any;

}

const AddNewAdminRoles = ({ addNewCategoryVisible, setAddNewCategoryVisible, tagList, setTagList }: Props) => {

    const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'adminRoleRegister');
    const [myImages, setmyImages] = useState(false);
    const [visibleMedia, setvisibleMedia] = useState(false);
    const [accesscheckedList,setAccessCheckedList] = useState([]);


    const handleSubmit = async (values: any, actions: any) => {
        const addTagRes = await handleAddTagFetch({
            body: {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone,
                password: values.password,
                password2: values.passwordConfirmation,
                access: accesscheckedList,

            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            // openSuccessNotification();

            setTagList([...tagList, {
                id: addTagRes['id'] || '',
                key: addTagRes['id'] || '',
                name: addTagRes['name'] || '',
            }])
            actions.resetForm();
            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification();
        }


        actions.setSubmitting(false);

    };


    useEffect(() => {
		if (!addTagState['isLoading']) {
			const error = addTagState['error'];
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
			!addTagState['isLoading'] &&
			Object.keys(addTagState.data).length > 0
		) {
			if (addTagState['data']['status'] === 'ok') {
				openSuccessNotification('Admin Created Successfully');
				// history.push({
				//   pathname: '/orderDetails',
				//   state: checkoutState['data']
				// })

				// clearCart();
				// setIsModalShown(true);
			}
		}
    }, [addTagState]);
    


    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !values.phone || !values.password || !values.passwordConfirmation || !isValid) {
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
                        <Modal
                            style={{
                                top: '40px'
                            }}
                            title="Register New Admin"
                            visible={addNewCategoryVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Create'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                        >
                            <Input
                                label='Name'
                                value={values.name}
                                name='name'
                                isError={(touched.name && errors.name) ||
                                    (!isSubmitting && addTagState.error['error']['name'])}

                                errorString={(touched.name && errors.name) ||
                                    (!isSubmitting && addTagState.error['error']['name'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('name');
                                }}
                            />


                            <Input
                                label='Phone'
                                value={values.phone}
                                name='phone'
                                isError={(touched.phone && errors.phone) ||
                                    (!isSubmitting && addTagState.error['error']['phone'])}

                                errorString={(touched.phone && errors.phone) ||
                                    (!isSubmitting && addTagState.error['error']['phone'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('phone');
                                }}
                            />


                            <Input
                                label='Email'
                                value={values.email}
                                name='email'
                                isError={(touched.email && errors.email) ||
                                    (!isSubmitting && addTagState.error['error']['email'])}

                                errorString={(touched.email && errors.email) ||
                                    (!isSubmitting && addTagState.error['error']['email'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('email');
                                }}
                            />
                           

                           <Input
                                label='Password'
                                value={values.password}
                                name='password'
                                type='password'
                                isError={(touched.password && errors.password) ||
                                    (!isSubmitting && addTagState.error['error']['password'])}

                                errorString={(touched.password && errors.password) ||
                                    (!isSubmitting && addTagState.error['error']['password'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('password');
                                }}
                            />


                            <Input
                                label='Confirm Password'
                                value={values.passwordConfirmation}
                                name='passwordConfirmation'
                                type='password'
                                isError={(touched.passwordConfirmation && errors.passwordConfirmation) ||
                                    (!isSubmitting && addTagState.error['error']['passwordConfirmation'])}

                                errorString={(touched.passwordConfirmation && errors.passwordConfirmation) ||
                                    (!isSubmitting && addTagState.error['error']['password2'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('passwordConfirmation');
                                }}
                            />

                                <h3 className='inputFieldLabel'>
                                    Select Admin Access 
                                </h3>

                            <AccessCheckbox 
                            plainOptions={plainOptions}
                            checkedList={accesscheckedList}
                            setCheckedList={setAccessCheckedList}
                            />
                           

                        </Modal>

                        <MediaLibrary
                            setvisible={setvisibleMedia}
                            visible={visibleMedia}
                            setmyImages={setmyImages}
                            myImages={myImages}
                            isModalOpenForImages={true}

                        />
                    </>
                )}
        </Formik>




    );
};

export default AddNewAdminRoles;
