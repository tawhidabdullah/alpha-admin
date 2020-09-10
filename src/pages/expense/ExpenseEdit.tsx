import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import {
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Modal,
  Tooltip,
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FileImageFilled,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import DatePicker from '../../components/Field/DatePicker';
import StaffIds from './StaffIds';

const validationSchema = Yup.object().shape({});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Expense Updated',
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

const initialValues = {
  topic: '',
  amount: null,
};

interface Props {
  addNewCategoryVisible?: any;
  setAddNewCategoryVisible?: any;
  tagList?: any;
  setTagList?: any;
  category?:any; 
  setTagDetailData?:any; 
}

const AddNewBrand = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  category,
  setTagDetailData
}: Props) => {
  const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'updateExpense');
  const [myImages, setmyImages] = useState(false);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [time, setTimeFeild] = useState('');
  const [customerId, setCustomerId] = useState([]);



  useEffect(() => {
    if(category && category.date){
        setTimeFeild(category.date)
    }
  },[category]); 

  
  const [customerListState, handleCustomerListFetch] = useHandleFetch(
    {},
    'staffList'
  );

  const [selectedCustomerData, setSelectedCustomerData] = useState({});

  useEffect(() => {
    const setCustomers = async () => {
      const customerListRes = await handleCustomerListFetch({});
    };
    setCustomers();
  }, []);

  const handleSubmit = async (values: any, actions: any) => {
    const addTagRes = await handleAddTagFetch({
		urlOptions: {
			placeHolders: {
				id: category.id || category._id
			}
		},
      body: {
        topic: values.topic.trim(),
        amount: values.amount,
        date: time,
        staff: customerId,
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
      openSuccessNotification();

      setTagDetailData({
          ...category,
          // @ts-ignore
        ...addTagRes,
      });

      actions.resetForm();
      setAddNewCategoryVisible(false);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!addTagState['isLoading']) {
      const error = addTagState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
        if (error['error']['registerError']) {
          // setServerErrors(error['error']['registerError']);
        } else if (error['error']['checkoutError']) {
          // setServerErrors(error['error']['checkoutError']);
        } else {
          // setServerErrors(error['error']);
        }

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

    if (!addTagState['isLoading'] && Object.keys(addTagState.data).length > 0) {
      if (addTagState['data']['status'] === 'ok') {
        // openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })
        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [addTagState]);

  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.name || !isValid) {
      return true;
    }
    return false;
  };

  const handleTimeChange = (date, dateString) => {
    setTimeFeild(dateString);
    // console.log('date', date, dateString);
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...initialValues, ...category }}
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
            title='Add New Expense'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              //   disabled: getisSubmitButtonDisabled(values, isValid),
            }}
          >
            <Input
              label='Topic'
              value={values.topic}
              name='topic'
              isError={
                (touched.topic && errors.topic) ||
                (!isSubmitting && addTagState.error['error']['topic'])
              }
              errorString={
                (touched.topic && errors.topic) ||
                (!isSubmitting && addTagState.error['error']['topic'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('topic');
              }}
            />

            <Input
              label='Amount'
              value={values.amount}
              name='amount'
              type={'number'}
              min={0}
              isError={
                (touched.amount && errors.amount) ||
                (!isSubmitting && addTagState.error['error']['amount'])
              }
              errorString={
                (touched.amount && errors.amount) ||
                (!isSubmitting && addTagState.error['error']['amount'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('amount');
              }}
            />

            <DatePicker
              date={time}
              placeholder='10/20/2020'
              label='Date'
              onChange={handleTimeChange}
            />

            <div
              style={{
                marginTop: '15px',
              }}
            ></div>

            {/* <h4 className='inputFieldLabel'>Associative staff</h4>
            <StaffIds
              customerListState={customerListState}
              setSelectedCustomerData={setSelectedCustomerData}
              setCustomerId={setCustomerId}
            /> */}
          </Modal>

          <MediaLibrary
            setvisible={setvisibleMedia}
            visible={visibleMedia}
            setmyImages={setmyImages}
            myImages={myImages}
            isModalOpenForImages={true}
          />
        </>
      )}
    </Formik>
  );
};

export default AddNewBrand;
