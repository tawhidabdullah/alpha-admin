import React, { useState, useEffect } from 'react';
import { Collapse, Button, Tooltip, Upload, Modal,Input } from 'antd';
import { CaretRightOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// import components
import InputField from '../../components/Field/Input';
import Empty from '../../components/Empty';
import ComponentImageUpload from './ComponentImageUpload';
import {useHandleFetch} from '../../hooks';
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewComponent from "./AddNewComponent";
const { Panel } = Collapse;
const { Search } = Input;



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

interface Props { }

const genExtra = () => (
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
		<Tooltip placement='top' title='Delete Component'>
			<DeleteOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					event.stopPropagation();
				}}
			/>
		</Tooltip>
	</div>
);

const genExtraForGroup = (setvisible: any) => (
	<div
		style={{
			display: 'flex'
		}}
	>
		<Tooltip placement='top' title='Add new child Component'>
			<PlusOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					// event.stopPropagation();
					setvisible(true);
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
		<Tooltip placement='top' title='Delete Component'>
			<DeleteOutlined
				onClick={(event) => {
					// If you don't want click extra trigger collapse, you can prevent this:
					event.stopPropagation();
				}}
			/>
		</Tooltip>
	</div>
);

const Component = (props: Props) => {


	const [visible, setvisible] = useState(false);
	const [groupVisible, setgroupVisible] = useState(false);


	
	const [componentState, handleComponentListFetch] = useHandleFetch({}, 'componentList');
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
				<div className='addproductSectionContainer addproductSectionContainer-components'>

				<div className='addproductSectionContainer-components__item'>


					<div className='groupComponentsContainer'>
						<div className='groupComponentsContainer-item'>
							<div className='componentsItemContainer'>
								<div className='componentsItemContainer-item'>
									<Collapse
										accordion={false}
										bordered={false}
										expandIconPosition='left'
										expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
										className='site-collapse-custom-collapse'
									>
										<Panel
											header='Payment'
											key='1'
											className='site-collapse-custom-panel'
											extra={genExtraForGroup(setvisible)}
										>
											<div className='componentsItemContainerv componentsItemContainer-white'>
												<div className='componentsItemContainer-item'>
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
															header='Bkash'
															key='1'
															className='site-collapse-custom-panel'
															extra={genExtra()}
														>
															<InputField label='Component Name' />
															<InputField label='Target URL' />
															<InputField label='Heading' />
															<InputField label='Text' />
															<h3 className='inputFieldLabel'>Image</h3>
															<div
																style={{
																	marginTop: '10px',
																	marginBottom: '10px'
																}}
															>
																<ComponentImageUpload />
															</div>

															<Button size='large' type='primary'>
																Save
														</Button>
														</Panel>
													</Collapse>
												</div>

												<div className='componentsItemContainer-item'>
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
															header='Rocket'
															key=''
															className='site-collapse-custom-panel'
															extra={genExtra()}
														>
															<InputField label='Component Name' />
															<InputField label='Target URL' />
															<InputField label='Heading' />
															<InputField label='Text' />
															<h3 className='inputFieldLabel'>Image</h3>
															<div
																style={{
																	marginTop: '10px',
																	marginBottom: '10px'
																}}
															>
																<ComponentImageUpload />
															</div>

															<Button size='large' type='primary'>
																Save
														</Button>
														</Panel>
													</Collapse>
												</div>

												<div className='componentsItemContainer-item'>
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
															header='Nagad'
															key='1'
															className='site-collapse-custom-panel'
															extra={genExtra()}
														>
															<InputField label='Component Name' />
															<InputField label='Target URL' />
															<InputField label='Heading' />
															<InputField label='Text' />
															<h3 className='inputFieldLabel'>Image</h3>
															<div
																style={{
																	marginTop: '10px',
																	marginBottom: '10px'
																}}
															>
																<ComponentImageUpload />
															</div>

															<Button size='large' type='primary'>
																Save
														</Button>
														</Panel>
													</Collapse>
												</div>
											</div>
										</Panel>
									</Collapse>
								</div>
							</div>
						</div>
					</div>
				</div>
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

			<Modal
				title="Add New Group Component"
				visible={false}
				onOk={handleOkGroup}
				onCancel={handleCancelGroup}
				footer={null}
				okText='Done'
			>
				<InputField label='Group Component Name' />
				{/* <Input label='Target URL' />
                <Input label='Heading' />
                <Input label='Text' />
                <h3 className='inputFieldLabel'>Image</h3>
                <div
                    style={{
                        marginTop: '10px',
                        marginBottom: '10px'
                    }}
                >
                    <ComponentImageUpload />
                </div> */}
{/* 
				<Button size='large' type='primary'>
					Save
                </Button> */}
			</Modal>
		</>
	);
};

export default Component;
