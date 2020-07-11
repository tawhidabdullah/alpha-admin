import React,{useState} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import {useHandleFetch} from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal,Tabs, Empty } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	EditOutlined,
	FileAddOutlined,
	PlusCircleOutlined,
	PlusOutlined
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
import Pricing from "./Pricing";


const { TabPane } = Tabs;



const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});


const initialValues = {
	name:'',
	description: '',
	model: '',
	unit: '',
	regular: '',
	offer: '',
	available: '',
	minimum: '',
	image: [],
	url: '',
	cover: '',
	pricing: [],

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

	const [addProductState, handleAddProductFetch] = useHandleFetch({}, 'addProduct');
	const [visible,setvisible] = useState(false);   
	const [myImages,setmyImages] = useState(false);   
	const [myThumbnailImage,setmyThumbnailImage] = useState(false);   
	const [isparentCategoryChecked,setisparentcategoryChecked] = useState(true); 
	const [isModalOpenForThumbnail,setisModalOpenForThumbnail] = useState(false); 
	const [isModalOpenForImages,setisModalOpenForImages] = useState(false); 
	const [selectedParentId,setselectedParentId] =useState(''); 
	const [categoryids,setcategoryIds] = useState([]); 
	const [tagIds,setTagIds] = useState([]); 
	const [brandId,setBrandId] = useState(''); 
	const [pricing,setPricing] = useState([]); 
	



	const handleSubmit = async (values : any, actions : any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}): []; 



	  const addProductRes = await handleAddProductFetch({
		
		body: {
			name: values.name,
			description: values.description,
			model: values.model,
			unit: values.unit,
			category: categoryids,
			tags: tagIds,
			brand: brandId,
			image: imagesIds,
			cover: imagesIds[0] ? imagesIds[0] : '',
			pricing: pricing,
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


	  const handleAddPricing = (priceItem) => {
		
		  setPricing([priceItem, ...pricing,])
	  }


	  console.log('pricing',pricing)

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
				  (!isSubmitting && addProductState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addProductState.error['error']['name'])}
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
				  (!isSubmitting && addProductState.error['error']['description'])}
			  
				  errorString={(touched.description && errors.description) ||
					  (!isSubmitting && addProductState.error['error']['description'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('description');
				}}
				 />

<Input 
			   label='Model Number'
			   value={values.model}
			   name='model'
			   isError={(touched.model && errors.model) ||
				  (!isSubmitting && addProductState.error['error']['model'])}
			  
				  errorString={(touched.model && errors.model) ||
					  (!isSubmitting && addProductState.error['error']['model'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('model');
				}}
			   />


<Input 
			   label='Unit'
			   value={values.unit}
			   name='unit'
			   isError={(touched.unit && errors.unit) ||
				  (!isSubmitting && addProductState.error['error']['unit'])}
			  
				  errorString={(touched.unit && errors.unit) ||
					  (!isSubmitting && addProductState.error['error']['unit'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('unit');
				}}
			   />

	 </div>


	
	</div>

	

	<div className='addProductGridContainer__price'> 
	 <div className='addProductGridContainer__item-header'>
			<h3>
				Product Variation 
			</h3>
	 </div>


	 <div className='addProductGridContainer__item-body'>

	 <Tabs 
	
	 type='card'
	 >
          <TabPane tab="Add Pricing" key="1">
				<Pricing handleAddPricing={handleAddPricing} />
          </TabPane>
          <TabPane tab="Pricing" key="2">
				<div className='addProductGridContainer__item-body-pricingContainer'>
				
				{pricing.length > 0 && pricing.map(item => {
					return (
						<div className='addProductGridContainer__item-body-pricingContainer-item'>
						<div className='addProductGridContainer__item-body-pricingContainer-item-edit'>
							<span>
							<EditOutlined />
							</span>
							<span className='d'>
							<DeleteOutlined />
							</span>
						</div>
						<div className='addProductGridContainer__item-body-pricingContainer-item-two'>
						<div>
					<h3>
							Pricing
						</h3>
						<div className='addProductGridContainer__item-body-pricingContainer-item-body'>

							{item.price && item.price.offer && (
								<div>
								<h6>
									offer
								</h6>
								<h4>
									{item.price.offer}
								</h4>
								</div>
							)}
							

							{item.price && item.price.regular && (
								<div>
								<h6>
								regular
								</h6>
								<h4>
									{item.price.regular}
								</h4>
								</div>
							)}
							
						
							
						</div>
					</div>

					{item.stock && (
									<div>
									<h3>
										Stock
									</h3>
									<div className='addProductGridContainer__item-body-pricingContainer-item-body'>
										<div>
										<h6>
											available
										</h6>
										<h4>
											{item.stock.available}
										</h4>
										</div>
										
										<div>
										<h6>
											minimum
										</h6>
										<h4>
											{item.stock.minimum}
										</h4>
										</div>
										
									</div>
									</div>
							)}


					
						</div>

						<h3>
							Attributes
						</h3>
						<div className='addProductGridContainer__item-body-pricingContainer-item-body'>
							<div>
							<h6>
								color
							</h6>
							<h4>
								black
							</h4>
							</div>
							
							<div>
							<h6>
								brand
							</h6>
							<h4>
							apple
							</h4>
							</div>
							
						</div>
					</div>
					)
				})}
						

						{!(pricing.length > 0) && <div style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center'
						}}>
							<Empty description='No Pricing added'  image={Empty.PRESENTED_IMAGE_SIMPLE} />
							</div>}
				</div>
          </TabPane>
         
        </Tabs>

				<div className='addProductGridContainer__item-body-container'>

				</div>
		
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
				<Categories setcategoryIds={setcategoryIds}/>
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
				<Tags setTagIds={setTagIds}/>
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
				<Brands setBrandId={setBrandId}/>
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