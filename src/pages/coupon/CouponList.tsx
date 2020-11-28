import React, { useState, useEffect } from 'react';

// import third party ui lib
import {
  Empty,
  Popconfirm,
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Table,
  Space,
  Input as CoolInput,
  Tooltip,
  Modal,
} from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router';
import Moment from 'react-moment';

import {
  FileOutlined,
  InboxOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/// import hooks
import { useFetch, useHandleFetch } from '../../hooks';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { DataTableSkeleton } from '../../components/Placeholders';
import CouponQuickEdit from './CouponQuickEdit';
import AddNewCoupon from './AddNewCoupon';
import moment from 'moment';

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Coupon Created',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.error({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required('Name is required')
    .min(3, 'Name must have at least 3 characters'),
});

const initialValues = {
  name: '',
  description: '',
};

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

const MyTable = ({ data, setTagList }) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteTagState, handleDeleteTagFetch] = useHandleFetch(
    {},
    'deleteCoupon'
  );

  const history = useHistory();

  const handleDeleteTag = async (id) => {
    const deleteTagRes = await handleDeleteTagFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteTagRes && deleteTagRes.status === 'ok') {
      openSuccessNotification('Deleted Coupon');
      const newtagList = data.filter((item) => item.id !== id);
      setTagList(newtagList);
    }
  };

  const handleOk = (e: any) => {
    setvisible(false);
  };

  const handleCancel = (e: any) => {
    setvisible(false);
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
                  history.push(`/admin/coupon/${record.id}`);
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
                  history.push(`/admin/coupon/${record.id}`);
                  // setBrandDetailVisible(true);
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

        <Column
          title='Code'
          dataIndex='code'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Discount'
          dataIndex='amount'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Discount Type'
          dataIndex='amountType'
          key='id'
          className='classnameofthecolumn'
        />

        {/* <Column
                    title="Order Products"
                    dataIndex="orderedProductsCount"
                    key="id"
                    className='classnameofthecolumn'

                /> */}

        <Column
          title='Order Products'
          dataIndex='orderedProductsCount'
          key='id'
          className='classnameofthecolumn'
        />

        {/* <Column
                    title="Free Products"
                    dataIndex="freeProductsCount"
                    key="id"
                    className='classnameofthecolumn'
                /> */}

        <Column
          width={150}
          title='Start Date'
          dataIndex='startDate'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {text && moment(text).format('MMMM Do YYYY, h:mm a')}
              </h4>
            </>
          )}
        />

        <Column
          width={150}
          title='End Date'
          dataIndex='endDate'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer',
                }}
              >
                {text && moment(text).format('MMMM Do YYYY, h:mm a')}
              </h4>
            </>
          )}
        />

        <Column
          className='classnameofthecolumn'
          title=''
          key='action'
          align='right'
          render={(text, record: any) => (
            <Space size='middle'>
              <a href='##'>
                <Tooltip placement='top' title='Edit Coupon'>
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
                onConfirm={() => handleDeleteTag(record.id)}
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
        <CouponQuickEdit
          tagList={data}
          setTagList={setTagList}
          setAddNewCategoryVisible={setvisible}
          addNewCategoryVisible={visible}
          category={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props { }

const Couponlist = ({ }: Props) => {
  const [tagList, setTagList] = useState([]);

  const [tagState, handleTagListFetch] = useHandleFetch({}, 'couponList');

  useEffect(() => {
    const setTags = async () => {
      const tags = await handleTagListFetch({
        urlOptions: {
          params: {
            sortItem: 'added',
            sortOrderValue: '-1',
          },
        },
      });
      // @ts-ignore
      setTagList(tags);
    };
    setTags();
  }, []);

  console.log('couponList', tagState);

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.name || !isValid) {
      return true;
    }
    return false;
  };

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const handleSearch = (value) => {
    if (tagState.data.length > 0) {
      const newTagList = tagState.data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setTagList(newTagList);
    }
  };

  return (
    <>
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar-tag'>
            <h2 className='categoryListContainer__header-title'>Coupons</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search coupon..'
              onChange={(e) => handleSearch(e.target.value)}
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
        <div className='categoryListContainer__categoryList'>
          {tagState.done && tagList.length > 0 && (
            <MyTable setTagList={setTagList} data={tagList} />
          )}
          {tagState.isLoading && <DataTableSkeleton />}

          {tagState.done && !(tagList.length > 0) && (
            <div
              style={{
                marginTop: '200px',
              }}
            >
              <Empty
                description='No Coupon found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>

      <AddNewCoupon
        tagList={tagList}
        setTagList={setTagList}
        addNewCategoryVisible={addNewCategoryVisible}
        setAddNewCategoryVisible={setAddNewCategoryVisible}
      />
    </>
  );
};

export default Couponlist;
