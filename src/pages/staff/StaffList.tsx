import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';

import {
  Table,
  Badge,
  Menu,
  Dropdown,
  notification,
  Space,
  Tag,
  Button,
  Input,
  Tooltip,
  Modal,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  CheckCircleOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import Moment from 'react-moment';

/// import hooks
import { useFetch, useHandleFetch } from '../../hooks';
import moment from 'moment';
// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import AddNewStaff from './AddNewStaff';
import QuickEdit from './QuickEdit';
import Empty from '../../components/Empty';
const { Column, ColumnGroup } = Table;
const { Search } = Input;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Staffs Created',
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

interface myTableProps {
  data: any;
  setCustomerList?: any;
}

const MyTable = ({ data, setCustomerList }: myTableProps) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);

  const history = useHistory();

  const [deleteCustomerState, handleDeleteCustomerFetch] = useHandleFetch(
    {},
    'deleteStaff'
  );
  const handleDeleteCustomer = async (id) => {
    const deleteCustomerRes = await handleDeleteCustomerFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteCustomerRes && deleteCustomerRes.status === 'ok') {
      openSuccessNotification('Deleted Staffs');
      const newCustomerList = data.filter((item) => item.id !== id);
      setCustomerList(newCustomerList);
    }
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
          title='Name'
          dataIndex='name'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/staff/${record.id}`);
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

        <Column
          title='Phone'
          dataIndex='phone'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Designation'
          dataIndex='designation'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Salary'
          dataIndex='salary'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Joined'
          dataIndex='joiningDate'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <Space size='middle'>
              <h5>{text && moment(text).format('MMMM Do YYYY, h:mm a')}</h5>
            </Space>
          )}
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
                <Tooltip placement='top' title='Edit Staff'>
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
                onConfirm={() => handleDeleteCustomer(record.id)}
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
          customerList={data}
          setCustomerList={setCustomerList}
          setAddNewCategoryVisible={setvisible}
          addNewCategoryVisible={visible}
          customer={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props {
  history: any;
}

const CustomerList = ({ history }: Props) => {
  const [customerList, setCustomerList] = useState([]);

  const [customerState, handleCustomerListFetch] = useHandleFetch(
    {},
    'staffList'
  );

  useEffect(() => {
    const setCustomers = async () => {
      const customers = await handleCustomerListFetch({});
      // @ts-ignore
      setCustomerList(customers);
    };
    setCustomers();
  }, []);

  const handleSearch = (value) => {
    if (customerState.data.length > 0) {
      const newCustomerList = customerState.data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setCustomerList(newCustomerList);
    }
  };

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  // console.log('customerState',customerState)

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Phone', key: 'phone' },
    { label: 'Designation', key: 'designation' },
    { label: 'Salary', key: 'salary' },
    { label: 'joined', key: 'joiningDate' },
  ];

  const getData = () => {
    if (customerList && customerList.length > 0) {
      const csvData = customerList.map((item) => {
        return {
          name: item.name,
          phone: item.phone,
          designation: item.designation,
          salary: item.salary,
          joiningDate: item.joiningDate
            ? moment(item.joiningDate).format('MMMM Do YYYY, h:mm a')
            : '',
        };
      });

      return csvData;
    } else return [];
  };

  const data = getData();

  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>Staffs</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search staffs..'
              onSearch={(value) => handleSearch(value)}
              // style={{ width: 300 }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {customerList && customerList.length > 0 && (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '25px',
                  }}
                >
                  <CSVLink
                    filename={'staff-list.csv'}
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

        <div className='categoryListContainer__afterHeader'>
          {/* <Search
      placeholder="search categories.."
      size="large"
      onSearch={value => console.log(value)}
      style={{ width: 300 }}
    /> */}
        </div>

        <div className='categoryListContainer__categoryList'>
          {customerState.done && customerList.length > 0 && (
            <MyTable setCustomerList={setCustomerList} data={customerList} />
          )}
          {customerState.isLoading && <DataTableSkeleton />}
          {customerState.done && !(customerList.length > 0) && (
            <Empty title='No Staff found' />
          )}
        </div>
      </div>

      {customerState.done && (
        <AddNewStaff
          setCustomerList={setCustomerList}
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          customerList={customerState.data}
        />
      )}
    </>
  );
};

export default withRouter(CustomerList);
