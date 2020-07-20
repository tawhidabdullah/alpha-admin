import React, { useState, useEffect } from 'react';
import { Collapse, Button, Tooltip, Upload, Modal,Input, notification, Popconfirm } from 'antd';
import { CaretRightOutlined,CheckCircleOutlined,  PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// import components
import InputField from '../../components/Field/Input';
import Empty from '../../components/Empty';
import ComponentImageUpload from './ComponentImageUpload';
import {useHandleFetch} from '../../hooks';
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewComponent from "./AddNewComponent";
import ComponentListComponentItem from './ComponentListComponentItem';
import AddNewComponentItem from './AddNewComponentItem';
import { category } from '../../state/ducks';




const { Panel } = Collapse;
const { Search } = Input;



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Component Created',
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



const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function getBase64(file: any) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}


const genExtra = (updateComponentByDeleting,component,id) => (
	<div
		style={{
			display: 'flex'
		}}
	>
		<Tooltip placement='top' title='Edit Component'>
			<EditOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					// event.stopPropagation();
				}}
			/>
		</Tooltip>

		<div
			style={{
				marginLeft: '15px'
			}}
		/>
			<Popconfirm 
               
               onConfirm={() => updateComponentByDeleting(id,component)}
               title="Are you sure？" okText="Yes" cancelText="No">
           
		   <DeleteOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					event.stopPropagation();
				}}
			/>
           </Popconfirm>
	</div>
);

const genExtraForGroup = (setitemVisible: any, handleDeleteComponent:any, id: any,setComponentId:any) => (
	<div
		style={{
			display: 'flex'
		}}
	>
		<Tooltip placement='top' title='Add new item Component'>
			<PlusOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					// event.stopPropagation();
					setitemVisible(true);
					setComponentId(id)
				}}
			/>
		</Tooltip>

		<div
			style={{
				marginLeft: '15px'
			}}
		/>
		<Tooltip placement='top' title='Edit Component'>
			<EditOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					// event.stopPropagation();
				}}
			/>
		</Tooltip>

		<div
			style={{
				marginLeft: '15px'
			}}
		/>
		<Popconfirm 
               
               onConfirm={() => handleDeleteComponent(id)}
               title="Are you sure？" okText="Yes" cancelText="No">
           
		   <DeleteOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					event.stopPropagation();
				}}
			/>
           </Popconfirm>


			
	</div>
);

