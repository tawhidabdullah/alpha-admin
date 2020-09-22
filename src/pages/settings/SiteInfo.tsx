import React, { useState } from 'react';
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
  Tabs,
  Tooltip,
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  FileImageFilled,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import AdminSiteInfo from './AdminSiteInfo';
import SiteInfoInvoice from './SiteInfoInvoice';
import SiteSeo from './SiteSeo';
import ChangeAdminPassword from './ChangeAdminPassword';

// import config
import config from '../../config.json';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required('Name is required')
    .min(3, 'Name must have at least 3 characters'),
});

const { TabPane } = Tabs;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Brand Created',
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
  name: '',
  description: '',
  image: [],
  url: '',
  cover: '',
};

interface Props {
  addNewCategoryVisible?: any;
  setAddNewCategoryVisible?: any;
  brandList?: any;
  setBrandList?: any;
}

const SiteInfo = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  brandList,
  setBrandList,
}: Props) => {
  const [
    updateSiteLogoAndIcon,
    handleUpdateSiteLogoAndIconFetch,
  ] = useHandleFetch({}, 'updateSiteLogoAndIcon', 'form');

  const [imageUrl, setImageUrl] = useState(`${config.baseURL}/images/logo.png`);
  const [loadingThumnail, setLoadingThumbnail] = useState(false);

  const [iconimageUrl, setIconImageUrl] = useState(
    `${config.baseURL}/favicon.ico`
  );
  const [loadingIcon, setloadingIcon] = useState(false);

  const [appLogo, setAppLogo] = useState(
    `${config.baseURL}/images/logo-app.png`
  );
  const [loadingAppLogo, setloadingAppLogo] = useState(false);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    getBase64(file, (imageUrl) => {
      setImageUrl(imageUrl);
      const setNewIcon = async () => {
        const formData = new FormData();
        formData.append('logo', file);

        const res = await handleUpdateSiteLogoAndIconFetch({
          body: formData,
        });

        // @ts-ignore
        if (res && res.status === 'ok') {
          openSuccessNotification('Site Logo updated!');
        } else {
          openErrorNotification(
            "Couldn't update site Logo, Something went wrong"
          );
        }
      };

      setNewIcon();
      setLoadingThumbnail(false);
    });

    return false;
  }

  function beforeIconUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    getBase64(file, (imageUrl) => {
      setIconImageUrl(imageUrl);
      const setNewIcon = async () => {
        const formData = new FormData();
        formData.append('icon', file);

        const res = await handleUpdateSiteLogoAndIconFetch({
          body: formData,
        });

        // @ts-ignore
        if (res && res.status === 'ok') {
          openSuccessNotification('Site Icon updated!');
        } else {
          openErrorNotification(
            "Couldn't update site icon, Something went wrong"
          );
        }
      };

      setNewIcon();
      setloadingIcon(false);
    });

    return false;
  }

  function beforeAppIconUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    getBase64(file, (imageUrl) => {
      setAppLogo(imageUrl);
      const setNewIcon = async () => {
        const formData = new FormData();
        formData.append('logoApp', file);

        const res = await handleUpdateSiteLogoAndIconFetch({
          body: formData,
        });

        // @ts-ignore
        if (res && res.status === 'ok') {
          openSuccessNotification('App logo updated!');
        } else {
          openErrorNotification(
            "Couldn't update App logo, Something went wrong"
          );
        }
      };

      setNewIcon();
      setloadingAppLogo(false);
    });

    return false;
  }

  const uploadButton = (
    <div>
      {loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  const iconUploadButton = (
    <div>
      {loadingIcon ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  const appIconUploadButton = (
    <div>
      {loadingAppLogo ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  return (
    <>
      <div className='siteInfoContainer'>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Site Info' key='1'>
            <AdminSiteInfo />
          </TabPane>
          <TabPane tab='Site logo' key='2'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '15px',
              }}
            >
              <div
                style={{
                  marginRight: '40px',
                }}
              >
                <div className='addproductSection-left-header'>
                  <h3 className='inputFieldLabel'> Logo </h3>
                  <Tooltip placement='left' title={'Update Site Logo image'}>
                    <a href='###'>
                      <InfoCircleOutlined />
                    </a>
                  </Tooltip>
                </div>

                <Upload
                  style={{
                    borderRadius: '8px',
                  }}
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  multiple={false}
                >
                  {imageUrl ? (
                    <img
                      onError={() => setImageUrl('')}
                      src={imageUrl}
                      alt='avatar'
                      style={{ width: '100%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>

              <div
                style={{
                  marginRight: '40px',
                }}
              >
                <div className='addproductSection-left-header'>
                  <h3 className='inputFieldLabel'> Icon </h3>
                  <Tooltip placement='left' title={'Update Icon image'}>
                    <a href='###'>
                      <InfoCircleOutlined />
                    </a>
                  </Tooltip>
                </div>

                <Upload
                  style={{
                    borderRadius: '8px',
                  }}
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  beforeUpload={beforeIconUpload}
                  multiple={false}
                >
                  {iconimageUrl ? (
                    <img
                      onError={() => setIconImageUrl('')}
                      src={iconimageUrl}
                      alt='avatar'
                      style={{ width: '100%' }}
                    />
                  ) : (
                    iconUploadButton
                  )}
                </Upload>
              </div>

              <div
                style={{
                  marginRight: '20px',
                }}
              >
                <div className='addproductSection-left-header'>
                  <h3 className='inputFieldLabel'> App Logo </h3>
                  <Tooltip placement='left' title={'Update App logo image'}>
                    <a href='###'>
                      <InfoCircleOutlined />
                    </a>
                  </Tooltip>
                </div>

                <Upload
                  style={{
                    borderRadius: '8px',
                  }}
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  beforeUpload={beforeAppIconUpload}
                  multiple={false}
                >
                  {appLogo ? (
                    <img
                      onError={() => setAppLogo('')}
                      src={appLogo}
                      alt='avatar'
                      style={{ width: '100%' }}
                    />
                  ) : (
                    appIconUploadButton
                  )}
                </Upload>
              </div>
            </div>

            <div
              style={{
                marginBottom: '10px',
              }}
            ></div>
          </TabPane>

          <TabPane tab='Site SEO' key='3'>
            <SiteSeo />
          </TabPane>

          <TabPane tab='Invoice Information' key='4'>
            <SiteInfoInvoice />
          </TabPane>

          <TabPane tab='Change Credentials' key='5'>
            <ChangeAdminPassword />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default SiteInfo;
