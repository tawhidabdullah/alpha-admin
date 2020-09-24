// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import hhooks
import { useHandleFetch } from '../../hooks';

// import lib
import { useParams } from 'react-router-dom';

// import third party ui lib
import {
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Modal,
  Empty,
  Steps,
  Tooltip,
} from 'antd';

import {
  CheckCircleOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  CaretRightFilled,
  UserOutlined,
  InfoCircleOutlined,
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
  PlusOutlined,
  FileImageFilled,
} from '@ant-design/icons';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import MetaTags from '../../pages/category/MetaTags';

const { Option } = Select;
const { Step } = Steps;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Page Updated',
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

const validationSchema = Yup.object().shape({});

const initialValues = {
  name: '',
  bnName: '',
  content: '',
  bnContent: '',
  metaTitle: '',
  bnMetaTitle: '',
  metaDescription: '',
  bnMetaDescription: '',
  metaTags: '',
  bnMetaTags: '',
  url: '',
};

const steps = [
  {
    title: 'Order Information',
    content: '',
    // description: 'Add Customer & Products'
  },
  {
    title: 'Billing Address',
  },
  {
    title: 'Confirm Order',
    content: '',
  },
];

interface Props {}

const AddNewPage = ({}: Props) => {
  const [addPageState, handleAddPageFetch] = useHandleFetch({}, 'updatePage');
  const [content, setContent] = useState('');
  const [bnContent, setBnContent] = useState('');
  const [myImages, setmyImages] = useState(false);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);

  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'pageDetail'
  );
  const [tagDetailData, setTagDetailData] = useState({});
  const [
    setImageAsThumbnailToItemState,
    handleSetImageAsThumbnailToItemFetch,
  ] = useHandleFetch({}, 'setImageAsThumbnailToItem');
  const [
    detachImageFromItemSingleState,
    handleDetachImageFromItemSingleFetch,
  ] = useHandleFetch({}, 'detachImageFromItemSingle');

  const params = useParams();
  const tagId = params['id'];

  useEffect(() => {
    const getBrandDetail = async () => {
      const tagDetailRes = await handleTagDetailFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });

      // @ts-ignore
      if (tagDetailRes) {
        console.log('tagDetailRes', tagDetailRes);
        // @ts-ignore
        setTagDetailData(tagDetailRes);
      }
    };

    getBrandDetail();
  }, [tagId]);

  useEffect(() => {
    if (tagDetailData && Object.keys(tagDetailData).length > 0) {
      if (tagDetailData.cover && tagDetailData.cover['id']) {
        // @ts-ignore
        setmyImages([tagDetailData.cover]);
        setCoverImageId(tagDetailData.cover['id']);
      }
    }
  }, [tagDetailData]);

  useEffect(() => {
    if (tagDetailData && Object.keys(tagDetailData).length > 0) {
      setContent(tagDetailData['content'] || '');
      setBnContent(
        tagDetailData['bn'] && tagDetailData['bn']['content']
          ? tagDetailData['bn']['content']
          : ''
      );
    }
  }, [tagDetailData]);

  const handleAddPageSubmit = async (values: any, actions: any) => {
    const addOrderRes = await handleAddPageFetch({
      urlOptions: {
        placeHolders: {
          id: tagDetailData._id,
        },
      },
      body: {
        name: values.name.trim(),
        content: content,
        url: values.url.trim(),
        cover: myImages ? myImages[0] && myImages[0].id : '',
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: tags && tags.length > 0 ? tags.join(',') : '',
        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags: bnTags && bnTags.length > 0 ? bnTags.join(',') : '',
          name: values.bnName.trim(),
          content: bnContent,
        },
      },
    });

    // @ts-ignore
    if (addOrderRes && addOrderRes.status === 'ok') {
      // openSuccessNotification();
      // setCoverImageId('');
      // setBnTags([]);
      // setTags([]);
      // setContent('');
      // setBnContent('');
      // setvisibleMedia();
      // setmyImages([]);
      // actions.resetForm();
    } else {
      openErrorNotification("Couldn't Update page, Something went wrong");
    }

    actions.setSubmitting(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!isValid || !values.name || !values.pickUpLocation || !values.time) {
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

  const handleSetImageAsThumnail = async (image) => {
    const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
      urlOptions: {
        placeHolders: {
          imageId: image.id,
          collection: 'page',
          itemId: tagDetailData.id,
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

  useEffect(() => {
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
      if (coverImageId !== myImages[0].id) {
        setCoverImageId(myImages[0].id);
        handleSetImageAsThumnail(myImages[0]);
      }
    }
  }, [myImages]);

  useEffect(() => {
    if (!addPageState['isLoading']) {
      const error = addPageState['error'];
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
      !addPageState['isLoading'] &&
      Object.keys(addPageState.data).length > 0
    ) {
      if (addPageState['data']['status'] === 'ok') {
        openSuccessNotification('Page Updated Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })

        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [addPageState]);

  useEffect(() => {
    if (tagDetailData && Object.keys(tagDetailData).length > 0) {
      const metaTags =
        tagDetailData.metaTags && tagDetailData.metaTags.split(',');

      console.log('localMetaTags', metaTags);

      const bnMetaTags =
        tagDetailData.bn &&
        tagDetailData.bn['metaTags'] &&
        tagDetailData.bn['metaTags'].split(',');
      setTags(metaTags || []);
      setBnTags(bnMetaTags || []);
    }
  }, []);

  const handleDetachSingleImage = async (id) => {
    console.log('dure', id);
    console.log('dure2', tagDetailData);
    await handleDetachImageFromItemSingleFetch({
      urlOptions: {
        placeHolders: {
          imageId: id,
          collection: 'page',
          itemId: tagDetailData.id,
        },
      },
    });
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleAddPageSubmit(values, actions)}
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
          <div className='addNewPageContainer'>
            <h3 className='addNewPageContainer__heading'>Edit Page</h3>

            <div className='addNewPageContainer__header'>
              <div className='dubbleRowInputs'>
                <div className='dubbleRowInputs__item'>
                  <Input
                    label='Title'
                    value={values.name}
                    name='name'
                    placeHolder='About us,Contact us'
                    isError={
                      (touched.name && errors.name) ||
                      (!isSubmitting && addPageState.error['error']['name'])
                    }
                    errorString={
                      (touched.name && errors.name) ||
                      (!isSubmitting && addPageState.error['error']['name'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('name');
                    }}
                  />
                </div>
                <div className='dubbleRowInputs__item'>
                  <Input
                    label='BN Title'
                    value={values.bnName}
                    placeHolder={'ব্লগ...'}
                    name='bnName'
                    isError={
                      (touched.bnName && errors.bnName) ||
                      (!isSubmitting && addPageState.error['error']['bnName'])
                    }
                    errorString={
                      (touched.bnName && errors.bnName) ||
                      (!isSubmitting && addPageState.error['error']['bnName'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnName');
                    }}
                  />
                </div>
              </div>

              <Input
                label='URL'
                value={values.url}
                name='url'
                isError={
                  (touched.url && errors.url) ||
                  (!isSubmitting && addPageState.error['error']['url'])
                }
                errorString={
                  (touched.url && errors.url) ||
                  (!isSubmitting && addPageState.error['error']['url'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('url');
                }}
              />

              <h3 className='inputFieldLabel'>Thumbnail</h3>

              <div className='aboutToUploadImagesContainer'>
                {tagDetailData && Object.keys(tagDetailData).length > 0 && (
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
                                setvisibleMedia(true);
                                // handleSetImageAsThumnail(image);
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

              <p
                style={{
                  color: '#ff4d4f',
                  marginTop: '-15px',
                }}
              >
                {addPageState.error['error']['cover']}
              </p>
            </div>
            <div className='addNewPageContainer__body'>
              <h3 className='inputFieldLabel'>Content</h3>

              <CKEditor
                editor={ClassicEditor}
                data={content}
                onInit={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
                onBlur={(event, editor) => {
                  console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                  console.log('Focus.', editor);
                }}
              />

              <div
                style={{
                  marginTop: '15px',
                }}
              ></div>

              <h3 className='inputFieldLabel'>BN Content</h3>

              <CKEditor
                editor={ClassicEditor}
                data={bnContent}
                onInit={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setBnContent(data);
                }}
                onBlur={(event, editor) => {
                  console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                  console.log('Focus.', editor);
                }}
              />
            </div>

            <div
              style={{
                marginTop: '20px',
              }}
            ></div>

            <div className='addNewPageContainer__header'>
              <div className='dubbleRowInputs'>
                <div className='dubbleRowInputs__item'>
                  <Input
                    label='Meta Title'
                    value={values.metaTitle}
                    name='metaTitle'
                    isError={
                      (touched.metaTitle && errors.metaTitle) ||
                      (!isSubmitting &&
                        addPageState.error['error']['metaTitle'])
                    }
                    errorString={
                      (touched.metaTitle && errors.metaTitle) ||
                      (!isSubmitting &&
                        addPageState.error['error']['metaTitle'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('metaTitle');
                    }}
                  />
                </div>
                <div className='dubbleRowInputs__item'>
                  <Input
                    label='BN Meta Title'
                    value={values.bnMetaTitle}
                    placeHolder={''}
                    name='bnMetaTitle'
                    isError={
                      (touched.bnMetaTitle && errors.bnMetaTitle) ||
                      (!isSubmitting &&
                        addPageState.error['error']['bnMetaTitle'])
                    }
                    errorString={
                      (touched.bnMetaTitle && errors.bnMetaTitle) ||
                      (!isSubmitting &&
                        addPageState.error['error']['bnMetaTitle'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnMetaTitle');
                    }}
                  />
                </div>
              </div>

              <div className='dubbleRowInputs'>
                <div className='dubbleRowInputs__item'>
                  <TextArea
                    label='Meta description'
                    value={values.metaDescription}
                    placeholder={'meta...'}
                    name='metaDescription'
                    isError={
                      (touched.metaDescription && errors.metaDescription) ||
                      (!isSubmitting &&
                        addPageState.error['error']['metaDescription'])
                    }
                    errorString={
                      (touched.metaDescription && errors.metaDescription) ||
                      (!isSubmitting &&
                        addPageState.error['error']['metaDescription'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('metaDescription');
                    }}
                  />
                </div>
                <div className='dubbleRowInputs__item'>
                  <TextArea
                    label='BN Meta Description'
                    value={values.bnMetaDescription}
                    placeholder={'এইয় মেট...'}
                    name='bnMetaDescription'
                    isError={
                      (touched.bnMetaDescription && errors.bnMetaDescription) ||
                      (!isSubmitting &&
                        addPageState.error['error']['bnMetaDescription'])
                    }
                    errorString={
                      (touched.bnMetaDescription && errors.bnMetaDescription) ||
                      (!isSubmitting &&
                        addPageState.error['error']['bnMetaDescription'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnMetaDescription');
                    }}
                  />
                </div>
              </div>

              <div className='dubbleRowInputs'>
                <div className='dubbleRowInputs__item'>
                  <h3 className='inputFieldLabel'>Meta Tags</h3>

                  <MetaTags
                    // @ts-ignore
                    setTags={setTags}
                    tags={tags}
                  />
                </div>
                <div className='dubbleRowInputs__item'>
                  <h3 className='inputFieldLabel'>BN Meta Tags</h3>

                  <MetaTags
                    // @ts-ignore
                    setTags={setBnTags}
                    tags={bnTags}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
              }}
            ></div>

            <Button
              loading={addPageState.isLoading}
              onClick={(e: any) => handleSubmit(e)}
              className='btnPrimaryClassNameoutline'
            >
              Update page
            </Button>
          </div>

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

export default AddNewPage;

/*

<div className="addNewPageContainer">
			<h3 className='addNewPageContainer__heading'>
				Add New Order
			</h3>
			<div className='addNewPageContainer__header'>

			</div>
			<div className='addNewPageContainer__body'>

			</div>
		</div>


*/
