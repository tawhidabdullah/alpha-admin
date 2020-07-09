import React, {useState, useEffect} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import third party ui lib
import { Upload, Button, Modal, Tabs,message } from 'antd';
import reqwest from 'reqwest';



import {
	InboxOutlined,
	CheckOutlined,
	ArrowUpOutlined,
	
} from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';

// import hooks
import { useHandleFetch } from "../../hooks";

const { Dragger } = Upload;
const { TabPane } = Tabs;


	



interface Props {
    visible: boolean; 
	setvisible: (isVisible : any) => void; 
	setmyImages?: any; 
	setmyThumbnailImage?:any; 
	isModalOpenForThumbnail?: boolean;
	isModalOpenForImages?: boolean;
}

const MediaLibrary = ({
    visible,
	setvisible,
	setmyImages,
	isModalOpenForImages,
	isModalOpenForThumbnail,
	setmyThumbnailImage,
	...rest
}: Props) => {

	const [fileList,setfileList] = useState([]); 
	const [uploading,setuploading] = useState(false); 
	const [selectedimages,setselectedImages] = useState([]); 
	const [activeImageItem,setactiveImageItem] = useState(false); 
	const [addMediaLibrary, handleAddMediaLibraryFetch] = useHandleFetch({}, 'addImageToLibrary');
	const [updateMediaLibrary, handleUpdateMediaLibraryFetch] = useHandleFetch({}, 'updateImageFromLibrary');
	const [imageListFromLibraryState, handleImageListFromLibraryFetch] = useHandleFetch({}, 'ImageListFromLibrary');
	const [deleteImageFromLibraryFetchState, handleDeleteImageFromLibraryFetch] = useHandleFetch({}, 'deleteImageFromLibrary');



	const handleDeleteImageFromImageLibrary = async (id) => {

		const deleteImageLibraryItemRes = await handleDeleteImageFromLibraryFetch({
			urlOptions: {
			  placeHolders: {
				id,
			  }
			  }
			});
	}; 





	const handleUpload = async () => {
		const formData = new FormData();
		fileList.forEach(file => {
			console.log('filt',file.name);
		  formData.append('images', file,file.name);
		});
	
		setuploading(true); 

		//  const addImageToLibraryRes = awAddait handleMediaLibraryFetch({
		// 	body: formData
		//   });

		//   console.log('addImageToLibraryRes',addImageToLibraryRes)


	
		// You can use any AJAX library you like
		reqwest({
		  url: 'http://localhost:5000/admin/image/add',
		  method: 'post',
		  processData: false,
		  data: formData,
		  withCredentials: true,
		  success: () => {
			setfileList([]);
			setuploading(false); 
			message.success('upload successfully.');
		  },
		  error: () => {
			setuploading(false); 
			message.error('upload failed.');
		  },
		});
	  };


	  useEffect(() => {
		 	const getImageList = async () => {
				 const imageListRes = await handleImageListFromLibraryFetch({}); 
				 console.log('imageListRes',imageListRes); 
			 }
			 getImageList(); 
	  }, [])

	  
    const handleOk = (e: any) => {
		
		if(isModalOpenForImages){
			setmyImages(selectedimages); 
		}
		else {
			setmyThumbnailImage(selectedimages)
		}
        setvisible(false);
      
      };
    
      const handleCancel = (e: any) => {
        setvisible(false);
	  };
	  

	  const uploadProps = {
		//  listType: 'picture',
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
				return [...fileList, file]
			})
		  return false;
		},
		fileList,
	  };




	  const handleAddToSelectedList = (image,id) => {

		if(selectedimages && selectedimages.length > 0){
			const isImageExist = selectedimages.find(image => image.id === id); 
			if(!isImageExist){
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
		  if(selectedimages && selectedimages.length > 0){
			const isImageExist = selectedimages.find(image => image.id === id); 
			if(isImageExist){
				return true; 
			}
			return false; 
		  }
		  else {
			  return false; 
		  }
		
	  }; 


	  const handleUpdateSubmit = async (values,actions) => {
		const updateImageLibraryItemRes = await handleUpdateMediaLibraryFetch({
			body: {
				id: values.id,
				alt: values.alt,
				title: values.title,
				captoin: values.captoin,
				labels: values.labels,

			},
		  });
		
		  actions.setSubmitting(false);
	  }

	  
	  const getisUpdateSubmitButtonDisabled = (values,isValid) => {
		// if(!values.alt || !values.title || !values.title || !values.caption || !isValid){
		// 	return true; 
		// }
		if(!isValid){
			return true; 
		}
		return false; 
	  }

	  console.log('selectedimages',selectedimages)
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
								background: '#fff'
							}}
							{...uploadProps}
						>
							<p className='ant-upload-drag-icon'>
								<InboxOutlined />
							</p>
							<p className='ant-upload-text'>Click or drag file to this area to upload</p>
							<p className='ant-upload-hint'>
								Support for a single or bulk upload. Strictly prohibit from uploading company data or
								other band files
							</p>
						</Dragger>
					     </div>
							</div>

				

							<Button 
							type='primary'
							onClick={handleUpload}
							disabled={fileList.length === 0}
							loading={uploading}
							icon={<ArrowUpOutlined />}
							style={{
								marginTop: '20px'
							}}
							 >
						Upload
					</Button>

          </TabPane>
          <TabPane tab="Media Library" key="2">
		  <div className='mediaLibraryBodyContainer-left-imageListContainer'>

			{imageListFromLibraryState.done 
			&& imageListFromLibraryState.data.length > 0
			 && imageListFromLibraryState.data.map(image => {
				 return (
					<div 
					key={image.id}
					onClick={() => {
						handleAddToSelectedList(image,image.id)
					}}
					 className='mediaLibraryBodyContainer-left-imageListContainer-item'>
					{getisSelectedImage(image.id) ? <div className='mediaLibraryBodyContainer-left-imageListContainer-item-icon'>
						<CheckOutlined 
						
						/>
					</div> : ''}
					<img src={image.cover} alt='img' />

					</div>
				 )
			 })}

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
		  {...activeImageItem}
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
										{activeImageItem['added']}
									</h5>
									{/* <h5>
										5000 X 500
									</h5> */}
									<h5 
									className='imageLibdeleteText'
									onClick={() => handleDeleteImageFromImageLibrary(activeImageItem['id'])}
									>
										Delete parmanently
									</h5>
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
							onChange={(e : any) => {
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
							onChange={(e : any) => {
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
							onChange={(e : any) => {
								handleChange(e);
								setFieldTouched('caption');
								}}
			   				/>

							<Button 
							type='default'
							onClick={(e : any) => handleSubmit(e)}
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
								<h3>
									Select an image to preview details
								</h3>
							)}
			
						</div>
		  </div>
		  
        </Modal>
        </>
    )
};

export default MediaLibrary;
