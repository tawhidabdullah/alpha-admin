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
  Checkbox,
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
  SendOutlined,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const validationSchema = Yup.object().shape({});

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

const initialValues = {
  recipient: '',
  subject: '',
};

interface Props {}

const ComposeCustomEmail = ({}: Props) => {
  const [sendCustomerEmailState, handleSendCustomEmailFetch] = useHandleFetch(
    {},
    'sendCustomSMS'
  );

  const [text, setText] = useState('');
  const [recipient, setrecipient] = useState('');

  function handleChange(value) {
    setrecipient(value);
  }

  const handleMsgSend = async () => {
    const addTagRes = await handleSendCustomEmailFetch({
      body: {
        recipient: recipient,
        text: text,
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
      setText('');
      setrecipient('');
      openSuccessNotification('SMS Sent!');
    } else {
      // openErrorNotification("Something went wrong, Couldn't send email");
    }
  };

  useEffect(() => {
    if (!sendCustomerEmailState['isLoading']) {
      const error = sendCustomerEmailState['error'];
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

    if (
      !sendCustomerEmailState['isLoading'] &&
      Object.keys(sendCustomerEmailState.data).length > 0
    ) {
      // if (sendCustomerEmailState['data']['status'] === 'ok') {
      //     openSuccessNotification('Email Sent!');
      // }
    }
  }, [sendCustomerEmailState]);

  return (
    <div
      style={{
        width: '450px',
      }}
    >
      <h3 className='inputFieldLabel'>Recipient</h3>

      <Select
        style={{
          height: '30px',
          borderRadius: '3px',
          borderColor: '#eee !important',
          width: '100%',
        }}
        mode='tags'
        onChange={handleChange}
        tokenSeparators={[',']}
      ></Select>

      <div
        style={{
          marginTop: '15px',
        }}
      ></div>
      <TextArea
        label='Text'
        value={text}
        name='text'
        onChange={(e: any) => {
          setText(e.target.value);
        }}
      />

      <Button
        style={{
          marginTop: '10px',
        }}
        onClick={handleMsgSend}
        loading={sendCustomerEmailState.isLoading}
        //   disabled={getMsgSendIsDisabled()}

        className='btnAddToPrice'
      >
        Send{' '}
        <span
          style={{
            marginLeft: '10px',
          }}
        >
          {' '}
          <SendOutlined />
        </span>
      </Button>
    </div>
  );
};

export default ComposeCustomEmail;
