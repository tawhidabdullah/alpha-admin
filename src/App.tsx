import React from 'react';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import Title from 'antd/lib/typography/Title';
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

} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} theme='light'>
          <div style={{
            marginLeft: '22px',
            marginRight: '20px',
            marginTop: '8px',
            width: '100%'
          }}>
            <Title style={{ color: '#0072EA' }} level={4}>
              ALPHA
         </Title>
          </div>
          <Menu defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Dashboard
            </Menu.Item>

            <SubMenu key="sub1" icon={<TagOutlined />} title="Category">
              <Menu.Item key="2">Add Category</Menu.Item>
              <Menu.Item key="3">List Categories</Menu.Item>
            </SubMenu>

            <SubMenu key="sub2" icon={<BranchesOutlined />} title="Brand">
              <Menu.Item key="4">Add Brand</Menu.Item>
              <Menu.Item key="5">List Brand</Menu.Item>
            </SubMenu>


            <SubMenu key="sub3" icon={<GoldOutlined />} title="Product">
              <Menu.Item key="6">Add Product</Menu.Item>
              <Menu.Item key="7">List Products</Menu.Item>
            </SubMenu>

            <Menu.Item key="8" icon={<FilterOutlined />}>
              Attributes
            </Menu.Item>


            <Menu.Item key="9" icon={<TagsOutlined />}>
              Tags
            </Menu.Item>


            <Menu.Item key="10" icon={<CarOutlined />}>
              Delivery
            </Menu.Item>




            <SubMenu key="sub4" icon={<ShoppingCartOutlined />} title="Orders">
              <Menu.Item key="11">Current Orders</Menu.Item>
              <Menu.Item key="12">Add new Order</Menu.Item>
            </SubMenu>


            <Menu.Item key="13" icon={<TeamOutlined />}>
              Customer
            </Menu.Item>

            <SubMenu key="sub5" icon={<MailOutlined />} title="Email">
              <Menu.Item key="14">STMP Configuration</Menu.Item>
              <Menu.Item key="15">Auto emails</Menu.Item>
              <Menu.Item key="16">Compose Email</Menu.Item>
              <Menu.Item key="16">Sent emails</Menu.Item>
            </SubMenu>




            <SubMenu key="sub6" icon={<FileOutlined />} title="Pages">
              <Menu.Item key="17">Add new Page</Menu.Item>
              <Menu.Item key="18">List Pages</Menu.Item>
            </SubMenu>


            <SubMenu key="sub7" icon={<SettingOutlined />} title="Settings">
              <Menu.Item key="19">Site information</Menu.Item>
              <Menu.Item key="20">Manage themes</Menu.Item>
              <Menu.Item key="21">Image</Menu.Item>
              <Menu.Item key="22">Invoice</Menu.Item>
              <Menu.Item key="23">Components</Menu.Item>
            </SubMenu>

          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#fff', height: '50px' }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Orders stats</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Users are ordering too much.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            © 2020 The Alpha E-commerce Engine - Developed By Lotus Technology
            Development.
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo;




