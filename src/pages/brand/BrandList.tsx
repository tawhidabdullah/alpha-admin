import React, {useState,useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import { Table,Empty, Popconfirm, Space, Tag,Button, Input,Tooltip, Modal, notification  } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled,CheckCircleOutlined } from '@ant-design/icons';



/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewBrand from "./AddNewBrand"
import QuickEdit from "./QuickEdit"



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
  setBrandList: any; 
} 


const MyTable = ({data,setBrandList}: myTableProps) => {
    const [visible,setvisible] = useState(false);   
    const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteBrandState, handleDeleteBrandFetch] = useHandleFetch({}, 'deleteBrand');


      

 
      const handleDeleteBrand = async (id) => {
        const deleteBrandRes = await handleDeleteBrandFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });

            // @ts-ignore
		  if(deleteBrandRes && deleteBrandRes.status === 'ok'){
			  openSuccessNotification('Deleted Brand'); 
			  const newBrandList =  data.filter(item => item.id !== id);
			  setBrandList(newBrandList); 
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

<Column
           title="Description" 
           dataIndex="description" 
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
               <Tooltip placement="top" title='Quick Edit Brand'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>
               </a>


 
               <Popconfirm 
               
               onConfirm={() => handleDeleteBrand(record.id)}
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
    brandList={data}
    setBrandList={setBrandList}
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


  const [brandList,setBrandList] = useState([]);

  
  const [brandState, handlebrandListFetch] = useHandleFetch({}, 'brandList');


  useEffect(()=>{
   const setBrands = async () => {
     const brands = await handlebrandListFetch({}); 
     // @ts-ignore
     setBrandList(brands); 
   }
   setBrands(); 
  },[])


  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };


    
  const handleSearch = (value) => {
    if(brandState.data.length > 0 ){
      const newBrandList = brandState.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase())); 
      setBrandList(newBrandList); 
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
            Organizer
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search organizer.."
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
        {brandState.done && brandList.length > 0 && <MyTable 
          setBrandList={setBrandList}
        data={brandList} />}
        {brandState.isLoading && <DataTableSkeleton />}
        {brandState.done && !(brandList.length > 0) && (
			<div style={{
				marginTop: '100px'
			}}>
				<Empty description='No Organizer found'  image={Empty.PRESENTED_IMAGE_SIMPLE} />
			</div>
		)}
			</div>
		</div>

    <AddNewBrand 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible} 
          setBrandList={setBrandList}
          brandList={brandList}
          />

    </>
	);
};

export default withRouter(CategoryList);
