import React from 'react';

// import pages
import { Overview } from './pages/overview';
import { CategoryList, AddNewCategory } from './pages/category';
import { BrandList, AddNewBrand } from './pages/brand';
import { ProductList, AddNewProduct } from './pages/product';
import { TagList, AddNewTag } from './pages/tag';
import { CustomerList } from './pages/customer';
import { PagesList, AddNewPage } from './pages/pages';
import { AttributeList } from './pages/attribute';
import { OrderList, AddNewOrder } from './pages/order';
import { Component } from './pages/settings';

// import components
import Sider from './layout/Sider';

// import third party ui libraries
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const App = () => {
	return (
		<Router>
			<Layout style={{ minHeight: '100vh' }}>
				<Sider />
				<Layout className='site-layout'>
					<Header
						className='site-layout-background'
						style={{ padding: 0, backgroundColor: '#fff', height: '50px' }}
					/>
					<Content hasSider={true} style={{ margin: '0 16px', background: '#fafafa' }}>
						<Switch>
							<Route path='/' exact>
								<Overview />
							</Route>
							<Route path='/category' exact>
								<CategoryList />
							</Route>
							<Route path='/category/new' exact>
								<AddNewCategory />
							</Route>

							<Route path='/brand/new' exact>
								<AddNewBrand />
							</Route>

							<Route path='/brand' exact>
								<BrandList />
							</Route>

							<Route path='/product' exact>
								<ProductList />
							</Route>

							<Route path='/product/new' exact>
								<AddNewProduct />
							</Route>

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

							<Route path='/order/new' exact>
								<AddNewOrder />
							</Route>

							<Route path='/customer' exact>
								<CustomerList />
							</Route>

							<Route path='/page' exact>
								<PagesList />
							</Route>

							<Route path='/page/new' exact>
								<AddNewPage />
							</Route>
							<Route path='/settings/components' exact>
								<Component />
							</Route>
						</Switch>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						© 2020 The Alpha E-commerce Engine - Developed By Lotus Technology Development.
					</Footer>
				</Layout>
			</Layout>
		</Router>
	);
};

export default App;
