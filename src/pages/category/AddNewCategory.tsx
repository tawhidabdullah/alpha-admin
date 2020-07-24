import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Switch, Select, notification, Modal, Tooltip, Upload, message } from 'antd';

import {
	DeleteOutlined,
	FileAddOutlined,
	FileImageFilled,
	PlusOutlined,
	CheckCircleOutlined,
	CloseOutlined,
	CheckOutlined,
	InfoCircleOutlined,
	LoadingOutlined
} from '@ant-design/icons';



// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

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

const { Option } = Select;

interface Props {
	addNewCategoryVisible: any;
	setAddNewCategoryVisible: any;
	categoryList?: any;
	setcategoryList?: any;
}

const AddNewCategory = ({ addNewCategoryVisible, setAddNewCategoryVisible, categoryList, setcategoryList }: Props) => {

	const [addCategoryState, handleAddCategoryFetch] = useHandleFetch({}, 'addCategory', 'form');
	const [visible, setvisible] = useState(false);
	const [myImages, setmyImages] = useState(false);
	const [myThumbnailImage, setmyThumbnailImage] = useState(false);
	const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);
	const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
	const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
	const [selectedParentId, setselectedParentId] = useState('');
	const [coverImageId, setCoverImageId] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [loadingThumnail, setLoadingThumbnail] = useState(false);
	const [imageFile, setImagefile] = useState('');





	const handleSubmit = async (values: any, actions: any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];

		const formData = new FormData();

		formData.append("name", values.name.trim());
		formData.append("description", values.description);
		formData.append("image", imagesIds);
		formData.append("cover", coverImageId || imagesIds[0] ? imagesIds[0] : '');
		formData.append("parent", selectedParentId);
		formData.append('icon', imageFile)



		const addCategoryRes = await handleAddCategoryFetch({

			body: formData,
		});



		// @ts-ignore
		if (addCategoryRes && addCategoryRes.status === 'ok') {
			openSuccessNotification('Category Created!');

			setcategoryList([...categoryList, {
				id: addCategoryRes['_id'] || '',
				key: addCategoryRes['_id'] || '',
				name: addCategoryRes['name'] || '',
				description: addCategoryRes['description'] || '',
				// @ts-ignore
				...addCategoryRes
			}])

			actions.resetForm();
			// @ts-ignore
			setmyImages([]);
			setCoverImageId('')
			setselectedParentId('')
			setisparentcategoryChecked(true);
			setAddNewCategoryVisible(false)
			setImageUrl('');
		}
		else {
			openErrorNotification();
		}




		actions.setSubmitting(false);
	};



	const onSwitchChange = (checked: any) => {
		setisparentcategoryChecked(checked)
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


	const onChangeSelect = (value) => {
		setselectedParentId(value);
	}




	function getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}


	function beforeUpload(file) {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}


		getBase64(file, imageUrl => {
			setImageUrl(imageUrl)
			setImagefile(file)
			setLoadingThumbnail(false)
		})

		return false;
	}


	const uploadButton = (
		<div>
			{loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
			<div className="ant-upload-text">Upload</div>
		</div>
	);


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

							<div style={{
								marginTop: '25px'
							}}></div>

							<div className='switchLabelContainer'>
								<Switch
									checked={isparentCategoryChecked}
									defaultChecked onChange={onSwitchChange} />
								<div className='switchLabelContainer-textContainer'>
									<h5 >Top level Category</h5>
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


							<div className='addproductSection-left-header' >
								<h3 className='inputFieldLabel'>Icon </h3>
								<Tooltip
									placement="left" title={'Add Icon image for this category'}>
									<a href='###'>
										<InfoCircleOutlined />
									</a>
								</Tooltip>
							</div>

							<Upload
								style={{
									borderRadius: "8px"
								}}
								name="avatar"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								beforeUpload={beforeUpload}
								multiple={false}
							>
								{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
							</Upload>


							<div
								style={{
									marginTop: '10px'
								}}
							/>


							<div className='addproductSection-left-header' style={{
								marginBottom: '-5px'
							}}>
								<h3 className='inputFieldLabel'>Images</h3>
								<Tooltip
									placement="left" title={'Click on the image to select cover image, By default 1st image is selected as cover'}>
									<a href='###'>
										<InfoCircleOutlined />
									</a>
								</Tooltip>
							</div>
							<div className='aboutToUploadImagesContainer'>
								{myImages &&
									// @ts-ignore
									myImages.length > 0 && myImages.map((image, index) => {
										return (
											<div className='aboutToUploadImagesContainer__item'>
												<div
													className='aboutToUploadImagesContainer__item-imgContainer'
													onClick={() => setCoverImageId(image.id)}
												>
													<img src={image.cover} alt={image.alt} />
												</div>

												<span
													onClick={() => handleImagesDelete(image.id)}
													className='aboutToUploadImagesContainer__item-remove'>
													<CloseOutlined />
												</span>


												{coverImageId === image.id ? (
													<span className='aboutToUploadImagesContainer__item-cover'>
														<CheckOutlined />
													</span>
												) : !coverImageId && index === 0 && (
													<span className='aboutToUploadImagesContainer__item-cover'>
														<CheckOutlined />
													</span>
												)}


											</div>
										)
									})}


								<Tooltip
									title={'Attach images'}>

									<div
										onClick={() => {
											setvisible(true);
											setisModalOpenForImages(true);
											setisModalOpenForThumbnail(false);
										}}
										className='aboutToUploadImagesContainer__uploadItem'>
										{/* <FileAddOutlined />
													<FileImageTwoTone />
													<FileImageOutlined /> */}
										<FileImageFilled />
										{/* <h5>
												     Select From Library
											<     /h5> */}
										<span className='aboutToUploadImagesContainer__uploadItem-plus'>
											<PlusOutlined />
										</span>
									</div>
								</Tooltip>

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
