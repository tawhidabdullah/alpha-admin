import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import { Button, Input,Tooltip, Modal, notification, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled,CheckCircleOutlined } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewTheme from "./AddNewTheme";

import Empty from "../../components/Empty";

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



interface Props {
    history: any; 
}

const CustomerList = ({history}: Props) => {

    const [themeList,setThemeList] = useState([]); 

    const [themeState, handleThemeListFetch] = useHandleFetch({}, 'themeList');
  
  
    useEffect(()=>{
     const setThemes = async () => {
       const themes = await handleThemeListFetch({}); 
       // @ts-ignore
       setThemeList(themes); 
     }
     setThemes(); 
    },[])




  
  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   

  console.log('orderState',themeState)


  const handleSearch = (value) => {
    if(themeState.data.length > 0 ){
      const newThemeList = themeState.data.filter(item => item.name.includes(value)); 
      setThemeList(newThemeList); 
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
		 Themes
 
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search themes.."
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

            </div>

     
			
			<div className='categoryListContainer__categoryList'>
        {themeState.done && themeList.length > 0 && (
			<> </>
		)}


        {themeState.isLoading && <DataTableSkeleton />}

        {themeState.done && !(themeList.length > 0) && (
        <Empty title='No Theme found'  />
        )}
        
			</div>
		</div>


    {themeState.done && 
    <AddNewTheme 
          addNewCategoryVisible={addNewCategoryVisible} 
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          themeList={themeState.data}
          setThemeList={setThemeList}
           />}
    </>
	);
};

export default withRouter(CustomerList);
