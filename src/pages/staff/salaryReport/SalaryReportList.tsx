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
import moment from 'moment';
import { CSVLink } from 'react-csv';

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
  DownloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/// import hooks
import { useFetch, useHandleFetch } from '../../../hooks';

// import components
import Input from '../../../components/Field/Input';
import TextArea from '../../../components/Field/TextArea';
import { DataTableSkeleton } from '../../../components/Placeholders';
import AddNewExpense from './AddNewSalaryReport';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Expense Created',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.error({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
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
    'deleteSalaryReport'
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
      openSuccessNotification('Deleted Salary report');
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
          title='Year'
          dataIndex='year'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/salaryReport/${record.id}`);
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
          title='Month'
          dataIndex='month'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/salaryReport/${record.id}`);
                }}
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer',
                }}
              >
                {text && months[text]}
              </h4>
            </>
          )}
        />

        <Column
          title='Total Salary'
          dataIndex='totalSalary'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Total Bonus'
          dataIndex='totalBonus'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Total Extra'
          dataIndex='totalExtra'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Total Convince'
          dataIndex='totalConvince'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          className='classnameofthecolumn'
          title=''
          key='action'
          align='right'
          render={(text, record: any) => (
            <Space size='middle'>
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
    </>
  );
};

interface Props {}

const TagList = ({}: Props) => {
  const [tagList, setTagList] = useState([]);

  console.log('salaryReport4', tagList);
  const [tagState, handleTagListFetch] = useHandleFetch({}, 'getSalaryReport');

  useEffect(() => {
    const setTags = async () => {
      const tags = await handleTagListFetch({});
      // @ts-ignore
      setTagList(tags);
    };
    setTags();
  }, []);

  const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'addTag');
  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  const handleSubmit = async (values: any, actions: any) => {
    const addTagRes = await handleAddTagFetch({
      urlOptions: {
        placeHolders: {
          id: values.id,
        },
      },
      body: {
        name: values.name.trim(),
        description: values.description,
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
      openSuccessNotification();

      setTagList([
        ...tagList,
        {
          id: addTagRes['id'] || '',
          key: addTagRes['id'] || '',
          name: addTagRes['name'] || '',
          description: addTagRes['description'] || '',
        },
      ]);
      actions.resetForm();
    }
    actions.setSubmitting(false);
  };

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

  const headers = [
    { label: 'Year', key: 'year' },
    { label: 'Month', key: 'month' },
    { label: 'Total Salary', key: 'totalSalary' },
    { label: 'Total Bonus', key: 'totalBonus' },
    { label: 'Total Convince', key: 'totalConvince' },
    { label: 'Total Extra', key: 'totalExtra' },
    { label: 'Total Negative', key: 'totalNegative' },
  ];

  const getData = () => {
    if (tagList && tagList.length > 0) {
      const csvData = tagList.map((item) => {
        return {
          year: item.year,
          month: item.month ? months[item.month] : '',
          totalSalary: item.totalSalary,
          totalBonus: item.totalBonus,
          totalConvince: item.totalConvince,
          totalExtra: item.totalExtra,
          totalNegative: item.totalNegative,
        };
      });

      return csvData;
    } else return [];
  };

  const data = getData();

  return (
    <>
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar-tag'>
            <h2 className='categoryListContainer__header-title'>
              Salary reports
            </h2>

            {/* <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search expense..'
              onSearch={(value) => handleSearch(value)}
            /> */}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {tagList && tagList.length > 0 && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '25px',
                  }}
                >
                  <CSVLink
                    filename={'SalaryReport.csv'}
                    data={data}
                    headers={headers}
                  >
                    Export as csv
                  </CSVLink>
                  <span
                    style={{
                      color: '#1890ff',
                      marginLeft: '10px',
                    }}
                  >
                    <DownloadOutlined />
                  </span>
                </div>
              </>
            )}

            <Button
              // type="primary"
              className='btnPrimaryClassNameoutline'
              icon={<PlusOutlined />}
              onClick={() => setAddNewCategoryVisible(true)}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className='categoryListContainer__categoryList'>
          {tagState.done && tagList.length > 0 && (
            <MyTable setTagList={setTagList} data={tagList} />
          )}
          {tagState.isLoading && <DataTableSkeleton />}

          {tagState.done && !(tagList.length > 0) && (
            <div
              style={{
                marginTop: '150px',
              }}
            >
              <Empty
                description='No Expense found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>

      <AddNewExpense
        componentList={tagList}
        setComponentList={setTagList}
        addNewCategoryVisible={addNewCategoryVisible}
        setAddNewCategoryVisible={setAddNewCategoryVisible}
      />
    </>
  );
};

export default TagList;
