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
  InfoCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import state
import { isAccess } from '../../utils';
import { connect } from 'react-redux';

/// import hooks
import { useFetch, useHandleFetch } from '../../hooks';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { DataTableSkeleton } from '../../components/Placeholders';
import QuickEdit from './QuickEdit';
import TagQuickEdit from './TagQuickEdit';
import AddNewTag from './AddNewTag';

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Tag Created',
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

const MyTable = ({ data, setTagList, roles }) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteTagState, handleDeleteTagFetch] = useHandleFetch(
    {},
    'deleteTag'
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
      openSuccessNotification('Deleted Tag');
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
          title='Name'
          dataIndex='name'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/tag/${record.id}`);
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
          title='Description'
          dataIndex='description'
          key='id'
          className='classnameofthecolumn'
        />

        {/* <Column
					title="Product"
					dataIndex="productCount"
					key="id"
					className='classnameofthecolumn'
				/> */}

        {isAccess('postCatalogue', roles) && (
          <Column
            className='classnameofthecolumn'
            title=''
            key='action'
            align='right'
            render={(text, record: any) => (
              <Space size='middle'>
                <a href='##'>
                  <Tooltip placement='top' title='Edit Tag'>
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
        )}
      </Table>

      {activeCategoryForEdit && (
        <TagQuickEdit
          tagList={data}
          setTagList={setTagList}
          tagEditVisible={visible}
          setTagEditVisible={setvisible}
          tagDetailData={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props {
  roles?: any;
}

const TagList = ({ roles }: Props) => {
  const [tagList, setTagList] = useState([]);

  const [tagState, handleTagListFetch] = useHandleFetch({}, 'tagList');

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

  const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'addTag');
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
            <h2 className='categoryListContainer__header-title'>Tags</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search tags..'
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {isAccess('postCatalogue', roles) && (
            <Button
              // type="primary"
              className='btnPrimaryClassNameoutline'
              icon={<PlusOutlined />}
              onClick={() => setAddNewCategoryVisible(true)}
            >
              Add New
            </Button>
          )}
        </div>
        <div className='categoryListContainer__categoryList'>
          {tagState.done && tagList.length > 0 && (
            <MyTable roles={roles} setTagList={setTagList} data={tagList} />
          )}
          {tagState.isLoading && <DataTableSkeleton />}

          {tagState.done && !(tagList.length > 0) && (
            <div
              style={{
                marginTop: '200px',
              }}
            >
              <Empty
                description='No Tags found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>

      <AddNewTag
        tagList={tagList}
        setTagList={setTagList}
        addNewCategoryVisible={addNewCategoryVisible}
        setAddNewCategoryVisible={setAddNewCategoryVisible}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, null)(TagList);
