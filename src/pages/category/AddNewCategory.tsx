import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, notification, Modal } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined
} from '@ant-design/icons';



import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";



const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Category Updated',
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
	setcategoryList?: any;
}

const AddNewCategory = ({ addNewCategoryVisible, setAddNewCategoryVisible, categoryList, setcategoryList }: Props) => {

	const [addCategoryState, handleAddCategoryFetch] = useHandleFetch({}, 'addCategory');
	const [visible, setvisible] = useState(false);
	const [myImages, setmyImages] = useState(false);
	const [myThumbnailImage, setmyThumbnailImage] = useState(false);
	const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);
	const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
	const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
	const [selectedParentId, setselectedParentId] = useState('');



	const handleSubmit = async (values: any, actions: any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];

		const addCategoryRes = await handleAddCategoryFetch({

			body: {
				name: values.name,
				description: values.description,
				image: imagesIds,
				cover: imagesIds[0] ? imagesIds[0] : '',
				parent: selectedParentId
			},
		});


		// @ts-ignore
		if (addCategoryRes && addCategoryRes.status === 'ok') {
			openSuccessNotification('Category Created!');

			setcategoryList([...categoryList, {
				id: addCategoryRes['id'] || '',
				key: addCategoryRes['id'] || '',
				name: addCategoryRes['name'] || '',
				description: addCategoryRes['description'] || '',
				// @ts-ignore
				...addCategoryRes
			}])
			actions.resetForm();
			setAddNewCategoryVisible(false)
		}
		else {
			openErrorNotification();
		}




		actions.setSubmitting(false);
	};



	const onSwitchChange = (checked: any) => {
		setisparentcategoryChecked(checked)
		console.log(checked);
	};


	const handleCancel = (e: any) => {
		setAddNewCategoryVisible(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!values.name || !isValid) {
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

		if (newImages.length > 0) {
			setmyThumbnailImage(newImages);

		}
		else setmyThumbnailImage(false);
	}




	console.log('isparentCategoryChecked', isparentCategoryChecked);


	const onChangeSelect = (value) => {
		setselectedParentId(value);
		console.log('selectedValue', value);
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
							title="Add New Category"
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
								label='Title'
								value={values.name}
								name='name'
								isError={(touched.name && errors.name) ||
									(!isSubmitting && addCategoryState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && addCategoryState.error['error']['name'])}
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
									(!isSubmitting && addCategoryState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && addCategoryState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
								}}
							/>

							<div className='switchLabelContainer'>
								<Switch defaultChecked onChange={onSwitchChange} />
								<div className='switchLabelContainer-textContainer'>
									<h4 className='switchLabelContainer-label'>Top level Category</h4>
									<h5 className='switchLabelContainer-desc'>Disable to select a Parent Category</h5>
								</div>
							</div>

							{!isparentCategoryChecked && (
								<>
									<h3 className='inputFieldLabel'>Parent Category</h3>
									<Select
										showSearch
										style={{ width: 300 }}
										placeholder='Select a Parent Category'
										optionFilterProp='children'
										onChange={onChangeSelect}
										// onFocus={onFocus}
										// onBlur={onBlur}
										// onSearch={onSearch}
										filterOption={(input, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{categoryList.length > 0 && categoryList.map(category => {
											return <Option value={category.id}>{category.name}</Option>
										})}


									</Select>
								</>
							)}
							<div
								style={{
									marginTop: '20px'
								}}
							/>


							<div className='addproductSection-left-header'>
								<h3 className='inputFieldLabel'>Images</h3>
								{/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
							</div>
							<div className='aboutToUploadImagesContainer'>
								{myImages &&
									// @ts-ignore
									myImages.length > 0 && myImages.map(image => {
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
									onClick={() => {
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


						</Modal>

						<MediaLibrary
							setvisible={setvisible}
							visible={visible}
							setmyImages={setmyImages}
							myImages={myImages}
							setmyThumbnailImage={setmyThumbnailImage}
							isModalOpenForThumbnail={isModalOpenForThumbnail}
							isModalOpenForImages={isModalOpenForImages}

						/>
					</>
				)}
		</Formik>




	);
};

export default AddNewCategory;
