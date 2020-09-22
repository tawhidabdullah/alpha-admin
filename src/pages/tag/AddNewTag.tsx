// @ts-nocheck
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
import MetaTags from '../../pages/category/MetaTags';

const validationSchema = Yup.object().shape({
  //   name: Yup.string()
  //     .label('Name')
  //     .required('Name is required')
  //     .min(3, 'Name must have at least 3 characters'),
});

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
  name: '',
  bnName: '',
  description: '',
  bnDescription: '',
  metaTitle: '',
  bnMetaTitle: '',
  metaDescription: '',
  bnMetaDescription: '',
  metaTags: '',
  bnMetaTags: '',
};

interface Props {
  addNewCategoryVisible?: any;
  setAddNewCategoryVisible?: any;
  tagList?: any;
  setTagList?: any;
}

const AddNewBrand = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  tagList,
  setTagList,
}: Props) => {
  const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'addTag');
  const [myImages, setmyImages] = useState(false);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);

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
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: tags.join(','),

        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags: bnTags.join(','),
          name: values.bnName.trim(),
          description: values.bnDescription,
        },
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
      openSuccessNotification();

      setTagList([
        {
          id: addTagRes['_id'] || '',
          key: addTagRes['_id'] || '',
          name: addTagRes['name'] || '',
          description: addTagRes['description'] || '',
        },
        ...tagList,
      ]);
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

  const handleImagesDelete = (id) => {
    // @ts-ignore
    const newImages =
      myImages &&
      myImages.filter((image) => {
        return image.id !== id;
      });

    setmyImages(newImages);
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
            title='Add New Tag'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Create'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
            }}
          >
            <Input
              label='Name *'
              value={values.name}
              name='name'
              placeHolder={'new,fresh'}
              isError={
                (touched.name && errors.name) ||
                (!isSubmitting && addTagState.error['error']['name'])
              }
              errorString={
                (touched.name && errors.name) ||
                (!isSubmitting && addTagState.error['error']['name'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('name');
              }}
            />

            <Input
              label='BN Name'
              value={values.bnName}
              placeHolder={'নতুন,ফ্রেশ'}
              name='bnName'
              isError={
                (touched.bnName && errors.bnName) ||
                (!isSubmitting && addTagState.error['error']['bnName'])
              }
              errorString={
                (touched.bnName && errors.bnName) ||
                (!isSubmitting && addTagState.error['error']['bnName'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('bnName');
              }}
            />

            <TextArea
              label='Description'
              value={values.description}
              name='description'
              placeholder={'This tag...'}
              isError={
                (touched.description && errors.description) ||
                (!isSubmitting && addTagState.error['error']['description'])
              }
              errorString={
                (touched.description && errors.description) ||
                (!isSubmitting && addTagState.error['error']['description'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('description');
              }}
            />

            <TextArea
              label='BN Description'
              value={values.bnDescription}
              placeholder={'এই ট্যাগ...'}
              name='bnDescription'
              isError={
                (touched.bnDescription && errors.bnDescription) ||
                (!isSubmitting && addTagState.error['error']['bnDescription'])
              }
              errorString={
                (touched.bnDescription && errors.bnDescription) ||
                (!isSubmitting && addTagState.error['error']['bnDescription'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('bnDescription');
              }}
            />

            <Input
              label='Meta title'
              value={values.metaTitle}
              placeHolder={'...'}
              name='metaTitle'
              isError={
                (touched.metaTitle && errors.metaTitle) ||
                (!isSubmitting && addTagState.error['error']['metaTitle'])
              }
              errorString={
                (touched.metaTitle && errors.metaTitle) ||
                (!isSubmitting && addTagState.error['error']['metaTitle'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('metaTitle');
              }}
            />

            <Input
              label='BN Meta title'
              value={values.bnMetaTitle}
              placeHolder={'...'}
              name='bnMetaTitle'
              isError={
                (touched.bnMetaTitle && errors.bnMetaTitle) ||
                (!isSubmitting && addTagState.error['error']['bnMetaTitle'])
              }
              errorString={
                (touched.bnMetaTitle && errors.bnMetaTitle) ||
                (!isSubmitting && addTagState.error['error']['bnMetaTitle'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('bnMetaTitle');
              }}
            />

            <TextArea
              label='Meta description'
              value={values.metaDescription}
              placeholder={'meta...'}
              name='metaDescription'
              isError={
                (touched.metaDescription && errors.metaDescription) ||
                (!isSubmitting && addTagState.error['error']['metaDescription'])
              }
              errorString={
                (touched.metaDescription && errors.metaDescription) ||
                (!isSubmitting && addTagState.error['error']['metaDescription'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('metaDescription');
              }}
            />

            <TextArea
              label='BN Meta Description'
              value={values.bnMetaDescription}
              placeholder={'এইয় মেট...'}
              name='bnMetaDescription'
              isError={
                (touched.bnMetaDescription && errors.bnMetaDescription) ||
                (!isSubmitting &&
                  addTagState.error['error']['bnMetaDescription'])
              }
              errorString={
                (touched.bnMetaDescription && errors.bnMetaDescription) ||
                (!isSubmitting &&
                  addTagState.error['error']['bnMetaDescription'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('bnMetaDescription');
              }}
            />

            <h3 className='inputFieldLabel'>Meta Tags</h3>

            <MetaTags
              // @ts-ignore
              setTags={setTags}
              tags={tags}
            />

            <div
              style={{
                marginTop: '15px',
              }}
            ></div>

            <h3 className='inputFieldLabel'>BN Meta Tags</h3>

            <MetaTags
              // @ts-ignore
              setTags={setBnTags}
              tags={bnTags}
            />
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
