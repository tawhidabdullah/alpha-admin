import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;
const { Search } = Input;

const data = [
	{
		key: '1',
		title: 'Home Page',
        created: 'Sun Apr 26 2020 22:34:13',
        lastModified: 'Sun Apr 26 2020 22:34:13',
      

	},
	{
		key: '2',
		title: 'Product Listing Page',
        created: 'Sun Apr 26 2020 22:34:13',
        lastModified: 'Sun Apr 26 2020 22:34:13',
      
	},
	{
		key: '3',
		title: 'Dashboard Page',
        created: 'Sun Apr 26 2020 22:34:13',
        lastModified: 'Sun Apr 26 2020 22:34:13',
      
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
         
          <Column title="Title" dataIndex="title" key="title" />
          <Column title="Created" dataIndex="created" key="created" />
          <Column title="Last Modified" dataIndex="lastModified" key="lastModified" />
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

const PagesList = ({history}: Props) => {
  
    
	return (
		<div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
            <h2 className='categoryListContainer__header-title'>Pages</h2>
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
      placeholder="search pages.."
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

export default withRouter(PagesList);
