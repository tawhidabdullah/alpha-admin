import React, { useState, useEffect } from 'react';




// import libraries
import { Upload, Button, Modal, Tabs, message, notification, Popconfirm, Menu, Dropdown, } from 'antd';
import reqwest from 'reqwest';
import { Formik } from 'formik';
import Moment from 'react-moment';
// import * as Yup from 'yup';


import {
	CheckOutlined,
	ArrowUpOutlined,
	CheckCircleOutlined,
	EllipsisOutlined,
	FileImageOutlined,
	DeleteOutlined,
	CloseOutlined

} from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import Empty from '../../components/Empty';

// import hooks
import { useHandleFetch } from "../../hooks";

// import configs
import config from "../../config.json";

const { Dragger } = Upload;
const { TabPane } = Tabs;




const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Category Updated',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
};


const openErrorNotification = (message?: any) => {
	notification.success({
		message: message || 'Something Went Wrong',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
};



interface Props {
	visible: boolean;
	setvisible: (isVisible: any) => void;
	setmyImages?: any;
	setmyThumbnailImage?: any;
	isModalOpenForThumbnail?: boolean;
	isModalOpenForImages?: boolean;
	myImages?: any;
	myThumbnailImage?: any;
	setMyGoddamnImages?: any;
	myGoddamnImages?: any;
}


const MediaLibrary = ({
	visible,
	setvisible,
	setmyImages,
	isModalOpenForImages,
	isModalOpenForThumbnail,
	setmyThumbnailImage,
	myImages,
	myThumbnailImage,
	...rest
}: Props) => {

	const [fileList, setfileList] = useState([]);
	const [uploading, setuploading] = useState(false);
	const [selectedimages, setselectedImages] = useState([]);
	const [activeImageItem, setactiveImageItem] = useState(false);
	const [updateMediaLibrary, handleUpdateMediaLibraryFetch] = useHandleFetch({}, 'updateImageFromLibrary');
	const [imageListFromLibraryState, handleImageListFromLibraryFetch] = useHandleFetch({}, 'ImageListFromLibrary');
	const [deleteImageFromLibraryFetchState, handleDeleteImageFromLibraryFetch] = useHandleFetch({}, 'deleteImageFromLibrary');
	const [localImageList, setLocalImageList] = useState([]);
	const [isDoneOk, setisDoneOk] = useState(false);


	const handleDeleteImageFromImageLibrary = async (id) => {

		const deleteImageLibraryItemRes = await handleDeleteImageFromLibraryFetch({
			urlOptions: {
				placeHolders: {
					id,
				}
			}
		});


		// @ts-ignore
		if (deleteImageLibraryItemRes && deleteImageLibraryItemRes.status === 'ok') {
			openSuccessNotification('Imaged Deleted');
			const newImageList = localImageList.filter(item => item.id !== id);
			setLocalImageList(newImageList);
		}
	};


	const getImageList = async () => {
		const imageListRes = await handleImageListFromLibraryFetch({
			urlOptions: {
				params: {
					limitNumber: 10000
				}
			}
		});


		// @ts-ignore
		if (imageListRes) {
			// @ts-ignore
			setLocalImageList(imageListRes);
		}

		// console.log('imageListRes', imageListRes);
	}



	useEffect(() => {

		getImageList();
	}, [])




	const handleUpload = async () => {
		const formData = new FormData();
		fileList.forEach(file => {
			formData.append('images', file, file.name);
		});

		setuploading(true);

		//  const addImageToLibraryRes = awAddait handleMediaLibraryFetch({
		// 	body: formData
		//   });

		//   console.log('addImageToLibraryRes',addImageToLibraryRes)



		// You can use any AJAX library you like
		reqwest({
			url: `${config.baseURL}/admin/api/image/add`,
			method: 'post',
			processData: false,
			data: formData,
			withCredentials: true,
			success: () => {
				setfileList([]);
				setuploading(false);
				getImageList();
				message.success('upload successfully.');
			},
			error: () => {
				setuploading(false);
				message.error('upload failed.');
			},
		});
	};



	const handleOk = (e: any) => {

		if (isModalOpenForImages) {
			setmyImages(selectedimages);
			setisDoneOk(true);
		}
		else {
			setmyThumbnailImage(selectedimages);
			setisDoneOk(true);
		}
		setvisible(false);

	};

	const handleCancel = (e: any) => {
		setvisible(false);
	};


	useEffect(() => {
		if (myImages && myImages.length > 0)
			setselectedImages([...myImages]);
	}, [myImages])


	useEffect(() => {
		if (isDoneOk && isModalOpenForImages && myImages) {
			setselectedImages([...myImages]);
		}
	}, [myImages, isDoneOk]);



	useEffect(() => {
		if (isDoneOk) {
			// console.log('myThumbnail', myThumbnailImage)
			// setselectedImages([...myThumbnailImage]);
		}
	}, [myThumbnailImage, isDoneOk])

	const uploadProps = {
		//  listType: 'picture',
		multiple: true,
		onRemove: file => {
			setfileList(filelist => {
				const index = fileList.indexOf(file);
				const newFileList = fileList.slice();
				newFileList.splice(index, 1);
				return newFileList;
			})

		},
		beforeUpload: file => {
			setfileList(filelist => {
				const xflelist = filelist;
				return [...xflelist, file]
			})
			return false;
		},
		fileList,
	};




	const handleAddToSelectedList = (image, id) => {

		if (selectedimages && selectedimages.length > 0) {
			const isImageExist = selectedimages.find(image => image.id === id);
			if (!isImageExist) {
				setselectedImages([image,...selectedimages]);
				setactiveImageItem(image);
			}
			else {
				const newselectedImages = selectedimages.filter(image => image.id !== id);
				setselectedImages(newselectedImages);
			}
		}
		else {
			setselectedImages([image,...selectedimages]);
			setactiveImageItem(image);
		}

	}


	const getisSelectedImage = (id) => {
		if (selectedimages && selectedimages.length > 0) {
			const isImageExist = selectedimages.find(image => image.id === id);
			if (isImageExist) {
				return true;
			}
			return false;
		}
		else {
			return false;
		}

	};


	const handleUpdateSubmit = async (values, actions) => {
		const updateImageLibraryItemRes = await handleUpdateMediaLibraryFetch({
			body: {
				id: values.id,
				alt: values.alt,
				title: values.title,
				captoin: values.captoin,
				labels: values.labels,

			},
		});


		// @ts-ignore
		if (updateImageLibraryItemRes && updateImageLibraryItemRes.status === 'ok') {
			openSuccessNotification('Image Updated');

			const positionInImageList = () => {
				return localImageList.map(item => item.id).indexOf(values.id);
			}

			const index = positionInImageList();

			// @ts-ignore
			const updatedItem = Object.assign({}, localImageList[index], { ...updateImageLibraryItemRes });
			const updateImageList = [...localImageList.slice(0, index), updatedItem, ...localImageList.slice(index + 1)];
			setLocalImageList(updateImageList);

		}
		else {
			openErrorNotification();
		}



		actions.setSubmitting(false);
	}


	const getisUpdateSubmitButtonDisabled = (values, isValid) => {
		// if(!values.alt || !values.title || !values.title || !values.caption || !isValid){
		// 	return true; 
		// }
		if (!isValid) {
			return true;
		}
		return false;
	}

	// console.log('selectedimages', selectedimages)

	const ImageItemMenu = (handleDeleteImageFromImageLibrary, id, handleAddToSelectedList, image) => {
		return (
			(
				<Menu>
					<Menu.Item
						onClick={() => handleAddToSelectedList(image, id)}
						key="1" icon={<CheckOutlined />}>
						Select

					</Menu.Item>



					<Menu.Item
						onClick={() => handleDeleteImageFromImageLibrary(id)}
						key="1" icon={<DeleteOutlined color='red' />}>
						Delete
					</Menu.Item>
				</Menu >
			)
		)
	};



	return (
		<>
			<Modal
				style={{
					top: '40px'
				}}
				title="Media Library"
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				width={'80vw'}
				bodyStyle={{
					margin: '0',
					padding: '0'
				}}
				okText='Done'
			>
				<div className='mediaLibraryBodyContainer'>
					<div className='mediaLibraryBodyContainer-left'>

						<Tabs defaultActiveKey="2" type="card" size='middle'>
							<TabPane tab="Upload New Media" key="1">
								<div className='mediaLibraryBodyContainer-left-header'>

									<div>
										<Dragger
											className='upload-list-inline'
											listType='picture'
											style={{
												background: '#fff',
												borderRadius: '8px'
											}}
											{...uploadProps}
										>
											<p className='ant-upload-drag-icon'>
												<FileImageOutlined />
											</p>
											<p className='ant-upload-text'>Click or drag file to this area to upload</p>
											<p className='ant-upload-hint'>
												Support for a single or bulk upload.
						                	</p>
										</Dragger>
									</div>
								</div>



								<Button
									className='btnPrimaryClassNameoutline'
									type='primary'
									onClick={handleUpload}
									disabled={fileList.length === 0}
									loading={uploading}
									icon={<ArrowUpOutlined />}
									style={{
										marginTop: '20px',
										marginBottom: '10px'
									}}
								>
									Upload
					</Button>

							</TabPane>
							<TabPane tab="Media Library" key="2">
								<>
									{myImages && myImages.lenght > 0 && (
										<>
											<h3 className='inputFieldLabel'>
												Selected Items
                               </h3>
											<div className='mediaLibraryBodyContainer-selectedImages'>
												{imageListFromLibraryState.done
													&& myImages.length > 0
													&& myImages.map(image => {
														return (
															<div
																key={image.id}

																className='mediaLibraryBodyContainer-selectedImages-imageListContainer-item'>


																<div
																	onClick={() => {
																		handleAddToSelectedList(image, image.id)
																	}}
																	className='mediaLibraryBodyContainer-selectedImages-imageListContainer-item-menu'>
																	<CloseOutlined />
																</div>




																<div className='mediaLibraryBodyContainer-selectedImages-imgContainer'>
																	<img src={image.cover} alt='img' />
																</div>


															</div>
														)
													})}

											</div>
										</>
									)}
								</>

								<div className='mediaLibraryBodyContainer-left-imageListContainer'>

									{imageListFromLibraryState.done
										&& localImageList.length > 0
										&& localImageList.map(image => {
											return (
												<div
													key={image.id}

													className='mediaLibraryBodyContainer-left-imageListContainer-item'>
													{getisSelectedImage(image.id) ? <div className='mediaLibraryBodyContainer-left-imageListContainer-item-icon'>
														<CheckOutlined

														/>
													</div> : ''}

													<Dropdown overlay={() => ImageItemMenu(handleDeleteImageFromImageLibrary, image.id, handleAddToSelectedList, image)} placement="bottomRight">
														<div className='mediaLibraryBodyContainer-left-imageListContainer-item-menu'>
															<EllipsisOutlined

															/>
														</div>
													</Dropdown>





													<img onClick={() => {
														handleAddToSelectedList(image, image.id)
													}} src={image.cover} alt='img' />

												</div>
											)
										})}


									{imageListFromLibraryState.done && !(localImageList.length > 0) && (
										<div style={{
											display: 'flex',
											justifyContent: 'center',
											width: '100%'
										}}>

											<Empty title='No Image Found in the library' />
										</div>
									)}

								</div>
							</TabPane>

						</Tabs>



					</div>
					<div className='mediaLibraryBodyContainer-right'>

						{activeImageItem && (
							<>
								<Formik
									onSubmit={(values, actions) => handleUpdateSubmit(values, actions)}
									validateOnBlur={false}
									enableReinitialize={true}
									initialValues={
										// @ts-ignore
										{ ...activeImageItem }
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
												<h4>
													Attachment Details
							</h4>
												<div className='mediaLibraryBodyContainer-right-ImageDetails'>
													<div className='mediaLibraryBodyContainer-right-ImageDetails-imageContainer'>
														<img src={activeImageItem['cover']} alt='img' />
													</div>
													<div className='mediaLibraryBodyContainer-right-ImageDetails-infoContainer'>
														<h5 className='imageLibnameText'>
															{activeImageItem['name']}
														</h5>
														<h5>
															<Moment>
																{activeImageItem['added']}
															</Moment>
														</h5>
														{/* <h5>
										5000 X 500
									</h5> */}

														<Popconfirm

															onConfirm={() => handleDeleteImageFromImageLibrary(activeImageItem['id'])}
															title="Are you sure？" okText="Yes" cancelText="No">

															<h5
																className='imageLibdeleteText'
															>
																Delete parmanently
									                       </h5>

														</Popconfirm>


													</div>
												</div>


												<Input
													label='Alternate Text'
													value={values.alt}
													name='alt'
													isError={(touched.alt && errors.alt) ||
														(!isSubmitting && updateMediaLibrary.error['error']['alt'])}

													errorString={(touched.alt && errors.alt) ||
														(!isSubmitting && updateMediaLibrary.error['error']['alt'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('alt');
													}}
												/>


												<Input
													label='Title'
													value={values.title}
													name='title'
													isError={(touched.title && errors.title) ||
														(!isSubmitting && updateMediaLibrary.error['error']['title'])}

													errorString={(touched.title && errors.title) ||
														(!isSubmitting && updateMediaLibrary.error['error']['title'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('title');
													}}
												/>

												<Input
													label='Caption'
													value={values.caption}
													name='title'
													isError={(touched.caption && errors.caption) ||
														(!isSubmitting && updateMediaLibrary.error['error']['caption'])}

													errorString={(touched.caption && errors.caption) ||
														(!isSubmitting && updateMediaLibrary.error['error']['caption'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('caption');
													}}
												/>

												<Button
													type='default'
													onClick={(e: any) => handleSubmit(e)}
													disabled={getisUpdateSubmitButtonDisabled(values, isValid)}
													loading={isSubmitting}
													style={{
														// marginTop: '20px'
													}}
												>
													Update
					</Button>



											</>
										)}
								</Formik>




							</>
						)}

						{!activeImageItem && (
							<div style={{
								height: '100%',
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}>
								<h4 style={{
									textAlign: "center",
									fontSize: "13px",
									color: '#8888'
								}}>
									Select an image to preview details
								</h4>
							</div>
						)}

					</div>
				</div>

			</Modal>
		</>
	)
};

export default MediaLibrary;
