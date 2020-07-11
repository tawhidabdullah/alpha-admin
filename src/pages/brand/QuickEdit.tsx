import React,{useState} from 'react';
import { Modal, notification  } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import {useHandleFetch} from '../../hooks';
import { CheckCircleOutlined } from '@ant-design/icons';


const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});




const openSuccessNotification = (message?: any) => {
	notification.success({
	  message: message || 'Tag Updated',
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





interface Props {
	category: any;
	setvisible: any; 
	visible: any;
	brandList: any; 
	setBrandList?: any; 

}

const QuickEdit = ({ category, setvisible, visible, brandList, setBrandList }: Props) => {
	const [updatebrandState, handleUpdateBrandFetch] = useHandleFetch({}, 'updateBrand');

	const handleSubmit = async (values : any, actions : any) => {
	  const updateBrandRes = await handleUpdateBrandFetch({
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

	  
	 	  // @ts-ignore
		   if(updateBrandRes && updateBrandRes.status === 'ok'){
			openSuccessNotification(); 
	
			const positionInBrand = () => {
				return brandList.map(item => item.id).indexOf(category.id);
			  }
	
			  const index = positionInBrand();
	
			  // @ts-ignore
			  const updatedItem = Object.assign({}, brandList[index], { ...updateBrandRes });
			  const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];
			  setBrandList(updateBrandList); 
			
		  }
		  else {
			openErrorNotification();
		  }
		
		  actions.setSubmitting(false);
		  setvisible(false)


	
	};
	

	const handleCancel = (e: any) => {
        setvisible(false);
      };



	  const getisSubmitButtonDisabled = (values,isValid) => {
		if(!values.name || !isValid){
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
				  (!isSubmitting && updatebrandState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && updatebrandState.error['error']['name'])}
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
				  (!isSubmitting && updatebrandState.error['error']['description'])}
			  
				  errorString={(touched.description && errors.description) ||
					  (!isSubmitting && updatebrandState.error['error']['description'])}
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
