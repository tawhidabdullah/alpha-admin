import React,{useState} from 'react';
import { Button  } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../../components/Field/Input';
import TextArea from '../../../components/Field/TextArea';
import {useHandleFetch} from '../../../hooks';

const validationSchema = Yup.object().shape({
	username: Yup.string()
	  .label('Username')
	  .required('Username is required')
	  .min(3, 'Username must have at least 3 characters'),
  
	password: Yup.string().label('Password').required('Password is required'),
  });
  
  const initialValues = {
	username: '',
	password: '',
  };

interface Props {
	
}

const QuickEdit = ({  }: Props) => {
	const [loginState, handleLoginFetch] = useHandleFetch({}, 'login');

	const handleSubmit = async (values : any, actions : any) => {

	  const updateCategoryRes = await handleLoginFetch({
		body: {
			username: values.username,
			password: values.password,
		},
	  });
	
	  actions.setSubmitting(false);
	};
	



	  const getisSubmitButtonDisabled = (values,isValid) => {
		if(!values.username || !values.password || !isValid){
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
		  {...initialValues}
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
				maxWidth: '400px',
				margin: '20px'
			}}>
			<Input 
			   label='Username'
			   value={values.username}
			   name='username'
			   isError={(touched.username && errors.username) ||
				  (!isSubmitting && loginState.error['error']['username'])}
			  
				  errorString={(touched.username && errors.username) ||
					  (!isSubmitting && loginState.error['error']['username'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('username');
				}}
			   />

			<Input 
			   label='Password'
			   value={values.password}
			   name='password'
			   isError={(touched.password && errors.password) ||
				  (!isSubmitting && loginState.error['error']['password'])}
				errorString={(touched.password && errors.password) ||
					  (!isSubmitting && loginState.error['error']['password'])}
			    onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('password');
				}}
			   />

<Button 
							type='primary'
							onClick={(e : any) => handleSubmit(e)}
							disabled={getisSubmitButtonDisabled(values, isValid)}
							loading={isSubmitting}
							style={{
								// marginTop: '20px'
							}}
							 >
						Login
					</Button>
				</div>
			</>
		  )}
	  </Formik>
	);
};


export default QuickEdit;
