import React from 'react';

// import third party ui lib
import { Upload, message, Switch, Select, Button, notification } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';

const { Dragger } = Upload;
const { Option } = Select;

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

	return (
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
	);
};

export default AddNewBrand;
