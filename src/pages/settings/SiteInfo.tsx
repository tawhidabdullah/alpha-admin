import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tabs } from 'antd';


import {
	FileOutlined,
	InboxOutlined,
	FileAddOutlined,
	DeleteOutlined,
	CheckCircleOutlined
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

	const [addBrandState, handleAddBrandFetch] = useHandleFetch({}, 'addBrand');
	const [visible, setvisible] = useState(false);
	const [myImages, setmyImages] = useState(false);
	const [visibleMedia, setvisibleMedia] = useState(false);


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
				cover: imagesIds[0] ? imagesIds[0] : '',
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
		console.log(checked);
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
		<>
			<div className='siteInfoContainer'>
				<h2>
					Site Settings
			</h2>

				<Tabs defaultActiveKey="1" >
					<TabPane tab="Site Info" key="1">
						<AdminSiteInfo />
					</TabPane>
					{/* <TabPane tab="Logo & Icon" key="2">
						<div style={{
							display: 'flex',
							alignItems: 'center'
						}}>
							<div style={{
								marginRight: '30px'
							}}>
								<h3 className='inputFieldLabel'>Site Logo</h3>
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
											setvisibleMedia(true);
										}}
										className='aboutToUploadImagesContainer__uploadItem'>
										<FileAddOutlined />

									</div>

								</div>
							</div>

							<div style={{
								// marginTop: '15px'
							}}>
								<h3 className='inputFieldLabel'>Site Icon</h3>
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
											setvisibleMedia(true);
										}}
										className='aboutToUploadImagesContainer__uploadItem'>
										<FileAddOutlined />

									</div>

								</div>
							</div>
						</div>


					</TabPane> */}


					<TabPane tab="Admin Information" key="2">

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