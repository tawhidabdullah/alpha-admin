import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, Badge, Menu, Dropdown, Space, Tag,Button, Input,Tooltip, Modal  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled } from '@ant-design/icons';



/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewBrand from "./AddNewBrand"
import QuickEdit from "./QuickEdit"



const { Column, ColumnGroup } = Table;
const { Search } = Input;




interface myTableProps {
  data: any; 
} 


const MyTable = ({data}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteBrandState, handleDeleteBrandFetch] = useHandleFetch({}, 'deleteBrand');


      
      console.log('activeCategoryForEdit',activeCategoryForEdit)

 
      const handleDeleteCategory = async (id) => {
        const deleteBrandRes = await handleDeleteBrandFetch({
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
          title=""
           dataIndex="cover"
            key="id" 
            // width={'100px'}
            
           className='classnameofthecolumn'

            render={cover => (
                <>
                <img src={cover} alt='cover img' style={{
                    height: '40px',
                    width: '40px',
                    objectFit: "contain",
                    borderRadius:'3px'
                }} />
                </>
              )}
            />
          <Column
           title="Name" 
           dataIndex="name" 
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
            
               <Tooltip placement="top" title='Quick Edit Brand'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>


             
              <Tooltip placement="top" title='Delete Brand'>
            

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
    category={activeCategoryForEdit}/>}
    
    
    </>
    )
}


interface Props {
    history: any; 
}

const CategoryList = ({history}: Props) => {

    const brandState = useFetch([], [], 'brandList', {
    urlOptions: {
      params: {
        isSubCategory: true,
      },
    },
  });


  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  console.log('brandState',brandState)



	return (
		<>
    {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Brand
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
        {brandState.done && brandState.data.length > 0 && <MyTable data={brandState.data} />}
        {brandState.isLoading && <DataTableSkeleton />}
			</div>
		</div>

    <AddNewBrand 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible} />

      

        
    </>
	);
};

export default withRouter(CategoryList);
