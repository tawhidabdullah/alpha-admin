import React,{useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import {useHandleFetch} from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import Tags from "./Tags";
import Brands from "./Brands";
import Categories from "./Categories";
import Attributes from "./Attributes";




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
	addNewCategoryVisible: any; 
	setAddNewCategoryVisible: any; 
	categoryList?: any; 
}

const AddNewProduct = ({ addNewCategoryVisible, setAddNewCategoryVisible,categoryList }: Props) => {

	const [addCategoryState, handleAddCategoryFetch] = useHandleFetch({}, 'addCategory');
	const [visible,setvisible] = useState(false);   
	const [myImages,setmyImages] = useState(false);   
	const [myThumbnailImage,setmyThumbnailImage] = useState(false);   
	const [isparentCategoryChecked,setisparentcategoryChecked] = useState(true); 
	const [isModalOpenForThumbnail,setisModalOpenForThumbnail] = useState(false); 
	const [isModalOpenForImages,setisModalOpenForImages] = useState(false); 
	const [selectedParentId,setselectedParentId] =useState(''); 



	const handleSubmit = async (values : any, actions : any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}): []; 

			// @ts-ignore
	const coverId = myThumbnailImage ? myThumbnailImage[0] && myThumbnailImage[0].id: ''; 


	  const addCategoryRes = await handleAddCategoryFetch({
		
		body: {
			name: values.name,
			description: values.description,
			image: imagesIds,
			cover: coverId,
			parent: setselectedParentId
		},
	  });
	
	  actions.setSubmitting(false);
	};



	const onSwitchChange = (checked: any) => {
		setisparentcategoryChecked(checked)
		console.log(checked);
	};


	const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
      };


	const getisSubmitButtonDisabled = (values,isValid) => {
		if(!values.name || !values.description || !isValid){
			return true; 
		}
		return false; 
	  }


	  const handleImagesDelete = (id) => {
		  // @ts-ignore
		  const newImages = myImages && myImages.filter(image => {
			  return image.id !== id; 
		  })

		  setmyImages(newImages); 
	  }


	  const handleThumbnailImageDelete = (id) => {
		    // @ts-ignore
			const newImages = myThumbnailImage && myThumbnailImage.filter(image => {
				return image.id !== id; 
			})

			if(newImages.length >  0){
				setmyThumbnailImage(newImages); 

			}
  			else setmyThumbnailImage(false);
	  }




	  console.log('isparentCategoryChecked', isparentCategoryChecked); 


	  const onChangeSelect = (value) => {
		setselectedParentId(value); 
		console.log('selectedValue',value); 
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
				top: '40px',
			
			}}
			bodyStyle={{
				margin: 0,
				padding: 0,
			}}
			width={'70vw'}
			title="Add New Product"
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


<section className='addProductGridContainer'>
	<div className='addProductGridContainer__left'>
	<div className='addProductGridContainer__name'> 
	<div className='addProductGridContainer__item-header'>
			<h3>
				Product Information 
			</h3>
	 </div>
	 <div className='addProductGridContainer__item-body'>
	 <Input 
			   label='Title'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && addCategoryState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addCategoryState.error['error']['name'])}
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
				  (!isSubmitting && addCategoryState.error['error']['description'])}
			  
				  errorString={(touched.description && errors.description) ||
					  (!isSubmitting && addCategoryState.error['error']['description'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('description');
				}}
				 />

<Input 
			   label='Model Number'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && addCategoryState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addCategoryState.error['error']['name'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('name');
				}}
			   />


<Input 
			   label='Unit'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && addCategoryState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addCategoryState.error['error']['name'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('name');
				}}
			   />



	 </div>


	
	</div>

	
	<div className='addProductGridContainer__model'> 
	model
	</div>
	<div className='addProductGridContainer__price'> 
	 <div className='addProductGridContainer__item-header'>
			<h3>
				Product Variation 
			</h3>
	 </div>
	 <div className='addProductGridContainer__item-body'>
			<Attributes />
	 </div>
	</div>
	
	
	<div className='addProductGridContainer__image'> 

	<div className='addProductGridContainer__item-header'>
			<h3>
				Image 
			</h3>
	 </div>
	 <div className='addProductGridContainer__item-body'>

			

			<div className='aboutToUploadImagesContainer'>
				{myImages &&
				// @ts-ignore
				 myImages.length > 0 &&  myImages.map(image => {
					 return (
						 <div className='aboutToUploadImagesContainer__item'>
							 <div 
							 onClick={() => handleImagesDelete(image.id)}
							 className='aboutToUploadImagesContainer__item-overlay'>
								 <DeleteOutlined />
							 </div>
							 <img src={image.cover} alt={image.alt} />
						 </div>
					 )
				 })}

				<div 
				onClick={()=> {
					setvisible(true); 
					setisModalOpenForImages(true); 
					setisModalOpenForThumbnail(false); 
				}}
				className='aboutToUploadImagesContainer__uploadItem'>
					<FileAddOutlined />
											{/* <h5>
												Select From Library
											</h5> */}
										</div>
							
							</div>		
	 </div>



	</div>

	</div>
	<div className='addProductGridContainer__right'>
	<div className='addProductGridContainer__category'> 

		<div className='addProductGridContainer-rightItemContainer'>
			<div className='addProductGridContainer-rightItemContainer-header'>
				<h3>
					Categories
				</h3>
			</div>
			<div className='addProductGridContainer-rightItemContainer-body'>
				<Categories/>
			</div>
		</div>

	</div>
	
	<div className='addProductGridContainer__tag'> 
	<div className='addProductGridContainer-rightItemContainer'>
			<div className='addProductGridContainer-rightItemContainer-header'>
				<h3>
					Tags
				</h3>
			</div>
			<div className='addProductGridContainer-rightItemContainer-body'>
				<Tags />
			</div>
		</div>

	</div>
	<div className='addProductGridContainer__brand'> 
	<div className='addProductGridContainer-rightItemContainer'>
			<div className='addProductGridContainer-rightItemContainer-header'>
				<h3>
				Brands
				</h3>
			</div>
			<div className='addProductGridContainer-rightItemContainer-body'>
				<Brands />
			</div>
		</div>


	</div>
	
</div>




</section>




		


		


  </Modal>
			  
			  	<MediaLibrary
		setvisible={setvisible}
		 visible={visible}
		 setmyImages={setmyImages}
		 setmyThumbnailImage={setmyThumbnailImage}
		 isModalOpenForThumbnail={isModalOpenForThumbnail}
		 isModalOpenForImages={isModalOpenForImages}
		 
		 />
			</>
		  )}
	  </Formik>


		

	);
};

export default AddNewProduct;




/*


Product variation ----> 

Price [title] 
	[regular input field] [offer inputfield]

Stock [title] 
	[available input field] [minimum inputfield]

default [default can be set to true] 

attributes [title]
	[add attributes name]
		[add attrubutes value]
		
	[add attributes name]
		[add attrubutes value]



*/