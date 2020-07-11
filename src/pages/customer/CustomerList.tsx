import React, {useState,useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, notification, Space, Tag,Button, Input,Tooltip, Modal , Empty, Popconfirm} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled, CheckCircleOutlined } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewCustomer from "./AddNewCustomer";
import QuickEdit from "./QuickEdit";

const { Column, ColumnGroup } = Table;
const { Search } = Input;



const openSuccessNotification = (message?: any) => {
	notification.success({
	  message: message || 'Tag Created',
	  description: '',
	  icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
  };


  const openErrorNotification = (message?: any) => {
	notification.success({
	  message: message || 'Something Went Wrong',
	  description: '',
	  icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
  };





interface myTableProps {
  data: any; 
  setCustomerList?:any; 
} 


const MyTable = ({data,setCustomerList}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 


    const [deleteCustomerState, handleDeleteCustomerFetch] = useHandleFetch({}, 'deleteCustomer');
      const handleDeleteCustomer = async (id) => {
        const deleteCustomerRes = await handleDeleteCustomerFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });


           // @ts-ignore
		  if(deleteCustomerRes && deleteCustomerRes.status === 'ok'){
			  openSuccessNotification('Deleted Customer'); 
			  const newCustomerList =  data.filter(item => item.id !== id);
			  setCustomerList(newCustomerList); 
		  }
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


             

              
               <Popconfirm 
               
               onConfirm={() => handleDeleteCustomer(record.id)}
               title="Are you sure？" okText="Yes" cancelText="No">
           
           <span 
             className='iconSize iconSize-danger'
             > 
             <DeleteOutlined/>
            </span>
       
           </Popconfirm>
             
            </Space>
          )}
        />
      </Table>

    

    {activeCategoryForEdit &&   <QuickEdit 
    customerList={data}
    setCustomerList={setCustomerList}
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


    const [customerList,setCustomerList] = useState([]); 

    const [customerState, handleCustomerListFetch] = useHandleFetch({}, 'customerList');
  
  
    useEffect(()=>{
     const setCustomers = async () => {
       const customers = await handleCustomerListFetch({}); 
       // @ts-ignore
       setCustomerList(customers); 
     }
     setCustomers(); 
    },[])


    

  
  const handleSearch = (value) => {
    if(customerState.data.length > 0 ){
      const newCustomerList = customerState.data.filter(item => item.name.includes(value)); 
      setCustomerList(newCustomerList); 
    }
     
  }



    

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
          onSearch={value =>handleSearch(value)}
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
        {customerState.done && customerList.length > 0 && <MyTable
        setCustomerList={setCustomerList}
         data={customerList} />}
        {customerState.isLoading && <DataTableSkeleton />}
        {customerState.done && !(customerList.length > 0) && (
			<div style={{
				marginTop: '50px'
			}}>
				<Empty description='No Tags found'  image={Empty.PRESENTED_IMAGE_SIMPLE} />
			</div>
		)}
			</div>
		</div>


{customerState.done && 
    <AddNewCustomer 
    setCustomerList={setCustomerList}
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          customerList={customerState.data}
          
           />}

      

        
    </>
	);
};

export default withRouter(CustomerList);
