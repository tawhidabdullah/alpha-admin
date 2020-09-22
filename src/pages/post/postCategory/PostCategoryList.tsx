import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Table,
  notification,
  Space,
  Tag,
  Button,
  Input,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import QuickEdit from './QuickEdit';
import AddNewPostCategory from './AddNewPostCategory';

/// import hooks
import { useFetch, useHandleFetch } from '../../../hooks';

// import components
import { DataTableSkeleton } from '../../../components/Placeholders';
import Empty from '../../../components/Empty';

const { Column, ColumnGroup } = Table;
const { Search } = Input;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Post Recipe Created',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

interface myTableProps {
  data: any;
  setcategoryList?: any;
  history?: any;
}

const MyTable = ({ data, setcategoryList, history }: myTableProps) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteCategoryState, handleDeleteCategoryFetch] = useHandleFetch(
    {},
    'postCategoryDelete'
  );
  // console.log('activeCategoryForEdit',activeCategoryForEdit);

  const handleDeleteCategory = async (id) => {
    const deleteCategoryRes = await handleDeleteCategoryFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteCategoryRes && deleteCategoryRes.status === 'ok') {
      openSuccessNotification('Deleted Recipe Category');
      const newCategoryList = data.filter((item) => item.id !== id);
      setcategoryList(newCategoryList);
    }
  };

  const getCover = (record: any) => {
    if (record.cover) {
      return record.cover;
    } else return '';
  };

  return (
    <>
      <Table
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        // bordered={true}
        size='small'
        // pagination={false}
        dataSource={data}
      >
        <Column
          title=''
          dataIndex='cover'
          key='id'
          width={'80px'}
          className='classnameofthecolumn'
          render={(cover, record: any) => (
            <>
              <div
                className='listCoverImage'
                onClick={() => {
                  history.push(`/admin/posts/category/${record.id}`);
                  setactiveCategoryForEdit(record);
                }}
              >
                <img src={getCover(record)} alt='' />
              </div>
            </>
          )}
        />
        <Column
          title='Name'
          dataIndex='name'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/posts/category/${record.id}`);
                  // setcategoryDetailVisible(true);
                  setactiveCategoryForEdit(record);
                }}
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer',
                }}
              >
                {text}
              </h4>
            </>
          )}
        />

        {/* <Column
           title="Description" 
           dataIndex="description" 
           key="id" 
           className='classnameofthecolumn'
         
            /> */}

        {/* <Column
           title="Sub Cateogory" 
           dataIndex="subCount" 
           key="id" 
           className='classnameofthecolumn'
         
            /> */}

        <Column
          title='Recipes'
          dataIndex='productCount'
          key='id'
          className='classnameofthecolumn'
        />

        {/* <Column 
          
          className='classnameofthecolumn'

          title="Product" dataIndex="product" key="product" /> */}

        {/* <Column 
          
          className='classnameofthecolumn'

          title="Sub Category" dataIndex="subCategory" key="subCategory" /> */}

        {/* <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <>
              {tags.map((tag : any) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          )}
        /> */}
        <Column
          className='classnameofthecolumn'
          title=''
          key='action'
          align='right'
          render={(text, record: any) => (
            <Space size='middle'>
              <a href='##'>
                <Tooltip placement='top' title='Edit Category'>
                  <span
                    className='iconSize'
                    onClick={() => {
                      setvisible(true);
                      setactiveCategoryForEdit(record);
                    }}
                  >
                    <EditOutlined />
                  </span>
                </Tooltip>
              </a>

              <Popconfirm
                onConfirm={() => handleDeleteCategory(record.id)}
                title='Are you sure？'
                okText='Yes'
                cancelText='No'
              >
                <span className='iconSize iconSize-danger'>
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      {activeCategoryForEdit && (
        <QuickEdit
          setcategoryList={setcategoryList}
          categoryList={data}
          setAddNewCategoryVisible={setvisible}
          addNewCategoryVisible={visible}
          categoryDetailData={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props {
  history: any;
}

const CategoryList = ({ history }: Props) => {
  const [categoryState, handleCategoryListFetch] = useHandleFetch(
    {},
    'postCategoryList'
  );
  const [categoryList, setcategoryList] = useState([]);

  useEffect(() => {
    const setCategories = async () => {
      const categories = await handleCategoryListFetch({
        urlOptions: {
          params: {
            isSubCategory: true,
            productCountValue: true,
          },
        },
      });
      // @ts-ignore
      setcategoryList(categories);
    };
    setCategories();
  }, []);

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  // console.log('categoryState',categoryState);

  const handleSearch = (value) => {
    if (categoryState.data.length > 0) {
      const newCategoryList = categoryState.data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setcategoryList(newCategoryList);
    }
  };

  console.log('postCategoryList', categoryState);

  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>
              Recipe Categories
            </h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search recipe categories..'
              onSearch={(value) => handleSearch(value)}
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

        <div className='categoryListContainer__afterHeader'>
          {/* <Search
                placeholder="search categories.."
                size="large"
                onSearch={value => console.log(value)}
                style={{ width: 300 }}
           /> */}
        </div>

        <div className='categoryListContainer__categoryList'>
          {categoryState.done && categoryList.length > 0 && (
            <MyTable
              history={history}
              setcategoryList={setcategoryList}
              data={categoryList}
            />
          )}
          {categoryState.isLoading && <DataTableSkeleton />}

          {categoryState.done && !(categoryList.length > 0) && (
            <div
              style={{
                marginTop: '50px',
              }}
            >
              <Empty title='No Recipe Category found' />
            </div>
          )}
        </div>
      </div>

      {categoryState.done && (
        <AddNewPostCategory
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          categoryList={categoryList}
          setcategoryList={setcategoryList}
        />
      )}
    </>
  );
};

export default withRouter(CategoryList);
