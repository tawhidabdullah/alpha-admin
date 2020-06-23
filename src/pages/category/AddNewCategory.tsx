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

const AddNewCategory = ({  }: Props) => {
	const onSwitchChange = (checked: any) => {
		console.log(checked);
	};

	return (
		<div className='site-layout-background' style={{ padding: '30px 50px 30px 50px', minHeight: 360 }}>
			<div className='addproductSectionTitleContainer'>
				<h2 className='addprouctSectionTitle'>Add Category</h2>
			</div>
			<div className='addproductSectionContainer'>
				<div className='addproductSection addproductSection-left'>
					<Input label='Title' />
					<Input label='Description' type='textarea' />

					<div className='switchLabelContainer'>
						<Switch defaultChecked onChange={onSwitchChange} />
						<div className='switchLabelContainer-textContainer'>
							<h4 className='switchLabelContainer-label'>Top level Category</h4>
							<h5 className='switchLabelContainer-desc'>Disable to select a Parent Category</h5>
						</div>
					</div>
					<h3 className='inputFieldLabel'>Parent Category</h3>
					<Select
						showSearch
						style={{ width: 300 }}
						placeholder='Select a Parent Category'
						optionFilterProp='children'
						// onChange={onChange}
						// onFocus={onFocus}
						// onBlur={onBlur}
						// onSearch={onSearch}
						filterOption={(input, option: any) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						<Option value='jack'>Jack</Option>
						<Option value='lucy'>Lucy</Option>
						<Option value='tom'>Tom</Option>
					</Select>

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
						Add New Category
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddNewCategory;
