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

/* 

#product 
#order
#category
#order
#customer
#customer
*/

/*

issus ====> 
error => product bundle ---> item not defined
error => in component list images will resolve
error => couldn't order, i._id.toHexString is not a function
error => Cannot read property 'offer' of undefined

*/