import React, { useEffect } from 'react';

// import pages
import Login from './pages/auth/login';

// import layouts
import Sider from './layout/sider';
import Header from './layout/header';
import Content from './layout/content';
// import Footer from './layout/footer';

// import state
import { glboalOperations } from './state/ducks/globalState';
import { credentialsOperations } from './state/ducks/credentials';
import { connect } from 'react-redux';

// import libraries
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import hooks
import { useHandleFetch } from './hooks';

const App = ({ saveRoles, saveCredentials }) => {
  const [
    getAdminCredentialState,
    handleAdminCredentCialsFetch,
  ] = useHandleFetch({}, 'getAdminCredential');

  useEffect(() => {
    const getCredenCials = async () => {
      const res = await handleAdminCredentCialsFetch({});
      // saveCredentials(res);
      // @ts-ignore
      if (res && res['role']) {
        saveRoles(res['role'] || []);
      }
    };
    getCredenCials();
  }, []);

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

const mapDispathToProps = {
  saveRoles: glboalOperations.saveRoles,
  saveCredentials: credentialsOperations.saveCredentials,
};

const mapStateToProps = (state) => ({
  globalState: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, mapDispathToProps)(App);

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
page update => {"image":"selected image are not attached to page with given id"}.
order list => add delivery filtering drowndown
recipe category => fix recipe category edit and others'
add site map => at site info add a extra tab, --sitemap-- then in there show, site maps, and
in below show update button which will update the site map. 
make components images to update at once.  

*/

/* 

Off work left to do: 
Filtering order by deliveryzone
making Post category work perfectly
update component at once. 
order status is not working properly
admin roles
give resolved images when create a component
check if productlist returns cover
make admin list section work properly
*/

/* 

Things that still left to do in mangshobazar: 

add delete button in add new component
complete salary report 
fix the order invoice 


// on change search in --> customer/recipe/dealer/staff




----------------------------------------------------
EDIT RECIPIE	* bn fields not populating (preparationTime, servingSize) --> 
suggestion --> change servingSize->serving
   and preparationTime -> prepTime	* servingSize is not defined error
    on updateSINGLE RECIPIE PAGE	* on edit shows 
   "servingSize is not defined"EDIT CATEGORY: 	* bn values and meta fields not populating on edit
*/
