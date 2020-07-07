import React, {useState} from 'react';

// import third party ui lib
import { Upload, Button, Modal, Tabs,message } from 'antd';
import reqwest from 'reqwest';



import {
	InboxOutlined,
	CheckOutlined,
	ArrowUpOutlined
} from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';

// import hooks
import { useHandleFetch } from "../../hooks";

const { Dragger } = Upload;
const { TabPane } = Tabs;


	
const myImages = [
	{
	  id: '1',
	  name: 'image1.png',
	  status: 'done',
	  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	},
	{
	  id: '2',
	  name: 'image2.png',
	  status: 'done',
	  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	},
	{
	  id: '3',
	  name: 'image3.png',
	  status: 'done',
	  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	}
  ]


interface Props {
    visible: boolean; 
    setvisible: (isVisible : any) => void; 
}

const MediaLibrary = ({
    visible,
    setvisible,
    ...rest
}: Props) => {

	const [fileList,setfileList] = useState([]); 
	const [uploading,setuploading] = useState(false); 
	const [selectedimages,setselectedImages] = useState([]); 
	const [mediaLibrary, handleMediaLibraryFetch] = useHandleFetch({}, 'addImageToLibrary');


	const handleUpload = async () => {
		const formData = new FormData();
		fileList.forEach(file => {
			console.log('filt',file.name);
		  formData.append('images', file,file.name);
		});
	
		setuploading(true); 

		//  const addImageToLibraryRes = await handleMediaLibraryFetch({
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


	  
    const handleOk = (e: any) => {
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
			}
			else {
				const newselectedImages = selectedimages.filter(image => image.id !== id); 
				setselectedImages(newselectedImages);  
			}
		}
		else {
			setselectedImages([image,...selectedimages]);  
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

			  {myImages.map(image => {
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
					<img src={image.url} alt='img' />

					</div>
				  )
			  })}
							  </div>
                    </TabPane>
                    
                    </Tabs>


		  				
						</div>
						<div className='mediaLibraryBodyContainer-right'>
							<h4>
								Attachment Details
							</h4>
							<div className='mediaLibraryBodyContainer-right-ImageDetails'>
								<div className='mediaLibraryBodyContainer-right-ImageDetails-imageContainer'>
									<img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
								</div>
								<div className='mediaLibraryBodyContainer-right-ImageDetails-infoContainer'>
									<h5 className='imageLibnameText'>
										IMG_1104.jpg
									</h5>
									<h5>
										April 20,1204
									</h5>
									<h5>
										5000 X 500
									</h5>
									<h5 className='imageLibdeleteText'>
										Delete parmanently
									</h5>
								</div>
							</div>
							<div>
							<Input label='Title' />
							<Input label='Alternate Text' />
							<Input label='Caption' />
							<Input label='Label' />
							<div
						style={{
							marginTop: '20px'
						}}
					/>
					<Button type='primary' onClick={() => console.log('createCategory')}>
						Update
					</Button>
							</div>
						</div>
		  </div>
		  
        </Modal>
        </>
    )
};

export default MediaLibrary;
