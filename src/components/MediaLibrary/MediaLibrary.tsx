// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useQueryCache } from 'react-query';

// import libraries
import {
  Upload,
  Button,
  Modal,
  Tabs,
  message,
  notification,
  Popconfirm,
  Menu,
  Dropdown,
  Spin,
  Pagination
} from 'antd';
import reqwest from 'reqwest';
import { Formik } from 'formik';
import moment from 'moment';
// import * as Yup from 'yup';


import {
  CheckOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  EllipsisOutlined,
  FileImageOutlined,
  DeleteOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import Empty from '../../components/Empty';

// import hooks
import { useHandleFetch, usePaginate } from '../../hooks';

// import configs
import config from '../../config.json';

const { Dragger } = Upload;
const { TabPane } = Tabs;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Category Updated',
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

interface Props {
  visible: boolean;
  setvisible: (isVisible: any) => void;
  setmyImages?: any;
  setmyThumbnailImage?: any;
  isModalOpenForThumbnail?: boolean;
  isModalOpenForImages?: boolean;
  myImages?: any;
  myThumbnailImage?: any;
  setMyGoddamnImages?: any;
  myGoddamnImages?: any;
}

const MediaLibrary = ({
  visible,
  setvisible,
  setmyImages,
  isModalOpenForImages,
  isModalOpenForThumbnail,
  setmyThumbnailImage,
  myImages,
  myThumbnailImage,
  ...rest
}: Props) => {
  const [mediaLibTagActiveKey, setmediaLibTagActiveKey] = useState('2');
  const [fileList, setfileList] = useState([]);
  const [uploading, setuploading] = useState(false);
  const [selectedimages, setselectedImages] = useState([]);
  const [activeImageItem, setactiveImageItem] = useState(false);
  const [updateMediaLibrary, handleUpdateMediaLibraryFetch] = useHandleFetch(
    {},
    'updateImageFromLibrary'
  );
  const [
    imageListFromLibraryState,
    handleImageListFromLibraryFetch,
  ] = useHandleFetch({}, 'ImageListFromLibrary');

  const imageListState = usePaginate('ImageListFromLibrary', {
    urlOptions: {
      params: {
        limitNumber: 11,
        sortItem: 'added',
        sortOrderValue: '-1',
      }
    },
  }, `image`);

  const cache = useQueryCache();



  const [
    deleteImageFromLibraryFetchState,
    handleDeleteImageFromLibraryFetch,
  ] = useHandleFetch({}, 'deleteImageFromLibrary');
  const [localImageList, setLocalImageList] = useState([]);
  const [isDoneOk, setisDoneOk] = useState(false);

  const handleDeleteImageFromImageLibrary = async (id) => {
    const deleteImageLibraryItemRes = await handleDeleteImageFromLibraryFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (
      deleteImageLibraryItemRes &&
      deleteImageLibraryItemRes.status === 'ok'
    ) {

      const queries = cache.getQueries();
      const queriesKeyMap = queries.filter(query => {
        const queryKey = query?.queryKey;
        // @ts-ignore
        return queryKey?.[0] === 'image' && typeof queryKey?.[1] === 'number'
      }).map(query => query?.queryKey);

      const idQueryKey = queriesKeyMap.find(key => {
        let isKey = false;
        // @ts-ignore
        if (cache.getQueryData(key)?.data.find(item => item.id === id)) {
          isKey = true;
        }
        return isKey;
      })
      if (idQueryKey?.[0]) {
        // @ts-ignore
        cache.setQueryData(idQueryKey, ((prev) => {
          return {
            // @ts-ignore
            ...prev,
            // @ts-ignore
            data: prev.data?.filter(item => item.id !== id),
          }
        }))
      }
      openSuccessNotification('Imaged Deleted');
      // const newImageList = localImageList.filter((item) => item.id !== id);
      // setLocalImageList(newImageList);
    }
  };

  const getImageList = async () => {
    const imageListRes = await handleImageListFromLibraryFetch({
      urlOptions: {
        params: {
          limitNumber: 10000,
          sortItem: 'added',
          sortOrderValue: '-1',
        },
      },
    });

    // @ts-ignore
    if (imageListRes) {
      // @ts-ignore
      setLocalImageList(imageListRes);
    }

    // console.log('imageListRes', imageListRes);
  };

  useEffect(() => {
    // getImageList();
  }, []);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('images', file, file.name);
    });

    setuploading(true);

    //  const addImageToLibraryRes = awAddait handleMediaLibraryFetch({
    // 	body: formData
    //   });

    //   console.log('addImageToLibraryRes',addImageToLibraryRes)

    // You can use any AJAX library you like
    reqwest({
      url: `${config.baseURL}/admin/api/image/add`,
      method: 'post',
      processData: false,
      data: formData,
      withCredentials: true,
      success: (res) => {
        console.log('successResOfMediaLib', res);
        setfileList([]);
        setuploading(false);

        const queries = cache.getQueries();
        const queriesKeyMap = queries.filter(query => {
          const queryKey = query?.queryKey;
          // @ts-ignore
          return queryKey?.[0] === 'image' && typeof queryKey?.[1] === 'number'
        }).map(query => query?.queryKey);

        const firstQueryKey = queriesKeyMap?.[0];


        if (firstQueryKey) {
          // @ts-ignore
          cache.setQueryData(firstQueryKey, ((prev) => {
            let newImageItem = res?.inserted?.[0];
            newImageItem = {
              ...newImageItem,
              id: newImageItem._id,
              cover: `${config.baseURL}${newImageItem?.thumbnail}`
            }
            return {
              // @ts-ignore
              ...prev,
              // @ts-ignore
              data: [newImageItem, ...prev?.data],
            }
          }))
        }






        getImageList();
        message.success('upload successfully.');

        if (res && res.inserted && res.inserted[0]) {
          setactiveImageItem({
            cover: `${config['baseURL']}${res.inserted[0].thumbnail && res.inserted[0].thumbnail
              }`,
            ...res.inserted[0],
          });
        }
        setmediaLibTagActiveKey('2');

        /* 
    added: "2020-09-22T07:53:43.710Z"
    alt: ""
    caption: ""
    cover: "http://localhost:5000\images\library\thumbnail\24582-group-2497.jpg"
    id: "5f69ad8786d83f2becfe2d10"
    labels: []
    name: "Group 2497.png"
    title: ""
  	
    */
      },
      error: () => {
        setuploading(false);
        message.error('upload failed.');
      },
    });
  };

  const handleOk = (e: any) => {
    if (isModalOpenForImages) {
      setmyImages(selectedimages);
      setisDoneOk(true);
    } else {
      console.log('');
      console.log('selectedimages,,,', selectedimages[0]);
      setmyImages(
        selectedimages && selectedimages[0] ? [selectedimages[0]] : []
      );
      setisDoneOk(true);
    }
    setvisible(false);
  };

  const handleCancel = (e: any) => {
    setvisible(false);
  };

  useEffect(() => {
    if (myImages && myImages.length > 0) setselectedImages([...myImages]);
  }, [myImages]);

  useEffect(() => {
    if (isDoneOk && isModalOpenForImages && myImages) {
      setselectedImages([...myImages]);
    }
  }, [myImages, isDoneOk]);

  useEffect(() => {
    if (isDoneOk) {
      // console.log('myThumbnail', myThumbnailImage)
      // setselectedImages([...myThumbnailImage]);
    }
  }, [myThumbnailImage, isDoneOk]);

  const uploadProps = {
    //  listType: 'picture',
    multiple: true,
    onRemove: (file) => {
      setfileList((filelist) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setfileList((filelist) => {
        const xflelist = filelist;
        return [...xflelist, file];
      });
      return false;
    },
    fileList,
  };

  const handleAddToSelectedList = (image, id) => {
    if (selectedimages && selectedimages.length > 0) {
      const isImageExist = selectedimages.find((image) => image.id === id);
      if (!isImageExist) {
        setselectedImages([image, ...selectedimages]);
        setactiveImageItem(image);
      } else {
        const newselectedImages = selectedimages.filter(
          (image) => image.id !== id
        );
        setselectedImages(newselectedImages);
      }
    } else {
      setselectedImages([image, ...selectedimages]);
      setactiveImageItem(image);
    }
  };

  const getisSelectedImage = (id) => {
    if (selectedimages && selectedimages.length > 0) {
      const isImageExist = selectedimages.find((image) => image.id === id);
      if (isImageExist) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const handleUpdateSubmit = async (values, actions) => {
    const updateImageLibraryItemRes = await handleUpdateMediaLibraryFetch({
      body: {
        id: values.id,
        alt: values.alt,
        title: values.title,
        caption: values.caption,
        labels: values.labels,
      },
    });

    // @ts-ignore
    if (
      updateImageLibraryItemRes &&
      updateImageLibraryItemRes.status === 'ok'
    ) {
      openSuccessNotification('Image Updated');

      const queries = cache.getQueries();
      const queriesKeyMap = queries.filter(query => {
        const queryKey = query?.queryKey;
        // @ts-ignore
        return queryKey?.[0] === 'image' && typeof queryKey?.[1] === 'number'
      }).map(query => query?.queryKey);

      const idQueryKey = queriesKeyMap.find(key => {
        let isKey = false;
        // @ts-ignore
        if (cache.getQueryData(key)?.data.find(item => item.id === id)) {
          isKey = true;
        }
        return isKey;
      })
      if (idQueryKey?.[0]) {
        // @ts-ignore
        cache.setQueryData(idQueryKey, ((prev) => {
          const localImageList = prev?.data;
          const positionInImageList = () => {
            return localImageList.map((item) => item.id).indexOf(values.id);
          };

          const index = positionInImageList();

          // @ts-ignore
          const updatedItem = Object.assign({}, localImageList[index], {
            ...updateImageLibraryItemRes,
          });
          const updateImageList = [
            ...localImageList.slice(0, index),
            updatedItem,
            ...localImageList.slice(index + 1),
          ];


          return {
            // @ts-ignore
            ...prev,
            // @ts-ignore
            data: updateImageList,
          }
        }))
      }





      // setLocalImageList(updateImageList);
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  const getisUpdateSubmitButtonDisabled = (values, isValid) => {
    // if(!values.alt || !values.title || !values.title || !values.caption || !isValid){
    // 	return true;
    // }
    if (!isValid) {
      return true;
    }
    return false;
  };

  // console.log('selectedimages', selectedimages)

  const ImageItemMenu = (
    handleDeleteImageFromImageLibrary,
    id,
    handleAddToSelectedList,
    image
  ) => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => handleAddToSelectedList(image, id)}
          key='1'
          icon={<CheckOutlined />}
        >
          Select
        </Menu.Item>

        <Menu.Item
          onClick={() => handleDeleteImageFromImageLibrary(id)}
          key='1'
          icon={<DeleteOutlined color='red' />}
        >
          Delete
        </Menu.Item>
      </Menu>
    );
  };


  return (
    <>
      <Modal
        style={{
          top: '40px',
        }}
        title='Media Library'
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'80vw'}
        bodyStyle={{
          margin: '0',
          padding: '0',
        }}
        okText='Done'
      >
        <div className='mediaLibraryBodyContainer'>
          <div className='mediaLibraryBodyContainer-left'>
            <Tabs
              onChange={(value) => {
                setmediaLibTagActiveKey(`${value}`);
              }}
              activeKey={mediaLibTagActiveKey}
              type='card'
              size='middle'
            >
              <TabPane tab='Upload New Media' key='1'>
                <div className='mediaLibraryBodyContainer-left-header'>
                  <div>
                    <Dragger
                      className='upload-list-inline'
                      listType='picture'
                      style={{
                        background: '#fff',
                        borderRadius: '8px',
                      }}
                      {...uploadProps}
                    >
                      <p className='ant-upload-drag-icon'>
                        <FileImageOutlined />
                      </p>
                      <p className='ant-upload-text'>
                        Click or drag file to this area to upload
                      </p>
                      <p className='ant-upload-hint'>
                        Support for a single or bulk upload.
                      </p>
                    </Dragger>
                  </div>
                </div>

                <Button
                  className='btnPrimaryClassNameoutline'
                  type='primary'
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                  icon={<ArrowUpOutlined />}
                  style={{
                    marginTop: '20px',
                    marginBottom: '10px',
                  }}
                >
                  Upload
                </Button>
              </TabPane>
              <TabPane tab='Media Library' key='2'>
                <div className='mediaLibraryBodyContainer-left-imageListContainer'>
                  {imageListState.isSuccess &&
                    imageListState?.resolvedData?.data.length > 0 &&
                    imageListState?.resolvedData?.data.map((image) => {
                      return (
                        <div
                          key={image.id}
                          className='mediaLibraryBodyContainer-left-imageListContainer-item'
                        >
                          {getisSelectedImage(image.id) ? (
                            <div className='mediaLibraryBodyContainer-left-imageListContainer-item-icon'>
                              <CheckOutlined />
                            </div>
                          ) : (
                              ''
                            )}

                          <Dropdown
                            overlay={() =>
                              ImageItemMenu(
                                handleDeleteImageFromImageLibrary,
                                image.id,
                                handleAddToSelectedList,
                                image
                              )
                            }
                            placement='bottomRight'
                          >
                            <div className='mediaLibraryBodyContainer-left-imageListContainer-item-menu'>
                              <EllipsisOutlined />
                            </div>
                          </Dropdown>

                          <img
                            onClick={() => {
                              handleAddToSelectedList(image, image.id);
                            }}
                            src={image.cover}
                            alt='img'
                          />
                        </div>
                      );
                    })}

                  {imageListState?.isError ||
                    !(imageListState?.resolvedData?.data?.length > 0) && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <Empty title='No Image Found in the library' />
                      </div>
                    )}

                  {imageListState.isLoading && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        margin: '100px 0 50px 0',
                      }}
                    >
                      <Spin size='large' />
                    </div>
                  )}

                </div>

                <div style={{
                  marginTop: '20px',
                  display: 'block'
                }}>
                  <Pagination
                    onChange={(pageNumber, _) => {
                      imageListState?.setPage(pageNumber)
                    }}
                    defaultCurrent={1} total={imageListState?.resolvedData?.total} pageSize={11} />
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className='mediaLibraryBodyContainer-right'>
            {activeImageItem && (
              <>
                <Formik
                  onSubmit={(values, actions) =>
                    handleUpdateSubmit(values, actions)
                  }
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={
                    // @ts-ignore
                    { ...activeImageItem }
                  }
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
                        <h4>Attachment Details</h4>
                        <div className='mediaLibraryBodyContainer-right-ImageDetails'>
                          <div className='mediaLibraryBodyContainer-right-ImageDetails-imageContainer'>
                            <img src={activeImageItem['cover']} alt='img' />
                          </div>
                          <div className='mediaLibraryBodyContainer-right-ImageDetails-infoContainer'>
                            <h5 className='imageLibnameText'>
                              {activeImageItem['name']}
                            </h5>
                            <h5>
                              {activeImageItem['added'] &&
                                moment(activeImageItem['added']).format(
                                  'MMMM Do YYYY, h:mm a'
                                )}
                            </h5>
                            {/* <h5>
										        5000 X 500
									          </h5> */}

                            <Popconfirm
                              onConfirm={() =>
                                handleDeleteImageFromImageLibrary(
                                  activeImageItem['id']
                                )
                              }
                              title='Are you sure？'
                              okText='Yes'
                              cancelText='No'
                            >
                              <h5 className='imageLibdeleteText'>
                                Delete parmanently
                            </h5>
                            </Popconfirm>
                          </div>
                        </div>

                        <Input
                          label='Alternate Text'
                          value={values.alt}
                          name='alt'
                          isError={
                            (touched.alt && errors.alt) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['alt'])
                          }
                          errorString={
                            (touched.alt && errors.alt) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['alt'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('alt');
                          }}
                        />

                        <Input
                          label='Title'
                          value={values.title}
                          name='title'
                          isError={
                            (touched.title && errors.title) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['title'])
                          }
                          errorString={
                            (touched.title && errors.title) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['title'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('title');
                          }}
                        />

                        <Input
                          label='Caption'
                          value={values.caption}
                          name='caption'
                          isError={
                            (touched.caption && errors.caption) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['caption'])
                          }
                          errorString={
                            (touched.caption && errors.caption) ||
                            (!isSubmitting &&
                              updateMediaLibrary.error['error']['caption'])
                          }
                          onChange={(e: any) => {
                            handleChange(e);
                            setFieldTouched('caption');
                          }}
                        />

                        <Button
                          type='default'
                          onClick={(e: any) => handleSubmit(e)}
                          disabled={getisUpdateSubmitButtonDisabled(
                            values,
                            isValid
                          )}
                          loading={isSubmitting}
                          style={
                            {
                              // marginTop: '20px'
                            }
                          }
                        >
                          Update
                      </Button>
                      </>
                    )}
                </Formik>
              </>
            )}

            {!activeImageItem && (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h4
                  style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#8888',
                  }}
                >
                  Select an image to preview details
                </h4>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MediaLibrary;
