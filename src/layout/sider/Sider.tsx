import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Switch, withRouter } from 'react-router-dom';
import { Layout, Menu, Upload, message } from 'antd';


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
    InboxOutlined,
    SlidersOutlined,
    DesktopOutlined,
    RadarChartOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent = (props: any) => {
    const [collapsed, setcollapsed] = useState(false);
    const onCollapse = (collapsed: any) => {
        // console.log(collapsed);
        setcollapsed(collapsed);
    };



    return (
        <Sider
            width={260}
            style={{
                boxShadow: '7px 0 60px rgba(0,0,0,.05)',
                border: 'none'
            }}
            collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light'>

            <Menu selectable={true} mode='inline'>
                <Menu.Item key='1' icon={<PieChartOutlined />}>
                    <Link to='/admin'>Dashboard</Link>
                </Menu.Item>

                {/* <SubMenu key='sub1' icon={<TagOutlined />} title='Category'>
					<Menu.Item key='2'>
						<Link to='/category'>List Categories</Link>
					</Menu.Item>
				</SubMenu> */}

                {/* <SubMenu key='sub2' icon={<BranchesOutlined />} title='Brand'>

					<Menu.Item key='5'>
						<Link to='/brand'>List Brand</Link>
					</Menu.Item>
				</SubMenu> */}

                <SubMenu
                    key='sub3'
                    icon={<GoldOutlined />}
                    title='Product'
                // onTitleClick={() => props.history.push('/product')}
                >
                    <Menu.Item
                        icon={<RadarChartOutlined />}
                        key='6'>
                        <Link to='/admin/product'>List Products</Link>
                    </Menu.Item>




                    <Menu.Item key='9' icon={<TagsOutlined />}>
                        <Link to='/admin/tag'>Tags</Link>

                    </Menu.Item>

                    <Menu.Item key='2' icon={<TagOutlined />}>
                        <Link to='/admin/category'>Categories</Link>
                    </Menu.Item>


                    <Menu.Item key='5' icon={<BranchesOutlined />}>
                        <Link to='/admin/brand'>Brands</Link>
                    </Menu.Item>



                </SubMenu>

                {/* <Menu.Item key='9' icon={<TagsOutlined />}>
					<Link to='/tag'>Tags</Link>
				</Menu.Item> */}

                <Menu.Item key='10' icon={<CarOutlined />}>
                    <Link to='/admin/delivery'>Delivery</Link>
                </Menu.Item>

                <SubMenu key='sub4' icon={<ShoppingCartOutlined />} title='Orders'>
                    <Menu.Item key='11'>
                        <Link to='/admin/order'>List Orders</Link>
                    </Menu.Item>
                    <Menu.Item key='12'>
                        <Link to='/admin/order/new'>Add Order</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key='13' icon={<TeamOutlined />}>
                    <Link to='/admin/customer'>Customer</Link>
                </Menu.Item>

                <SubMenu key='sub5' icon={<MailOutlined />} title='Email'>
                    <Menu.Item key='14'>STMP Configuration</Menu.Item>
                    <Menu.Item key='15'>Auto emails</Menu.Item>
                    <Menu.Item key='16'>Compose Email</Menu.Item>
                    <Menu.Item key='177'>Sent emails</Menu.Item>
                </SubMenu>

                <SubMenu key='sub6' icon={<FileOutlined />} title='Pages'>
                    <Menu.Item key='17'>
                        <Link to='/admin/page/new'> Add new Page</Link>
                    </Menu.Item>
                    <Menu.Item key='18'>
                        <Link to='/admin/page'> List Pages</Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item
                    icon={<DesktopOutlined />}
                    key='20'>
                    <Link to='/admin/settings/themes'>Themes</Link>
                </Menu.Item>

                <Menu.Item key='23'
                    icon={<SlidersOutlined />}
                >
                    <Link to='/admin/settings/components'>Components</Link>
                </Menu.Item>

                <SubMenu key='sub7' icon={<SettingOutlined />} title='Settings'>
                    <Menu.Item key='19'>
                        <Link to='/admin/settings/siteInfo'>Site information</Link>
                    </Menu.Item>

                    {/* <Menu.Item key='21'>
						<Link to='/settings/image'>Image</Link>
					</Menu.Item> */}
                    <Menu.Item key='22'>
                        <Link to='/admin/settings/invoice'>Invoice</Link>
                    </Menu.Item>

                </SubMenu>
            </Menu>
        </Sider>
    );
};

export default withRouter(SiderComponent);
