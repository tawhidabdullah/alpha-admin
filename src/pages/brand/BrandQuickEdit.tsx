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
  Spin,
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
import MetaTags from '../category/MetaTags';

const validationSchema = Yup.object().shape({
  // name: Yup.string()
  //   .label('Name')
  //   .required('Name is required')
  //   .min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Brand Updated',
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
};

interface Props {
  brandDetailData?: any;
  brandEditVisible?: any;
  setBrandEditVisible?: any;
  brandList?: any;
  setBrandList?: any;
}

const ModalComponentChildItem = ({
  brandDetailData,
  brandEditVisible,
  setBrandEditVisible,
  brandList,
  setBrandList,
}) => {
  const [updateBrandState, handleUpdateBrandFetch] = useHandleFetch(
    {},
    'updateBrand'
  );
  const [brandDetailState, handleBrandDetailFetch] = useHandleFetch(
    {},
    'brandDetail'
  );

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

  const [myImages, setmyImages]: any = useState(false);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [myGoddamnImages, setMyGoddamnImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);

  useEffect(() => {
    const getBrandDetail = async () => {
      const brandDetailRes = await handleBrandDetailFetch({
        urlOptions: {
          placeHolders: {
            id: brandDetailData.id,
          },
        },
      });
    };

    getBrandDetail();
  }, [brandDetailData]);

  useEffect(() => {
    if (
      brandDetailState.data &&
      Object.keys(brandDetailState.data).length > 0
    ) {
      const images = brandDetailState.data.image;
      if (images && images.length > 0) {
        setmyImages(images);
        setMyGoddamnImages(images);
      }

      if (brandDetailState.data.cover && brandDetailState.data.cover['id']) {
        // @ts-ignore
        setmyImages([brandDetailState.data.cover]);
        setCoverImageId(brandDetailState.data.cover['id']);
      }
    }
  }, [brandDetailState.data]);

  const handleDetachSingleImage = async (id) => {
    await handleDetachImageFromItemSingleFetch({
      urlOptions: {
        placeHolders: {
          imageId: id,
          collection: 'brand',
          itemId: brandDetailData.id,
        },
      },
    });
  };

  const handleSetImageAsThumnail = async (image) => {
    const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
      urlOptions: {
        placeHolders: {
          imageId: image.id,
          collection: 'brand',
          itemId: brandDetailData.id,
        },
      },
    });

    // @ts-ignore
    if (thumbnailRes && thumbnailRes.status === 'ok') {
      openSuccessNotification('Set as thumbnail!');
      // const positionInBrand = () => {
      //     return brandList.map(item => item.id).indexOf(brandDetailData.id);
      // }

      // const index = positionInBrand();

      // const prevItem = brandList.find(item => item.id === productRecord.id);

      // if (prevItem) {
      //     const updatedItem = Object.assign({}, brandList[index], { ...prevItem, cover: image.cover });
      //     const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];
      //     setBrandList(updateBrandList);
      // }
    } else {
      openErrorNotification("Couldn't set as thumbnail, Something went wrong");
    }
  };

  const handleSubmit = async (values: any, actions: any) => {
    console.log('myReadyToGoImages', myImages);

    if (brandDetailData && Object.keys(brandDetailData).length > 0) {
      // @ts-ignore
      const images =
        myImages && myImages.length > 0 ? myImages.map((item) => item.id) : [];

      if (images[0] && images.length > 1) {
        await handleAttachImageToItemMultipleFetch({
          urlOptions: {
            placeHolders: {
              collection: 'brand',
              itemId: brandDetailData.id,
            },
          },
          body: {
            image: images,
          },
        });
      } else if (images[0] && images.length < 1) {
        await handleAttachImageToItemSingleFetch({
          urlOptions: {
            placeHolders: {
              imageId: images[0].id,
              collection: 'brand',
              itemId: brandDetailData.id,
            },
          },
        });
      }
    }

    const updateBrandRes = await handleUpdateBrandFetch({
      urlOptions: {
        placeHolders: {
          id: brandDetailData.id,
        },
      },
      body: {
        name: values.name,
        description: values.description,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: tags && tags.length > 0 ? tags.join(',') : '',
        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags: bnTags && bnTags.length > 0 ? bnTags.join(',') : '',
          name: values.bnName,
          description: values.bnDescription,
        },
      },
    });

    // @ts-ignore
    if (updateBrandRes && updateBrandRes.status === 'ok') {
      console.log('updateBrandRes', updateBrandRes);

      const positionInTag = () => {
        return brandList.map((item) => item.id).indexOf(values.id);
      };

      const index = positionInTag();

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

      // @ts-ignore
      const updatedItem = Object.assign({}, brandList[index], {
        ...brandDetailData,
        id: brandDetailData['id'] || '',
        key: brandDetailData['id'] || '',
        name: updateBrandRes['name'] || '',
        description: updateBrandRes['description'] || '',
        // @ts-ignore
        ...updateBrandRes,
        cover: getCover(coverImageId),
      });
      const updateTagList = [
        ...brandList.slice(0, index),
        updatedItem,
        ...brandList.slice(index + 1),
      ];
      setBrandList(updateTagList);

      openSuccessNotification('Brand Updated!');
      setBrandEditVisible(false);

      // const positionInBrand = () => {
      //     return brandList.map(item => item.id).indexOf(productRecord.id);
      // }

      // const index = positionInBrand();
      // const updatedItem = Object.assign({}, brandList[index], { ...updateBrandRes });
      // console.log('updateBrandList', updatedItem)

      // const updateBrandList = [...brandList.slice(0, index), updatedItem, ...brandList.slice(index + 1)];

      // setBrandList(updateBrandList);

      actions.resetForm();
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!updateBrandState['isLoading']) {
      const error = updateBrandState['error'];
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
  }, [updateBrandState]);

  const onSwitchChange = (checked: any) => {
    // console.log(checked);
  };

  const handleCancel = (e: any) => {
    setBrandEditVisible(false);
    setBnTags([]);
    setTags([]);
    setCoverImageId('');
    setvisibleMedia(false);
    setmyImages(false);
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

  console.log('myImages', myImages);

  useEffect(() => {
    if (brandDetailData && Object.keys(brandDetailData).length > 0) {
      const metaTags =
        brandDetailData.metaTags && brandDetailData.metaTags.split(',');

      console.log('localMetaTags', metaTags);

      const bnMetaTags =
        brandDetailData.bn &&
        brandDetailData.bn['metaTags'] &&
        brandDetailData.bn['metaTags'].split(',');
      setTags(metaTags || []);
      setBnTags(bnMetaTags || []);
    }
  }, []);

  console.log('brandEdit', brandDetailData);

  useEffect(() => {
    console.log('thumnail', myImages);
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
      console.log('thumnail2', myImages);

      if (coverImageId !== myImages[0].id) {
        setCoverImageId(myImages[0].id);
        // set thumbnail with server for edits
        handleSetImageAsThumnail(myImages[0]);
      }
    }
  }, [myImages]);

  useEffect(() => {
    if (brandDetailData && Object.keys(brandDetailData).length > 0) {
      const metaTags =
        brandDetailData.metaTags && brandDetailData.metaTags.split(',');

      console.log('localMetaTags', metaTags);

      const bnMetaTags =
        brandDetailData.bn &&
        brandDetailData.bn['metaTags'] &&
        brandDetailData.bn['metaTags'].split(',');
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
          ...brandDetailData,
          ...(brandDetailData &&
            Object.keys(brandDetailData).length > 0 && {
              bnMetaTitle:
                brandDetailData['bn'] &&
                brandDetailData['bn'].metaTitle &&
                brandDetailData['bn'].metaTitle,
              bnMetaDescription:
                brandDetailData['bn'] &&
                brandDetailData['bn'].metaDescription &&
                brandDetailData['bn'].metaDescription,
              bnName:
                brandDetailData['bn'] &&
                brandDetailData['bn'].name &&
                brandDetailData['bn'].name,
              bnDescription:
                brandDetailData['bn'] &&
                brandDetailData['bn'].description &&
                brandDetailData['bn'].description,
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
                    <h3>Brand Information *</h3>
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
                      name='name'
                      placeHolder={''}
                      isError={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['name'])
                      }
                      errorString={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['name'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('name');
                      }}
                    />

                    <Input
                      label='BN Name'
                      value={values.bnName}
                      placeHolder={''}
                      name='bnName'
                      isError={
                        (touched.bnName && errors.bnName) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['bnName'])
                      }
                      errorString={
                        (touched.bnName && errors.bnName) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['bnName'])
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
                      placeholder={'This brand...'}
                      isError={
                        (touched.description && errors.description) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['description'])
                      }
                      errorString={
                        (touched.description && errors.description) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['description'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('description');
                      }}
                    />

                    <TextArea
                      label='BN Description'
                      value={values.bnDescription}
                      placeholder={'এই ব্র্যান্ড...'}
                      name='bnDescription'
                      isError={
                        (touched.bnDescription && errors.bnDescription) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['bnDescription'])
                      }
                      errorString={
                        (touched.bnDescription && errors.bnDescription) ||
                        (!isSubmitting &&
                          updateBrandState.error['error']['bnDescription'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('bnDescription');
                      }}
                    />
                  </div>
                </div>

                <div className='addProductGridContainer__image'>
                  <div className='addProductGridContainer__item-header'>
                    <h3>Cover</h3>

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
                    {brandDetailState.isLoading && (
                      <div
                        style={{
                          padding: '20px 0',
                        }}
                      >
                        <Spin />
                      </div>
                    )}
                    {brandDetailState.done && (
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
                                    // setCoverImageId(image.id);
                                    // handleSetImageAsThumnail(image);
                                    setvisibleMedia(true);
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

                                {/* {coverImageId === image.id ? (
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
                          )} */}
                              </div>
                            );
                          })}

                        {!myImages ||
                        // @ts-ignore
                        (myImages && !(myImages && myImages.length > 0)) ? (
                          <>
                            <Tooltip title={'Attach images'}>
                              <div
                                onClick={() => {
                                  setvisibleMedia(true);
                                }}
                                className='aboutToUploadImagesContainer__uploadItem'
                              >
                                <FileImageFilled />
                                <span className='aboutToUploadImagesContainer__uploadItem-plus'>
                                  <PlusOutlined />
                                </span>
                              </div>
                            </Tooltip>
                          </>
                        ) : (
                          ''
                        )}
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
                            updateBrandState.error['error']['metaTitle'])
                        }
                        errorString={
                          (touched.metaTitle && errors.metaTitle) ||
                          (!isSubmitting &&
                            updateBrandState.error['error']['metaTitle'])
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
                            updateBrandState.error['error']['bnMetaTitle'])
                        }
                        errorString={
                          (touched.bnMetaTitle && errors.bnMetaTitle) ||
                          (!isSubmitting &&
                            updateBrandState.error['error']['bnMetaTitle'])
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
                            updateBrandState.error['error']['metaDescription'])
                        }
                        errorString={
                          (touched.metaDescription && errors.metaDescription) ||
                          (!isSubmitting &&
                            updateBrandState.error['error']['metaDescription'])
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
                            updateBrandState.error['error'][
                              'bnMetaDescription'
                            ])
                        }
                        errorString={
                          (touched.bnMetaDescription &&
                            errors.bnMetaDescription) ||
                          (!isSubmitting &&
                            updateBrandState.error['error'][
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
                onClick={() => setBrandEditVisible(false)}
                type='default'
              >
                Cancel
              </Button>

              <Button
                className='btnPrimaryClassNameoutline'
                onClick={handleSubmit}
                loading={updateBrandState.isLoading}
                type='link'
                icon={<CheckOutlined />}
              >
                Update
              </Button>
            </div>

            <MediaLibrary
              setvisible={setvisibleMedia}
              visible={visibleMedia}
              setmyImages={setmyImages}
              myImages={myImages}
              myGoddamnImages={myGoddamnImages}
              setMyGoddamnImages={setMyGoddamnImages}
              isModalOpenForImages={false}
            />
          </>
        )}
      </Formik>
    </>
  );
};

const AddNewBrand = ({
  brandDetailData,
  brandEditVisible,
  setBrandEditVisible,
  brandList,
  setBrandList,
}: Props) => {
  const handleCancel = () => {
    setBrandEditVisible(false);
  };

  return (
    <Modal
      style={{
        top: '40px',
      }}
      width={'70vw'}
      bodyStyle={{
        margin: 0,
        padding: 0,
      }}
      title='Brand Edit'
      destroyOnClose={true}
      visible={brandEditVisible}
      onCancel={handleCancel}
      footer={false}
    >
      <ModalComponentChildItem
        brandDetailData={brandDetailData}
        brandEditVisible={brandEditVisible}
        setBrandEditVisible={setBrandEditVisible}
        brandList={brandList}
        setBrandList={setBrandList}
      />
    </Modal>
  );
};

export default AddNewBrand;
