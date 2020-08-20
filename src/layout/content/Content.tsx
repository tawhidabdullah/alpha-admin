import React from 'react'


// import pages
import { Overview } from '../../pages/overview';
import { CategoryList, NewCategoryDetail } from '../../pages/category';
import { ProductBundleDetail, ProductBundleList } from '../../pages/productBundle';
import { BrandList, AddNewBrand, NewBrandDetail } from '../../pages/brand';
import { ProductList, NewProductDetail } from '../../pages/product';
import { TagList, AddNewTag, NewTagDetail } from '../../pages/tag';
import { CouponList, CouponDetail } from '../../pages/coupon';
import { CustomerList, CustomerDetail } from '../../pages/customer';
import { PagesList, AddNewPage } from '../../pages/pages';
import { AttributeList } from '../../pages/attribute';
import { OrderList, AddNewOrder, OrderDetail } from '../../pages/order';
import { Component, ManageThemes, Image, Invoice, SiteInfo } from '../../pages/settings';
import { Delivery } from '../../pages/delivery';
import Sms from '../../pages/sms';
import {Email} from '../../pages/email';


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
                    render={() => <Redirect to='/admin/overview' />}
                />

                <Route
                    exact
                    path='/admin'
                    render={() => <Redirect to='/admin/overview' />}
                />

                <Route path='/admin/overview' exact>
                    <Overview />
                </Route>
                <Route path='/admin/category' exact>
                    <CategoryList />
                </Route>
                <Route path='/admin/category/:id' exact>
                    <NewCategoryDetail />
                </Route>
                {/* <Route path='/admin/category/:name' exact>
                    <CategoryDetail />
                </Route> */}

                {/* CategoryDetail */}
                <Route path='/admin/brand/new' exact>
                    <AddNewBrand />
                </Route>
                <Route path='/admin/brand' exact>
                    <BrandList />
                </Route>
                <Route path='/admin/brand/:id' exact>
                    <NewBrandDetail />
                </Route>
                <Route path='/admin/product' exact>
                    <ProductList />
                </Route>
                <Route path='/admin/product/:id' exact>
                    <NewProductDetail />
                </Route>

                <Route path='/admin/bundle' exact>
                    <ProductBundleList />
                </Route>

                <Route path='/admin/bundle/:id' exact>
                    <ProductBundleDetail />
                </Route>

                <Route path='/admin/coupon' exact>
                    <CouponList />
                </Route>

                <Route path='/admin/coupon/:id' exact>
                    <CouponDetail />
                </Route>

                {/* <Route path='/product/new' exact>
                     <AddNewProduct />
                   </Route> */}
                <Route path='/admin/tag' exact>
                    <TagList />
                </Route>
                <Route path='/admin/tag/new' exact>
                    <AddNewTag />
                </Route>
                <Route path='/admin/tag/:id' exact>
                    <NewTagDetail />
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
                <Route path='/admin/order/:id' exact>
                    <OrderDetail />
                </Route>
                <Route path='/admin/customer' exact>
                    <CustomerList />
                </Route>
                <Route path='/admin/customer/:id' exact>
                    <CustomerDetail />
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
                <Route path='/admin/sms' exact>
                    <Sms />
                </Route>

                <Route path='/admin/email' exact>
                    <Email />
                </Route>

            </Switch>
        </Content>
    )
}

export default ContentComponent
