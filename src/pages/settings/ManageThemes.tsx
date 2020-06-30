import React, {useState} from 'react';
import { Table, Badge, Menu, Dropdown, Space, Tag, Button, Input, Tooltip, Modal, Card, Avatar } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, CheckOutlined, CheckCircleTwoTone } from '@ant-design/icons';

interface Props {}

const ManageThemes = (props: Props) => {
	const [visible,setvisible] = useState(false);   


	

    const handleOk = (e: any) => {
        setvisible(false);
      
      };
    
      const handleCancel = (e: any) => {
        setvisible(false);
	  };
	  

	return (
		<>
		<div className='categoryListContainer'>
			<div className='categoryListContainer__header'>
				<h2 className='categoryListContainer__header-title'>Uploaded Themes</h2>
				<Tooltip placement='top' title='Add new Themes'>
					<Button 
					type='primary'
					 icon={<CloudUploadOutlined />} onClick={() => setvisible(true)}>
						Add New
					</Button>
				</Tooltip>
			</div>

			<div className='categoryListContainer__bodyContainerList'>
				<div className='categoryListContainer__bodyContainerList-item'>
					<Badge count={<CheckCircleTwoTone style={{ color: '#3FA3FF' }} />}>
						<div className='categoryListContainer__bodyContainerList-item-top'>
							<img
								alt='theme img'
								src='https://homebazarshibchar.com/images/homeBazar.zip-thumb-homebazarLogo.jpg'
							/>
						</div>
						<div className='categoryListContainer__bodyContainerList-item-body'>
							<h3>Home Bazar</h3>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between'
								}}
							>
								<Tooltip placement='top' title='Active this theme'>
									<Button
										size='small'
										type='primary'
										icon={<CheckOutlined />}
										onClick={() => console.log('upload thme')}
									>
										Set Active
									</Button>
								</Tooltip>

								<Tooltip placement='top' title='Delete theme'>
									<Button
										size='small'
										type='link'
										danger={true}
										icon={<DeleteOutlined />}
										onClick={() => console.log('upload thme')}
									>
										{/* Delete */}
									</Button>
								</Tooltip>
							</div>
						</div>
					</Badge>
				</div>

				<div className='categoryListContainer__bodyContainerList-item'>
					<div className='categoryListContainer__bodyContainerList-item-top'>
						<img
							alt='theme img'
							src='https://homebazarshibchar.com/images/homeBazar.zip-thumb-homebazarLogo.jpg'
						/>
					</div>
					<div className='categoryListContainer__bodyContainerList-item-body'>
						<h3>Home Bazar</h3>

						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between'
							}}
						>
							<Tooltip placement='top' title='Active this theme'>
								<Button
									size='small'
									type='primary'
									icon={<CheckOutlined />}
									onClick={() => console.log('upload thme')}
								>
									Set Active
								</Button>
							</Tooltip>

							<Tooltip placement='top' title='Delete theme'>
								<Button
									size='small'
									type='link'
									danger={true}
									icon={<DeleteOutlined />}
									onClick={() => console.log('upload thme')}
								>
									{/* Delete */}
								</Button>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal
          title="Add new Theme"
          visible={visible}
          onOk={handleOk}
		  onCancel={handleCancel}
		 footer={null}
		  okText='Done'
        ></Modal>
		</>
	);
};

export default ManageThemes;
