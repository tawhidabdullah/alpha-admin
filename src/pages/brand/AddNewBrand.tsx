import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip } from 'antd';

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
	FileImageFilled
} from '@ant-design/icons';




// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";

import MetaTags from "../../pages/category/MetaTags";
const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Brand Created',
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
	bnName: '',
	description: '',
	bnDescription: '',
	metaTitle: '',
	bnMetaTitle: '',
	metaDescription: '',
	bnMetaDescription: '',
	metaTags: '',
	bnMetaTags: '',
	image: [],
	url: '',
	cover: ''
}



interface Props {
	addNewCategoryVisible?: any;
	setAddNewCategoryVisible?: any;
	brandList?: any;
	setBrandList?: any;

}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, brandList, setBrandList }: Props) => {

	const [updateBrandState, handleUpdateBrandFetch] = useHandleFetch({}, 'addBrand');
	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);
	const [coverImageId, setCoverImageId] = useState('');
	const [tags,setTags] = useState([]);
	const [bnTags,setBnTags] = useState([]);

	const handleSubmit = async (values: any, actions: any) => {

		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];


		const addBrandRes = await handleUpdateBrandFetch({

			body: {
				name: values.name.trim(),
				description: values.description,
				type: values.type,
				image: imagesIds,
				cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
				metaTitle: values.metaTitle,
                metaDescription: values.metaDescription,
				metaTags: tags.join(','),
				
				
				bn: {
					metaTitle: values.bnMetaTitle,
					metaDescription: values.bnMetaDescription,
					metaTags: bnTags.join(','),
					name: values.bnName.trim(),
					description: values.bnDescription,
				}
			},
		});

		// @ts-ignore
		if (addBrandRes && addBrandRes.status === 'ok') {
			openSuccessNotification();

			setBrandList([{
				id: addBrandRes['id'] || '',
				key: addBrandRes['id'] || '',
				name: addBrandRes['name'] || '',
				description: addBrandRes['description'] || '',
				cover: addBrandRes['cover'] || '',
				// @ts-ignore
				...addBrandRes
			},...brandList]); 
			
			actions.resetForm();
			setAddNewCategoryVisible(false);
		}
		else {
			openErrorNotification();
		}

		actions.setSubmitting(false);

	};


	const onSwitchChange = (checked: any) => {
		// console.log(checked);
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
							title="Add New Brand"
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
								label='Name'
								value={values.name}
								name='name'
								placeHolder={'microsoft,apple'}
								isError={(touched.name && errors.name) ||
									(!isSubmitting && updateBrandState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && updateBrandState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>

							<Input
								label='BN Name'
								value={values.bnName}
								placeHolder={'প্রান,নোকিয়া'}
								name='bnName'
								isError={(touched.bnName && errors.bnName) ||
									(!isSubmitting && updateBrandState.error['error']['bnName'])}

								errorString={(touched.bnName && errors.bnName) ||
									(!isSubmitting && updateBrandState.error['error']['bnName'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnName');
								}}
							/>


							<TextArea
								label='Description'
								value={values.description}
								name='description'
								placeholder={'This brand...'}
								isError={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && updateBrandState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
								}}
							/>

							<TextArea
								label='BN Description'
								value={values.bnDescription}
								placeholder={'এই ব্র্যান্ড...'}
								name='bnDescription'
								isError={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnDescription'])}

								errorString={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnDescription');
								}}
							/>

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

							</div>






							<Input
								label='Meta title'
								value={values.metaTitle}
								placeHolder={'category...'}
								name='metaTitle'
								isError={(touched.metaTitle && errors.metaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['metaTitle'])}

								errorString={(touched.metaTitle && errors.metaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['metaTitle'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('metaTitle')
								}}
							/>

							<Input
								label='BN Meta title'
								value={values.bnMetaTitle}
								placeHolder={'ক্যাটাগড়ি...'}
								name='bnMetaTitle'
								isError={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaTitle'])}

								errorString={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaTitle'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaTitle');
								}}
							/>

							<TextArea
								label='Meta description'
								value={values.metaDescription}
								placeholder={'meta...'}
								name='metaDescription'
								isError={(touched.metaDescription && errors.metaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['metaDescription'])}

								errorString={(touched.metaDescription && errors.metaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['metaDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('metaDescription');
								}}
							/>

							<TextArea
								label='BN Meta Description'
								value={values.bnMetaDescription}
								placeholder={'এইয় মেট...'}
								name='bnMetaDescription'
								isError={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaDescription'])}

								errorString={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && updateBrandState.error['error']['bnMetaDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaDescription');
								}}
							/>

							<h3 className='inputFieldLabel'>
							Meta Tags (grocery,fashion)
							</h3>

							<MetaTags
							// @ts-ignore
							setTags={setTags}
							tags={tags}
							 />

							<div style={{
								marginTop:'15px'
							}}></div>

							<h3 className='inputFieldLabel'>
							BN Meta Tags (মুদিখানা,ফ্যাশন)
							</h3>

							<MetaTags
							// @ts-ignore
							setTags={setBnTags}
							tags={bnTags}
							 />


						</Modal>

						<MediaLibrary
							setvisible={setvisibleMedia}
							visible={visibleMedia}
							setmyImages={setmyImages}
							myImages={myImages}
							isModalOpenForImages={true}

						/>
					</>
				)}
		</Formik>




	);
};

export default AddNewBrand;
