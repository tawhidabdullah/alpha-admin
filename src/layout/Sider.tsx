import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import { Layout, Menu, Upload, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import {
	PieChartOutlined,
	FileOutlined,
	TeamOutlined,
	TagOutlined,
	BranchesOutlined,
	GoldOutlined,
	FilterOutlined,
	TagsOutlined,
	CarOutlined,
	ShoppingCartOutlined,
	MailOutlined,
	SettingOutlined,
	InboxOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent = () => {
	const [ collapsed, setcollapsed ] = useState(false);
	const onCollapse = (collapsed: any) => {
		console.log(collapsed);
		setcollapsed(collapsed);
	};

	return (
		<Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light'>
			<div
				style={{
					marginLeft: '22px',
					marginRight: '20px',
					marginTop: '8px',
					width: '100%'
				}}
			>
				<Title style={{ color: '#0072EA' }} level={4}>
					ALPHA
				</Title>
			</div>
			<Menu defaultSelectedKeys={[ '1' ]} mode='inline'>
				<Menu.Item key='1' icon={<PieChartOutlined />}>
					<Link to='/'>Dashboard</Link>
				</Menu.Item>

				<SubMenu key='sub1' icon={<TagOutlined />} title='Category'>
					<Menu.Item key='2'>
						<Link to='/category'>List Categories</Link>
					</Menu.Item>
					<Menu.Item key='3'>
						<Link to='/category/new'>Add Category</Link>
					</Menu.Item>
				</SubMenu>

				<SubMenu key='sub2' icon={<BranchesOutlined />} title='Brand'>
					<Menu.Item key='4'>
						<Link to='/brand/new'>Add Brand</Link>
					</Menu.Item>
					<Menu.Item key='5'>
						<Link to='/brand'>List Brand</Link>
					</Menu.Item>
				</SubMenu>

				<SubMenu key='sub3' icon={<GoldOutlined />} title='Product'>
					<Menu.Item key='6'>
						<Link to='/product/new'>Add Product</Link>
					</Menu.Item>
					<Menu.Item key='7'>
						<Link to='/product'> List Products</Link>
					</Menu.Item>
				</SubMenu>

				<Menu.Item key='8' icon={<FilterOutlined />}>
					<Link to='/attribute'>Attributes</Link>
				</Menu.Item>

				<Menu.Item key='9' icon={<TagsOutlined />}>
					<Link to='/tag'>Tags</Link>
				</Menu.Item>

				<Menu.Item key='10' icon={<CarOutlined />}>
					<Link to='/delivery'>Delivery</Link>
				</Menu.Item>

				<SubMenu key='sub4' icon={<ShoppingCartOutlined />} title='Orders'>
					<Menu.Item key='11'>
						<Link to='/order'>List Orders</Link>
					</Menu.Item>
					<Menu.Item key='12'>
						<Link to='/order/new'>Add Order</Link>
					</Menu.Item>
				</SubMenu>

				<Menu.Item key='13' icon={<TeamOutlined />}>
					<Link to='/customer'>Customer</Link>
				</Menu.Item>

				<SubMenu key='sub5' icon={<MailOutlined />} title='Email'>
					<Menu.Item key='14'>STMP Configuration</Menu.Item>
					<Menu.Item key='15'>Auto emails</Menu.Item>
					<Menu.Item key='16'>Compose Email</Menu.Item>
					<Menu.Item key='177'>Sent emails</Menu.Item>
				</SubMenu>

				<SubMenu key='sub6' icon={<FileOutlined />} title='Pages'>
					<Menu.Item key='17'>
						<Link to='/page/new'> Add new Page</Link>
					</Menu.Item>
					<Menu.Item key='18'>
						<Link to='/page'> List Pages</Link>
					</Menu.Item>
				</SubMenu>

				<SubMenu key='sub7' icon={<SettingOutlined />} title='Settings'>
					<Menu.Item key='19'>Site information</Menu.Item>
					<Menu.Item key='20'>Manage themes</Menu.Item>
					<Menu.Item key='21'>Image</Menu.Item>
					<Menu.Item key='22'>Invoice</Menu.Item>
					<Menu.Item key='23'>Components</Menu.Item>
				</SubMenu>
			</Menu>
		</Sider>
	);
};

export default SiderComponent;
