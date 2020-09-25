// @ts-nocheck
import React, { useState, useEffect } from 'react';

// import hooks
import { useHandleFetch } from '../../hooks';

// import libraries
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  message,
  Tooltip,
  Modal,
  Tabs,
  Empty,
  Badge,
  Spin,
  Button,
} from 'antd';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  DeleteOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  FileImageFilled,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import {
  openSuccessNotification,
  openErrorNotification,
} from '../../components/Notification';
import MetaTags from '../category/MetaTags';

import Tags from './Tags';
import Brands from './Brands';
import Categories from './Categories';
import SelectProducts from './SelectProducts';
import SelectedProductItems from './SelectedProductItems';

const { TabPane } = Tabs;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required('Name is required')
    .min(3, 'Name must have at least 3 characters'),
});

const initialValues = {
  name: '',
  url: '',
  preparationTime: '',
  servingSize: '',
  cookingTime: '',
  body: '',
  bnName: '',
  bnBody: '',
  bnPreparationTime: '',
  bnServingSize: '',
  bnCookingTime: '',
  metaTitle: '',
  bnMetaTitle: '',
  metaDescription: '',
  bnMetaDescription: '',
  metaTags: '',
  bnMetaTags: '',
};

interface Props {
  addNewCategoryVisible: any;
  setAddNewCategoryVisible: any;
  productList?: any;
  setProductList?: any;
  productDetailData?: any;
}

