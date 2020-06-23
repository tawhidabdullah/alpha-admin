import React, {useState} from 'react';

// import third party ui lib
import { Upload, message, Switch, Select, Button, notification,Table, Space, Input as CoolInput,Tooltip, Modal } from 'antd';

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

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

const data = [
	{
		key: '1',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
		name: 'Phone',
        description: 'Tags are useful nowadays',
      

	},
	{
		key: '2',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
            name: 'Cool',
            description: 'Tags are useful nowadays',
	},
	{
		key: '3',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
            name: 'Man',
            description: 'Tags are useful nowadays',
	}
];


const MyTable = () => {
    const [visible,setvisible] = useState(false);   



    const handleOk = (e: any) => {
        setvisible(false);
      
      };
    
      const handleCancel = (e: any) => {
        setvisible(false);
      };

      

    return (
        <>
        <Table 
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        dataSource={data}>
        
            <Column title="Name" dataIndex="name" key="name" />
          <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Action"
          key="action"
          render={(text, record : any) => (
            <Space size="middle">
              <a onClick={() => setvisible(true)} href='##'>Quick Edit</a>
              <Tooltip placement="top" title='Delete Category'>
              <a href='##'>Delete</a>
          </Tooltip>
             
            </Space>
          )}
        />
      </Table>

      <Modal
          title="Quick Edit"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {/* <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p> */}
        </Modal>
    </>
    )
}





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

const TagList = ({  }: Props) => {
	const onSwitchChange = (checked: any) => {
		console.log(checked);
	};

	return (
		<div className='site-layout-background' style={{ padding: '30px 20px 30px 20px', minHeight: 360 }}>
			<div className='addproductSectionTitleContainer'>
				<h2 className='addprouctSectionTitle'>Add Tag</h2>
			</div>
			<div className='addproductSectionContainer addproductSectionContainer-tags'>
				<div className='addproductSection addproductSection-left'>
					<Input label='Title' />
					<Input label='Description' type='textarea' />

				

					<div
						style={{
							marginTop: '20px'
						}}
					/>
					<Button type='primary' onClick={() => console.log('createCategory')}>
						Add New Tag
					</Button>
				</div>
                <div className='addproductSection addproductSection-right'> 
                <div className='categoryListContainer__afterHeader'>
            <Search
      placeholder="search tags.."
      size="large"
      onSearch={value => console.log(value)}
      style={{ width: 300 }}
    />
            </div>

     
			
			<div className='categoryListContainer__categoryList'>
				<MyTable />
			</div>
                        </div>
			</div>
		</div>
	);
};

export default TagList;
