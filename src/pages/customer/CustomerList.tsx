import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  Table,
  Badge,
  Menu,
  Dropdown,
  notification,
  Space,
  Select,
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
} from '@ant-design/icons';
import Moment from 'react-moment';

/// import hooks
import { useFetch, useHandleFetch } from '../../hooks';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import AddNewCustomer from './AddNewCustomer';
import QuickEdit from './QuickEdit';
import Empty from '../../components/Empty';
import moment from 'moment';
const { Column, ColumnGroup } = Table;
const { Search } = Input;

const { Option } = Select;

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
    icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
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
    'deleteCustomer'
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
      openSuccessNotification('Deleted Customer');
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
                  history.push(`/admin/customer/${record.id}`);
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

        {/* <Column
           title="City" 
           dataIndex="city" 
           key="id" 
           className='classnameofthecolumn'
            /> */}

        <Column
          title='Dealer'
          dataIndex='dealerName'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  // go to dealer detail
                  // history.push(`/admin/dealer/${record.id}`)
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
          title='Order'
          dataIndex='orderCount'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Total Price'
          dataIndex='totalOrderPrice'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          width={150}
          title='Created'
          dataIndex='created'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <Space size='middle'>
              <h5>{text && moment(text).format('MMMM Do YYYY')}</h5>
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
                <Tooltip placement='top' title='Edit Customer'>
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
          setvisible={setvisible}
          visible={visible}
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
    'customerList'
  );
  const [orderStatusFilterValue, setorderStatusFilterValue] = useState('');

  console.log('customerList', customerList);

  useEffect(() => {
    const setCustomers = async () => {
      const getSorttingvalue = () => {
        switch (orderStatusFilterValue) {
          case 'newFirst':
            return {
              sortItem: 'added',
              sortOrderValue: '-1',
            };
            break;
          case 'orderCountHigh':
            return {
              sortItem: 'orderCount',
              sortOrderValue: '-1',
            };
            break;
          case 'orderCountLow':
            return {
              sortItem: 'orderCount',
              sortOrderValue: '1',
            };
            break;

          case 'totalPriceHigh':
            return {
              sortItem: 'totalPrice',
              sortOrderValue: '-1',
            };
            break;

          case 'totalPriceLow':
            return {
              sortItem: 'totalPrice',
              sortOrderValue: '1',
            };
            break;

          default:
            return {
              sortItem: 'added',
              sortOrderValue: '-1',
            };
        }
      };
      const customers = await handleCustomerListFetch({
        urlOptions: {
          params: {
            ...getSorttingvalue(),
            limitNumber: 252423480,
          },
        },
      });
      // @ts-ignore
      setCustomerList(customers);
    };
    setCustomers();
  }, [orderStatusFilterValue]);

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

  const orderFilteringOption = [
    {
      name: 'New first',
      value: 'newFirst',
    },
    {
      name: 'Order count (high > low)',
      value: 'orderCountHigh',
    },
    {
      name: 'Order count (low < high)',
      value: 'orderCountLow',
    },
    {
      name: 'Total price (high > low)',
      value: 'totalPriceHigh',
    },
    {
      name: 'Total price (low < high)',
      value: 'totalPriceLow',
    },
  ];

  const onOrderStatusFilterChange = (value) => {
    setorderStatusFilterValue(value);
  };

  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>Customers</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search customer..'
              onChange={(e) => handleSearch(e.target.value)}
              // style={{ width: 300 }}
            />
          </div>

          <div>
            <Select
              style={{
                borderRadius: '15px',
                color: '#3fa6f9',
                marginRight: '15px',
                width: '200px',
              }}
              placeholder='Select status'
              optionFilterProp='children'
              onChange={onOrderStatusFilterChange}
              defaultValue={'newFirst'}
              bordered={false}
            >
              {orderFilteringOption.map((option) => {
                return <Option value={option.value}>{option.name}</Option>;
              })}
            </Select>

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
            <Empty title='No Customer found' />
          )}
        </div>
      </div>

      {customerState.done && (
        <AddNewCustomer
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
