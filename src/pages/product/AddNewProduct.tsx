import React from 'react';

// import third party ui lib
import { Upload, message } from 'antd';

import { FileOutlined, InboxOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';

const { Dragger } = Upload;

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

const AddNewProduct = ({  }: Props) => {
	return (
		<div className='site-layout-background' style={{ padding: 24, minHeight: 360 }}>
			<div className='addproductSectionTitleContainer'>
				<h2 className='addprouctSectionTitle'>Add Product</h2>
			</div>
			<div className='addproductSectionContainer'>
				<div className='addproductSection addproductSection-left'>
					<Input label='Title' />
					<h3 className='inputFieldLabel'>Description</h3>
					<ReactQuill theme='snow' />
				</div>
				<div className='addproductSection addproductSection-right'>
					<h3 className='addproductSection-right-title'>Classification</h3>
					<Input label='Category' />
				</div>
			</div>

			<div className='addproductSectionContainer'>
				<div className='addproductSection addproductSection-left'>
					<div className='addproductSection-left-header'>
						<h3 className='addproductSection-right-title'>Images</h3>
						<div>
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
				</div>
				<div className='addproductSection addproductSection-right'>
					<h3 className='addproductSection-right-title'>Classification</h3>
					<Input label='Category' />
				</div>
			</div>
		</div>
	);
};

export default AddNewProduct;
