import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Input,
  Tooltip,
  Modal,
  notification,
  Popconfirm,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  InfoCircleOutlined,
} from '@ant-design/icons';

/// import hooks
import { useFetch, useHandleFetch } from '../../hooks';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import AddNewTheme from './AddNewTheme';

import Empty from '../../components/Empty';

const { Search } = Input;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Tag Created',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

interface Props {
  history: any;
}

const CustomerList = ({ history }: Props) => {
  const [themeList, setThemeList] = useState([]);

  const [themeState, handleThemeListFetch] = useHandleFetch({}, 'themeList');
  const [activeThemeState, handleActiveThemeFetch] = useHandleFetch(
    {},
    'activeTheme'
  );
  const [updateDeleteThemeState, handleDeleteThemeFetch] = useHandleFetch(
    {},
    'deletetheme'
  );

  useEffect(() => {
    const setThemes = async () => {
      const themes = await handleThemeListFetch({});
      // @ts-ignore
      setThemeList(themes);
    };
    setThemes();
  }, []);

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  const handleSearch = (value) => {
    if (themeState.data.length > 0) {
      const newThemeList = themeState.data.filter((item) =>
        item.name.includes(value)
      );
      setThemeList(newThemeList);
    }
  };

  const handleActiveTheme = async (id) => {
    const activeThemeRes = await handleActiveThemeFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (activeThemeRes && activeThemeRes.status === 'ok') {
      openSuccessNotification('Theme activated');
    } else {
      openErrorNotification(
        "Couldn't activate the theme, Something went wrong"
      );
    }
  };

  const handleDeleteTheme = async (id) => {
    const deleteThemeRes = await handleDeleteThemeFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteThemeRes && deleteThemeRes.status === 'ok') {
      openSuccessNotification('Theme Deleted');
      const newThemeList = themeList.filter((item) => item.id !== id);
      setThemeList(newThemeList);
    } else {
      openErrorNotification("Couldn't delete, Something went wrong");
    }
  };

  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>Themes</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search themes..'
              onSearch={(value) => handleSearch(value)}
              // style={{ width: 300 }}
            />
          </div>
          <Button
            // type="primary"
            className='btnPrimaryClassNameoutline'
            icon={<PlusOutlined />}
            onClick={() => setAddNewCategoryVisible(true)}
          >
            Add New
          </Button>
        </div>

        <div className='categoryListContainer__afterHeader'></div>

        <div className='categoryListContainer__categoryList'>
          {themeState.done && themeList.length > 0 && (
            <div className='categoryListContainer__bodyContainerList'>
              {themeList.map((theme) => {
                return (
                  <div className='categoryListContainer__bodyContainerList-item'>
                    {/* <Badge count={<CheckCircleTwoTone style={{ color: '#3FA3FF' }} />}>
               
                  </Badge> */}
                    <div className='categoryListContainer__bodyContainerList-item-top'>
                      <img alt='theme img' src={theme.thumbnail} />
                    </div>
                    <div className='categoryListContainer__bodyContainerList-item-body'>
                      <h3> {theme.name} </h3>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Tooltip placement='top' title='Active this theme'>
                          <Button
                            size='small'
                            className='btnPrimaryClassNameoutline'
                            icon={<CheckOutlined />}
                            onClick={() => handleActiveTheme(theme.id)}
                          >
                            <span
                              style={{
                                fontSize: '11px',
                              }}
                            >
                              Set Active
                            </span>
                          </Button>
                        </Tooltip>

                        <Tooltip placement='top' title='Delete theme'>
                          <Popconfirm
                            onConfirm={() => handleDeleteTheme(theme.id)}
                            title='Are you sure？'
                            okText='Yes'
                            cancelText='No'
                          >
                            <Button
                              size='small'
                              type='link'
                              danger={true}
                              icon={<DeleteOutlined />}
                            ></Button>
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {themeState.isLoading && <DataTableSkeleton />}

          {themeState.done && !(themeList.length > 0) && (
            <Empty title='No Theme found' />
          )}
        </div>
      </div>

      {themeState.done && (
        <AddNewTheme
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          themeList={themeState.data}
          setThemeList={setThemeList}
        />
      )}
    </>
  );
};

export default withRouter(CustomerList);
