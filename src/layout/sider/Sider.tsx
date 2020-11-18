import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  withRouter,
} from 'react-router-dom';
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
  RadarChartOutlined,
  MessageOutlined,
  UserOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  BgColorsOutlined,
  BankOutlined,
  FireOutlined,
  MailTwoTone,
  UserAddOutlined,
  GlobalOutlined,
  CalculatorOutlined,
  UsergroupAddOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';

// import state
import { glboalOperations } from '../../state/ducks/globalState';
import { isAccess } from '../../utils';
import { connect } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderComponent = ({ roles }: any) => {
  const [collapsed, setcollapsed] = useState(false);
  const onCollapse = (collapsed: any) => {
    // console.log(collapsed);
    setcollapsed(collapsed);
  };

  return (
    <Sider
      width={260}
      className='siderForAlphaAdmin'
      style={{
        boxShadow: '7px 0 60px rgba(0,0,0,.05)',
        border: 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'calc(100vh - 100px)',
        position: 'fixed',
        top: '60px'
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme='light'
    >
      <Menu selectable={true} mode='inline'>
        {isAccess('analytics', roles) && (
          <Menu.Item key='1' icon={<PieChartOutlined />}>
            <Link to='/admin'>Dashboard</Link>
          </Menu.Item>
        )}

        {isAccess('getCatalogue', roles) && (
          <SubMenu
            key='sub3'
            icon={<GoldOutlined />}
            title='Product'
            // onTitleClick={() => props.history.push('/product')}
          >
            <Menu.Item icon={<RadarChartOutlined />} key='6'>
              <Link to='/admin/product'>Products</Link>
            </Menu.Item>

            {/* <Menu.Item
                      icon={<BankOutlined />}
                      key='2222'>
                      <Link to='/admin/bundle'>Bundle</Link>
                  </Menu.Item> */}

            <Menu.Item key='9' icon={<TagsOutlined />}>
              <Link to='/admin/tag'>Tags</Link>
            </Menu.Item>

            <Menu.Item key='2' icon={<TagOutlined />}>
              <Link to='/admin/category'>Categories</Link>
            </Menu.Item>

            <Menu.Item key='5' icon={<BranchesOutlined />}>
              <Link to='/admin/brand'>Brand</Link>
            </Menu.Item>
          </SubMenu>
        )}

        <SubMenu
          key='sub333'
          icon={<GoldOutlined />}
          title='Recipes'
          // onTitleClick={() => props.history.push('/product')}
        >
          <Menu.Item icon={<RadarChartOutlined />} key='655'>
            <Link to='/admin/posts'>List Recipe</Link>
          </Menu.Item>

          <Menu.Item icon={<TagOutlined />} key='2222444'>
            <Link to='/admin/posts/category'>Recipe Category</Link>
          </Menu.Item>

          <Menu.Item key='955' icon={<TagsOutlined />}>
            <Link to='/admin/posts/tag'>Recipe Tags</Link>
          </Menu.Item>
        </SubMenu>

        {/* <Menu.Item key='1012' icon={<FileExcelOutlined />}>
                    <Link to='/admin/posts'>
                        Recipies
                    </Link>
                </Menu.Item> */}

        <Menu.Item key='1011' icon={<FireOutlined />}>
          <Link to='/admin/coupon'>Coupon</Link>
        </Menu.Item>

        {isAccess('getDelivery', roles) && (
          <Menu.Item key='10' icon={<CarOutlined />}>
            <Link to='/admin/delivery'>Delivery</Link>
          </Menu.Item>
        )}

        {isAccess('accounts', roles) && (
          <SubMenu key='sub33' icon={<CalculatorOutlined />} title='Accounting'>
            <SubMenu key='sub3355' icon={<CalculatorOutlined />} title='Staff'>
              <Menu.Item icon={<UsergroupAddOutlined />} key='66'>
                <Link to='/admin/staff'>Staffs</Link>
              </Menu.Item>
              <Menu.Item icon={<MoneyCollectOutlined />} key='65257'>
                <Link to='/admin/salaryReport'>Salary report</Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item icon={<MoneyCollectOutlined />} key='67'>
              <Link to='/admin/expense'>Expense</Link>
            </Menu.Item>

            <Menu.Item key='675454'>
              <Link to='/admin/acccounting/overview'>Order report</Link>
            </Menu.Item>
          </SubMenu>
        )}

        {isAccess('getOrder', roles) && (
          <SubMenu key='sub4' icon={<ShoppingCartOutlined />} title='Orders'>
            <Menu.Item key='11'>
              <Link to='/admin/order'>List Orders</Link>
            </Menu.Item>
            <Menu.Item key='11222'>
              <Link to='/admin/order/overview'>Order Analytics</Link>
            </Menu.Item>
            <Menu.Item key='12'>
              <Link to='/admin/order/new'>Add Order</Link>
            </Menu.Item>
            {/* <Menu.Item key='12'>
                          <Link to='/admin/order/config'>
                              Configure order status
                          </Link>
                      </Menu.Item> */}
          </SubMenu>
        )}

        {isAccess('getDealer', roles) && (
          <SubMenu
            key='sub5553'
            icon={<TeamOutlined />}
            title='Dealer'
            // onTitleClick={() => props.history.push('/product')}
          >
            <Menu.Item icon={<TeamOutlined />} key='666655'>
              <Link to='/admin/dealer'>List dealer</Link>
            </Menu.Item>

            <Menu.Item icon={<GlobalOutlined />} key='22534522444'>
              <Link to='/admin/dealer/area'>Dealer Areas</Link>
            </Menu.Item>
          </SubMenu>
        )}

        <Menu.Item key='13' icon={<UserOutlined />}>
          <Link to='/admin/customer'>Customer</Link>
        </Menu.Item>
        <Menu.Item key='1888' icon={<MailOutlined />}>
          <Link to='/admin/email'>Email</Link>
        </Menu.Item>
        <Menu.Item key='199' icon={<MessageOutlined />}>
          <Link to='/admin/sms'>SMS</Link>
        </Menu.Item>

        {isAccess('getDealer', roles) && (
          <SubMenu key='sub6' icon={<FileOutlined />} title='Pages'>
            <Menu.Item key='18' icon={<FileSearchOutlined />}>
              <Link to='/admin/page'> List Pages</Link>
            </Menu.Item>
            <Menu.Item icon={<FileAddOutlined />} key='17'>
              <Link to='/admin/page/new'> Add new Page</Link>
            </Menu.Item>
          </SubMenu>
        )}

        <SubMenu key='sub7' icon={<SettingOutlined />} title='Settings'>
          <Menu.Item icon={<UserOutlined />} key='19'>
            <Link to='/admin/settings/siteInfo'>Site information</Link>
          </Menu.Item>

          <Menu.Item icon={<UserAddOutlined />} key='19999'>
            <Link to='/admin/settings/admins'>Admins</Link>
          </Menu.Item>

          <Menu.Item key='23' icon={<SlidersOutlined />}>
            <Link to='/admin/settings/components'>Components</Link>
          </Menu.Item>

          <Menu.Item icon={<BgColorsOutlined />} key='20'>
            <Link to='/admin/settings/themes'>Themes</Link>
          </Menu.Item>

          {/* <Menu.Item key='21'>
						<Link to='/settings/image'>Image</Link>
					</Menu.Item> */}
          {/* <Menu.Item key='22'>
                        <Link to='/admin/settings/invoice'>Invoice</Link>
                    </Menu.Item> */}
        </SubMenu>
      </Menu>
    </Sider>
  );
};

const mapDispathToProps = {
  saveRoles: glboalOperations.saveRoles,
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, mapDispathToProps)(SiderComponent);

/* 
git checkout commit3 && git checkout -b newBranch && git cherry-pick 20ead887
af2f73c541465d9067c3c6c70c398ac2
*/
