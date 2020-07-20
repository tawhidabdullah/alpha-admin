import React from 'react';

// import pages
import Login from './pages/auth/login';



// import layouts
import Sider from "./layout/sider";
import Header from './layout/header';
import Content from './layout/content';
// import Footer from './layout/footer';

// import libraries
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


const App = () => {
	return (
		<Router>
			<Switch>
				<Route path='/admin/login' exact>
					<Login />
				</Route>
			</Switch>
			<Switch>

				<Layout style={{ minHeight: '100vh' }}>
					<Header />

					<Layout className='site-layout'>
						<Sider />
						<Content />
					</Layout>
					{/* <Footer /> */}
				</Layout>
			</Switch>
		</Router>
	);
};

export default App;
