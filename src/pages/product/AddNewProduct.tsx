import React, { useState, useEffect } from 'react';

// import hooks 
import { useHandleFetch } from '../../hooks';


// import libraries 
import { Formik } from 'formik';
import * as Yup from 'yup';
import { message, Tooltip, Modal, Tabs, Empty, Badge } from 'antd';
import {
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined,
	FileImageFilled,
	FileImageOutlined,
	FileImageTwoTone,
	PlusOutlined,
	PlusCircleOutlined,
	CloseOutlined,
	CheckOutlined,
	InfoCircleOutlined
} from '@ant-design/icons';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import { openSuccessNotification, openErrorNotification } from "../../components/Notification";
import Tags from "./Tags";
import Brands from "./Brands";
import Categories from "./Categories";
import Pricing from "./Pricing";

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

}


interface Props {
	addNewCategoryVisible: any;
	setAddNewCategoryVisible: any;
	productList?: any;
	setProductList?: any;
}

const AddNewProduct = ({ addNewCategoryVisible, setAddNewCategoryVisible, productList, setProductList }: Props) => {

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




	const handleSubmit = async (values: any, actions: any) => {
		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];



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
				cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
				pricing: pricing,
			},
		});



		// @ts-ignore
		if (addProductRes && addProductRes.status === 'ok') {
			openSuccessNotification('Product Created');

			setProductList([...productList, {
				id: addProductRes['id'] || '',
				key: addProductRes['id'] || '',
				name: addProductRes['name'] || '',
				description: addProductRes['description'] || '',
				// @ts-ignore
				...addProductRes
			}])
			setAddNewCategoryVisible(false)
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
							width={'70vw'}
							title="Add New Product"
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


							<section className='addProductGridContainer'>
								<div className='addProductGridContainer__left'>
									<div className='addProductGridContainer__name'>
										<div className='addProductGridContainer__item-header'>
											<h3>
												Product Information
			</h3>

											<div className={values.name && values.name.length > 2 ? 'checkicon-active' : 'checkicon'}>
												<CheckCircleOutlined />
											</div>
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
													(!isSubmitting && addProductState.error['error']['description'])}

												errorString={(touched.description && errors.description) ||
													(!isSubmitting && addProductState.error['error']['description'])}
												onChange={(e: any) => {
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
												onChange={(e: any) => {
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
												onChange={(e: any) => {
													handleChange(e);
													setFieldTouched('unit');
												}}
											/>

										</div>



									</div>



									<div className='addProductGridContainer__price'>
										<div className='addProductGridContainer__item-header'>
											<h3>
												Product Pricing
			</h3>

											<div className={pricing && pricing.length > 0 ? 'checkicon-active' : 'checkicon'}>
												<CheckCircleOutlined />
											</div>
										</div>


										<div className='addProductGridContainer__item-body'>

											<Tabs

												type='card'
											>
												<TabPane tab="Add Variation" key="1">
													<Pricing handleAddPricing={handleAddPricing} />
												</TabPane>
												<TabPane tab="Pricing List" key="2">
													<div className='addProductGridContainer__item-body-pricingContainer'>

														{pricing.length > 0 && pricing.map(item => {
															return (
																<div className='addProductGridContainer__item-body-pricingContainer-item'>
																	<div className='addProductGridContainer__item-body-pricingContainer-item-edit'>
																		{/* <span>
							<EditOutlined />
							</span> */}
																		<span className='d' onClick={() => handleDeletePricing(item.id)}>
																			<DeleteOutlined />
																		</span>
																	</div>
																	<div className='addProductGridContainer__item-body-pricingContainer-item-two'>
																		<div>
																			<h3>
																				Price
						</h3>
																			<div className='addProductGridContainer__item-body-pricingContainer-item-body'>


																				{item.price.offer ? (
																					<>
																						<h4>
																							{item.price.offer}

																						</h4>
																			/
																			<h5 style={{
																							textDecoration: "line-through"
																						}}>

																							{item.price.regular}
																						</h5>
																					</>
																				) : (
																						<h4>
																							{item.price.regular}

																						</h4>
																					)}


																			</div>
																		</div>

																		{item.stock && (
																			<div>
																				<Badge
																					overflowCount={999}
																					count={item.stock.available}>
																					<h3>
																						Stock
									</h3>
																				</Badge>
																				<div className='addProductGridContainer__item-body-pricingContainer-item-body'>
																					<div>
																						<h6>
																							min
																							<Badge
																								className="site-badge-count-4"
																								overflowCount={999}
																								count={item.stock.minimum} />
																						</h6>


																					</div>

																				</div>
																			</div>
																		)}



																	</div>

																	{item.attribute
																		&& Object.keys(item.attribute).length > 0 && (
																			<>
																				<h3>
																					Attributes
						</h3>
																				<div className='addProductGridContainer__item-body-pricingContainer-item-body'>
																					{item.attribute
																						&& Object.keys(item.attribute).length > 0
																						&& Object.keys(item.attribute).map(attributeItem => {
																							return (
																								<div>
																									<h6>
																										{attributeItem}
																									</h6>
																									<h4>
																										{item.attribute[attributeItem]}
																									</h4>
																								</div>
																							)
																						})}
																				</div>
																			</>
																		)}

																</div>
															)
														})}


														{!(pricing.length > 0) && <div style={{
															width: '100%',
															display: 'flex',
															justifyContent: 'center'
														}}>
															<Empty description='No Pricing added' image={Empty.PRESENTED_IMAGE_SIMPLE} />
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

											<Tooltip
												placement="left" title={'Click on the image to select cover image, By default 1st image is selected as cover'}>
												<a href='###'>
													<InfoCircleOutlined />
												</a>
											</Tooltip>
										</div>
										<div className='addProductGridContainer__item-body'>



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

												<Tooltip
													color='red'
													visible={addProductState.error['error']['category'] && !(categoryids.length > 0)}
													placement="left" title={'Select at least one category'}>
													<div className={!(categoryids.length > 0)
														&& !addProductState.error['error']['category'] ? 'checkicon' : addProductState.error['error']['category'] ? 'checkicon-error' : 'checkicon-active'}>
														<CheckCircleOutlined />
													</div>
												</Tooltip>

											</div>
											<div className='addProductGridContainer-rightItemContainer-body'>
												<Categories

													setcategoryIds={setcategoryIds} />
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
												<Tags setTagIds={setTagIds} />
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
												<Brands setBrandId={setBrandId} />
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