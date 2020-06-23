import React, {useState} from 'react';
import { Collapse, Button, Tooltip, Upload, Modal } from 'antd';
import { CaretRightOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import ComponentImageUpload from './ComponentImageUpload';

const { Panel } = Collapse;

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

interface Props {}

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

    
    const [visible,setvisible] = useState(false);   
    const [groupVisible,setgroupVisible] = useState(false);   
    



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
<div className='site-layout-background' style={{ padding: '30px 50px 30px 50px', minHeight: 360 }}>
			<div className='addproductSectionContainer addproductSectionContainer-components'>
				<div className='addproductSection addproductSection-left'>
					<div className='addproductSectionTitleContainer'>
						<h2 className='addprouctSectionTitle'>Components</h2>
						<Tooltip placement='top' title='Add new Single Component'>
                            <Button 
                            onClick={()=> setvisible(true)}
                            type='link' icon={<PlusOutlined />}>
								Add New
							</Button>
						</Tooltip>
					</div>

					<div className='componentsItemContainer'>
						<div className='componentsItemContainer-item'>
							<Collapse
								accordion={false}
								bordered={false}
								expandIconPosition='left'
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								className='site-collapse-custom-collapse'
							>
								<Panel header='Bkash' key='1' className='site-collapse-custom-panel' extra={genExtra()}>
									<Input label='Component Name' />
									<Input label='Target URL' />
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
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								className='site-collapse-custom-collapse'
							>
								<Panel header='Rocket' key='' className='site-collapse-custom-panel' extra={genExtra()}>
									<Input label='Component Name' />
									<Input label='Target URL' />
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
								expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
								className='site-collapse-custom-collapse'
							>
								<Panel header='Nagad' key='1' className='site-collapse-custom-panel' extra={genExtra()}>
									<Input label='Component Name' />
									<Input label='Target URL' />
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
									</div>

									<Button size='large' type='primary'>
										Save
									</Button>
								</Panel>
							</Collapse>
						</div>
					</div>
				</div>
				<div className='addproductSection addproductSection-right'>
					<div className='addproductSectionTitleContainer'>
						<h2 className='addprouctSectionTitle'>Group Components</h2>
						<Tooltip placement='top' title='Add new Group Component'>
                            <Button 
                            onClick={() => setgroupVisible(true)}
                            type='link' icon={<PlusOutlined />}>
								Add New
							</Button>
						</Tooltip>
					</div>

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
															<Input label='Component Name' />
															<Input label='Target URL' />
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
															<Input label='Component Name' />
															<Input label='Target URL' />
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
															<Input label='Component Name' />
															<Input label='Target URL' />
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
		</div>
        <Modal
          title="Add new Component"
          visible={visible}
          onOk={handleOk}
		  onCancel={handleCancel}
		 footer={null}
		  okText='Done'
        >
            	<Input label='Component Name' />
									<Input label='Target URL' />
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
									</div>

									<Button size='large' type='primary'>
										Save
									</Button>
        </Modal>

        <Modal
          title="Add New Group Component"
          visible={groupVisible}
          onOk={handleOkGroup}
		  onCancel={handleCancelGroup}
		 footer={null}
		  okText='Done'
        >
            	<Input label='Group Component Name' />
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

                <Button size='large' type='primary'>
                    Save
                </Button>
        </Modal>
</>
	);
};

export default Component;
