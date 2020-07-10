import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewCustomer from "./AddNewRegion";
import QuickEdit from "./QuickEdit";

const { Column, ColumnGroup } = Table;
const { Search } = Input;




interface myTableProps {
  data: any; 
} 


const MyTable = ({data}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteRegionState, handleDeleteRegioFetch] = useHandleFetch({}, 'deleteRegion');
      const handleDeleteCategory = async (id) => {
        const deleteRegionRes = await handleDeleteRegioFetch({
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


             
              <Tooltip placement="top" title='Delete Region'>
            

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

    const regionState = useFetch([], [], 'regionList', { });


  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  console.log('regionState',regionState)



	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Regions 
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search regions.."
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
        {regionState.done && regionState.data.length > 0 && <MyTable data={regionState.data} />}
        {regionState.isLoading && <DataTableSkeleton />}
			</div>
		</div>


{regionState.done && 
    <AddNewCustomer 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          categoryList={regionState.data}
          
           />}

      

        
    </>
	);
};

export default withRouter(CustomerList);
