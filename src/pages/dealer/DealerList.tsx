import React, {useState,useEffect} from 'react';
import {withRouter, useHistory} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, notification, Space, Tag,Button, Input,Tooltip, Modal , Popconfirm} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled, CheckCircleOutlined } from '@ant-design/icons';
import Moment from 'react-moment';

/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewCustomer from "./AddNewDealer";
import QuickEdit from "./QuickEdit";
import Empty from "../../components/Empty";
import moment from "moment";

// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";




const { Column, ColumnGroup } = Table;
const { Search } = Input;






const openSuccessNotification = (message?: any) => {
	notification.success({
	  message: message || 'Dealer Created',
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
  roles?:any; 
} 


const MyTable = ({data,setCustomerList, roles}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 

   const history = useHistory(); 

    const [deleteCustomerState, handleDeleteCustomerFetch] = useHandleFetch({}, 'deleteDealer');
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
			  openSuccessNotification('Deleted Dealer'); 
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
           title="Code" 
           dataIndex="code" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/dealer/${record.id}`)
                  // setcategoryDetailVisible(true);
                  setactiveCategoryForEdit(record)
                }}
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer'
                }}>
                {text}
              </h4>
            </>
          )}
            />

            

          <Column
           title="Name" 
           dataIndex="name" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/dealer/${record.id}`)
                  // setcategoryDetailVisible(true);
                  setactiveCategoryForEdit(record)
                }}
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer'
                }}>
                {text}
              </h4>
            </>
          )}
            />

         
     

          {/* <Column
           title="City" 
           dataIndex="city" 
           key="id" 
           className='classnameofthecolumn'
            /> */}

  
            
          <Column
           title="Commission" 
           dataIndex="commission" 
           key="id" 
           className='classnameofthecolumn'
         
            />

        <Column
           title="Deposit Money" 
           dataIndex="depositMoney" 
           key="id" 
           className='classnameofthecolumn'
         
            />


      <Column
					title="Areas"
					dataIndex="area"
					key="role"
					className='classnameofthecolumn'
					render={(areas,record) => (
						<>
						{areas && areas.length > 0 && areas.slice(0,2).map((tag) => (
              <Tag 
							style={{
								borderRadius:"5px"
							}}
							color="blue" key={tag._id}>
							{tag.name}
							</Tag>
						))}

          <span 
          style={{
            cursor:'pointer'
          }}
          onClick={() => {
             history.push(`/admin/dealer/${record['id']}`)
          }}>
          {areas && areas.length === 2 && '.......'}
          </span>
						</>
					)}
					/>


      <Column
           width={150}
           title="Created" 
           dataIndex="created" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record : any) => (
            <Space size="middle">
            
            <h5>
              {text && moment(text).format('MMMM Do YYYY, h:mm:ss a')}
            </h5>
             
            </Space>
          )}
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

{isAccess('postDealer',roles) && (
              <Column
        
              className='classnameofthecolumn'
                title=""
                key="action"
                align='right'
                render={(text, record : any) => (
                  <Space size="middle">
                    <a href='##'>
                     <Tooltip placement="top" title='Edit Dealer'>
                    <span className='iconSize' onClick={() => {
                      setvisible(true)
                      setactiveCategoryForEdit(record); 
                    }}> 
                    <EditOutlined />
                  
                    </span>
                     </Tooltip>
                     </a>
      
                   
      
                    
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
          )}



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
  roles: any; 
}

const CustomerList = ({roles}: Props) => {


    const [customerList,setCustomerList] = useState([]); 

    const [customerState, handleCustomerListFetch] = useHandleFetch({}, 'dealerList');
  

    console.log('dealerList',customerList); 
  
    useEffect(()=>{
     const setCustomers = async () => {
       const customers = await handleCustomerListFetch({
        urlOptions:{
          params: {
            sortItem: 'added',
            sortOrderValue: '-1'
          }
          }
       }); 
       // @ts-ignore
       setCustomerList(customers); 
     }
     setCustomers(); 
    },[])


    

  
  const handleSearch = (value) => {
    if(customerState.data.length > 0 ){
      const newCustomerList = customerState.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase())); 
      setCustomerList(newCustomerList); 
    }
     
  }



    

  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  // console.log('customerState',customerState)



	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
          Dealers
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search dealers.."
          onSearch={value =>handleSearch(value)}
          // style={{ width: 300 }}
        />
          </div>

          {isAccess('postDealer',roles) && (
        <Button
        // type="primary"
        className='btnPrimaryClassNameoutline'
        icon={<PlusOutlined />}
        onClick={() => setAddNewCategoryVisible(true)}
      >
      Add New
          
          </Button>
          )}
    
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
        roles={roles}
        setCustomerList={setCustomerList}
         data={customerList} />}
        {customerState.isLoading && <DataTableSkeleton />}
        {customerState.done && !(customerList.length > 0) && (
			<Empty title='No Dealer found'  />
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



const mapStateToProps = state => ({
  roles: state.globalState,
})

// @ts-ignore
export default connect(mapStateToProps, null)(CustomerList);



