import React from 'react';

// import pages
import { Overview } from './pages/overview';
import { CategoryList, CategoryDetail } from './pages/category';
import { BrandList, AddNewBrand } from './pages/brand';
import { ProductList, AddNewProduct } from './pages/product';
import { TagList, AddNewTag } from './pages/tag';
import { CustomerList } from './pages/customer';
import { PagesList, AddNewPage } from './pages/pages';
import { AttributeList } from './pages/attribute';
import { OrderList, AddNewOrder } from './pages/order';
import { Component, ManageThemes, Image, Invoice, SiteInfo } from './pages/settings';
import { Delivery } from './pages/delivery';
import Login from './pages/auth/login';
// import components
import Sider from './layout/Sider';

// import third party ui libraries
import { Layout, notification } from 'antd';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';

import { useHandleFetch } from "./hooks";
import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined,
	LogoutOutlined
} from '@ant-design/icons';
import { cursorTo } from 'readline';
const { Header, Content, Footer } = Layout;


const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Category Updated',
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





const App = () => {


	const [logoutState, handleLogoutFetch] = useHandleFetch({}, 'logout');


	const handleLogout = async () => {
		const logoutRes = await handleLogoutFetch({});

		//@ts-ignore
		if (logoutRes && logoutRes.status === 'ok') {
			openSuccessNotification('Loged out successfully');

		}
		else {
			openErrorNotification("Couldn't logout, Something went wrong");
		}

	};





	return (
		<Router>
			{/* <Switch>
				<Route path='/login' exact>
					<Login />
				</Route>
			</Switch> */}
			<Switch>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider />
					<Layout className='site-layout'>
						<Header
							className='site-layout-background'
							style={{
								background: '#fff',
								borderBottom: '1px solid #fafafa',
								borderLeft: '1px solid #fafafa',
								height: '50px',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						>
							<Title
								style={{ color: '#0072EA', marginTop: '10px', marginLeft: '-20px' }}
								level={4}>
								Admin
				             </Title>


							<div
								onClick={() => handleLogout()}
								style={{
									marginTop: '-8px',
									marginRight: '-28px'
								}}>

								<span style={{
									marginLeft: '10px',
									fontWeight: 600,
									// backgroundColor: 'rgba(28, 39, 152, 0.1)',
									borderRadius: '25px',
									color: '#1890ff',
									padding: '2px 20px',
									cursor: 'pointer'


								}}>
									<LogoutOutlined />
									<span style={{
										marginLeft: '10px',

									}}>
										logout
									</span>

								</span>


							</div>
						</Header>
						<Content
							hasSider={true}
							style={{
								backgroundColor: '#Fff'
							}}
						>
							<Switch>
								<Route
									exact
									path='/'
									render={() => <Redirect to='/admin/product' />}
								/>


								<Route path='/admin' exact>
									<Overview />
								</Route>
								<Route path='/admin/category' exact>
									<CategoryList />
								</Route>
								<Route path='/admin/category/:name' exact>
									<CategoryDetail />
								</Route>
								{/* CategoryDetail */}
								<Route path='/admin/brand/new' exact>
									<AddNewBrand />
								</Route>
								<Route path='/admin/brand' exact>
									<BrandList />
								</Route>
								<Route path='/admin/product' exact>
									<ProductList />
								</Route>
								{/* <Route path='/product/new' exact>
									<AddNewProduct />
								</Route> */}
								<Route path='/admin/tag' exact>
									<TagList />
								</Route>
								<Route path='/admin/product/new' exact>
									<AddNewTag />
								</Route>
								<Route path='/admin/attribute' exact>
									<AttributeList />
								</Route>
								<Route path='/admin/order' exact>
									<OrderList />
								</Route>
								<Route path='/admin/order/new' exact>
									<AddNewOrder />
								</Route>
								<Route path='/admin/customer' exact>
									<CustomerList />
								</Route>
								<Route path='/admin/page' exact>
									<PagesList />
								</Route>
								<Route path='/admin/delivery' exact>
									<Delivery />
								</Route>
								<Route path='/admin/page/new' exact>
									<AddNewPage />
								</Route>
								<Route path='/admin/settings/components' exact>
									<Component />
								</Route>
								<Route path='/admin/settings/image' exact>
									<Image />
								</Route>
								<Route path='/admin/settings/themes' exact>
									<ManageThemes />
								</Route>
								<Route path='/admin/settings/invoice' exact>
									<Invoice />
								</Route>
								<Route path='/admin/settings/siteInfo' exact>
									<SiteInfo />
								</Route>
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center', background: '#fafafa', color: '#1890ff' }}>
							© 2020 The Alpha E-commerce Engine - Developed By Lotus Technology Development.
						</Footer>
					</Layout>
				</Layout>
			</Switch>
		</Router>
	);
};

export default App;
