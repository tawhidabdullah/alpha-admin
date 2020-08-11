import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


// import hhooks
import { useHandleFetch } from '../../hooks';


// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Empty, Steps, Tooltip } from 'antd';

import {
	CheckCircleOutlined,
	CaretRightOutlined,
	CaretLeftOutlined,
	CaretRightFilled,
	UserOutlined,
	InfoCircleOutlined,
	FileOutlined,
	InboxOutlined,
	FileAddOutlined,
	DeleteOutlined,
	CloseOutlined,
	CheckOutlined,
	PlusOutlined,
	FileImageFilled
} from '@ant-design/icons';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";



const { Option } = Select;
const { Step } = Steps;

const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Page Created',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
};


const openErrorNotification = (message?: any) => {
	notification.error({
		message: message || 'Something Went Wrong',
		description: '',
		icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
};






const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});




const initialValues = {
	name: '',
	url: ''
};


const steps = [
	{
		title: 'Order Information',
		content: '',
		// description: 'Add Customer & Products'
	},
	{
		title: 'Billing Address',

	},
	{
		title: 'Confirm Order',
		content: '',
	},
];




interface Props {

}

const AddNewPage = ({ }: Props) => {

	const [addPageState, handleAddPageFetch] = useHandleFetch({}, 'addpage');
	const [content, setContent] = useState("<p>Hello from the new page !</p>");
	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);
	const [coverImageId, setCoverImageId] = useState('');


	const handleAddPageSubmit = async (values: any, actions: any) => {
		console.log('content', content);
		console.log('values', values);
		const addOrderRes = await handleAddPageFetch({
			body: {
				name: values.name,
				content: content,
				url: values.name,
				cover: myImages ? myImages[0] && myImages[0].id : '',
			},
		});

		// @ts-ignore
		if (addOrderRes && addOrderRes.status === 'ok') {
			openSuccessNotification();


			actions.resetForm();
		}
		else {
			openErrorNotification("Couldn't create page, Something went wrong")
		}

		actions.setSubmitting(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!isValid ||
			!values.name ||
			!values.pickUpLocation ||
			!values.time) {

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




	console.log('myImagesdx', myImages)

	return (
		<Formik
			onSubmit={(values, actions) => handleAddPageSubmit(values, actions)}
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
						<div className="addNewPageContainer">
							<h3 className='addNewPageContainer__heading'>
								Add New Page
		                 	</h3>

							<div className='addNewPageContainer__header'>
								<div className='dubbleRowInputs'>
									<div className='dubbleRowInputs__item'>
										<Input
											label='Title'
											value={values.name}
											name='name'
											isError={(touched.name && errors.name) ||
												(!isSubmitting && addPageState.error['error']['name'])}

											errorString={(touched.name && errors.name) ||
												(!isSubmitting && addPageState.error['error']['name'])}
											onChange={(e: any) => {
												handleChange(e);
												setFieldTouched('name');
											}}
										/>
									</div>
									<div className='dubbleRowInputs__item'>
										<Input
											label='URL'
											value={values.url}
											name='url'
											isError={(touched.url && errors.url) ||
												(!isSubmitting && addPageState.error['error']['url'])}

											errorString={(touched.url && errors.url) ||
												(!isSubmitting && addPageState.error['error']['url'])}
											onChange={(e: any) => {
												handleChange(e);
												setFieldTouched('url');
											}}
										/>
									</div>
								</div>

								<h3 className='inputFieldLabel'>Thumbnail</h3>

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
												</div>
											)
										})}


									{myImages ? !myImages[0] && (
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
									) : <Tooltip
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
										</Tooltip>}
								</div>

							</div>
							<div className='addNewPageContainer__body'>
								<h3 className='inputFieldLabel'>
									Content
                               </h3>

								<CKEditor
									editor={ClassicEditor}
									data={content}
									onInit={editor => {
										// You can store the "editor" and use when it is needed.
										console.log('Editor is ready to use!', editor);
									}}
									onChange={(event, editor) => {
										const data = editor.getData();
										setContent(data);
									}}
									onBlur={(event, editor) => {
										console.log('Blur.', editor);
									}}
									onFocus={(event, editor) => {
										console.log('Focus.', editor);
									}}
								/>
							</div>

							<div style={{
								marginTop: '20px'
							}}></div>

							<Button
								loading={addPageState.isLoading}
								onClick={(e: any) => handleSubmit(e)}
								className='btnPrimaryClassNameoutline'
							>
								Create page
                            </Button>
						</div>

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

export default AddNewPage;











/*

<div className="addNewPageContainer">
			<h3 className='addNewPageContainer__heading'>
				Add New Order
			</h3>
			<div className='addNewPageContainer__header'>

			</div>
			<div className='addNewPageContainer__body'>

			</div>
		</div>


*/