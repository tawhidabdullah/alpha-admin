import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  Empty,
  Popconfirm,
  Space,
  Button,
  Input,
  Tooltip,
  notification,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

/// import hooks
import { useHandleFetch } from '../../hooks';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';


// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";




const { Column } = Table;
const { Search } = Input;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Page Created',
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

interface myTableProps {
  data: any;
  setBrandList: any;
  roles: any; 
}

const MyTable = ({ data, setBrandList, roles }: myTableProps) => {
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deletePageState, handleDeletePageFetch] = useHandleFetch(
    {},
    'deletePage'
  );

  const history = useHistory();

  const handleDeletePage = async (id) => {
    const deletePageRes = await handleDeletePageFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deletePageRes && deletePageRes.status === 'ok') {
      openSuccessNotification('Deleted Page');
      const newBrandList = data.filter((item) => item.id !== id);
      setBrandList(newBrandList);
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
          title=''
          dataIndex='cover'
          key='id'
          width={'100px'}
          className='classnameofthecolumn'
          render={(cover, record: any) => (
            <>
              <img
                onClick={() => {
                  history.push(`/admin/page/${record.id}`);
                  // history.push(`/admin/page/${record.id}`);
                }}
                src={cover}
                alt='cover img'
                style={{
                  height: '40px',
                  width: '40px',
                  objectFit: 'contain',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              />
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
                  // setactiveCategoryForEdit(record);
                  history.push(`/admin/page/${record.id}`);
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
          title='Description'
          dataIndex='description'
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

        {isAccess('postPage',roles) && (
            <Column
            className='classnameofthecolumn'
            title=''
            key='action'
            align='right'
            render={(text, record: any) => (
              <Space size='middle'>
                <a href='##'>
                  <Tooltip placement='top' title='Edit Page'>
                    <span
                      className='iconSize'
                      onClick={() => {
                      history.push(`/admin/page/edit/${record.id}`);
                      setactiveCategoryForEdit(record);
                    }}
                  >
                    <EditOutlined />
                  </span>
                </Tooltip>
              </a>

              <Popconfirm
                onConfirm={() => handleDeletePage(record.id)}
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
          )}



  
      </Table>
    </>
  );
};

interface Props {
  roles: any; 
}


const PageList = ({roles}: Props) => {
  const [pageList, setPageList] = useState([]);
  const [pageState, handlePagsListFetch] = useHandleFetch({}, 'pageList');

  const history = useHistory();

  useEffect(() => {
    const setPages = async () => {
      const pages = await handlePagsListFetch({});
      // @ts-ignore
      setPageList(pages);
    };
    setPages();
  }, []);

  const handleSearch = (value) => {
    if (pageState.data.length > 0) {
      const newBrandList = pageState.data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setPageList(newBrandList);
    }
  };

  return (
    <>
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>Pages</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search pages..'
              onSearch={(value) => handleSearch(value)}
            />
          </div>

          
          {isAccess('postPage',roles) && (
         <Button
         // type="primary"
         className='btnPrimaryClassNameoutline'
         icon={<PlusOutlined />}
         onClick={() => history.push('/admin/page/new')}
       >
         Add New
       </Button>
          )}


       
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
          {pageState.done && pageList.length > 0 && (
            <MyTable roles={roles} setBrandList={setPageList} data={pageList} />
          )}
          {pageState.isLoading && <DataTableSkeleton />}
          {pageState.done && !(pageList.length > 0) && (
            <div
              style={{
                marginTop: '200px',
              }}
            >
              <Empty
                description='No Page found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};



const mapStateToProps = state => ({
  roles: state.globalState,
})

// @ts-ignore
export default connect(mapStateToProps, null)(PageList);

