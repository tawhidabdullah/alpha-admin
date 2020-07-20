import React from 'react'


// import pages
import { Overview } from '../../pages/overview';
import { CategoryList, CategoryDetail } from '../../pages/category';
import { BrandList, AddNewBrand } from '../../pages/brand';
import { ProductList } from '../../pages/product';
import { TagList, AddNewTag } from '../../pages/tag';
import { CustomerList } from '../../pages/customer';
import { PagesList, AddNewPage } from '../../pages/pages';
import { AttributeList } from '../../pages/attribute';
import { OrderList, AddNewOrder } from '../../pages/order';
import { Component, ManageThemes, Image, Invoice, SiteInfo } from '../../pages/settings';
import { Delivery } from '../../pages/delivery';
// import Login from '../../pages/auth/login';




// import libraries
import { Layout } from 'antd';
import { Switch, Route, Redirect } from 'react-router-dom';



const { Content } = Layout;

interface Props {

}

const ContentComponent = (props: Props) => {
    return (
        <Content
            hasSider={true}
            style={{
                backgroundColor: '#fff',
                paddingTop: '20px'
            }}
        >
            <Switch>
                <Route
                    exact
                    path='/'
                    render={() => <Redirect to='/admin' />}
                />
                <Route
                    exact
                    path='/admin'
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
    )
}

export default ContentComponent
