import React, {useState} from 'react';

// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tabs} from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	CheckOutlined,
	FileAddOutlined, 
	ArrowUpOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';

const { Dragger } = Upload;
const { Option } = Select;
const { TabPane } = Tabs;

const props = {
	name: 'file',
	multiple: true,
	action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
	onChange(info: any) {
		const { status } = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
};

interface Props {}

const AddNewBrand = ({  }: Props) => {
	const onSwitchChange = (checked: any) => {
		console.log(checked);
	};

	const [visible,setvisible] = useState(false);   



    const handleOk = (e: any) => {
        setvisible(false);
      
      };
    
      const handleCancel = (e: any) => {
        setvisible(false);
      };




	return (
		<>
		<div className='site-layout-background' style={{ padding: '30px 50px 30px 50px', minHeight: 360 }}>
			<div className='addproductSectionTitleContainer'>
				<h2 className='addprouctSectionTitle'>Add Brand</h2>
			</div>
			<div className='addproductSectionContainer'>
				<div className='addproductSection addproductSection-left'>
					<Input label='Title' />
					<Input label='Description' type='textarea' />

					<div
						style={{
							marginTop: '20px'
						}}
					/>
					<div className='addproductSection-left-header'>
						<h3 className='inputFieldLabel'>Images</h3>
						<div onClick={()=> setvisible(true)}>
							<FileOutlined />
							<span>Media Center</span>
						</div>
					</div>
					<div>
						<Dragger
							style={{
								background: '#fff'
							}}
							{...props}
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

					<div
						style={{
							marginTop: '20px'
						}}
					/>
					<Button type='primary' onClick={() => console.log('createCategory')}>
						Add New Brand
					</Button>
				</div>
			</div>
		</div>
		<Modal
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
							style={{
								background: '#fff'
							}}
							{...props}
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

							<div style={{
								marginTop: '20px'
							}}></div>

							<Button 
							type='primary'
							icon={<ArrowUpOutlined />}
							 onClick={() => console.log('createCategory')}>
						Upload
					</Button>

          </TabPane>
          <TabPane tab="Media Library" key="2">
		  <div className='mediaLibraryBodyContainer-left-imageListContainer'>
		  							<div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
										  <div className='mediaLibraryBodyContainer-left-imageListContainer-item-icon'>
											  <CheckOutlined 
											  
											  />
										  </div>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>
									  <div  className='mediaLibraryBodyContainer-left-imageListContainer-item'>
									  <img src='https://homebazarshibchar.com/images/library/thumbnail/600043-cartScreen.jpg' alt='img' />
		  								
									  </div>

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
	);
};

export default AddNewBrand;
