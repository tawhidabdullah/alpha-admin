// @ts-nocheck

import React, { useEffect, useState } from 'react';

// import hooks
import { useHandleFetch } from '../../hooks';

// import components
// import { openSuccessNotification, openErrorNotification } from "../../components/Notification";
import Empty from '../../components/Empty';

// import libraries
import { useHistory } from 'react-router';
import {
  LogoutOutlined,
  BellOutlined,
  OrderedListOutlined,
  TwitterSquareFilled,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Moment from 'react-moment';
import { Layout, Badge, Dropdown, Menu, Spin, notification } from 'antd';
import moment from 'moment';
const { Header } = Layout;

// import styles

const openSuccessNotification = (msg?: any) => {
  notification.success({
    message: msg || 'Product Deleted',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

interface Props {}

const HeaderComponent = (props: Props) => {
  const history = useHistory();

  const [getAllNotificationState, handleGetAllNOticationFetch] = useHandleFetch(
    {},
    'getAllNotification'
  );
  const [
    getMarkNotificationAsReadState,
    handleMarkNotificationAsReadFetch,
  ] = useHandleFetch({}, 'markNotificationAsRead');
  const [
    getMarkAllNotificationAsReadState,
    handleMarkAllNotificationAsReadFetch,
  ] = useHandleFetch({}, 'markAllNotificationAsRead');

  const [notificationList, setnotificationList] = useState({});

  const handleMenuClick = (e) => {
    if (e.key === '3') {
    }
  };

  useEffect(() => {
    const getAllNotification = async () => {
      const res = await handleGetAllNOticationFetch({
        urlOptions: {
          params: {
            sortItem: 'added',
            sortOrderValue: '-1',
            limitNumber: 100000,
          },
        },
      });

      // @ts-ignore
      if (res) {
        // @ts-ignore
        setnotificationList(res);
      }
    };

    getAllNotification();
  }, []);

  const handleNotificationAsRead = async (id) => {
    await handleMarkNotificationAsReadFetch({
      body: {
        id: [id],
      },
    });
  };

  const handleAllNotificationAsRead = async () => {
    const res = await handleMarkAllNotificationAsReadFetch({});
    // @ts-ignore
    if (res && res.status === 'ok') {
      openSuccessNotification('Notification cleared!');
      setnotificationList([]);
    }
  };

  console.log('getAllNotificationState', getAllNotificationState);

  const typeIcon = {
    customer: <UserOutlined />,
    order: <ShoppingCartOutlined />,
  };

  const menu = () => {
    if (getAllNotificationState.isLoading)
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '0 50px',
          }}
        >
          <Spin />
        </div>
      );

    if (
      getAllNotificationState.done &&
      notificationList &&
      !notificationList[0]
    ) {
      return (
        <div
          className='notificationListItemContainer'
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '0 50px',
          }}
        >
          <Empty title='No Notification found' />
        </div>
      );
    }
    return (
      <div style={{}} className='notificationListItemContainer'>
        {getAllNotificationState.done && notificationList[0] && (
          <div style={{}}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <a
                onClick={() => handleAllNotificationAsRead()}
                style={{
                  textAlign: 'center',
                  backgroundColor: '#f7f7f7',
                  padding: '10px',
                  width: '50%',
                  fontSize: '13px',
                }}
                href='##'
              >
                CLEAR ALL
              </a>
              <a
                onClick={() => history.push('/admin/notification')}
                style={{
                  textAlign: 'center',
                  backgroundColor: '#eee',
                  padding: '10px',
                  width: '50%',
                  fontSize: '13px',
                }}
                href='##'
              >
                SEE ALL
              </a>
            </div>
          </div>
        )}

        {getAllNotificationState.done &&
          notificationList[0] &&
          notificationList.map((item, index) => {
            console.log('notificationItem', item);
            return (
              <div
                onClick={() => {
                  handleNotificationAsRead(item._id);
                  history.push(`/admin/${item.type}/${item._id}`);
                }}
                className={
                  !item.read
                    ? 'notificationListItemContainer__item notificationListItemContainer__item-active'
                    : 'notificationListItemContainer__item'
                }
              >
                <span className='notificationListItemContainer__item-icon'>
                  {typeIcon[item['type']]}
                </span>
                <div className='notificationListItemContainer__item-info'>
                  <h3>{item.heading}</h3>
                  <h4>{item.text}</h4>
                  <h2>
                    {item.added &&
                      moment(item.added).format('MMMM Do YYYY, h:mm a')}
                  </h2>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  console.log('notificationList', notificationList);

  return (
    <Header
      style={{
        background: '#fff',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        boxShadow:
          '0 0.46875rem 2.1875rem rgba(8,10,37,.01), 0 0.9375rem 1.40625rem rgba(8,10,37,.01), 0 0.25rem 0.53125rem rgba(8,10,37,.02), 0 0.125rem 0.1875rem rgba(8,10,37,.01)',
        zIndex: 10,
        transition: ' all .2s',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <h2
        onClick={() => history.push('/admin')}
        style={{
          color: '#0072EA',
          marginTop: '10px',
          marginLeft: '-20px',
          cursor: 'pointer',
        }}
      >
        Admin
      </h2>

      <div
        style={{
          marginRight: '-28px',
        }}
      >
        <Dropdown
          placement='bottomLeft'
          overlay={menu}
          // visible={this.state.visible}
        >
          <a
            style={{
              marginRight: '10px',
            }}
            href='###'
            className='notificationIconContainer'
          >
            <Badge
              overflowCount={100}
              // @ts-ignore
              showZero={TwitterSquareFilled}
              count={
                getAllNotificationState.done && !notificationList
                  ? 0
                  : notificationList && notificationList.length
                  ? notificationList.length
                  : 0
              }
            >
              <span
                style={{
                  marginLeft: '10px',
                  fontWeight: 600,
                  borderRadius: '25px',
                  color: '#1890ff',
                  padding: '2px 20px',
                  cursor: 'pointer',
                  marginRight: '-5px',
                }}
              >
                <BellOutlined />
              </span>
            </Badge>
          </a>
        </Dropdown>

        <a href='/admin/auth/logout'>
          <span
            style={{
              marginLeft: '10px',
              fontWeight: 600,
              borderRadius: '25px',
              color: '#1890ff',
              padding: '2px 20px',
              cursor: 'pointer',
            }}
          >
            <LogoutOutlined />
            <span
              style={{
                marginLeft: '10px',
              }}
            >
              logout
            </span>
          </span>
        </a>
      </div>
    </Header>
  );
};

export default HeaderComponent;
