import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import { Table, notification,  Space, Tag,Button, Input,Tooltip, Popconfirm  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,CheckCircleOutlined } from '@ant-design/icons';

import {AddNewCategory,QuickEdit} from "../category"

/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
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
  setcategoryList?:any; 
  history?: any; 
} 


const MyTable = ({data, setcategoryList, history}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteCategoryState, handleDeleteCategoryFetch] = useHandleFetch({}, 'deleteCategory');

      console.log('activeCategoryForEdit',activeCategoryForEdit); 


      const handleDeleteCategory = async (id) => {
        const deleteCategoryRes = await handleDeleteCategoryFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });

          	  // @ts-ignore
		  if(deleteCategoryRes && deleteCategoryRes.status === 'ok'){
			  openSuccessNotification('Deleted Category'); 
			  const newCategoryList =  data.filter(item => item.id !== id);
			  setcategoryList(newCategoryList); 
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
          title=""
           dataIndex="cover"
            key="id" 
            // width={'100px'}
            
           className='classnameofthecolumn'

            render={(cover,record: any) => (
                <>
                <img src={cover} 
                // onClick={() => history.push(`/category/${record.name}`)}
                alt='cover img' 
                style={{
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


<Column
           title="Desctription" 
           dataIndex="desctription" 
           key="id" 
           className='classnameofthecolumn'
         
            />


<Column
           title="Sub Cateogory" 
           dataIndex="subCount" 
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
              <a href='##'>
               <Tooltip placement="top" title='Quick Edit Category'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>
               </a>


               <Popconfirm 
               
               onConfirm={() => handleDeleteCategory(record.id)}
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
    setcategoryList={setcategoryList}
    categoryList={data}
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


  

  const [categoryState, handleCategoryListFetch] = useHandleFetch({}, 'categoryList');
  const [categoryList,setcategoryList] = useState([]); 

  useEffect(()=>{
   const setCategories = async () => {
     const categories = await handleCategoryListFetch({
      urlOptions: {
        params: {
          isSubCategory: true,
        },
      },
     }); 
     // @ts-ignore
     setcategoryList(categories); 
   }
   setCategories(); 
  },[])


  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  console.log('categoryState',categoryState)



  
  
  const handleSearch = (value) => {
    if(categoryState.data.length > 0 ){
      const newCategoryList = categoryState.data.filter(item => item.name.includes(value)); 
      setcategoryList(newCategoryList); 
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
            Categories
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search categories.."
          onSearch={value => handleSearch(value)}
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
        {categoryState.done && categoryList.length > 0 && <MyTable 
        history={history}
        setcategoryList={setcategoryList}
        data={categoryList} />}
        {categoryState.isLoading && <DataTableSkeleton />}

        {categoryState.done && !(categoryList.length > 0) && (
			<div style={{
				marginTop: '50px'
			}}>
				<Empty title='No Category found'   />
			</div>
		)}
			</div>
		</div>


{categoryState.done && 
    <AddNewCategory 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          categoryList={categoryState.data}
          setcategoryList={setcategoryList}
          
           />}

      

        
    </>
	);
};

export default withRouter(CategoryList);
