import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip, Spin } from 'antd';

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
	FileImageFilled,
	LoadingOutlined
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


const { Option } = Select;



interface Props {
	addNewCategoryVisible?: any;
	setAddNewCategoryVisible?: any;
	productRecord?: any;
	brandList: any;
	setBrandList?: any;
}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, productRecord, setBrandList, brandList }: Props) => {

	const [updateBrandState, handleUpdateBrandFetch] = useHandleFetch({}, 'updateCategory');
	const [brandDetailState, handleBrandDetailFetch] = useHandleFetch({}, 'categoryDetail');
	const [attachImageToItemMultipleState, handleAttachImageToItemMultipleFetch] = useHandleFetch({}, 'attachImageToItemMultiple');
	const [attachImageToItemSingleState, handleAttachImageToItemSingleFetch] = useHandleFetch({}, 'attachImageToItemSingle');
	const [detachImageFromItemMultipleState, handleDetachImageFromItemMultipleFetch] = useHandleFetch({}, 'detachImageFromItemMultiple');
	const [detachImageFromItemSingleState, handleDetachImageFromItemSingleFetch] = useHandleFetch({}, 'detachImageFromItemSingle');
	const [setImageAsThumbnailToItemState, handleSetImageAsThumbnailToItemFetch] = useHandleFetch({}, 'setImageAsThumbnailToItem');


	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);
	const [coverImageId, setCoverImageId] = useState('');
	const [myGoddamnImages, setMyGoddamnImages] = useState([]);
	const [selectedParentId, setselectedParentId] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [loadingThumnail, setLoadingThumbnail] = useState(false);
	const [imageFile, setImagefile] = useState('');
	const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);


	useEffect(() => {

		const getBrandDetail = async () => {
			await handleBrandDetailFetch({
				urlOptions: {
					placeHolders: {
						id: productRecord.id
					}
				}
			})
		};

		getBrandDetail();

	}, [productRecord]);


	useEffect(() => {
		if (brandDetailState.done && Object.keys(brandDetailState).length > 0) {

			const images = brandDetailState.data.image;
			if (images && images.length > 0) {
				setmyImages(images);
				setMyGoddamnImages(images);
			}

			if (brandDetailState.data.cover && brandDetailState.data.cover['id']) {
				// @ts-ignore
				setmyImages([brandDetailState.data.cover, ...images]);
				setCoverImageId(brandDetailState.data.cover['id']);
			}

		}
	}, [brandDetailState])


	useEffect(() => {
		// @ts-ignore
		if (myImages && myImages[0] && myImages.length < 2) {

			if (coverImageId !== myImages[0].id) {
				setCoverImageId(myImages[0].id);
				handleSetImageAsThumnail(myImages[0]);
			}

		}

	}, [myImages])


	const handleDetachSingleImage = async id => {
		await handleDetachImageFromItemSingleFetch({
			urlOptions: {
				placeHolders: {
					imageId: id,
					collection: 'category',
					itemId: productRecord.id
				}
			}
		});


	}



	const handleSetImageAsThumnail = async image => {

		const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
			urlOptions: {
				placeHolders: {
					imageId: image.id,
					collection: 'category',
					itemId: productRecord.id
				}
			}
		});


		// @ts-ignore
		if (thumbnailRes && thumbnailRes.status === 'ok') {
			openSuccessNotification('Seted as thumbnail!')
			const positionInBrand = () => {
				return brandList.map(item => item.id).indexOf(productRecord.id);
			}

			const index = positionInBrand();

			const prevItem = brandList.find(item => item.id === productRecord.id);

			if (prevItem) {
				// @ts-ignore
				const updatedItem = Object.assign({}, brandList[index], { ...prevItem, cover: image.cover });
				const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];
				setBrandList(updateBrandList);

			}
		}
		else {
			openErrorNotification("Couldn't set as thumbnail, Something went wrong")
		}

	}



	console.log('categoryDetailState', brandDetailState);

	const handleSubmit = async (values: any, actions: any) => {

		console.log('myReadyToGoImages', myImages);

		if (brandDetailState && brandDetailState.done && Object.keys(brandDetailState.data).length > 0) {
			// @ts-ignore
			const images = myImages && myImages.length > 0 ? myImages.map(item => item.id) : [];

			if (images[0] && images.length > 1) {
				await handleAttachImageToItemMultipleFetch({
					urlOptions: {
						placeHolders: {
							collection: 'category',
							itemId: productRecord.id
						}
					},
					body: {
						image: images
					}
				});
			}
			else if (images[0] && images.length < 1) {
				await handleAttachImageToItemSingleFetch({
					urlOptions: {
						placeHolders: {
							imageId: images[0].id,
							collection: 'category',
							itemId: productRecord.id
						}
					}
				});
			}
		}




		const updateBrandRes = await handleUpdateBrandFetch({
			urlOptions: {
				placeHolders: {
					id: productRecord.id
				}
			},
			body: {
				name: values.name.trim(),
				description: values.description,
				icon: imageFile,
				type: 'bottom'
			},
		});

		// @ts-ignore
		if (updateBrandRes && updateBrandRes.status === 'ok') {
			openSuccessNotification();
			setAddNewCategoryVisible(false);


			const positionInBrand = () => {
				return brandList.map(item => item.id).indexOf(productRecord.id);
			}

			const index = positionInBrand();
			// @ts-ignore
			const updatedItem = Object.assign({}, brandList[index], { ...updateBrandRes });
			console.log('updateBrandList', updatedItem)

			const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];

			setBrandList(updateBrandList);


			actions.resetForm();

		}
		else {
			openErrorNotification();
		}

		actions.setSubmitting(false);
	};



	const onSwitchChange = (checked: any) => {
		setisparentcategoryChecked(checked)
	};


	useEffect(() => {
		if (productRecord.type === 'top') {
			// setisparentcategoryChecked()
		}
	}, [productRecord])


	const handleCancel = (e: any) => {
		setAddNewCategoryVisible(false);
		setmyImages(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!values.name || !isValid) {
			return true;
		}
		return false;
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




	const handleImagesDelete = (id) => {
		// @ts-ignore
		const newImages = myImages && myImages.filter(image => {
			return image.id !== id;
		})

		// @ts-ignore
		setmyImages([]);
	}


	const uploadButton = (
		<div>
			{loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
			<div className="ant-upload-text">Upload</div>
		</div>
	);





	console.log('myImages', myImages)

	return (
		<Formik
			onSubmit={(values, actions) => handleSubmit(values, actions)}
			validationSchema={validationSchema}
			validateOnBlur={false}
			enableReinitialize={true}
			initialValues={
				{ ...initialValues, ...productRecord }
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
							title="Category Detail"
							visible={addNewCategoryVisible}
							onOk={(e: any) => handleSubmit(e)}
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
									(!isSubmitting && updateBrandState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && updateBrandState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>
							<TextArea
								rows={3}
								label='Description'
								value={values.description}
								name='description'
								isError={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
								}}
							/>

							{/* <div style={{
								marginTop: '25px'
							}}></div>

							<div className='switchLabelContainer'>
								<Switch
									checked={isparentCategoryChecked}
									onChange={onSwitchChange} />
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
										style={{ width: 400 }}
										placeholder='Select a Parent Category'
										optionFilterProp='children'
										onChange={onChangeSelect}
										// onFocus={onFocus}
										// onBlur={onBlur}
										// onSearch={onSearch}
										filterOption={(input, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{brandList.length > 0 && brandList.map(category => {
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
 */}


							<div
								style={{
									marginTop: '20px'
								}}
							/>


							<div className='addproductSection-left-header'

								style={{
									marginBottom: '-5px'
								}}
							>
								<h3 className='inputFieldLabel'>Images</h3>
								{/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
							</div>


							<div className='aboutToUploadImagesContainer'>
								{brandDetailState.isLoading && (
									<div style={{
										padding: '20px 0'
									}}>
										<Spin />
									</div>
								)}
								{brandDetailState.done && (
									<>
										{myImages &&
											// @ts-ignore
											myImages.length > 0 && myImages.map((image, index) => {
												return (
													<div className='aboutToUploadImagesContainer__item'>
														<div
															className='aboutToUploadImagesContainer__item-imgContainer'
															onClick={() => {
																setCoverImageId(image.id);
																handleSetImageAsThumnail(image);
															}}
														>
															<img src={image.cover} alt={image.alt} />
														</div>

														<span
															onClick={() => {
																handleImagesDelete(image.id)
																handleDetachSingleImage(image.id)
															}

															}
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
													setvisibleMedia(true);
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
									</>
								)}


							</div>

						</Modal>

						<MediaLibrary
							setvisible={setvisibleMedia}
							visible={visibleMedia}
							setmyImages={setmyImages}
							myImages={myImages}
							myGoddamnImages={myGoddamnImages}
							setMyGoddamnImages={setMyGoddamnImages}
							isModalOpenForImages={true}

						/>
					</>
				)}
		</Formik>




	);
};

export default AddNewBrand;
