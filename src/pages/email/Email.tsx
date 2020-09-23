import React, { useState, useEffect } from 'react';

// import lib
import {
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Modal,
  Tabs,
  Input,
} from 'antd';

// import components
import ConfigureSTMP from './ConfigureSTMP';
import ConfigureAutoEmail from './ConfigureAutoEmail';
import ComposeCustomEmail from './ComposeCustomEmail';
import Inbox from './Inbox';

// import hooks
import { useHandleFetch } from '../../hooks';

import {
  DeleteOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  FileImageFilled,
  FileImageOutlined,
  FileImageTwoTone,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search } = Input;

interface Props {}

const Sms = (props: Props) => {
  const [getEmailListState, handleGetEmailListFetch] = useHandleFetch(
    {},
    'getSetEmailList'
  );
  const [emailList, setEmailList] = useState([]);

  useEffect(() => {
    const getEmailConfiguration = async () => {
      const res = await handleGetEmailListFetch({
        urlOptions: {
          params: {
            limitCount: 50000,
            sortItemValue: 'time',
            sortOrderValue: '-1',
          },
        },
      });
      // @ts-ignore
      setEmailList(res);
    };
    getEmailConfiguration();
  }, []);

  const handleSearch = (value) => {
    if (getEmailListState.data.length > 0) {
      const newProductList = getEmailListState.data.filter((item) => {
        return (
          (item.recipient &&
            item.recipient.toLowerCase().includes(value.toLowerCase())) ||
          (item.subject &&
            item.subject.toLowerCase().includes(value.toLowerCase())) ||
          (item.html && item.html.toLowerCase().includes(value.toLowerCase()))
        );
      });
      setEmailList(newProductList);
    }
  };

  return (
    <>
      <div className='categoryListContainer__header'>
        <div className='categoryListContainer__header-searchBar'>
          <h2 className='categoryListContainer__header-title'>Email</h2>

          <Search
            enterButton={false}
            className='searchbarClassName'
            placeholder='search email..'
            onChange={(e) => handleSearch(e.target.value)}
            // style={{ width: 300 }}
          />
        </div>
      </div>
      <div className='siteInfoContainer'>
        <Tabs defaultActiveKey='1'>
          <TabPane
            tab={
              <span>
                <InboxOutlined />
                Outbox
              </span>
            }
            key='1'
          >
            <Inbox
              getEmailListState={getEmailListState}
              setEmailList={setEmailList}
              emailList={emailList}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <PlusCircleOutlined />
                Compose Email
              </span>
            }
            key='2'
          >
            <ComposeCustomEmail />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Configure STMP
              </span>
            }
            key='3'
          >
            <ConfigureSTMP />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Configure Auto Email
              </span>
            }
            key='4'
          >
            <ConfigureAutoEmail />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Sms;
