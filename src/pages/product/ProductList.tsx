import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;
const { Search } = Input;

const data = [
	{
		key: '1',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
		name: 'Onion (1 kg )',
        offerPrice: 400,
        price: 500,
        availableStock: 300,

	},
	{
		key: '2',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
            name: 'Onion (1 kg )',
            offerPrice: 400,
            price: 500,
            availableStock: 300,
	},
	{
		key: '3',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
            name: 'Onion (1 kg )',
            offerPrice: 400,
            price: 500,
            availableStock: 300,
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
            <Column 
          title="Cover"
           dataIndex="cover"
            key="cover" 
            render={cover => (
                <>
                <img src={cover} alt='cover img' style={{
                    height: '40px',
                    width: '40px',
                    objectFit: "contain"
                }} />
                </>
              )}
            />
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Offer Price" dataIndex="offerPrice" key="offerPrice" />
          <Column title="Price" dataIndex="price" key="price" />
          <Column title="Available Stock" dataIndex="availableStock" key="availableStock" />
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


interface Props {
    history: any; 
}

const ProductList = ({history}: Props) => {
  
    
	return (
		<div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
            <h2 className='categoryListContainer__header-title'>Products</h2>
            <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/product/new')}
        >
        Add New
            
            </Button>
            </div>

            <div className='categoryListContainer__afterHeader'>
            <Search
      placeholder="search products.."
      size="large"
      onSearch={value => console.log(value)}
      style={{ width: 300 }}
    />
            </div>

     
			
			<div className='categoryListContainer__categoryList'>
				<MyTable />
			</div>
		</div>
	);
};

export default withRouter(ProductList);
