// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import {
  Switch,
  Select,
  notification,
  Modal,
  Tooltip,
  Upload,
  message,
} from 'antd';

import {
  DeleteOutlined,
  FileAddOutlined,
  FileImageFilled,
  PlusOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import MetaTags from './MetaTags';

const validationSchema = Yup.object().shape({
  // name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Category Updated',
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
  image: [],
  url: '',
  cover: '',
  displayOrder: null,
};

const { Option } = Select;

interface Props {
  addNewCategoryVisible: any;
  setAddNewCategoryVisible: any;
  categoryList?: any;
  setcategoryList?: any;
}

const AddNewCategory = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  categoryList,
  setcategoryList,
}: Props) => {
  const [addCategoryState, handleAddCategoryFetch] = useHandleFetch(
    {},
    'addCategory',
    'form'
  );
  const [visible, setvisible] = useState(false);
  const [myImages, setmyImages] = useState(false);
  const [myThumbnailImage, setmyThumbnailImage] = useState(false);
  const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);
  const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
  const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [selectedParentId, setselectedParentId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingThumnail, setLoadingThumbnail] = useState(false);
  const [imageFile, setImagefile] = useState('');
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds = myImages
      ? myImages.map((image) => {
          return image.id;
        })
      : [];

    const formData = new FormData();

    const bn = {
      metaTitle: values.bnMetaTitle,
      metaDescription: values.bnMetaDescription,
      metaTags: bnTags.join(','),
      name: values.bnName.trim(),
      description: values.bnDescription,
    };

    formData.append('name', values.name.trim());
    formData.append('description', values.description);
    formData.append('image', JSON.stringify(imagesIds));
    formData.append('cover', coverImageId || imagesIds[0] ? imagesIds[0] : '');
    formData.append('parent', selectedParentId);
    formData.append('icon', imageFile);
    // formData.append('metaTitle', values.metaTitle)
    formData.append('displayOrder', values.displayOrder);
    // formData.append('metaDescription', values.metaDescription)
    // formData.append('metaTags', values.metaTags)

    // const bnData = JSON.stringify(bn);
    // const bnFormData = new FormData();
    // bnFormData.append("bn",bnData);

    // formData.append('bn', bnFormData.get('bn'))

    console.log('addcategoryREsBody', {
      ...formData,
      // ...bnFormData
    });

    const addCategoryRes = await handleAddCategoryFetch({
      body: formData,
    });

    // @ts-ignore
    if (addCategoryRes && addCategoryRes.status === 'ok') {
      openSuccessNotification('Category Created!');
      setAddNewCategoryVisible(false);

      setcategoryList([
        {
          id: addCategoryRes['_id'] || '',
          key: addCategoryRes['_id'] || '',
          name: addCategoryRes['name'] || '',
          description: addCategoryRes['description'] || '',
          cover: addCategoryRes['cover'] || '',
          // @ts-ignore
          ...addCategoryRes,
        },
        ...categoryList,
      ]);

      actions.resetForm();
      // @ts-ignore
      setmyImages([]);
      setCoverImageId('');
      setselectedParentId('');
      setisparentcategoryChecked(true);
      setImageUrl('');
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!addCategoryState['isLoading']) {
      const error = addCategoryState['error'];
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
  }, [addCategoryState]);

  const onSwitchChange = (checked: any) => {
    setisparentcategoryChecked(checked);
  };

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

  const handleThumbnailImageDelete = (id) => {
    // @ts-ignore
    const newImages =
      myThumbnailImage &&
      myThumbnailImage.filter((image) => {
        return image.id !== id;
      });

    if (newImages.length > 0) {
      setmyThumbnailImage(newImages);
    } else setmyThumbnailImage(false);
  };

  const onChangeSelect = (value) => {
    setselectedParentId(value);
  };

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
      setImagefile(file);
      setLoadingThumbnail(false);
    });

    return false;
  }

  const uploadButton = (
    <div>
      {loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

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
            title='Add New Category'
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
              label='Name'
              value={values.name}
              // placeHolder={'grocery,fashion'}
              name='name'
              isError={
                (touched.name && errors.name) ||
                (!isSubmitting && addCategoryState.error['error']['name'])
              }
              errorString={
                (touched.name && errors.name) ||
                (!isSubmitting && addCategoryState.error['error']['name'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('name');
              }}
            />

            {/* <Input
								label='BN Name'
								value={values.bnName}
								placeHolder={'মুদিখানা,ফ্যাশন'}
								name='bnName'
								isError={(touched.bnName && errors.bnName) ||
									(!isSubmitting && addCategoryState.error['error']['bnName'])}

								errorString={(touched.bnName && errors.bnName) ||
									(!isSubmitting && addCategoryState.error['error']['bnName'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnName');
								}}
							/> */}

            <TextArea
              label='Description'
              value={values.description}
              placeholder={'This category...'}
              name='description'
              isError={
                (touched.description && errors.description) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['description'])
              }
              errorString={
                (touched.description && errors.description) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['description'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('description');
              }}
            />

            {/* <TextArea
								label='BN Description'
								value={values.bnDescription}
								placeholder={'এই ক্যাটাগড়ি...'}
								name='bnDescription'
								isError={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && addCategoryState.error['error']['bnDescription'])}

								errorString={(touched.bnDescription && errors.bnDescription) ||
									(!isSubmitting && addCategoryState.error['error']['bnDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnDescription');
								}}
							/> */}

            <Input
              label='Display Order'
              value={values.displayOrder}
              placeHolder={'1,3,7'}
              name='displayOrder'
              type='number'
              isError={
                (touched.displayOrder && errors.displayOrder) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['displayOrder'])
              }
              errorString={
                (touched.displayOrder && errors.displayOrder) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['displayOrder'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('displayOrder');
              }}
            />

            <div
              style={{
                marginTop: '25px',
              }}
            ></div>

            <div className='switchLabelContainer'>
              <Switch
                checked={isparentCategoryChecked}
                defaultChecked
                onChange={onSwitchChange}
              />
              <div className='switchLabelContainer-textContainer'>
                <h5>Top level Category</h5>
                <h5 className='switchLabelContainer-desc'>
                  Disable to select a Parent Category
                </h5>
              </div>
            </div>

            {!isparentCategoryChecked && (
              <>
                <h3 className='inputFieldLabel'>Parent Category</h3>
                <Select
                  showSearch
                  style={{ width: 300 }}
                  placeholder='Select a Parent Category'
                  optionFilterProp='children'
                  onChange={onChangeSelect}
                  // onFocus={onFocus}
                  // onBlur={onBlur}
                  // onSearch={onSearch}
                  filterOption={(input, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {categoryList.length > 0 &&
                    categoryList.map((category) => {
                      return (
                        <Option value={category.id}>{category.name}</Option>
                      );
                    })}
                </Select>
              </>
            )}

            <div
              style={{
                marginTop: '20px',
              }}
            />

            <div className='addproductSection-left-header'>
              <h3 className='inputFieldLabel'>Icon </h3>
              <Tooltip
                placement='left'
                title={'Add Icon image for this category'}
              >
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
                <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>

            <div
              style={{
                marginTop: '10px',
              }}
            />

            <div
              className='addproductSection-left-header'
              style={{
                marginBottom: '-5px',
              }}
            >
              <h3 className='inputFieldLabel'>Images</h3>
              <Tooltip
                placement='left'
                title={
                  'Click on the image to select cover image, By default 1st image is selected as cover'
                }
              >
                <a href='###'>
                  <InfoCircleOutlined />
                </a>
              </Tooltip>
            </div>
            <div className='aboutToUploadImagesContainer'>
              {myImages &&
                // @ts-ignore
                myImages.length > 0 &&
                myImages.map((image, index) => {
                  return (
                    <div className='aboutToUploadImagesContainer__item'>
                      <div
                        className='aboutToUploadImagesContainer__item-imgContainer'
                        onClick={() => setCoverImageId(image.id)}
                      >
                        <img src={image.cover} alt={image.alt} />
                      </div>

                      <span
                        onClick={() => handleImagesDelete(image.id)}
                        className='aboutToUploadImagesContainer__item-remove'
                      >
                        <CloseOutlined />
                      </span>

                      {coverImageId === image.id ? (
                        <span className='aboutToUploadImagesContainer__item-cover'>
                          <CheckOutlined />
                        </span>
                      ) : (
                        !coverImageId &&
                        index === 0 && (
                          <span className='aboutToUploadImagesContainer__item-cover'>
                            <CheckOutlined />
                          </span>
                        )
                      )}
                    </div>
                  );
                })}

              <Tooltip title={'Attach images'}>
                <div
                  onClick={() => {
                    setvisible(true);
                    setisModalOpenForImages(true);
                    setisModalOpenForThumbnail(false);
                  }}
                  className='aboutToUploadImagesContainer__uploadItem'
                >
                  {/* <FileAddOutlined />
													<FileImageTwoTone />
													<FileImageOutlined /> */}
                  <FileImageFilled />
                  {/* <h5>
												     Select From Library
											<     /h5> */}
                  <span className='aboutToUploadImagesContainer__uploadItem-plus'>
                    <PlusOutlined />
                  </span>
                </div>
              </Tooltip>
            </div>

            <Input
              label='Meta title'
              value={values.metaTitle}
              placeHolder={'...'}
              name='metaTitle'
              isError={
                (touched.metaTitle && errors.metaTitle) ||
                (!isSubmitting && addCategoryState.error['error']['metaTitle'])
              }
              errorString={
                (touched.metaTitle && errors.metaTitle) ||
                (!isSubmitting && addCategoryState.error['error']['metaTitle'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('metaTitle');
              }}
            />
            {/* 
							<Input
								label='BN Meta title'
								value={values.bnMetaTitle}
								placeHolder={'...'}
								name='bnMetaTitle'
								isError={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && addCategoryState.error['error']['bnMetaTitle'])}

								errorString={(touched.bnMetaTitle && errors.bnMetaTitle) ||
									(!isSubmitting && addCategoryState.error['error']['bnMetaTitle'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaTitle');
								}}
							/> */}

            <TextArea
              label='Meta description'
              value={values.metaDescription}
              placeholder={'meta...'}
              name='metaDescription'
              isError={
                (touched.metaDescription && errors.metaDescription) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['metaDescription'])
              }
              errorString={
                (touched.metaDescription && errors.metaDescription) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['metaDescription'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('metaDescription');
              }}
            />

            {/* <TextArea
								label='BN Meta Description'
								value={values.bnMetaDescription}
								placeholder={'এইয় মেট...'}
								name='bnMetaDescription'
								isError={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && addCategoryState.error['error']['bnMetaDescription'])}

								errorString={(touched.bnMetaDescription && errors.bnMetaDescription) ||
									(!isSubmitting && addCategoryState.error['error']['bnMetaDescription'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('bnMetaDescription');
								}}
							/> */}

            <h3 className='inputFieldLabel'>Meta Tags </h3>

            <MetaTags
              // @ts-ignore
              setTags={setTags}
              tags={tags}
            />
            {/* 
							<div style={{
								marginTop:'15px'
							}}></div>

							<h3 className='inputFieldLabel'>
							BN Meta Tags (মুদিখানা,ফ্যাশন)
							</h3>

							<MetaTags
							// @ts-ignore
							setTags={setBnTags}
							tags={bnTags}
							 /> */}
          </Modal>

          <MediaLibrary
            setvisible={setvisible}
            visible={visible}
            setmyImages={setmyImages}
            myImages={myImages}
            setmyThumbnailImage={setmyThumbnailImage}
            isModalOpenForThumbnail={isModalOpenForThumbnail}
            isModalOpenForImages={isModalOpenForImages}
          />
        </>
      )}
    </Formik>
  );
};

export default AddNewCategory;