const Component = (props) => {


	const [visible, setvisible] = useState(false);
	const [groupVisible, setgroupVisible] = useState(false);
	const [itemVisible, setitemVisible] = useState(false);
	const [componentId,setComponentId] = useState(''); 


	
	const [componentState, handleComponentListFetch] = useHandleFetch({}, 'componentList');
	const [deleteComponentState, handleDeleteComponentFetch] = useHandleFetch({}, 'deleteComponent');
	const [updateComponentState, handleUpdateComponentFetch] = useHandleFetch({}, 'updateComponent');
	
	const [componentList,setComponentList] = useState([]); 
  
	useEffect(()=>{
	 const setComponents = async () => {
	   const categories = await handleComponentListFetch({}); 
	   // @ts-ignore
	   setComponentList(categories); 
	 }
	 setComponents(); 
	},[])

	

	const handleSearch = (value) => {
		if(componentState.data.length > 0 ){
		  const newComponentList = componentState.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase())); 
		  setComponentList(newComponentList); 
		}
		 
	  }
	



	  
      const handleDeleteComponent = async (id) => {
        const deleteComponentRes = await handleDeleteComponentFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });

            // @ts-ignore
		  if(deleteComponentRes && deleteComponentRes.status === 'ok'){
			  openSuccessNotification('Component Deleted'); 
			  const newComponentList =  componentList.filter(item => item.id !== id);
			  setComponentList(newComponentList); 
		  }
		  else {
			openErrorNotification("Couldn't delete, Something went wrong")
		  }
	  }
	  



	const handleOk = (e: any) => {
		setvisible(false);

	};

	const handleCancel = (e: any) => {
		setvisible(false);
	};
	const handleOkGroup = (e: any) => {
		setgroupVisible(false);

	};

	const handleCancelGroup = (e: any) => {
		setgroupVisible(false);
	};


	const componentUpdate = async (item,component,localComponentItem) => {
		const positionInComponents = () => {
            return componentList.map(item => item.id).indexOf(component.id);
          };
      
          const positionInItemsOfComponent = () => {
            return component.items.map(item => item.id).indexOf(item.id);
          };
      
          const componentIndex = positionInComponents();
      
          const itemIndex = positionInItemsOfComponent();
      
          const updatedItems = [
            ...component.items.slice(0, itemIndex),
            localComponentItem,
            ...component.items.slice(itemIndex + 1)
          ];
      
          const updatedItem = Object.assign({}, componentList[componentIndex], {
            ...component,
            items: updatedItems
          });
      
          const updateComponentList = [
            ...componentList.slice(0, componentIndex),
            updatedItem,
            ...componentList.slice(componentIndex + 1)
          ];
		
		  


		const updateComponentRes = await handleUpdateComponentFetch({
			urlOptions: {
				placeHolders: {
				  id: component.id,
				}
			  },
			body: {
				...updatedItem,
				groupName: updatedItem.name
			},
		  });
		
			   // @ts-ignore
			   if(updateComponentRes && updateComponentRes.status === 'ok'){
				openSuccessNotification("Component Updated"); 
				setComponentList(updateComponentList);
				
			  }
			  else {
				openErrorNotification();
			  }
	}


	const updateComponentByDeleting = async (id,component) => {

		const positionInComponents = () => {
            return componentList.map(item => item.id).indexOf(component.id);
          };
      
          const positionInItemsOfComponent = () => {
            return component.items.map(item => item.id).indexOf(id);
          };
      
          const componentIndex = positionInComponents();
      
          const itemIndex = positionInItemsOfComponent();
      
          const updatedItems = [
            ...component.items.slice(0, itemIndex),
            ...component.items.slice(itemIndex + 1)
          ];
      
          const updatedItem = Object.assign({}, componentList[componentIndex], {
            ...component,
            items: updatedItems
          });
      
          const updateComponentList = [
            ...componentList.slice(0, componentIndex),
            updatedItem,
            ...componentList.slice(componentIndex + 1)
          ];
		
		  


		const updateComponentRes = await handleUpdateComponentFetch({
			urlOptions: {
				placeHolders: {
				  id: component.id,
				}
			  },
			body: {
				...updatedItem,
				groupName: updatedItem.name
			},
		  });
		
			   // @ts-ignore
			   if(updateComponentRes && updateComponentRes.status === 'ok'){
				openSuccessNotification("Component Item deleted"); 
				setComponentList(updateComponentList);
				
			  }
			  else {
				openErrorNotification();
			  }
	};


	const updateComponentByAddingItem = async (localComponentItem,id) => {
		const positionInComponents = () => {
            return componentList.map(item => item.id).indexOf(id);
          };
      
      
          const componentIndex = positionInComponents();
      
    
      
          const updatedItems = [
            ...componentList[componentIndex].items,
            localComponentItem,
          ];
      
          const updatedItem = Object.assign({}, componentList[componentIndex], {
            ...componentList[componentIndex],
            items: updatedItems
          });
      
          const updateComponentList = [
            ...componentList.slice(0, componentIndex),
            updatedItem,
            ...componentList.slice(componentIndex + 1)
          ];
		
		  


		const updateComponentRes = await handleUpdateComponentFetch({
			urlOptions: {
				placeHolders: {
				  id: id,
				}
			  },
			body: {
				...updatedItem,
				groupName: updatedItem.name
			},
		  });
		
			   // @ts-ignore
			   if(updateComponentRes && updateComponentRes.status === 'ok'){
				openSuccessNotification("Component Item Added"); 
				setComponentList(updateComponentList);
				setitemVisible(false);
				
			  }
			  else {
				openErrorNotification();
			  }
	};

	return (
		<>
		    <div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>
            Components
            </h2>


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search components.."
          onSearch={value => handleSearch(value)}
        />
          </div>
            <Button
          // type="primary"
          className='btnPrimaryClassNameoutline'
          icon={<PlusOutlined />}
		  onClick={() => setgroupVisible(true)}
        >
        Add New
            
            </Button>
            </div>

            <div className='categoryListContainer__afterHeader'>
 
            </div>

     
			
			<div className='categoryListContainer__categoryList'>
     
        {componentState.isLoading && <DataTableSkeleton />}

        {componentState.done && !(componentList.length > 0) && (
			<div style={{
				marginTop: '50px'
			}}>
				<Empty title='No Component found' />
			</div>
		)}

		{componentState.done && componentList.length > 0 && (
					<div className='componentsItemContainer'>
					{componentList.map(component => {
						return (
							<div className='componentsItemContainer-item'>
							<Collapse
								accordion={false}
								bordered={false}
								expandIconPosition='left'
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								className='site-collapse-custom-collapse'
							>
								<Panel
									header={component.name}
									key='1'
									className='site-collapse-custom-panel'
									extra={genExtraForGroup(setitemVisible,handleDeleteComponent, component.id,setComponentId)}
								>
									<div className=' componentsItemContainer-white'>
										{component.items && component.items.length > 0 && component.items.map(item => {
											return (
												<div className='componentsItemContainer-item-item'>
												<Collapse
													accordion={false}
													bordered={false}
													expandIconPosition='left'
													expandIcon={({ isActive }) => (
														<CaretRightOutlined rotate={isActive ? 90 : 0} />
													)}
													className='site-collapse-custom-collapse'
												
												>
													<Panel
														header={item.title || ''}
														key='1'
														className='site-collapse-custom-panel'
														extra={genExtra(updateComponentByDeleting,component,item.id)}
													>
														<ComponentListComponentItem
														setComponentList={setComponentList}
														componentList={componentList}
														item={item}
														component={component}
														componentUpdate={componentUpdate}
														 />
														

													</Panel>
												</Collapse>
											</div>

											)
										})}


										{!(component.items.length > 0 ) && <Empty title='No item Found'/>}
						
									</div>
								</Panel>
							</Collapse>
						</div>
						)
					})}
				</div>
		)}
			</div>
		</div>


		<AddNewComponent 
          addNewCategoryVisible={groupVisible} 
          setAddNewCategoryVisible={setgroupVisible} 
          setComponentList={setComponentList}
          componentList={componentList}
          />
		  <AddNewComponentItem 
          addNewCategoryVisible={itemVisible} 
          setAddNewCategoryVisible={setitemVisible} 
          setComponentList={setComponentList}
		  componentList={componentList}
		  updateComponentByAddingItem={updateComponentByAddingItem}
		  componentId={componentId}
          />


		  

			<Modal
				title="Add New Group Component"
				visible={false}
				onOk={handleOkGroup}
				onCancel={handleCancelGroup}
				footer={null}
				okText='Done'
			>
				<InputField label='Group Component Name' />
		
			</Modal>
		</>
	);
};

export default Component;
