import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;
const { Search } = Input;

const data = [
	{
		key: '1',
		name: 'Tawhid Abdullah',
        orderDate: 'Sun Apr 26 2020 22:34:13',
        items: 5,
        price: 5,
        delivery: 'Bochila',
        status: 'pending'

	},
	{
		key: '2',
		name: 'Tawhid Abdullah',
        orderDate: 'Sun Apr 26 2020 22:34:13',
        items: 5,
        price: 5,
        delivery: 'Bochila',
        status: 'pending'
	},
	{
		key: '3',
		name: 'Tawhid Abdullah',
        orderDate: 'Sun Apr 26 2020 22:34:13',
        items: 5,
        price: 5,
        delivery: 'Bochila',
        status: 'pending'
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
          <Column title="Order Date	" dataIndex="orderDate" key="orderDate" />
          <Column title="Items" dataIndex="items" key="items" />
          <Column title="Price" dataIndex="price" key="price" />
          <Column title="Delivery" dataIndex="delivery" key="delivery" />
          <Column title="Status" dataIndex="status" key="status" />
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

const OrderList = ({history}: Props) => {
  
    
	return (
		<div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
            <h2 className='categoryListContainer__header-title'>Orders</h2>
            <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/order/new')}
        >
        Add New
            
            </Button>
            </div>

            <div className='categoryListContainer__afterHeader'>
            <Search
      placeholder="search orders.."
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

export default withRouter(OrderList);
