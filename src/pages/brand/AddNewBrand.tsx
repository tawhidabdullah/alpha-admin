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
	description: '',
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

	const [addBrandState, handleAddBrandFetch] = useHandleFetch({}, 'addBrand');
	const [visible, setvisible] = useState(false);
	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);
	const [coverImageId, setCoverImageId] = useState('');


	const handleSubmit = async (values: any, actions: any) => {

		// @ts-ignore
		const imagesIds = myImages ? myImages.map(image => {
			return image.id;
		}) : [];


		const addBrandRes = await handleAddBrandFetch({

			body: {
				name: values.name,
				description: values.description,
				type: values.type,
				image: imagesIds,
				cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
			},
		});

		// @ts-ignore
		if (addBrandRes && addBrandRes.status === 'ok') {
			openSuccessNotification();

			setBrandList([...brandList, {
				id: addBrandRes['id'] || '',
				key: addBrandRes['id'] || '',
				name: addBrandRes['name'] || '',
				description: addBrandRes['description'] || '',
				// @ts-ignore
				...addBrandRes
			}])
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
		if (!values.name && !values.description || !isValid) {
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
								label='Title'
								value={values.name}
								name='name'
								isError={(touched.name && errors.name) ||
									(!isSubmitting && addBrandState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && addBrandState.error['error']['name'])}
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
									(!isSubmitting && addBrandState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && addBrandState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
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
								{/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
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
