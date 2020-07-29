import React, { useState, useEffect } from 'react';

// import hooks 
import { useHandleFetch } from '../../hooks';


// import libraries 
import { Formik } from 'formik';
import * as Yup from 'yup';
import { message, Tooltip, Modal, Tabs, Empty, Badge } from 'antd';

import {
	DeleteOutlined,
	CheckCircleOutlined,
	FileImageFilled,
	FileImageOutlined,
	FileImageTwoTone,
	PlusOutlined,
	PlusCircleOutlined,
	CloseOutlined,
	CheckOutlined,
	InfoCircleOutlined,
	EditOutlined
} from '@ant-design/icons';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import DatePicker from "../../components/Field/DatePicker";
import { openSuccessNotification, openErrorNotification } from "../../components/Notification";

// import assets 
// import {  } from "";

const { TabPane } = Tabs;

const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});


const initialValues = {
	name: '',
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
	venue: '',
	date: '',
	purchaseLimit: null
}


interface Props {
	addNewCategoryVisible: any;
	setAddNewCategoryVisible: any;
	productRecord: any;
}

const CategoryDetail = ({ addNewCategoryVisible, setAddNewCategoryVisible, productRecord }: Props) => {

	const [addProductState, handleAddProductFetch] = useHandleFetch({}, 'addProduct');
	const [visible, setvisible] = useState(false);
	const [myImages, setmyImages] = useState(false);
	const [myThumbnailImage, setmyThumbnailImage] = useState(false);
	const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
	const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
	const [categoryids, setcategoryIds] = useState([]);
	const [tagIds, setTagIds] = useState([]);
	const [brandId, setBrandId] = useState('');
	const [pricing, setPricing] = useState([]);
	const [coverImageId, setCoverImageId] = useState('');
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [date, setDateFeild] = useState('');


	const [categoryDetailByIdState, handleCategoryDetailByIdFetch] = useHandleFetch(
		{},
		'categoryDetail'
	);

	const [localProductDetail, setLocalProductDetail] = useState({});


	useEffect(() => {
		const getProductDetail = async () => {

			const productDetail = await handleCategoryDetailByIdFetch({
				urlOptions: {
					placeHolders: {
						id: productRecord.id
					}
				}
			});

			// @ts-ignore
			if (productDetail) {
				// @ts-ignore
				setLocalProductDetail(productDetail)

			}
		}

		getProductDetail();

	}, [])




	console.log('localProductDetail', localProductDetail)
	console.log('localProductDetail', localProductDetail)
	console.log('categoryDetailByIdState', categoryDetailByIdState)

	const makeEmptyCategoryOptions = (setEmpty) => {
		setEmpty([]);
	}

	const handleSubmit = async (values: any, actions: any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];



		const myData = {
			name: values.name.trim(),
			description: values.description,
			model: values.model,
			unit: values.unit,
			category: categoryids,
			tags: tagIds,
			brand: brandId,
			image: imagesIds,
			cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
			pricing: pricing,
			date: date,
			venue: values.venue,
			purchaseLimit: values.purchaseLimit
		};

		console.log('myData', myData)

		const addProductRes = await handleAddProductFetch({

			body: {
				name: values.name.trim(),
				description: values.description,
				model: values.model,
				unit: values.unit,
				category: categoryids,
				tags: tagIds,
				brand: brandId,
				image: imagesIds,
				cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
				pricing: pricing,
				date: date,
				venue: values.value,
				purchaseLimit: values.purchaseLimit
			},
		});


		// @ts-ignore
		if (addProductRes && addProductRes.status === 'ok') {
			openSuccessNotification('Product Created');


			setAddNewCategoryVisible(false)
			// @ts-ignore
			setmyImages([]);
			setCoverImageId('');
			setPricing([]);
			setTagIds([]);
			setSelectedTags([]);
			setBrandId("");
			setcategoryIds([]);
			setCategoryOptions([]);
			actions.resetForm();
		}
		else {
			// openErrorNotification();
		}

		actions.setSubmitting(false);


	};



	useEffect(() => {
		if (!addProductState['isLoading']) {
			const error = addProductState['error'];
			if (error['isError'] && Object.keys(error['error']).length > 0) {


				const errors =
					Object.values(error['error']).length > 0
						? Object.values(error['error'])
						: [];
				errors.forEach((err, i) => {
					if (typeof err === 'string') {
						openErrorNotification(err)
					}
					else if (typeof err === 'object') {
						if (err && Object.keys(err).length > 0) {
							const errs = Object.values(err);
							errs.forEach(err => {
								openErrorNotification(err)
							})

						}
					}
				});
			}
		}
	}, [addProductState])


	const handleCancel = (e: any) => {
		setAddNewCategoryVisible(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!values.name || !(pricing.length > 0) || !isValid) {
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

	const handleDeleteFromSelectedImage = () => {

	};

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





	const handleAddPricing = (priceItem) => {

		setPricing([{
			...priceItem,
			id: pricing.length
		}, ...pricing])
		message.info('Product Pricing Added');
	}


	const handleDeletePricing = (id) => {
		const newPricing = pricing.filter(item => item.id !== id);
		setPricing(newPricing);
		message.info('Product Pricing Deleted');
	}



	const isCategoryInValid = () => {
		if (addProductState.error['error']['category'] && !categoryids && categoryids.length) {
			return true;
		}
		else if (categoryids && categoryids.length > 0) {
			return false;
		}
	}

	const handleDateChange = (date, dateString) => {
		setDateFeild(dateString);
		// console.log('date', date, dateString);
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
								top: '40px',

							}}
							bodyStyle={{
								margin: 0,
								padding: 0,
							}}
							width={'50vw'}
							title="Event Detail"
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

							<section className='detailViewContainer'>
								<div className="detailViewContainer__cover">
									{productRecord && productRecord['cover'] && (
										<img
											className='detailViewContainer__cover-img'
											src={productRecord['cover']}
											alt="cover img" />
									)}

								</div>
								<div className="detailViewContainer__body">

									<div className="detailViewContainer__body-imageGallaryContainer">
										<div className="detailViewContainer__body-imageGallaryContainer-item">
											<img src={require('../../assets/backImage.jpg')} alt="" className='detailViewContainer__body-imageGallaryContainer-item-img' />
										</div>
										<div className="detailViewContainer__body-imageGallaryContainer-item">
											<img src={require('../../assets/backImage.jpg')} alt="" className='detailViewContainer__body-imageGallaryContainer-item-img' />
										</div>
										<div className="detailViewContainer__body-imageGallaryContainer-item">
											<img src={require('../../assets/backImage.jpg')} alt="" className='detailViewContainer__body-imageGallaryContainer-item-img' />
										</div>
										<div className="detailViewContainer__body-imageGallaryContainer-item">
											<img src={require('../../assets/backImage.jpg')} alt="" className='detailViewContainer__body-imageGallaryContainer-item-img' />
										</div>
										<div className="detailViewContainer__body-imageGallaryContainer-item">
											<img src={require('../../assets/backImage.jpg')} alt="" className='detailViewContainer__body-imageGallaryContainer-item-img' />
										</div>
									</div>

									<Tabs defaultActiveKey="1" type='card'>
										<TabPane
											tab={
												<span style={{
													width: '12vw',
													fontWeight: 600,
												}}>
													Information details
                                            </span>
											}
											key="1">
											<div className="detailViewContainer__body-infoContainer">
												<div className="detailViewContainer__body-infoContainer-item">
													<h2 className='detailViewContainer__body-infoContainer-item-title'>
														Title
                                                            <span>
															<a href='##'>
																<EditOutlined />
															</a>
														</span>
													</h2>
													<h3 className='detailViewContainer__body-infoContainer-item-info'>
														Aenger Captain America
                                                     </h3>
													<Input />

												</div>


												<div className="detailViewContainer__body-infoContainer-item">
													<h2 className='detailViewContainer__body-infoContainer-item-title'>
														Venue
                                                            <span>
															<a href='##'>
																<EditOutlined />
															</a>
														</span>
													</h2>
													<h3 className='detailViewContainer__body-infoContainer-item-info'>
														Bochila, Dhaka
                                                     </h3>
													<Input />

												</div>



												<div className="detailViewContainer__body-infoContainer-item">
													<h2 className='detailViewContainer__body-infoContainer-item-title'>
														Date
                                                            <span>
															<a href='##'>
																<EditOutlined />
															</a>
														</span>
													</h2>
													<h3 className='detailViewContainer__body-infoContainer-item-info'>
														25 june, 2016
                                                     </h3>
													<Input />

												</div>



												<div className="detailViewContainer__body-infoContainer-item">
													<h2 className='detailViewContainer__body-infoContainer-item-title'>
														Time
                                                            <span>
															<a href='##'>
																<EditOutlined />
															</a>
														</span>
													</h2>
													<h3 className='detailViewContainer__body-infoContainer-item-info'>
														6 hour 26 minutes
                                                     </h3>
													<Input />

												</div>





												<div className="detailViewContainer__body-infoContainer-item">
													<h2 className='detailViewContainer__body-infoContainer-item-title'>
														Description

                                                        <span>
															<a href='##'>
																<EditOutlined />
															</a>
														</span>
													</h2>
													<h3 className='detailViewContainer__body-infoContainer-item-info'>
														R.K INTERNATIONAL is a all kinds of quality plastic goods,curtain eyelets & hot stamper
														Pneumatic & Hydraulics Machine Producer ,manufacturer and supplier.
                                                   </h3>
													<Input />

												</div>

											</div>
										</TabPane>
										<TabPane
											tab={
												<span style={{
													width: '12vw',
													fontWeight: 600,

												}}>
													Pricing
                                        </span>
											} key="2">
											Content of Tab Pane 2
    </TabPane>
										<TabPane

											tab={
												<span style={{
													width: '12vw',
													fontWeight: 600,

												}}>
													Classfication
                                        </span>
											} key="3">
											Content of Tab Pane 3
    </TabPane>
									</Tabs>



								</div>
							</section>


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

export default CategoryDetail;




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
		[add attrubutes value

*///