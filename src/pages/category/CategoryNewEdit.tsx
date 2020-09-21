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
  name: Yup.string()
    .label('Name')
    .required('Name is required')
    .min(3, 'Name must have at least 3 characters'),
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
  displayOrder: '',
};

const { Option } = Select;

interface Props {
  addNewCategoryVisible: any;
  setAddNewCategoryVisible: any;
  categoryList?: any;
  setcategoryList?: any;
  categoryDetailData?: any;
  setcategoryDetailData?: any;
}

const AddNewCategory = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  categoryList,
  setcategoryList,
  categoryDetailData,
  setcategoryDetailData,
}: Props) => {
  const [addCategoryState, handleAddCategoryFetch] = useHandleFetch(
    {},
    'updateCategory'
  );
  const [
    updateCategoryIconState,
    handleUpdateCategoryIconFetch,
  ] = useHandleFetch({}, 'categoryUpdateIcon');
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

  const [visible, setvisible] = useState(false);
  const [myThumbnailImage, setmyThumbnailImage] = useState(false);
  const [isparentCategoryChecked, setisparentcategoryChecked] = useState(true);
  const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
  const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
  const [selectedParentId, setselectedParentId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingThumnail, setLoadingThumbnail] = useState(false);
  const [imageFile, setImagefile] = useState('');
  const [tags, setTags] = useState([]);
  const [bnTags, setBnTags] = useState([]);
  const [myImages, setmyImages] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [myGoddamnImages, setMyGoddamnImages] = useState([]);

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds = myImages
      ? myImages.map((image) => {
          return image.id;
        })
      : [];

    const formData = new FormData();

    formData.append('name', values.name.trim());
    formData.append('description', values.description);
    formData.append('image', JSON.stringify(imagesIds));
    formData.append('cover', coverImageId || imagesIds[0] ? imagesIds[0] : '');
    formData.append('parent', selectedParentId);
    formData.append('icon', imageFile);
    formData.append('displayOrder', values.displayOrder);

    console.log('categoryDetailData', categoryDetailData);
    console.log('imagesIds', imagesIds);

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
        name: values.name.trim(),
        description: values.description,
        image: imagesIds,
        cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
        parent: selectedParentId,
        icon: imageFile,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        displayOrder: values.displayOrder,
        metaTags: tags && tags.length > 0 ? tags.join(',') : '',
        // bn: {
        //   metaTitle: values.bnMetaTitle,
        //   metaDescription: values.bnMetaDescription,
        //   metaTags: bnTags && bnTags.length > 0 ? bnTags.join(',') : '',
        //   name: values.bnName.trim(),
        //   description: values.bnDescription,
        // },
      },
    });

    // @ts-ignore
    if (addCategoryRes && addCategoryRes.status === 'ok') {
      openSuccessNotification('Category Updated!');
      setAddNewCategoryVisible(false);

      // setcategoryList([{
      // 	id: addCategoryRes['_id'] || '',
      // 	key: addCategoryRes['_id'] || '',
      // 	name: addCategoryRes['name'] || '',
      // 	description: addCategoryRes['description'] || '',
      // 	cover: addCategoryRes['cover'] || '',
      // 	// @ts-ignore
      // 	...addCategoryRes
      // },...categoryList]);

      setcategoryDetailData({
        ...categoryDetailData,
        // @ts-ignore
        ...addCategoryRes,
      });

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
    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const images = categoryDetailData.image;
      let mahImages = [];

      if (images && images.length > 0) {
        mahImages = images;
      }

      if (categoryDetailData.cover && categoryDetailData.cover['id']) {
        const ixists = images.find(
          (item) => item.id === categoryDetailData.cover['id']
        );
        if (!ixists) {
          mahImages = [categoryDetailData.cover, ...mahImages];
        }

        setCoverImageId(categoryDetailData.cover['id']);
      }

      // @ts-ignore
      setmyImages(mahImages);
    }
  }, [categoryDetailData]);

  useEffect(() => {
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
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
      // const positionInBrand = () => {
      //     return brandList.map(item => item.id).indexOf(categoryDetailData.id);
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

  const handleImagesDelete = (id) => {
    // @ts-ignore
    const newImages =
      myImages &&
      myImages.filter((image) => {
        return image.id !== id;
      });

    setmyImages(newImages);
  };

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

  const uploadButton = (
    <div>
      {loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  useEffect(() => {
    if (categoryDetailData && Object.keys(categoryDetailData).length > 0) {
      const iconUrl = categoryDetailData.icon && categoryDetailData.icon;

      setImageUrl(iconUrl);
    }
  }, []);

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

  // console.log('addnewCategoryTags777', tags);
  // console.log('categoryDetailData', categoryDetailData);
  // console.log('shitThere', myImages);

  return (
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
          <Modal
            style={{
              top: '40px',
            }}
            title='Edit Category'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
            }}
          >
            <Input
              label='Name'
              value={values.name}
              // placeHolder={'g'}
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
              isError={
                (touched.bnName && errors.bnName) ||
                (!isSubmitting && addCategoryState.error['error']['bnName'])
              }
              errorString={
                (touched.bnName && errors.bnName) ||
                (!isSubmitting && addCategoryState.error['error']['bnName'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('bnName');
              }}
            /> */}

            <TextArea
              label='Description'
              value={values.description}
              placeholder={'...'}
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
                marginTop: '20px',
              }}
            />

            <div
              className='addproductSection-left-header'
              style={{
                marginBottom: '-5px',
              }}
            >
              <h3 className='inputFieldLabel'>Images</h3>
              {/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
            </div>

            <div className='aboutToUploadImagesContainer'>
              {categoryDetailData &&
                Object.keys(categoryDetailData).length > 0 && (
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

            {/* <Input
              label='BN Meta title'
              value={values.bnMetaTitle}
              placeHolder={'ক্যাটাগড়ি...'}
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
              isError={
                (touched.bnMetaDescription && errors.bnMetaDescription) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['bnMetaDescription'])
              }
              errorString={
                (touched.bnMetaDescription && errors.bnMetaDescription) ||
                (!isSubmitting &&
                  addCategoryState.error['error']['bnMetaDescription'])
              }
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

            {/* <div
              style={{
                marginTop: '15px',
              }}
            ></div>

            <h3 className='inputFieldLabel'>BN Meta Tags (মুদিখানা,ফ্যাশন)</h3>

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
