import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled,CheckCircleOutlined } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewOrder from "./AddNewOrder";
import QuickEdit from "./QuickEdit";
import Empty from "../../components/Empty";

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
  setRegionList: any; 
} 


const MyTable = ({data,setRegionList}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteRegionState, handleDeleteRegioFetch] = useHandleFetch({}, 'deleteRegion');


      const handleDeleteRegion = async (id) => {
        const deleteRegionRes = await handleDeleteRegioFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });

            // @ts-ignore
		  if(deleteRegionRes && deleteRegionRes.status === 'ok'){
			  openSuccessNotification('Deleted Region'); 
			  const newRegionList =  data.filter(item => item.id !== id);
			  setRegionList(newRegionList); 
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
           title="Name" 
           dataIndex="name" 
           key="id" 
           className='classnameofthecolumn'
         
            />


<Column
           title="Pick up Location" 
           dataIndex="pickUpLocation" 
           key="id" 
           className='classnameofthecolumn'
         
            />




<Column
           title="Country" 
           dataIndex="countryName" 
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
           title="Time" 
           dataIndex="time" 
           key="id" 
           className='classnameofthecolumn'
         
            />


<Column
           title="Charge" 
           dataIndex="time" 
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
            
               <Tooltip placement="top" title='Quick Edit Region'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>



   
               <Popconfirm 
               
               onConfirm={() => handleDeleteRegion(record.id)}
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
    setvisible={setvisible}
    visible={visible}
    customer={activeCategoryForEdit}
    regionList={data}
    setRegionList={setRegionList}

    />

    }
    
    
    </>
    )
}


interface Props {
    history: any; 
}

const CustomerList = ({history}: Props) => {

    const [regionList,setRegionList] = useState([]); 

    const [regionState, handleRegionListFetch] = useHandleFetch({}, 'regionList');
  
  
    useEffect(()=>{
     const setRegions = async () => {
       const regions = await handleRegionListFetch({}); 
       // @ts-ignore
       setRegionList(regions); 
     }
     setRegions(); 
    },[])




  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  console.log('regionState',regionState)


  const handleSearch = (value) => {
    if(regionState.data.length > 0 ){
      const newTagList = regionState.data.filter(item => item.name.includes(value)); 
      setRegionList(newTagList); 
    }
     
  }







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
        {regionState.done && regionList.length > 0 && <MyTable 
        setRegionList={setRegionList}
        data={regionList} />}
        {regionState.isLoading && <DataTableSkeleton />}

        {regionState.done && !(regionList.length > 0) && (
        <Empty title='No Order found'  />
        )}
        
			</div>
		</div>


{regionState.done && 
    <AddNewOrder 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          regionList={regionState.data}
          setRegionList={setRegionList}
           />}

      

        
    </>
	);
};

export default withRouter(CustomerList);
