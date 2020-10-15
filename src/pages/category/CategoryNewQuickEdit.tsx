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
  Button,
  Spin,
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
  //   name: Yup.string()
  //     .label('Name')
  //     .required('Name is required')
  //     .min(3, 'Name must have at least 3 characters'),
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
  categoryDetailData?: any;
  categoryList2?:any; 
}

const ModalChildComponent = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  categoryList,
  setcategoryList,
  categoryDetailData,
  categoryList2
}) => {
  console.log('categoryList211',categoryList2)
  const [addCategoryState, handleAddCategoryFetch] = useHandleFetch(
    {},
    'updateCategory'
  );
  const [categoryDetailState, handleCategoryDetailFetch] = useHandleFetch(
    {},
    'categoryDetail'
  );

  const [
    updateCategoryIconState,
    handleUpdateCategoryIconFetch,
  ] = useHandleFetch({}, 'categoryUpdateIcon', 'form');

  const [
    updateCategoryThumbnailState,
    handleUpdateCategoryThumbnailFetch,
  ] = useHandleFetch({}, 'categoryUpdateThumbnail', 'form');


  const [visible, setvisible] = useState(false);
  const [myImages, setmyImages] = useState(false);
  const [myThumbnailImage, setmyThumbnailImage] = useState(false);
  const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);
  const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
  const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
  const [selectedParentId, setselectedParentId] = useState('');
  const [imageFile, setImagefile] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [thumbnailImageFile, setThumbnailImagefile] = useState('');
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState('');
  const [loadingThumnail, setLoadingThumbnail] = useState(false);
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [myGoddamnImages, setMyGoddamnImages] = useState([]);

  const [
    attachImageToItemMultipleState,
    handleAttachImageToItemMultipleFetch,
  ] = useHandleFetch({}, 'attachImageToItemMultiple');
  const [
    attachImageToItemSingleState,
    handleAttachImageToItemSingleFetch,
  ] = useHandleFetch({}, 'attachImageToItemSingle');
  const [
    detachImageFromItemMultipleState,
    handleDetachImageFromItemMultipleFetch,
  ] = useHandleFetch({}, 'detachImageFromItemMultiple');
  const [
    detachImageFromItemSingleState,
    handleDetachImageFromItemSingleFetch,
  ] = useHandleFetch({}, 'detachImageFromItemSingle');
  const [
    setImageAsThumbnailToItemState,
    handleSetImageAsThumbnailToItemFetch,
  ] = useHandleFetch({}, 'setImageAsThumbnailToItem');

  useEffect(() => {
    const getProductDetail = async () => {
      await handleCategoryDetailFetch({
        urlOptions: {
          placeHolders: {
            id: categoryDetailData.id,
          },
        },
      });
    };

    getProductDetail();
  }, [categoryDetailData]);

  useEffect(() => {
    if (
      categoryDetailState.done &&
      Object.keys(categoryDetailState).length > 0
    ) {
      const images = categoryDetailState.data.image;
      let mahImages = [];

      if (images && images.length > 0) {
        mahImages = images;
      }

      if (
        categoryDetailState.data.cover &&
        categoryDetailState.data.cover['id']
      ) {
        const ixists = images.find(
          (item) => item.id === categoryDetailState.data.cover['id']
        );
        if (!ixists) {
          mahImages = [categoryDetailState.data.cover, ...mahImages];
        }

        setCoverImageId(categoryDetailState.data.cover['id']);
      }

      // @ts-ignore
      setmyImages(mahImages);
    }
  }, [categoryDetailState.done]);

  useEffect(() => {
    console.log('thumnail', myImages);
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
      console.log('thumnail2', myImages);

      if (coverImageId !== myImages[0].id) {
        setCoverImageId(myImages[0].id);
        handleSetImageAsThumnail(myImages[0]);
      }
    }
  }, [myImages]);

  const handleDetachSingleImage = async (id) => {
    await handleDetachImageFromItemSingleFetch({
      urlOptions: {
        placeHolders: {
          imageId: id,
          collection: 'category',
          itemId: categoryDetailData.id,
        },
      },
    });
  };

  const handleSetImageAsThumnail = async (image) => {
    const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
      urlOptions: {
        placeHolders: {
          imageId: image.id,
          collection: 'category',
          itemId: categoryDetailData.id,
        },
      },
    });

    // @ts-ignore
    if (thumbnailRes && thumbnailRes.status === 'ok') {
      openSuccessNotification('Set as thumbnail!');
    } else {
      openErrorNotification("Couldn't set as thumbnail, Something went wrong");
    }
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

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds = myImages
      ? myImages.map((image) => {
          return image.id;
        })
      : [];

    const formData = new FormData();

    formData.append('name', values.name?.trim());
    formData.append('description', values.description);
    formData.append('image', JSON.stringify(imagesIds));
    formData.append('cover', coverImageId || imagesIds[0] ? imagesIds[0] : '');
    formData.append('parent', selectedParentId);
    formData.append('icon', imageFile);
    formData.append('thumbnail', thumbnailImageFile);

    console.log('categoryDetailData', categoryDetailData);

    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const aboutToUpdatedImageIds = [];

      if (imagesIds && imagesIds.length > 0) {
        imagesIds.forEach((imageId) => {
          if (categoryDetailData && categoryDetailData['image']) {
            if (!categoryDetailData['image'].includes(imageId)) {
              aboutToUpdatedImageIds.push(imageId);
            }
          }
        });
      }

      if (aboutToUpdatedImageIds[0] && aboutToUpdatedImageIds.length > 1) {
        await handleAttachImageToItemMultipleFetch({
          urlOptions: {
            placeHolders: {
              collection: 'category',
              itemId: categoryDetailData.id,
            },
          },
          body: {
            image: aboutToUpdatedImageIds,
          },
        });
      } else if (
        aboutToUpdatedImageIds[0] &&
        aboutToUpdatedImageIds.length < 1
      ) {
        await handleAttachImageToItemSingleFetch({
          urlOptions: {
            placeHolders: {
              imageId: aboutToUpdatedImageIds[0].id,
              collection: 'category',
              itemId: categoryDetailData.id,
            },
          },
        });
      }
    }

    const addCategoryRes = await handleAddCategoryFetch({
      urlOptions: {
        placeHolders: {
          id: categoryDetailData.id,
        },
      },
      body: {
        name: values.name?.trim(),
        description: values.description,
        displayOrder: values.displayOrder,
        image: imagesIds,
        cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
        parent: selectedParentId,
        icon: imageFile,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: tags && tags.length > 0 ? tags.join(',') : '',
        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags: bnTags && bnTags.length > 0 ? bnTags.join(',') : '',
          name: values.bnName?.trim(),
          description: values.bnDescription,
        },
      },
    });

    // @ts-ignore
    if (addCategoryRes && addCategoryRes.status === 'ok') {
      openSuccessNotification('Category Updated!');
      setAddNewCategoryVisible(false);
      const positionInTag = () => {
        return categoryList.map((item) => item.id).indexOf(values.id);
      };

      const getCover = (id) => {
        if (!id || !myImages || !myImages[0]) {
          return '';
        } else {
          if (myImages && myImages.length > 0) {
            const item = myImages.find((item) => item.id === id);
            if (item) {
              return item.cover;
            }
          }
        }
      };

      const index = positionInTag();

      // @ts-ignore
      const updatedItem = Object.assign({}, categoryList[index], {
        name: addCategoryRes['name'] || '',
        description: addCategoryRes['description'] || '',
        id: categoryDetailData.id,
        key: categoryDetailData['id'] || '',
        // @ts-ignore
        ...addCategoryRes,
        cover: getCover(coverImageId),
      });
      const updateTagList = [
        ...categoryList.slice(0, index),
        updatedItem,
        ...categoryList.slice(index + 1),
      ];
      setcategoryList(updateTagList);

      actions.resetForm();
      // @ts-ignore
      setmyImages([]);
      setCoverImageId('');
      setselectedParentId('');
      setisparentcategoryChecked(true);
      setImageUrl('');
      setThumbnailImageUrl('');
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
    setTags([]);
    setBnTags([]);
    setAddNewCategoryVisible(false);
    setImagefile('');
    setCoverImageId('');
    setselectedParentId('');
    setmyImages(false);
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
      const setNewIcon = async () => {
        const formData = new FormData();
        formData.append('icon', file);
        // const addCategoryRes = await handleAddCategoryFetch({
        // 	body: formData,
        // });
        const res = await handleUpdateCategoryIconFetch({
          urlOptions: {
            placeHolders: {
              id: categoryDetailData.id,
            },
          },
          body: formData,
        });

        // @ts-ignore
        if (res && res.status === 'ok') {
          openSuccessNotification('Category Icon updated!');
        } else {
          openErrorNotification(
            "Couldn't update category icon, Something went wrong"
          );
        }
      };

      setNewIcon();
      setLoadingThumbnail(false);
    });

    return false;
  }


  function beforeThumbnailUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    getBase64(file, (imageUrl) => {
      setThumbnailImageUrl(imageUrl)
      setThumbnailImagefile(file)
      const setNewIcon = async () => {
        const formData = new FormData();
        formData.append('thumbnail', file);
        // const addCategoryRes = await handleAddCategoryFetch({
        // 	body: formData,
        // });
        const res = await handleUpdateCategoryThumbnailFetch({
          urlOptions: {
            placeHolders: {
              id: categoryDetailData.id,
            },
          },
          body: formData,
        });

        // @ts-ignore
        if (res && res.status === 'ok') {
          openSuccessNotification('Category Thumbnail updated!');
        } else {
          openErrorNotification(
            "Couldn't update category Thumbnail, Something went wrong"
          );
        }
      };

      setNewIcon();
      setLoadingThumbnail(false);
    });

    return false;
  }



  
  useEffect(() => {
    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const iconUrl = categoryDetailData.icon && categoryDetailData.icon;

      setImageUrl(iconUrl);
    }
  }, []);


  useEffect(() => {
    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const thumbnailImageUrl = categoryDetailData.thumbnail && categoryDetailData.thumbnail;
      setThumbnailImageUrl(thumbnailImageUrl);
    }
  }, []);


  const uploadButton = (
    <div>
      {loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  useEffect(() => {
    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const metaTags =
        categoryDetailData.metaTags && categoryDetailData.metaTags.split(',');

      console.log('localMetaTags', metaTags);

      const bnMetaTags =
        categoryDetailData.bn &&
        categoryDetailData.bn['metaTags'] &&
        categoryDetailData.bn['metaTags'].split(',');
      setTags(metaTags || []);
      setBnTags(bnMetaTags || []);
    }
  }, []);


  return (
    <>
      <Formik
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        validationSchema={validationSchema}
        validateOnBlur={false}
        enableReinitialize={true}
        initialValues={{
          ...initialValues,
          ...categoryDetailData,
          ...(categoryDetailData &&
            Object.keys(categoryDetailData).length > 0 && {
              bnMetaTitle:
                categoryDetailData['bn'] &&
                categoryDetailData['bn'].metaTitle &&
                categoryDetailData['bn'].metaTitle,
              bnMetaDescription:
                categoryDetailData['bn'] &&
                categoryDetailData['bn'].metaDescription &&
                categoryDetailData['bn'].metaDescription,
              bnName:
                categoryDetailData['bn'] &&
                categoryDetailData['bn'].name &&
                categoryDetailData['bn'].name,
              bnDescription:
                categoryDetailData['bn'] &&
                categoryDetailData['bn'].description &&
                categoryDetailData['bn'].description,
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
            <section className='addProductGridContainer'>
              <div className='addProductGridContainer__left'>
                <div className='addProductGridContainer__name'>
                  <div className='addProductGridContainer__item-header'>
                    <h3>Category Information *</h3>
                    <div
                      className={
                        values.name && values.name.length > 2
                          ? 'checkicon-active'
                          : 'checkicon'
                      }
                    >
                      <CheckCircleOutlined />
                    </div>
                  </div>
                  <div className='addProductGridContainer__item-body'>
                    <Input
                      label='Name *'
                      value={values.name}
                      placeHolder={'grocery,fashion'}
                      name='name'
                      isError={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['name'])
                      }
                      errorString={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['name'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('name');
                      }}
                    />

                    <Input
                      label='BN Name'
                      value={values.bnName}
                      placeHolder={'মুদিখানা,ফ্যাশন'}
                      name='bnName'
                      isError={
                        (touched.bnName && errors.bnName) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['bnName'])
                      }
                      errorString={
                        (touched.bnName && errors.bnName) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['bnName'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('bnName');
                      }}
                    />

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

                    <TextArea
                      label='BN Description'
                      value={values.bnDescription}
                      placeholder={'এই ক্যাটাগড়ি...'}
                      name='bnDescription'
                      isError={
                        (touched.bnDescription && errors.bnDescription) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['bnDescription'])
                      }
                      errorString={
                        (touched.bnDescription && errors.bnDescription) ||
                        (!isSubmitting &&
                          addCategoryState.error['error']['bnDescription'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('bnDescription');
                      }}
                    />

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
                          {categoryList2 && categoryList2.length > 0 &&
                            categoryList2.map((category) => {
                              return (
                                <Option value={category.id}>
                                  {category.name}
                                </Option>
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
                        <img
                          src={imageUrl}
                          alt='avatar'
                          style={{ width: '100%' }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>


                    
                    <div
                      style={{
                        marginTop: '20px',
                      }}
                    />

                    <div className='addproductSection-left-header'>
                      <h3 className='inputFieldLabel'>Thumbnail</h3>
                      <Tooltip
                        placement='left'
                        title={'Add thumbnail image for this category'}
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
                      beforeUpload={beforeThumbnailUpload}
                      multiple={false}
                    >
                      {thumbnailImageUrl ? (
                        <img
                          src={thumbnailImageUrl}
                          alt='avatar'
                          style={{ width: '100%' }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>


                  </div>
                </div>

                <div className='addProductGridContainer__image'>
                  <div className='addProductGridContainer__item-header'>
                    <h3>Image</h3>

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

                  <div
                    style={{
                      padding: '10px',
                    }}
                    className='aboutToUploadImagesContainer'
                  >
                    {categoryDetailState.isLoading && (
                      <div
                        style={{
                          padding: '20px 0',
                        }}
                      >
                        <Spin />
                      </div>
                    )}
                    {categoryDetailState.done && (
                      <>
                        {myImages &&
                          // @ts-ignore
                          myImages.length > 0 &&
                          myImages.map((image, index) => {
                            return (
                              <div className='aboutToUploadImagesContainer__item'>
                                <div
                                  className='aboutToUploadImagesContainer__item-imgContainer'
                                  onClick={() => {
                                    setCoverImageId(image.id);
                                    handleSetImageAsThumnail(image);
                                  }}
                                >
                                  <img src={image.cover} alt={image.alt} />
                                </div>

                                <span
                                  onClick={() => {
                                    handleImagesDelete(image.id);
                                    handleDetachSingleImage(image.id);
                                  }}
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
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className='addProductGridContainer__right'>
                <div className='addProductGridContainer__category'>
                  <div className='addProductGridContainer-rightItemContainer'>
                    <div className='addProductGridContainer-rightItemContainer-header'>
                      <h3>Meta Tags</h3>

                      <Tooltip
                        placement='left'
                        title={
                          "Meta data will be used to make the user's easy and for search engine optimization."
                        }
                      >
                        <a href='###'>
                          <InfoCircleOutlined />
                        </a>
                      </Tooltip>

                      {/* <Tooltip
                        color='red'
                        visible={
                          addCategoryState.error['error']['category'] &&
                          !(categoryids.length > 0)
                        }
                        placement='left'
                        title={'Select at least one category'}
                      >
                        <div
                          className={
                            !(categoryids.length > 0) &&
                            !addCategoryState.error['error']['category']
                              ? 'checkicon'
                              : addCategoryState.error['error']['category']
                              ? 'checkicon-error'
                              : 'checkicon-active'
                          }
                        >
                          <CheckCircleOutlined />
                        </div>
                      </Tooltip> */}
                    </div>
                    <div className='addProductGridContainer-rightItemContainer-body'>
                      <Input
                        label='Meta title'
                        value={values.metaTitle}
                        placeHolder={'...'}
                        name='metaTitle'
                        isError={
                          (touched.metaTitle && errors.metaTitle) ||
                          (!isSubmitting &&
                            addCategoryState.error['error']['metaTitle'])
                        }
                        errorString={
                          (touched.metaTitle && errors.metaTitle) ||
                          (!isSubmitting &&
                            addCategoryState.error['error']['metaTitle'])
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
                          (!isSubmitting &&
                            addCategoryState.error['error']['bnMetaTitle'])
                        }
                        errorString={
                          (touched.bnMetaTitle && errors.bnMetaTitle) ||
                          (!isSubmitting &&
                            addCategoryState.error['error']['bnMetaTitle'])
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

                      <TextArea
                        label='BN Meta Description'
                        value={values.bnMetaDescription}
                        placeholder={'এইয় মেট...'}
                        name='bnMetaDescription'
                        isError={
                          (touched.bnMetaDescription &&
                            errors.bnMetaDescription) ||
                          (!isSubmitting &&
                            addCategoryState.error['error'][
                              'bnMetaDescription'
                            ])
                        }
                        errorString={
                          (touched.bnMetaDescription &&
                            errors.bnMetaDescription) ||
                          (!isSubmitting &&
                            addCategoryState.error['error'][
                              'bnMetaDescription'
                            ])
                        }
                        onChange={(e: any) => {
                          handleChange(e);
                          setFieldTouched('bnMetaDescription');
                        }}
                      />

                      <h3 className='inputFieldLabel'>Meta Tags </h3>

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

                      <h3 className='inputFieldLabel'>BN Meta Tags </h3>

                      <MetaTags
                        // @ts-ignore
                        setTags={setBnTags}
                        tags={bnTags}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
                loading={addCategoryState.isLoading}
                type='link'
                icon={<CheckOutlined />}
              >
                Update
              </Button>
            </div>

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
    </>
  );
};

const AddNewCategory = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  categoryList,
  setcategoryList,
  categoryDetailData,
  categoryList2
}: Props) => {
  const handleCancel = () => {
    setAddNewCategoryVisible(false);
  };
  return (
    <Modal
      destroyOnClose={true}
      style={{
        top: '40px',
      }}
      bodyStyle={{
        margin: 0,
        padding: 0,
      }}
      title='Edit Category'
      visible={addNewCategoryVisible}
      onCancel={handleCancel}
      footer={false}
      okText='Update'
      width={'70vw'}
      okButtonProps={{
        // loading: isSubmitting,
        htmlType: 'submit',
      }}
    >
      <ModalChildComponent
        addNewCategoryVisible={addNewCategoryVisible}
        setAddNewCategoryVisible={setAddNewCategoryVisible}
        categoryList={categoryList}
        setcategoryList={setcategoryList}
        categoryDetailData={categoryDetailData}
        categoryList2={categoryList2}
      />
    </Modal>
  );
};

export default AddNewCategory;
