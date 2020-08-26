import React, {useState, useEffect} from 'react';
import {withRouter, useHistory} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,CheckOutlined,CheckCircleOutlined,DownOutlined  } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewOrder from "./AddNewOrder";
import QuickEdit from "./QuickEdit";
import Empty from "../../components/Empty";



// import lib 
import Moment from "react-moment";

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
	notification.error({
	  message: message || 'Something Went Wrong',
	  description: '',
	  icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
  };





interface myTableProps {
  data: any; 
  setOrderList: any; 
} 


const MyTable = ({data,setOrderList}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteOrderState, handleDeleteOrderFetch] = useHandleFetch({}, 'deleteOrder');
    const [updateOrderStatusState, handleUpdateOrderStatusFetch] = useHandleFetch({}, 'updateOrderStatus');

    const history = useHistory();

      const handleDeleteRegion = async (id) => {
        const deleteOrderRes = await handleDeleteOrderFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });

            // @ts-ignore
		  if(deleteOrderRes && deleteOrderRes.status === 'ok'){
			  openSuccessNotification('Deleted Order'); 
			  const newOrderList =  data.filter(item => item.id !== id);
			  setOrderList(newOrderList); 
		  }

      }
      


      
      const handleUpdateOrderStatus = async (record,id,newStatus) => {
        const updateOrderStatusRes = await handleUpdateOrderStatusFetch({
          urlOptions: {
            params: {
              newOrderstatus: newStatus,
            },
            placeHolders: {
              id,
            }
            }
          });

            // @ts-ignore
		  if(updateOrderStatusRes && updateOrderStatusRes.status === 'ok'){
			  openSuccessNotification('Updated Order Status'); 
			  
        const positionInTag = () => {
          return data.map(item => item.id).indexOf(id);
          }

      const index = positionInTag();
      console.log('recordis',record,index );

      // @ts-ignore
      const updatedItem = Object.assign({}, data[index], { status: newStatus });
      const updateOrderList = [...data.slice(0, index), updatedItem, ...data.slice(index + 1)];
      console.log('updateOrderList',updateOrderList,'-----',setOrderList );
      setOrderList(updateOrderList);


      }

      
      else {
        openErrorNotification("Couldn't changed order status, Something went wrong")
      }

      }
      

      const StatusItemMenu = (record,id) => {
        return (
          (
            <Menu>

<Menu.Item
                onClick={() => handleUpdateOrderStatus(record,id,'pending')}
                key="1" icon={<CheckOutlined />}>
                Pending
              </Menu.Item>
  

  
              <Menu.Item
                onClick={() => handleUpdateOrderStatus(record,id,'complete')}
                key="1" icon={<CheckOutlined />}>
                Completed
    
              </Menu.Item>
    
              {/* <Menu.Item
                onClick={() => handleUpdateOrderStatus(record,id,'deliver')}
                key="1" icon={<CheckOutlined />}>
                Delivered
              </Menu.Item>
     */}
            
            </Menu >
          )
        )
      };




    

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
          title="Name"
          dataIndex="name"
          key="id"
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>

              <h4
                onClick={() => {
                  // setvisible(true)
                  history.push(`/admin/order/${record.id}`)
                  setactiveCategoryForEdit(record); 
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
           dataIndex="date_created" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record: any) => (
            <>

              <h4
               
                style={{
                  fontWeight: 400,
                  color: '#555',

                }}>
                  <Moment  withTitle>
                    {text}
                  </Moment>
              </h4>


            </>
          )}
            />


          <Column
          width={150}
           title="Status" 
           dataIndex="status" 
           key="id" 
           className='classnameofthecolumn'
           render={(text, record: any) => (
            <>

        <Dropdown overlay={() => StatusItemMenu(record,record.id)} placement="bottomRight">
           <a href='##'>
            <span
                // className={'product-attributeTag'}
              style={{
                fontSize:'12px'
              }}
                >

                {text}
                <span style={{
                  marginLeft:"5px",
                  fontSize:'10px'
                }}>
                   <DownOutlined />
                </span>
               
            </span> 
            </a>
					</Dropdown>


     
            </>
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
        <Column
        
        className='classnameofthecolumn'
          title=""
          key="action"
          align='right'
          render={(text, record : any) => (
            <Space size="middle">
              <a href='##'>
               <Tooltip placement="top" title='Quick Edit Region'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
              </span>

               </Tooltip>
               </a>



{/*    
               <Popconfirm 
               
               onConfirm={() => handleDeleteRegion(record.id)}
               title="Are you sure？" okText="Yes" cancelText="No">
           
           <span 
             className='iconSize iconSize-danger'
             > 
             <DeleteOutlined/>
            </span>
       
           </Popconfirm> */}


             
             
            </Space>
          )}
        />
      </Table>

    

    {/* {activeCategoryForEdit &&   <QuickEdit 
    setvisible={setvisible}
    visible={visible}
    customer={activeCategoryForEdit}
    orderList={data}
    setOrderList={setOrderList}

    />

    }
     */}
    
    </>
    )
}


interface Props {
    history: any; 
}

const CustomerList = ({history}: Props) => {

    const [orderList,setOrderList] = useState([]); 

    const [orderState, handleRegionListFetch] = useHandleFetch({}, 'orderList');
  

    console.log('orderState',orderState);
  
    useEffect(()=>{
     const setOrders = async () => {
       const regions = await handleRegionListFetch({
        urlOptions:{
          params: {
            sortItem: 'added',
            sortOrderValue: '-1'
          }
          }
       }); 
       // @ts-ignore
       setOrderList(regions); 
     }
     setOrders(); 
    },[])

  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  // console.log('orderState',orderState)


  const handleSearch = (value) => {
    if(orderState.data.length > 0 ){
      const newOrderList = orderState.data.filter(item => item.name.includes(value)); 
      setOrderList(newOrderList); 
    }
     
  }; 




	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Orders 
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search orders.."
          onSearch={value => handleSearch(value)}
          // style={{ width: 300 }}
        />
          </div>
            <Button
          // type="primary"
          className='btnPrimaryClassNameoutline'
          icon={<PlusOutlined />}
          onClick={() => history.push('/order/new')}
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
        {orderState.done && orderList.length > 0 && <MyTable 
        setOrderList={setOrderList}
        data={orderList} />}
        {orderState.isLoading && <DataTableSkeleton />}

        {orderState.done && !(orderList.length > 0) && (
        <Empty title='No Order found'  />
        )}
        
			</div>
		</div>


      {/* {orderState.done && 
          <AddNewOrder 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          orderList={orderState.data}
          setOrderList={setOrderList}
           />} */}

  
    </>
	);
};

export default withRouter(CustomerList);
