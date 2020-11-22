import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { useHandleFetch } from '../../hooks';
import {
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import MetaTags from '../../pages/category/MetaTags';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required('Name is required')
    .min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Tag Updated',
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
  tagEditVisible?: any;
  setTagEditVisible?: any;
  tagDetailData?: any;
  setTagDetailData?: any;
}

const QuickEdit = ({
  tagEditVisible,
  setTagEditVisible,
  tagDetailData,
  setTagDetailData,
}: Props) => {
  const [updateTagState, handleUpdateCategoryFetch] = useHandleFetch(
    {},
    'updateTag'
  );
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);

  const handleSubmit = async (values: any, actions: any) => {
    const updateTagRes = await handleUpdateCategoryFetch({
      urlOptions: {
        placeHolders: {
          id: values.id,
        },
      },
      body: {
        name: values.name,
        description: values.description,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: tags.join(','),

        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags: bnTags.join(','),
          name: values.bnName,
          description: values.bnDescription,
        },
      },
    });

    // @ts-ignore
    if (updateTagRes && updateTagRes.status === 'ok') {
      setTagDetailData({
        id: values.id,
        key: values.id,
        name: values.name,
        description: values.description,
      });
      console.log('categoryupdateTagRes', updateTagRes);
      openSuccessNotification();
      setTagEditVisible(false);

      // const positionInTag = () => {
      //     return tagList.map(item => item.id).indexOf(category.id);
      // }

      // const index = positionInTag();

      // const updatedItem = Object.assign({}, tagList[index], { ...updateTagRes });
      // const updateTagList = [...tagList.slice(0, index), updatedItem, ...tagList.slice(index + 1)];
      // setTagList(updateTagList);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!updateTagState['isLoading']) {
      const error = updateTagState['error'];
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
  }, [updateTagState]);

  const handleCancel = (e: any) => {
    setTagEditVisible(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.name || !isValid) {
      return true;
    }
    return false;
  };

  // useEffect(()=>{

  //     if(tagDetailData && Object.keys(tagDetailData).length > 0){
  //         const metaTags = tagDetailData.metaTags.split(',');

  //         console.log('localMetaTags',metaTags);

  //         const bnMetaTags = tagDetailData.bn['metaTags'].split(',');

  //         setTags(metaTags)
  //         setBnTags(bnMetaTags)
  //     }

  // },[]);

  console.log('tagDetailData', tagDetailData);

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{
        ...initialValues,
        ...tagDetailData,
        ...(tagDetailData &&
          Object.keys(tagDetailData).length > 0 && {
            bnMetaTitle:
              tagDetailData['bn'] &&
              tagDetailData['bn'].metaTitle &&
              tagDetailData['bn'].metaTitle,
            bnMetaDescription:
              tagDetailData['bn'] &&
              tagDetailData['bn'].metaDescription &&
              tagDetailData['bn'].metaDescription,
            bnName:
              tagDetailData['bn'] &&
              tagDetailData['bn'].name &&
              tagDetailData['bn'].name,
            bnDescription:
              tagDetailData['bn'] &&
              tagDetailData['bn'].description &&
              tagDetailData['bn'].description,
          }),
      }}
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
            title='Tag Edit'
            visible={tagEditVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
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
                (!isSubmitting && updateTagState.error['error']['name'])
              }
              errorString={
                (touched.name && errors.name) ||
                (!isSubmitting && updateTagState.error['error']['name'])
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
                (!isSubmitting && updateTagState.error['error']['bnName'])
              }
              errorString={
                (touched.bnName && errors.bnName) ||
                (!isSubmitting && updateTagState.error['error']['bnName'])
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
                (!isSubmitting && updateTagState.error['error']['description'])
              }
              errorString={
                (touched.description && errors.description) ||
                (!isSubmitting && updateTagState.error['error']['description'])
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
                (!isSubmitting &&
                  updateTagState.error['error']['bnDescription'])
              }
              errorString={
                (touched.bnDescription && errors.bnDescription) ||
                (!isSubmitting &&
                  updateTagState.error['error']['bnDescription'])
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
                (!isSubmitting && updateTagState.error['error']['metaTitle'])
              }
              errorString={
                (touched.metaTitle && errors.metaTitle) ||
                (!isSubmitting && updateTagState.error['error']['metaTitle'])
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
                (!isSubmitting && updateTagState.error['error']['bnMetaTitle'])
              }
              errorString={
                (touched.bnMetaTitle && errors.bnMetaTitle) ||
                (!isSubmitting && updateTagState.error['error']['bnMetaTitle'])
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
                (!isSubmitting &&
                  updateTagState.error['error']['metaDescription'])
              }
              errorString={
                (touched.metaDescription && errors.metaDescription) ||
                (!isSubmitting &&
                  updateTagState.error['error']['metaDescription'])
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
                  updateTagState.error['error']['bnMetaDescription'])
              }
              errorString={
                (touched.bnMetaDescription && errors.bnMetaDescription) ||
                (!isSubmitting &&
                  updateTagState.error['error']['bnMetaDescription'])
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
        </>
      )}
    </Formik>
  );
};

export default QuickEdit;
