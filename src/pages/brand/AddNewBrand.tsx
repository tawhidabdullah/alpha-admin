import React,{useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import {useHandleFetch} from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";



const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
	description: Yup.string().label('Description').required('Description is required')
});


const initialValues = {
	name:'',
	description: '',
	image: [],
	url: '',
	cover: ''
}

const { Dragger } = Upload;
const { Option } = Select;

const props = {
	name: 'file',
	multiple: true,
	action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
	onChange(info: any) {
		const { status } = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
};

interface Props {
	addNewCategoryVisible?: any; 
	setAddNewCategoryVisible?: any; 
}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible }: Props) => {

	const [addBrandState, handleAddBrandFetch] = useHandleFetch({}, 'addBrand');
	const [visible,setvisible] = useState(false);   



	const handleSubmit = async (values : any, actions : any) => {
	  const addBrandRes = await handleAddBrandFetch({
		
		body: {
			name: values.name,
			description: values.description,
			type: values.type,
			image: [],
			cover: ''
		},
	  });
	
	  actions.setSubmitting(false);
	};



	const onSwitchChange = (checked: any) => {
		console.log(checked);
	};


	const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
      };


	const getisSubmitButtonDisabled = (values,isValid) => {
		if(!values.name && !values.description || !isValid){
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
			<Modal
			style={{
				top: '40px'
			}}
			title="Add New Brand"
			visible={addNewCategoryVisible}
			onOk={(e : any) => handleSubmit(e)}
			onCancel={handleCancel}
			okText='Create'
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
				  (!isSubmitting && addBrandState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addBrandState.error['error']['name'])}
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
				  (!isSubmitting && addBrandState.error['error']['description'])}
			  
				  errorString={(touched.description && errors.description) ||
					  (!isSubmitting && addBrandState.error['error']['description'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('description');
				}}
				 />

			<div
				style={{
					marginTop: '20px'
				}}
			/>
			<div className='addproductSection-left-header'>
				<h3 className='inputFieldLabel'>Images</h3>
				<div  onClick={()=> setvisible(true)}>
					<FileOutlined />
					<span>Media Center</span>
				</div>
			</div>
			<div>
				<Dragger
					style={{
						background: '#fff'
					}}
					{...props}
				>
					<p className='ant-upload-drag-icon'>
						<InboxOutlined />
					</p>
					<p className='ant-upload-text'>Click or drag file to this area to upload</p>
					<p className='ant-upload-hint'>
						Support for a single or bulk upload. Strictly prohibit from uploading company data or other band
						files
					</p>
				</Dragger>
			</div>


  </Modal>
			  
			  	<MediaLibrary
		setvisible={setvisible}
		 visible={visible}/>
			</>
		  )}
	  </Formik>


		

	);
};

export default AddNewBrand;
