// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../../hooks';
// import third party ui lib
import {
  Upload,
  message,
  Switch,
  Select,
  notification,
  Modal,
  Form,
  Empty,
  Button,
  Spin,
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../../components/Field/Input';
import TextArea from '../../../components/Field/TextArea';
import MediaLibrary from '../../../components/MediaLibrary';
import ComponentItem from './ComponentItem';
import { DatePicker } from 'antd';
import moment from 'moment';
const validationSchema = Yup.object().shape({
  // groupName: Yup.string()
  //   .label('Name')
  //   .required('Name is required')
  //   .min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Salary report Created',
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

const initialValues = {
  groupName: '',
  items: [],
};

interface Props {
  addNewCategoryVisible?: any;
  setAddNewCategoryVisible?: any;
  componentList?: any;
  setComponentList?: any;
}

const ModalChildComponent = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  componentList,
  setComponentList,
}) => {
  const [addComponentState, handleAddComponentFetch] = useHandleFetch(
    {},
    'generateSalaryReport'
  );

  const [brandState, handleTagListFetch] = useHandleFetch({}, 'staffList');

  useEffect(() => {
    const setBrands = async () => {
      const brandListRes = await handleTagListFetch({});
    };
    setBrands();
  }, []);

  const [myImages, setmyImages] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [time, setTimeFeild] = useState('');
  const [month, setMonthFeild] = useState('');

  console.log('salaryReportItemList', itemsList);

  const handleSubmit = async (values: any, actions: any) => {
    const convertedYear = month ? month.split('-')[0] : '';
    const convertedMonth = month
      ? month.split('-')[1] &&
        month.split('-')[1][0] &&
        month.split('-')[1][0] === '0'
        ? month.split('-')[1][1]
        : month.split('-')[1]
      : '';
    const convertedStaffs =
      itemsList && itemsList.length > 0
        ? itemsList.map((item) => {
            return {
              ...item,
              bonus: item.bonus ? +item.bonus : 0,
              convince: item.convince ? +item.convince : 0,
              extra: item.extra ? +item.extra : 0,
              negative: item.negative ? +item.negative : 0,
              id: `${itemsList.length}`,
            };
          })
        : [];
    const data = {
      month: convertedMonth ? +convertedMonth : '',
      year: convertedYear ? +convertedYear : '',
      staff: convertedStaffs,
    };
    const addComponentRes = await handleAddComponentFetch({
      body: data,
    });

    // @ts-ignore
    if (addComponentRes && addComponentRes.status === 'ok') {
      openSuccessNotification();
      setComponentList([
        {
          id: addComponentRes['_id'] || '',
          key: addComponentRes['_id'] || '',
          // @ts-ignore
          ...addComponentRes,
        },
        ...componentList,
      ]);
      actions.resetForm();
      setItemsList([]);
      setMonthFeild('');
      setAddNewCategoryVisible(false);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!addComponentState['isLoading']) {
      const error = addComponentState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
        const errors =
          Object.values(error['error']).length > 0
            ? Object.values(error['error'])
            : [];
        errors.forEach((err, i) => {
          if (typeof err === 'string') {
            openErrorNotification(err);
          } else if (typeof err === 'object') {
            if (err && Object.keys(err).length > 0) {
              const errs = Object.values(err);
              errs.forEach((err) => {
                openErrorNotification(err);
              });
            }
          }
        });
      }
    }
  }, [addComponentState]);

  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.groupName) {
      return true;
    }
    return false;
  };

  const handleAddComponentItem = () => {
    setItemsList([
      ...itemsList,
      {
        _id: `${Math.floor(100000 + Math.random() * 900000)}`,
        bonus: null,
        convince: null,
        extra: null,
        negative: null,
        id: `${itemsList.length}`,
      },
    ]);
  };

  useEffect(() => {
    if (brandState.done && brandState.data && brandState.data.length > 0) {
      const items = brandState.data.map((staff) => {
        return {
          ...staff,
          _id: staff._id,
          bonus: staff.bonus,
          convince: staff.convince,
          extra: staff.extra,
          negative: staff.negative,
        };
      });
      setItemsList(items);
    }
  }, [brandState.data]);

  const handleTimeChange = (date, dateString) => {
    setTimeFeild(dateString);
    // console.log('date', date, dateString);
  };

  const handleMonthChange = (date, dateString) => {
    setMonthFeild(dateString);
    // console.log('date', date, dateString);
  };

  return (
    <>
      <Formik
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        validationSchema={validationSchema}
        validateOnBlur={false}
        enableReinitialize={true}
        initialValues={{ ...initialValues }}
      >
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          isSubmitting,
          touched,
          handleBlur,
          setFieldTouched,
          handleReset,
        }) => (
          <>
            <Form.Item
              validateStatus={
                addComponentState.error['error']['year'] ||
                addComponentState.error['error']['month']
                  ? 'error'
                  : ''
              }
              help={
                addComponentState.error['error']['year'] ||
                addComponentState.error['error']['month']
              }
              // noStyle={true}
            >
              <h3 className='inputFieldLabel'>Time</h3>
              <DatePicker
                picker='month'
                placeholder={'2020, Jan'}
                className='inputclassName'
                style={{
                  width: '100%',
                  borderColor: '#eee',
                }}
                onChange={handleMonthChange}
                {...(month && {
                  defaultValue: moment(month),
                })}
              />
            </Form.Item>

            <div
              style={{
                marginTop: '25px',
              }}
            ></div>

            {itemsList && itemsList[0] && (
              <h3 className='addOrderContainer-sectionTitle'>
                <span>
                  <UsergroupAddOutlined />
                </span>
                Staffs
              </h3>
            )}

            <div
              style={{
                marginTop: '15px',
              }}
            ></div>

            <div className='componentItemsContainer'>
              {itemsList.map((itemComponent, index) => {
                return (
                  <ComponentItem
                    index={index}
                    brandState={brandState}
                    componentItem={itemComponent}
                    itemsList={itemsList}
                    setItemsList={setItemsList}
                  />
                );
              })}

              {brandState.done && itemsList && !itemsList[0] && (
                <div
                  style={{
                    marginTop: '5px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Empty
                    description='No Staff'
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
              {brandState.isLoading && (
                <div
                  style={{
                    padding: '15px 0',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spin />
                </div>
              )}
            </div>

            <div
              style={{
                padding: '15px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                style={{
                  color: '#555',
                  marginRight: '10px',
                }}
                className='btnPrimaryClassNameoutline-cancle'
                onClick={() => setAddNewCategoryVisible(false)}
                type='default'
              >
                Cancel
              </Button>

              <Button
                className='btnPrimaryClassNameoutline'
                onClick={handleSubmit}
                loading={addComponentState.isLoading}
                type='link'
                icon={<CheckOutlined />}
              >
                Generate
              </Button>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

const AddNewBrand = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  componentList,
  setComponentList,
}: Props) => {
  const handleCancel = () => {
    setAddNewCategoryVisible(false);
  };

  return (
    <Modal
      style={{
        top: '40px',
      }}
      title='Add Salary Report'
      visible={addNewCategoryVisible}
      onCancel={handleCancel}
      destroyOnClose={true}
      footer={false}
      width={'80vw'}
      bodyStyle={{
        margin: '0',
        padding: '10px',
      }}
    >
      <ModalChildComponent
        addNewCategoryVisible={addNewCategoryVisible}
        setAddNewCategoryVisible={setAddNewCategoryVisible}
        componentList={componentList}
        setComponentList={setComponentList}
      />
    </Modal>
  );
};

export default AddNewBrand;
