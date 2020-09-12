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
  Button,
  notification,
  Modal,
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
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

const AddNewBrand = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  componentList,
  setComponentList,
}: Props) => {
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
        _id: '',
        bonus: null,
        convince: null,
        extra: null,
        negative: null,
        id: `${itemsList.length}`,
      },
    ]);
  };

  const handleTimeChange = (date, dateString) => {
    setTimeFeild(dateString);
    // console.log('date', date, dateString);
  };

  const handleMonthChange = (date, dateString) => {
    setMonthFeild(dateString);
    // console.log('date', date, dateString);
  };

  return (
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
          <Modal
            style={{
              top: '40px',
            }}
            title='Add New Component'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Create'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              // disabled: getisSubmitButtonDisabled(values, isValid),
            }}
            width={'50vw'}
            bodyStyle={{
              margin: '0',
              padding: '10px',
            }}
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
            <div
              style={{
                marginTop: '15px',
              }}
            ></div>
            <h3 className='inputFieldLabel'>Staffs</h3>

            <div className='componentItemsContainer'>
              {itemsList.map((itemComponent) => {
                return (
                  <ComponentItem
                    brandState={brandState}
                    componentItem={itemComponent}
                    itemsList={itemsList}
                    setItemsList={setItemsList}
                  />
                );
              })}

              <Button
                size='small'
                onClick={handleAddComponentItem}
                style={{
                  width: '290px',
                  minHeight: '145px',
                  marginTop: '0px',
                  borderRadius: '8px',
                }}
                type='dashed'
                icon={<PlusOutlined />}
              >
                Add Staff
              </Button>
            </div>

            <div
              style={{
                marginTop: '20px',
              }}
            />
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default AddNewBrand;
