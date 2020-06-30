import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;
const { Search } = Input;

const data = [
	{
		key: '1',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
		name: 'John',
		product: 32,
		subCategory: '50',
        tags: [ 'nice', 'developer' ],
        children: [
            {
              key: 1311,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
            {
              key: 1312,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
          ],
	},
	{
		key: '2',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
		name: 'John',
		product: 32,
		subCategory: '50',
        tags: [ 'loser' ],
        children: [
            {
              key: 13,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
            {
              key: 131552,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
          ],
	},
	{
		key: '3',
		cover:
			'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
		name: 'John',
		product: 32,
		subCategory: '50',
        tags: [ 'cool', 'teacher' ],
        children: [
            {
              key: 1343,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
            {
              key: 13431552,
              cover:
              'https://homebazarshibchar.com/images/library/thumbnail/783515-Meat-(%E0%A6%AE%E0%A6%BE%E0%A6%82%E0%A6%B8).jpg',
          name: 'John',
          product: 32,
          subCategory: '50',
          tags: [ 'loser' ]
            },
          ],
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
        // bordered={true}
        // size='middle'
        pagination={false}
        dataSource={data}
        >
            <Column 
          title="Cover"
           dataIndex="cover"
            key="cover" 
            
           className='classnameofthecolumn'

            render={cover => (
                <>
                <img src={cover} alt='cover img' style={{
                    height: '25px',
                    width: '25px',
                    objectFit: "contain"
                }} />
                </>
              )}
            />
          <Column
           title="Name" 
           dataIndex="name" 
           key="name"
           align='center'
           className='classnameofthecolumn'

            />
          <Column 
          
          className='classnameofthecolumn'

          title="Product" dataIndex="product" key="product" />
          <Column 
          
          className='classnameofthecolumn'

          title="Sub Category" dataIndex="subCategory" key="subCategory" />
        
        {/* <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <>
              {tags.map((tag : any) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          )}
        /> */}
        <Column
        
        className='classnameofthecolumn'
          title=""
          key="action"
          align='right'
          render={(text, record : any) => (
            <Space size="middle">
               <Tooltip placement="top" title='Edit Category'>
               <EditFilled />
               </Tooltip>


               <Tooltip placement="top" title='Quick Edit Category'>
               <EditOutlined />
               </Tooltip>


             
              <Tooltip placement="top" title='Delete Category'>
             <span style={{
               color: 'rgba(238, 192, 106, 0.877)'
             }}>
             <DeleteOutlined/>
             </span>
            
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

const CategoryList = ({history}: Props) => {
  
    
	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Categories
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search categories.."
          onSearch={value => console.log(value)}
          // style={{ width: 300 }}
        />
          </div>
            <Button
          // type="primary"
          className='btnPrimaryClassNameoutline'
          icon={<PlusOutlined />}
          onClick={() => history.push('/category/new')}
        >
        Add New
            
            </Button>
            </div>

            <div className='categoryListContainer__afterHeader'>
            {/* <Search
      placeholder="search categories.."
      size="large"
      onSearch={value => console.log(value)}
      style={{ width: 300 }}
    /> */}
            </div>

     
			
			<div className='categoryListContainer__categoryList'>
				<MyTable />
			</div>
		</div>
    </>
	);
};

export default withRouter(CategoryList);
