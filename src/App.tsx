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
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const App = () => {
	return (
		<Router>
			<Switch>
				<Route path='/login' exact>
					<Login />
				</Route>
			</Switch>
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
								height: '50px'
							}}
						/>
						<Content
							hasSider={true}
							style={{
								backgroundColor: '#Fff'
							}}
						>
							<Switch>
								<Route path='/' exact>
									<Overview />
								</Route>
								<Route path='/category' exact>
									<CategoryList />
								</Route>
								<Route path='/category/:name' exact>
									<CategoryDetail />
								</Route>
								CategoryDetail
								<Route path='/brand/new' exact>
									<AddNewBrand />
								</Route>
								<Route path='/brand' exact>
									<BrandList />
								</Route>
								<Route path='/product' exact>
									<ProductList />
								</Route>
								{/* <Route path='/product/new' exact>
									<AddNewProduct />
								</Route> */}
								<Route path='/tag' exact>
									<TagList />
								</Route>
								<Route path='/product/new' exact>
									<AddNewTag />
								</Route>
								<Route path='/attribute' exact>
									<AttributeList />
								</Route>
								<Route path='/order' exact>
									<OrderList />
								</Route>
								{/* <Route path='/order/new' exact>
									<AddNewOrder />
								</Route> */}
								<Route path='/customer' exact>
									<CustomerList />
								</Route>
								<Route path='/page' exact>
									<PagesList />
								</Route>
								<Route path='/delivery' exact>
									<Delivery />
								</Route>
								<Route path='/page/new' exact>
									<AddNewPage />
								</Route>
								<Route path='/settings/components' exact>
									<Component />
								</Route>
								<Route path='/settings/image' exact>
									<Image />
								</Route>
								<Route path='/settings/themes' exact>
									<ManageThemes />
								</Route>
								<Route path='/settings/invoice' exact>
									<Invoice />
								</Route>
								<Route path='/settings/siteInfo' exact>
									<SiteInfo />
								</Route>
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							© 2020 The Alpha E-commerce Engine - Developed By Lotus Technology Development.
						</Footer>
					</Layout>
				</Layout>
			</Switch>
		</Router>
	);
};

export default App;
