import React from 'react';
import { Layout, Avatar, Menu, Icon, Breadcrumb } from 'antd';
import Title from 'antd/lib/typography/Title';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header
        style={{
          background: '#fff',
          padding: 15,
          borderBottom: '1px solid #F4F5F7'
        }}
      >
        <Avatar style={{ float: 'right' }} icon='user' />

        <Title style={{ color: '#333' }} level={3}>
          ALPHA 0.1
        </Title>
      </Header>
      <Layout>
        <Sider
          style={{
            background: '#fff'
          }}
        >
          <Menu defaultSelectedKeys={['Dashboard']} mode='inline'>
            <Menu.Item key='Dashboard'>Dashboard</Menu.Item>
            <SubMenu
              title={
                <span>
                  <Icon type='mail' />
                  <span>About Us</span>
                </span>
              }
            >
              <Menu.ItemGroup key='Branch One' title='Branch One'>
                <Menu.Item key='Contact Us'>Contact Us</Menu.Item>
                <Menu.Item key='Address'></Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout
          style={{
            background: '#'
          }}
        >
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                background: '#fff',
                padding: 24,
                minHeight: 580
              }}
            >
              Content
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            © 2019 The Alpha E-commerce Engine - Developed By Lotus Technology
            Development.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
