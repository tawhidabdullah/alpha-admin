import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewCustomer from "./AddNewCustomer";
import QuickEdit from "./QuickEdit";

const { Column, ColumnGroup } = Table;
const { Search } = Input;




interface myTableProps {
  data: any; 
} 


const MyTable = ({data}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteCustomerState, handleDeleteCustomerFetch] = useHandleFetch({}, 'deleteCustomer');
      const handleDeleteCategory = async (id) => {
        const deleteCustomerRes = await handleDeleteCustomerFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });
      }
      

    return (
        <>
        <Table 
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        // bordered={true}
        size='small'
        // pagination={false}
        dataSource={data}
        >
         
          <Column
           title="Phone" 
           dataIndex="phone" 
           key="id" 
           className='classnameofthecolumn'
         
            />


         <Column
           title="First Name" 
           dataIndex="firstName" 
           key="id" 
           className='classnameofthecolumn'
         
            />

         <Column
           title="Last Name" 
           dataIndex="lastName" 
           key="id" 
           className='classnameofthecolumn'
         
            />



<Column
           title="Country" 
           dataIndex="country" 
           key="id" 
           className='classnameofthecolumn'
         
            />


<Column
           title="City" 
           dataIndex="city" 
           key="id" 
           className='classnameofthecolumn'
         
            />

<Column
           title="Created" 
           dataIndex="created" 
           key="id" 
           className='classnameofthecolumn'
         
            />



          {/* <Column 
          
          className='classnameofthecolumn'

          title="Product" dataIndex="product" key="product" /> */}

          {/* <Column 
          
          className='classnameofthecolumn'

          title="Sub Category" dataIndex="subCategory" key="subCategory" /> */}
        
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
            
               <Tooltip placement="top" title='Quick Edit Customer'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>


             
              <Tooltip placement="top" title='Delete Customer'>
            

             <span 
             className='iconSize iconSize-danger'
             onClick={() => handleDeleteCategory(record.id)}
             > 
             <DeleteOutlined/>
            </span>
            
          </Tooltip>
             
            </Space>
          )}
        />
      </Table>

    

    {activeCategoryForEdit &&   <QuickEdit 
    setvisible={setvisible}
    visible={visible}
    customer={activeCategoryForEdit}/>}
    
    
    </>
    )
}


interface Props {
    history: any; 
}

const CustomerList = ({history}: Props) => {

    const customerState = useFetch([], [], 'customerList', { });


  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  console.log('customerState',customerState)



	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Customers
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search customer.."
          onSearch={value => console.log(value)}
          // style={{ width: 300 }}
        />
          </div>
            <Button
          // type="primary"
          className='btnPrimaryClassNameoutline'
          icon={<PlusOutlined />}
          onClick={() => setAddNewCategoryVisible(true)}
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
        {customerState.done && customerState.data.length > 0 && <MyTable data={customerState.data} />}
        {customerState.isLoading && <DataTableSkeleton />}
			</div>
		</div>


{customerState.done && 
    <AddNewCustomer 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          categoryList={customerState.data}
          
           />}

      

        
    </>
	);
};

export default withRouter(CustomerList);
