import React, { useEffect } from 'react';

// import components
import Empty from '../../components/Empty';

// import hooks
import { useHandleFetch } from '../../hooks';

// import lib
import { useHistory } from 'react-router';
import {
  LogoutOutlined,
  BellOutlined,
  OrderedListOutlined,
  TwitterSquareFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';

import Moment from 'react-moment';
import moment from 'moment';

import { Layout, Badge, Dropdown, Menu, Spin } from 'antd';

const { Header } = Layout;

interface Props {}

const NotificationList = (props: Props) => {
  const history = useHistory();

  const [getAllNotificationState, handleGetAllNOticationFetch] = useHandleFetch(
    {},
    'getAllNotificationPage'
  );

  const handleMenuClick = (e) => {
    if (e.key === '3') {
    }
  };

  useEffect(() => {
    const getAllNotification = async () => {
      await handleGetAllNOticationFetch({
        urlOptions: {
          params: {
            limitNumber: 5000,
          },
        },
      });
    };

    getAllNotification();
  }, []);

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
            marginTop: '100px',
          }}
        >
          <Spin />
        </div>
      );

    if (
      getAllNotificationState.done &&
      getAllNotificationState.data &&
      !getAllNotificationState.data[0]
    ) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '100px',
          }}
        >
          <Empty title='No Notification found' />
        </div>
      );
    }

    return (
      <div className='notificationListItemContainer'>
        {getAllNotificationState.done &&
          getAllNotificationState.data[0] &&
          getAllNotificationState.data.map((item, index) => {
            return (
              <div
                onClick={() => history.push(`/admin/${item.type}/${item.eventId}`)}
                className='notificationListItemContainer__item'
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

  return (
    <>
      <div className='notificationList'>
        <h3 className='notificationList__heading'>Notification</h3>
        {menu()}
      </div>
    </>
  );
};

export default NotificationList;
