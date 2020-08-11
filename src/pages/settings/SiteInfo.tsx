import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tabs, Tooltip } from 'antd';


import {
	FileOutlined,
	InboxOutlined,
	FileAddOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
	PlusOutlined,
	FileImageFilled,
	CheckOutlined,
	CloseOutlined
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import AdminSiteInfo from "./AdminSiteInfo";
import SiteInfoInvoice from "./SiteInfoInvoice";

const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});

const { TabPane } = Tabs;

const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Brand Created',
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

	const [updateSiteLogoAndIcon, handleUpdateSiteLogoAndIconFetch] = useHandleFetch({}, 'updateSiteLogoAndIcon');
	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);
	const [coverImageId, setCoverImageId] = useState('');



	const handleSubmit = async () => {


		const updateSiteIconAndLogoRes = await handleUpdateSiteLogoAndIconFetch({

			body: {
				logo: myImages ? myImages[0] && myImages[0].id : '',
			},
		});

		// @ts-ignore
		if (updateSiteIconAndLogoRes && updateSiteIconAndLogoRes.status === 'ok') {
			openSuccessNotification('Updated Site Logo');
		}
		else {
			openErrorNotification("Couldn't updated site logo, Something went wrong");
		}

	};


	const handleImagesDelete = (id) => {
		// @ts-ignore
		const newImages = myImages && myImages.filter(image => {
			return image.id !== id;
		})

		setmyImages(newImages);
	}


	return (
		<>
			<div className='siteInfoContainer'>

				<Tabs defaultActiveKey="1" >
					<TabPane tab="Site Info" key="1">
						<AdminSiteInfo />
					</TabPane>
					<TabPane tab="Site logo" key="2">
						<div style={{
							display: 'flex',
							alignItems: 'center'
						}}>
							<div style={{
								marginRight: '20px'
							}}>
								<h3 className='inputFieldLabel'>Logo</h3>
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
							{/* 
							<div style={{
							}}>
								<h3 className='inputFieldLabel'> Icon</h3>


								<div className='aboutToUploadImagesContainer'>
									{myImages &&
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
												
												<FileImageFilled />
											
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
												
												<FileImageFilled />
												
												<span className='aboutToUploadImagesContainer__uploadItem-plus'>
													<PlusOutlined />
												</span>
											</div>
										</Tooltip>}
								</div>

							</div> */}


						</div>

						<Button

							loading={updateSiteLogoAndIcon.isLoading}
							onClick={() => handleSubmit()}
							className='btnPrimaryClassNameoutline'
						>
							Update site Logo
                            </Button>

						<div style={{
							marginBottom: '10px'
						}}></div>
					</TabPane>


					<TabPane tab="Admin Information" key="3">

						<SiteInfoInvoice />
					</TabPane>

				</Tabs>

			</div>



			<MediaLibrary
				setvisible={setvisibleMedia}
				visible={visibleMedia}
				setmyImages={setmyImages}
				isModalOpenForImages={true}

			/>
		</>


	);
};

export default AddNewBrand;



/*
	<div className='categoryListContainer__bodyContainerList'>
				<div className='categoryListContainer__bodyContainerList-item'>
					<Badge count={<CheckCircleTwoTone style={{ color: '#3FA3FF' }} />}>
						<div className='categoryListContainer__bodyContainerList-item-top'>
							<img
								alt='theme img'
								src='https://homebazarshibchar.com/images/homeBazar.zip-thumb-homebazarLogo.jpg'
							/>
						</div>
						<div className='categoryListContainer__bodyContainerList-item-body'>
							<h3>Home Bazar</h3>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between'
								}}
							>
								<Tooltip placement='top' title='Active this theme'>
									<Button
										size='small'
										type='primary'
										icon={<CheckOutlined />}
										onClick={() => console.log('upload thme')}
									>
										Set Active
									</Button>
								</Tooltip>

								<Tooltip placement='top' title='Delete theme'>
									<Button
										size='small'
										type='link'
										danger={true}
										icon={<DeleteOutlined />}
										onClick={() => console.log('upload thme')}
									>

										</Button>
										</Tooltip>
									</div>
								</div>
							</Badge>
						</div>

						<div className='categoryListContainer__bodyContainerList-item'>
							<div className='categoryListContainer__bodyContainerList-item-top'>
								<img
									alt='theme img'
									src='https://homebazarshibchar.com/images/homeBazar.zip-thumb-homebazarLogo.jpg'
								/>
							</div>
							<div className='categoryListContainer__bodyContainerList-item-body'>
								<h3>Home Bazar</h3>

								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between'
									}}
								>
									<Tooltip placement='top' title='Active this theme'>
										<Button
											size='small'
											type='primary'
											icon={<CheckOutlined />}
											onClick={() => console.log('upload thme')}
										>
											Set Active
										</Button>
									</Tooltip>

									<Tooltip placement='top' title='Delete theme'>
										<Button
											size='small'
											type='link'
											danger={true}
											icon={<DeleteOutlined />}
											onClick={() => console.log('upload thme')}
										>
										</Button>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>


*/