const ModalComponentChild = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  productList: bundleList,
  setProductList: setBundleList,
  productDetailData,
}) => {
  const [addProductState, handleAddProductFetch] = useHandleFetch(
    {},
    'updatePost'
  );
  const [productDetailState, handleProductDetailFetch] = useHandleFetch(
    {},
    'postDetail'
  );
  const [visible, setvisible] = useState(false);
  const [myImages, setmyImages] = useState(false);
  const [myThumbnailImage, setmyThumbnailImage] = useState(false);
  const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
  const [isModalOpenForImages, setisModalOpenForImages] = useState(false);
  const [categoryids, setcategoryIds] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [pricing, setPricing] = useState([]);
  const [coverImageId, setCoverImageId] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [body, setBody] = useState('');
  const [bnBody, setBnBody] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [productList, setProductList] = useState([]);
  const [metaTags, setMetaTags] = useState([]);
  const [bnMetaTags, setBnMetaTags] = useState([]);

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

  console.log('myPostState', productDetailState);
  useEffect(() => {
    const getProductDetail = async () => {
      await handleProductDetailFetch({
        urlOptions: {
          placeHolders: {
            id: productDetailData.id,
          },
          params: {
            imageValue: 1,
            tagsOne: '1',
            categoryOne: '1',
          },
        },
      });
    };

    getProductDetail();
  }, [productDetailData]);

  useEffect(() => {
    if (
      productDetailState.data &&
      Object.keys(productDetailState.data).length > 0
    ) {
      const images = productDetailState.data.image;
      let mahImages = [];

      if (images && images.length > 0) {
        mahImages = images;
      }

      if (
        productDetailState.data.cover &&
        productDetailState.data.cover['id']
      ) {
        const ixists = images.find(
          (item) => item.id === productDetailState.data.cover['id']
        );
        if (!ixists) {
          mahImages = [productDetailState.data.cover, ...mahImages];
        }

        setCoverImageId(productDetailState.data.cover['id']);
      }

      // @ts-ignore
      setmyImages(mahImages);
    }
  }, [productDetailState.data]);

  useEffect(() => {
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
      if (coverImageId !== myImages[0].id) {
        setCoverImageId(myImages[0].id);
        handleSetImageAsThumnail(myImages[0]);
      }
    }
  }, [myImages]);

  console.log('myLoadImages', myImages);

  const handleDetachSingleImage = async (id) => {
    await handleDetachImageFromItemSingleFetch({
      urlOptions: {
        placeHolders: {
          imageId: id,
          collection: 'post',
          itemId: productDetailData.id,
        },
      },
    });
  };

  const handleSetImageAsThumnail = async (image) => {
    const thumbnailRes = await handleSetImageAsThumbnailToItemFetch({
      urlOptions: {
        placeHolders: {
          imageId: image.id,
          collection: 'post',
          itemId: productDetailData.id,
        },
      },
    });

    // @ts-ignore
    if (thumbnailRes && thumbnailRes.status === 'ok') {
      // openSuccessNotification('Set as thumbnail!');
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

  useEffect(() => {
    if (
      productDetailState.done &&
      productDetailState.data &&
      Object.keys(productDetailState.data).length > 0
    ) {
      console.log('5555', productDetailState);
      const productDetailData = productDetailState.data;
      if (productDetailData && productDetailData.brand) {
        setBrandId(productDetailData.brand['id']);
      } else {
        setBrandId('');
      }

      if (
        productDetailData &&
        productDetailData.tags &&
        productDetailData.tags.length > 0
      ) {
        const tagNames = productDetailData.tags.map((item) => item.name);
        const tagIds = productDetailData.tags.map((item) => item._id);
        console.log('tags55----', tagNames, tagIds);
        setSelectedTags(tagNames);
        setTagIds(tagIds);
      } else {
        setTagIds([]);
        setSelectedTags([]);
      }
      if (
        productDetailData &&
        productDetailData.category &&
        productDetailData.category.length > 0
      ) {
        const categoryIds = productDetailData.category;
        setCategoryOptions(categoryIds);
      } else {
        setCategoryOptions([]);
      }

      if (productDetailData && productDetailData.body) {
        setBody(productDetailData.body);
      } else {
        setBody('');
      }

      if (
        productDetailData &&
        productDetailData.bn &&
        productDetailData.bn['body']
      ) {
        setBnBody(productDetailData.bn['body']);
      } else {
        setBnBody('');
      }
    }
  }, [productDetailState]);

  console.log('postSelectedTagsIds', selectedTags);
  console.log('TagsIds', tagIds);
  useEffect(() => {
    if (
      productDetailState.done &&
      productDetailState['data'] &&
      Object.keys(productDetailState['data']).length > 0 && [
        'requiredProducts',
      ] &&
      productDetailState['data']['requiredProducts'].length > 0
    ) {
      const productIds = productDetailState['data']['requiredProducts'].map(
        (item) => item
      );
      setProductIds(productIds);
      const productList = productDetailState['data']['requiredProducts'].map(
        (item) => {
          return {
            ...item,
            _id: item._id,
            variation: item.variation,
            quantity: item.quantity,
          };
        }
      );
      setProductList(productList);
    }
  }, [productDetailState]);

  console.log('couponDetialQuickEdit', productDetailState);

  useEffect(() => {
    if (productIds.length > 0) {
      if (productIds.length > productList.length) {
        const variation =
          productIds[productIds.length - 1]['pricing'].length > 0 &&
          productIds[productIds.length - 1]['pricing'][0]['_id'];
        console.log('variation', variation);

        setProductList([
          ...productList,
          {
            ...productIds[productIds.length - 1],
            _id: productIds[productIds.length - 1]['id'],
            variation: variation,
            quantity: 1,
          },
        ]);
      } else if (productIds.length < productList.length) {
        console.log('productIds', productIds);
        console.log('productList', productList);

        const newProductList = productList.filter((item) => {
          let isTrue = false;
          productIds.forEach((product) => {
            if (product.id === item._id) {
              isTrue = true;
            }
          });
          return isTrue;
        });
        setProductList(newProductList);
      }
    } else {
      setProductList([]);
    }
    // console.log('productIds', productIds)
  }, [productIds]);

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds =
      myImages && myImages[0]
        ? // @ts-ignore
          myImages.map((image) => {
            return image.id;
          })
        : [];

    const products =
      productList.length > 0
        ? productList.map((product) => {
            return {
              _id: product._id,
              variation: product.variation,
              quantity: product.quantity,
            };
          })
        : [];

    if (productDetailData && Object.keys(productDetailData).length > 0) {
      const aboutToUpdatedImageIds = [];

      if (imagesIds && imagesIds.length > 0) {
        imagesIds.forEach((imageId) => {
          if (productDetailData && productDetailData['image']) {
            if (!productDetailData['image'].includes(imageId)) {
              aboutToUpdatedImageIds.push(imageId);
            }
          }
        });
      }

      if (aboutToUpdatedImageIds[0] && aboutToUpdatedImageIds.length > 1) {
        await handleAttachImageToItemMultipleFetch({
          urlOptions: {
            placeHolders: {
              collection: 'post',
              itemId: productDetailData.id,
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
              collection: 'post',
              itemId: productDetailData.id,
            },
          },
        });
      }
    }

    const addProductRes = await handleAddProductFetch({
      urlOptions: {
        placeHolders: {
          id: productDetailData.id,
        },
      },
      body: {
        name: values.name.trim(),
        category: categoryOptions,
        tags: tagIds,
        image: imagesIds,
        body: body,
        requiredProducts: products,
        preparationTime: values.preparationTime,
        servingSize: values.servingSize,
        cookingTime: values.cookingTime,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        metaTags: metaTags && metaTags.length > 0 ? metaTags.join(',') : '',

        bn: {
          metaTitle: values.bnMetaTitle,
          metaDescription: values.bnMetaDescription,
          metaTags:
            bnMetaTags && bnMetaTags.length > 0 ? bnMetaTags.join(',') : '',
          name: values.bnName.trim(),
          preparationTime: values.bnPreparationTime,
          body: bnBody,
          servingSize: values.bnServingSize,
          cookingTime: values.bnCookingTime,
        },
      },
    });

    console.log('addProductRes', addProductRes);

    // @ts-ignore
    if (addProductRes && addProductRes.status === 'ok') {
      openSuccessNotification('Notice Updated');

      const positionInTag = () => {
        return bundleList.map((item) => item.id).indexOf(productDetailData.id);
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
      const updatedItem = Object.assign({}, bundleList[index], {
        ...addProductRes,
        id: addProductRes['id'] || '',
        key: addProductRes['id'] || '',
        name: values.name.trim() || '',
        cover: getCover(coverImageId),
      });
      const updateTagList = [
        ...bundleList.slice(0, index),
        updatedItem,
        ...bundleList.slice(index + 1),
      ];
      setBundleList(updateTagList);

      setAddNewCategoryVisible(false);

      // @ts-ignore
      setmyImages([]);
      setCoverImageId('');
      setPricing([]);
      setTagIds([]);
      setSelectedTags([]);
      setBrandId('');
      setcategoryIds([]);
      setCategoryOptions([]);
      setBnBody('');
      setBody('');
      setMetaTags([]);
      setBnMetaTags([]);
      setProductIds([]);
      setProductList([]);
      actions.resetForm();
    } else {
      // openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (!addProductState['isLoading']) {
      const error = addProductState['error'];
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
  }, [addProductState]);

  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);
    setmyImages([]);
    setCoverImageId('');
    setPricing([]);
    setTagIds([]);
    setSelectedTags([]);
    setBrandId('');
    setcategoryIds([]);
    setCategoryOptions([]);
    setBnBody('');
    setBody('');
    setMetaTags([]);
    setBnMetaTags([]);
    setProductIds([]);
    setProductList([]);
  };

  useEffect(() => {
    if (productDetailData && Object.keys(productDetailData).length > 0) {
      const metaTags =
        productDetailData.metaTags && productDetailData.metaTags.split(',');

      console.log('localMetaTags', metaTags);

      const bnMetaTags =
        productDetailData.bn &&
        productDetailData.bn['metaTags'] &&
        productDetailData.bn['metaTags'].split(',');
      setMetaTags(metaTags || []);
      setBnMetaTags(bnMetaTags || []);
    }
  }, []);

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{
        ...initialValues,
        ...{
          ...productDetailData,
          ...(productDetailState['data'] &&
            Object.keys(productDetailState['data']).length > 0 &&
            productDetailState['data']['bn'] && {
              bnMetaTitle: productDetailState['data']['bn'].metaTitle,
              bnMetaDescription:
                productDetailState['data']['bn'].metaDescription,
              bnName: productDetailState['data']['bn'].name,
              metaUnit: productDetailState['data']['bn'].unit,
              bnDescription: productDetailState['data']['bn'].description,
            }),
        },
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
                  <h3>Notice Information</h3>

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
                    label='Name'
                    placeHolder=''
                    value={values.name}
                    name='name'
                    isError={
                      (touched.name && errors.name) ||
                      (!isSubmitting && addProductState.error['error']['name'])
                    }
                    errorString={
                      (touched.name && errors.name) ||
                      (!isSubmitting && addProductState.error['error']['name'])
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
                        addProductState.error['error']['bnName'])
                    }
                    errorString={
                      (touched.bnName && errors.bnName) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnName'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnName');
                    }}
                  />

                  {/* <Input
                    label='Preparation Time'
                    value={values.preparationTime}
                    placeHolder='15 min'
                    name='preparationTime'
                    isError={
                      (touched.preparationTime && errors.preparationTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['preparationTime'])
                    }
                    errorString={
                      (touched.preparationTime && errors.preparationTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['preparationTime'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('preparationTime');
                    }}
                  />

                  <Input
                    label='BN Preparation Time'
                    value={values.bnPreparationTime}
                    placeHolder={'১৫ মিনিট'}
                    name='bnPreparationTime'
                    isError={
                      (touched.bnPreparationTime && errors.bnPreparationTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnPreparationTime'])
                    }
                    errorString={
                      (touched.bnPreparationTime && errors.bnPreparationTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnPreparationTime'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnPreparationTime');
                    }}
                  />

                  <Input
                    label='Cooking Time'
                    placeHolder={'30 min'}
                    value={values.cookingTime}
                    name='cookingTime'
                    isError={
                      (touched.cookingTime && errors.cookingTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['cookingTime'])
                    }
                    errorString={
                      (touched.cookingTime && errors.cookingTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['cookingTime'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('cookingTime');
                    }}
                  />

                  <Input
                    label='BN Cooking Time'
                    placeHolder={'৩০ মিনিট'}
                    value={values.bnCookingTime}
                    name='bnCookingTime'
                    isError={
                      (touched.bnCookingTime && errors.bnCookingTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnCookingTime'])
                    }
                    errorString={
                      (touched.bnCookingTime && errors.bnCookingTime) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnCookingTime'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnCookingTime');
                    }}
                  />

                  <Input
                    label='Serving Size'
                    value={values.servingSize}
                    name='servingSize'
                    isError={
                      (touched.servingSize && errors.servingSize) ||
                      (!isSubmitting &&
                        addProductState.error['error']['servingSize'])
                    }
                    errorString={
                      (touched.servingSize && errors.servingSize) ||
                      (!isSubmitting &&
                        addProductState.error['error']['servingSize'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('servingSize');
                    }}
                  />

                  <Input
                    label='BN Serving Size'
                    value={values.bnServingSize}
                    name='bnServingSize'
                    isError={
                      (touched.bnServingSize && errors.bnServingSize) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnServingSize'])
                    }
                    errorString={
                      (touched.bnServingSize && errors.bnServingSize) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnServingSize'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnServingSize');
                    }}
                  /> */}

                  <Input
                    label='URL'
                    value={values.url}
                    name='url'
                    isError={
                      (touched.url && errors.url) ||
                      (!isSubmitting && addProductState.error['error']['url'])
                    }
                    errorString={
                      (touched.url && errors.url) ||
                      (!isSubmitting && addProductState.error['error']['url'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('url');
                    }}
                  />

                  <h3 className='inputFieldLabel'>Body</h3>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={body}
                      onInit={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setBody(data);
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
                      marginTop: '15px',
                    }}
                  ></div>

                  <h3 className='inputFieldLabel'>BN Body</h3>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={bnBody}
                      onInit={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setBnBody(data);
                      }}
                      onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                      }}
                      onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                      }}
                    />
                  </div>

                  {/* <div style={{
												display: 'flex',
												justifyContent: 'space-between'
											}}>
												<div style={{
													width: '48%',
												}}>
													<DatePicker
														label='Date'
														onChange={handleDateChange} />

												</div>
												<div style={{
													width: '48%'
												}}>

													<DatePicker
														date={date}
														withTime={true}
														placeholder='Select time'
														label='Time'
														onChange={handleTimeChange} />

												</div>
											</div> */}
                  <div
                    style={{
                      marginBottom: '15px',
                    }}
                  ></div>
                  {/* 
											<TextArea
												rows={1}
												label='Venue'
												value={values.venue}
												name='venue'
												isError={(touched.venue && errors.venue) ||
													(!isSubmitting && addProductState.error['error']['venue'])}

												errorString={(touched.venue && errors.venue) ||
													(!isSubmitting && addProductState.error['error']['venue'])}
												onChange={(e: any) => {
													handleChange(e);
													setFieldTouched('venue');
												}}
											/>



											<Input
												label='Purchase Limit'
												value={values.purchaseLimit}
												type='number'
												name='purchaseLimit'
												isError={(touched.purchaseLimit && errors.purchaseLimit) ||
													(!isSubmitting && addProductState.error['error']['purchaseLimit'])}

												errorString={(touched.purchaseLimit && errors.purchaseLimit) ||
													(!isSubmitting && addProductState.error['error']['purchaseLimit'])}
												onChange={(e: any) => {
													handleChange(e);
													setFieldTouched('purchaseLimit');
												}}
											/> */}
                </div>
              </div>

              {/* <div className='addProductGridContainer__price'>
                <div className='addProductGridContainer__item-header'>
                  <h3>Products</h3>

                  <div
                    className={
                      pricing && pricing.length > 0
                        ? 'checkicon-active'
                        : 'checkicon'
                    }
                  >
                    <CheckCircleOutlined />
                  </div>
                </div>

                <div className='addProductGridContainer__item-body'>
                  <h3 className='inputFieldLabel'>Products</h3>
                  <SelectProducts
                    setProductIds={setProductIds}
                    productIds={productIds}
                  />

                  <div
                    style={{
                      marginTop: '15px',
                    }}
                  ></div>

                  <h3 className='inputFieldLabel'>Selcted Products</h3>

                  <SelectedProductItems
                    productList={productList}
                    setProductList={setProductList}
                  />
                </div>
              </div> */}

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
                  {productDetailState.isLoading && (
                    <div
                      style={{
                        padding: '20px 0',
                      }}
                    >
                      <Spin />
                    </div>
                  )}
                  {productDetailState.done && (
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

              <div className='addProductGridContainer__image'>
                <div className='addProductGridContainer__item-header'>
                  <h3>Meta Data</h3>

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
                </div>
                <div className='addProductGridContainer__item-body'>
                  <Input
                    label='Meta title'
                    value={values.metaTitle}
                    placeHolder={'...'}
                    name='metaTitle'
                    isError={
                      (touched.metaTitle && errors.metaTitle) ||
                      (!isSubmitting &&
                        addProductState.error['error']['metaTitle'])
                    }
                    errorString={
                      (touched.metaTitle && errors.metaTitle) ||
                      (!isSubmitting &&
                        addProductState.error['error']['metaTitle'])
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
                        addProductState.error['error']['bnMetaTitle'])
                    }
                    errorString={
                      (touched.bnMetaTitle && errors.bnMetaTitle) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnMetaTitle'])
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
                        addProductState.error['error']['metaDescription'])
                    }
                    errorString={
                      (touched.metaDescription && errors.metaDescription) ||
                      (!isSubmitting &&
                        addProductState.error['error']['metaDescription'])
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
                        addProductState.error['error']['bnMetaDescription'])
                    }
                    errorString={
                      (touched.bnMetaDescription && errors.bnMetaDescription) ||
                      (!isSubmitting &&
                        addProductState.error['error']['bnMetaDescription'])
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      setFieldTouched('bnMetaDescription');
                    }}
                  />

                  <h3 className='inputFieldLabel'>Meta Tags</h3>

                  <MetaTags
                    // @ts-ignore
                    setTags={setMetaTags}
                    tags={metaTags}
                  />

                  <div
                    style={{
                      marginTop: '15px',
                    }}
                  ></div>

                  <h3 className='inputFieldLabel'>BN Meta Tags</h3>

                  <MetaTags
                    // @ts-ignore
                    setTags={setBnMetaTags}
                    tags={bnMetaTags}
                  />
                </div>
              </div>
            </div>
            <div className='addProductGridContainer__right'>
              <div className='addProductGridContainer__category'>
                <div className='addProductGridContainer-rightItemContainer'>
                  <div className='addProductGridContainer-rightItemContainer-header'>
                    <h3>Notice Categories</h3>

                    <Tooltip
                      color='red'
                      visible={
                        addProductState.error['error']['category'] &&
                        !(categoryids.length > 0)
                      }
                      placement='left'
                      title={'Select at least one category'}
                    >
                      <div
                        className={
                          !(categoryids.length > 0) &&
                          !addProductState.error['error']['category']
                            ? 'checkicon'
                            : addProductState.error['error']['category']
                            ? 'checkicon-error'
                            : 'checkicon-active'
                        }
                      >
                        <CheckCircleOutlined />
                      </div>
                    </Tooltip>
                  </div>
                  <div className='addProductGridContainer-rightItemContainer-body'>
                    <Categories
                      setCategoryOptions={setCategoryOptions}
                      categoryOptions={categoryOptions}
                      setcategoryIds={setcategoryIds}
                    />
                  </div>
                </div>
              </div>

              <div className='addProductGridContainer__tag'>
                <div className='addProductGridContainer-rightItemContainer'>
                  <div className='addProductGridContainer-rightItemContainer-header'>
                    <h3>Notice Tags</h3>
                  </div>
                  <div className='addProductGridContainer-rightItemContainer-body'>
                    <Tags
                      setSelectedTags={setSelectedTags}
                      selectedTags={selectedTags}
                      setTagIds={setTagIds}
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
              loading={addProductState.isLoading}
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
  );
};

const AddNewProduct = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  productList: bundleList,
  setProductList: setBundleList,
  productDetailData,
}: Props) => {
  const handleCancel = () => {
    setAddNewCategoryVisible(false);
  };
  return (
    <>
      <Modal
        style={{
          top: '40px',
        }}
        footer={false}
        bodyStyle={{
          margin: 0,
          padding: 0,
        }}
        width={'70vw'}
        title='Edit Notice'
        visible={addNewCategoryVisible}
        // onOk={(e: any) => handleSubmit(e)}
        onCancel={handleCancel}
        destroyOnClose={true}
        okText='Update'
        okButtonProps={{
          // loading: isSubmitting,
          htmlType: 'submit',
        }}
      >
        <ModalComponentChild
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={bundleList}
          bundleList={bundleList}
          setBundleList={setBundleList}
          productDetailData={productDetailData}
        />
      </Modal>
    </>
  );
};

export default AddNewProduct;

/*


Product variation ---->

Price [title]
	[regular input field] [offer inputfield]

Stock [title]
	[available input field] [minimum inputfield]

default [default can be set to true]

attributes [title]
	[add attributes name]
		[add attrubutes value]

	[add attributes name]
		[add attrubutes value

*/ //
