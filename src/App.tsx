import React from 'react';

// import pages
import Login from './pages/auth/login';

// import layouts
import Sider from './layout/sider';
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

fix ===>

// # product add -> category name search dile crash kore
// # add order -> make delivery zone align as horizontal
// # double notification -> when creating order 
// # customer detail -> customer er order history hobe
// # customer list => add orderCount and totalOrderPrice field to show
# customer List =>  user will be able to sort with them (sort=totalOrderPrice&sortOrder=-1) 
// # order analytics -> add metric=deliveryRegion 
# at the footer of analytic charts -> add a show data button -> on clicked show data as table 
# price price field - make input type number 
# delivery region edit
# email api implementation
# check if the tag edit works properly 
# on open product quick epit site crashes 
# product bundle detail -> show images in product bundle detail 
# fix the attach image in bundle 
# amount type will be drowpdown
# add meta tags autofill in all items 
# add porst/add product => categories scrolbar
# update all the item quick edit to item edit 
# make order edit functionality to quick order edit


feat ===> 

# dealer
# bundle edit
# coupon edit
# post edit
# post category edit
# post tag edit (maybe)
# notification
# admin roles
# dynamic order status
# add dealer code at add order. 
# add coupon code at add order. 
*/

/* 

*/

/*

issus ====> 

error => product bundle ---> item not defined. 
error => Cannot read property 'offer' of undefined. 
error => coupon cover is coming as array in coupon list.
error => update post tag => Cannot read property 'name' of undefined. 
error => add post category => checkMime is not defined probably because of the image.

*/
