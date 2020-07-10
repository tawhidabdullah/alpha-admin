import React,{useState} from 'react';
import { Modal  } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import {useHandleFetch} from '../../hooks';

const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
	description: Yup.string().label('Description').required('Description is required')
});





interface Props {
	category: any;
	setvisible: any; 
	visible: any;
}

const QuickEdit = ({ category, setvisible, visible }: Props) => {
	const [updateTagState, handleUpdateCategoryFetch] = useHandleFetch({}, 'updateTag');

	const handleSubmit = async (values : any, actions : any) => {
	  const updateTagRes = await handleUpdateCategoryFetch({
		urlOptions: {
			placeHolders: {
			  id: values.id,
			}
		  },
		body: {
			name: values.name,
			description: values.description,
		},
	  });
	
	  actions.setSubmitting(false);
	};
	

	const handleCancel = (e: any) => {
        setvisible(false);
      };



	  const getisSubmitButtonDisabled = (values,isValid) => {
		if(!values.name || !values.description || !isValid){
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
		  {...category}
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
			title="Quick Edit"
			visible={visible}
			onOk={(e : any) => handleSubmit(e)}
			onCancel={handleCancel}
			okText='Update'
			okButtonProps={{
			loading: isSubmitting,
			htmlType: "submit",
			disabled: getisSubmitButtonDisabled(values, isValid)
			}}
  >
  <Input 
			   label='Title'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && updateTagState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && updateTagState.error['error']['name'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('name');
				}}
			   />
			  <TextArea
			   label='Description' 
			   value={values.description}
			   name='description'
			   isError={(touched.description && errors.description) ||
				  (!isSubmitting && updateTagState.error['error']['description'])}
			  
				  errorString={(touched.description && errors.description) ||
					  (!isSubmitting && updateTagState.error['error']['description'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('description');
				}}
				 />
  </Modal>
			  
			</>
		  )}
	  </Formik>
	);
};


export default QuickEdit;
