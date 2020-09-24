// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';

// import third party ui lib
import { notification, Modal, Tooltip, DatePicker } from 'antd';

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
import OrderedProductsSelectProducts from './OrderedProductsSelectProducts';
import OrderedProductsSelectedProductItems from './OrderedProductsSelectedProductItems';
import FreeSelectProducts from './FreeSelectProducts';
import FreeSelectedProductItems from './FreeSelectedProductItems';
import moment from 'moment';

const { RangePicker } = DatePicker;

const validationSchema = Yup.object().shape({
  // name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Coupon Updated',
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
  code: '',
  minimumOrder: null,
  amount: '',
  amountType: '',
  orderedProducts: [],
  freeDelivery: true,
  freeProducts: [],
};

interface Props {
  addNewCategoryVisible?: any;
  setAddNewCategoryVisible?: any;
  tagList?: any;
  setTagList?: any;
  category?: any;
}

const AddNewBrand = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  tagList,
  setTagList,
  category,
}: Props) => {
  const [addCouponState, handleAddCouponStateFetch] = useHandleFetch(
    {},
    'updateCoupon'
  );
  const [couponDetailState, handleCouponDetailFetch] = useHandleFetch(
    {},
    'couponDetail'
  );
  const [myImages, setmyImages] = useState(false);
  const [visibleMedia, setvisibleMedia] = useState(false);
  const [coverImageId, setCoverImageId] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [productList, setProductList] = useState([]);
  const [freeProductIds, setFreeProductIds] = useState([]);
  const [freeProductList, setFreeProductList] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const getProductDetail = async () => {
      await handleCouponDetailFetch({
        urlOptions: {
          placeHolders: {
            id: category.id,
          },
        },
      });
    };

    getProductDetail();
  }, [category]);

  useEffect(() => {
    if (
      couponDetailState.data &&
      Object.keys(couponDetailState.data).length > 0
    ) {
      const images = couponDetailState.data.image;
      if (images && images.length > 0) {
        setmyImages(images);
      }

      if (couponDetailState.data.cover && couponDetailState.data.cover['id']) {
        // @ts-ignore
        setmyImages([couponDetailState.data.cover]);
        setCoverImageId(couponDetailState.data.cover['id']);
      }
    }
  }, [couponDetailState.data]);

  useEffect(() => {
    // @ts-ignore
    if (myImages && myImages[0] && myImages.length < 2) {
      if (coverImageId !== myImages[0].id) {
        setCoverImageId(myImages[0].id);
      }
    }
  }, [myImages]);

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds = myImages
      ? myImages.map((image) => {
          return image.id;
        })
      : [];

    const orderedProducts =
      productList.length > 0
        ? productList.map((product) => {
            return {
              _id: product._id,
              variation: product.variation,
              quantity: product.quantity,
            };
          })
        : [];

    // const freeProducts = freeProductList.length > 0 ? freeProductList.map(product => {
    //     return {
    //         _id: product._id,
    //         variation: product.variation,
    //         quantity: product.quantity,
    //     }
    // }) : [];

    const addTagRes = await handleAddCouponStateFetch({
      urlOptions: {
        placeHolders: {
          id: values.id,
        },
      },
      body: {
        name: values.name.trim(),
        code: values.code,
        minimumOrder: values.minimumOrder,
        amount: values.amount,
        amountType: values.amountType,
        // freeDelivery: false,
        orderedProducts: orderedProducts,
        // freeProducts: freeProducts,
        cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
        startDate,
        endDate,
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
      openSuccessNotification();
      setAddNewCategoryVisible(false);

      const positionInTag = () => {
        return tagList.map((item) => item.id).indexOf(values.id);
      };

      const index = positionInTag();

      function getCover(id) {
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
      }

      // @ts-ignore
      const updatedItem = Object.assign({}, tagList[index], {
        ...addTagRes,
        cover: getCover(coverImageId),
      });
      const updateTagList = [
        ...tagList.slice(0, index),
        updatedItem,
        ...tagList.slice(index + 1),
      ];
      setTagList(updateTagList);

      setProductList([]);
      setProductIds([]);
      setStartDate('');
      setEndDate('');
      setmyImages(false);
      setCoverImageId('');
      setvisibleMedia(false);
      actions.resetForm();
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  console.log('4444444', myImages);
  console.log('4444444', coverImageId);
  const handleCancel = (e: any) => {
    setAddNewCategoryVisible(false);

    setProductList([]);
    setProductIds([]);
    setStartDate('');
    setEndDate('');
    setmyImages(false);
    setCoverImageId('');
    setvisibleMedia(false);
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.name || !isValid) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (category && Object.keys(category).length > 0) {
      const images = category.image;
      if (images && images.length > 0) {
        setmyImages(images);
      }

      if (category.cover && category.cover['id']) {
        // @ts-ignore
        setmyImages([category.cover]);
        setCoverImageId(category.cover['id']);
      }
    }
  }, [category]);

  useEffect(() => {
    if (category && Object.keys(category).length > 0) {
      console.log('hsit');

      let startDate = category.startDate;
      let endDate = category.endDate;

      startDate = startDate && new Date(moment(startDate).format());
      endDate = endDate && new Date(moment(endDate).format());

      console.log('CategorydateStart', startDate);
      console.log('CategorydateStart', endDate);

      // @ts-ignore
      setStartDate(startDate);
      // @ts-ignore
      setEndDate(endDate);
    }
  }, [category]);

  const handleStartEndDateRangeDate = (e) => {
    const startDate = e[0] && new Date(moment(e[0]).format());
    const endDate = e[1] && new Date(moment(e[1]).format());
    // @ts-ignore
    setStartDate(startDate);
    // @ts-ignore
    setEndDate(endDate);
  };

  useEffect(() => {
    if (!addCouponState['isLoading']) {
      const error = addCouponState['error'];
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
  }, [addCouponState]);

  useEffect(() => {
    if (
      couponDetailState.done &&
      couponDetailState['data'] &&
      Object.keys(couponDetailState['data']).length > 0 && [
        'orderedProducts',
      ] &&
      couponDetailState['data']['orderedProducts'].length > 0
    ) {
      const productIds = couponDetailState['data']['orderedProducts'].map(
        (item) => item
      );
      setProductIds(productIds);
      const productList = couponDetailState['data']['orderedProducts'].map(
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
  }, [couponDetailState]);

  console.log('couponDetialQuickEdit', couponDetailState);

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

  console.log('startDate--', startDate);
  console.log('endDate--', endDate);

  useEffect(() => {
    if (freeProductIds.length > 0) {
      if (freeProductIds.length > freeProductList.length) {
        const variation =
          freeProductIds[freeProductIds.length - 1]['pricing'].length > 0 &&
          freeProductIds[freeProductIds.length - 1]['pricing'][0]['_id'];
        console.log('variation', variation);

        setFreeProductList([
          ...freeProductList,
          {
            ...freeProductIds[freeProductIds.length - 1],
            _id: freeProductIds[freeProductIds.length - 1]['id'],
            variation: variation,
            quantity: 1,
          },
        ]);
      } else if (freeProductIds.length < freeProductList.length) {
        console.log('freeProductIds', freeProductIds);
        console.log('productList', productList);

        const newProductList = freeProductList.filter((item) => {
          let isTrue = false;
          freeProductIds.forEach((product) => {
            if (product.id === item._id) {
              isTrue = true;
            }
          });
          return isTrue;
        });
        setFreeProductList(newProductList);
      }
    } else {
      setFreeProductList([]);
    }
    // console.log('freeProductIds', freeProductIds)
  }, [freeProductIds]);

  const handleImagesDelete = (id) => {
    // @ts-ignore
    const newImages =
      myImages &&
      myImages.filter((image) => {
        return image.id !== id;
      });

    setmyImages(newImages);
  };

  const dateFormat = 'YYYY-MM-DD';

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...initialValues, ...category }}
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
            width={'45vw'}
            style={{
              top: '40px',
            }}
            title='Edit Coupon'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            // destroyOnClose={true}
            okText='Update'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
              // disabled: getisSubmitButtonDisabled(values, isValid)
            }}
          >
            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Name'
                  value={values.name}
                  name='name'
                  isError={
                    (touched.name && errors.name) ||
                    (!isSubmitting && addCouponState.error['error']['name'])
                  }
                  errorString={
                    (touched.name && errors.name) ||
                    (!isSubmitting && addCouponState.error['error']['name'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('name');
                  }}
                />
              </div>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Code'
                  value={values.code}
                  name='code'
                  isError={
                    (touched.code && errors.code) ||
                    (!isSubmitting && addCouponState.error['error']['code'])
                  }
                  errorString={
                    (touched.code && errors.code) ||
                    (!isSubmitting && addCouponState.error['error']['code'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('code');
                  }}
                />
              </div>
            </div>

            <Input
              label='Minimum Order'
              value={values.minimumOrder}
              name='minimumOrder'
              isError={
                (touched.minimumOrder && errors.minimumOrder) ||
                (!isSubmitting && addCouponState.error['error']['minimumOrder'])
              }
              errorString={
                (touched.minimumOrder && errors.minimumOrder) ||
                (!isSubmitting && addCouponState.error['error']['minimumOrder'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('minimumOrder');
              }}
            />

            <div className='dubbleRowInputs'>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Discount Amount'
                  value={values.amount}
                  name='amount'
                  isError={
                    (touched.amount && errors.amount) ||
                    (!isSubmitting && addCouponState.error['error']['amount'])
                  }
                  errorString={
                    (touched.amount && errors.amount) ||
                    (!isSubmitting && addCouponState.error['error']['amount'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('amount');
                  }}
                />
              </div>
              <div className='dubbleRowInputs__item'>
                <Input
                  label='Discount Amount Type'
                  value={values.amountType}
                  name='amountType'
                  isError={
                    (touched.amountType && errors.amountType) ||
                    (!isSubmitting &&
                      addCouponState.error['error']['amountType'])
                  }
                  errorString={
                    (touched.amountType && errors.amountType) ||
                    (!isSubmitting &&
                      addCouponState.error['error']['amountType'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('amountType');
                  }}
                />
              </div>
            </div>

            {true && (
              <div
                style={{
                  marginBottom: '15px',
                }}
              >
                <h3 className='inputFieldLabel'>Start and end date</h3>
                <RangePicker
                  style={{
                    borderRadius: '8px',
                    borderColor: '#eee',
                    width: '100%',
                  }}
                  value={[
                    moment(startDate, dateFormat).isValid()
                      ? moment(startDate, dateFormat)
                      : undefined,
                    moment(endDate, dateFormat).isValid()
                      ? moment(endDate, dateFormat)
                      : undefined,
                  ]}
                  showTime={true}
                  onChange={handleStartEndDateRangeDate}
                  picker={'date'}
                />
              </div>
            )}

            <div
              className='addproductSection-left-header'
              style={{
                marginBottom: '-5px',
              }}
            >
              <h3 className='inputFieldLabel'>Cover</h3>
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
                        onClick={() => {
                          setvisibleMedia(true);
                        }}
                      >
                        <img src={image.cover} alt={image.alt} />
                      </div>

                      <span
                        onClick={() => handleImagesDelete(image.id)}
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
            </div>

            <h3 className='inputFieldLabel'>Ordered Products</h3>

            <OrderedProductsSelectProducts
              setProductIds={setProductIds}
              productIds={productIds}
            />

            <div
              style={{
                marginTop: '15px',
              }}
            ></div>

            <h3 className='inputFieldLabel'>Selected Ordered Products</h3>

            <OrderedProductsSelectedProductItems
              productList={productList}
              setProductList={setProductList}
            />

            {/* <h3 className='inputFieldLabel'>
                                Free Products
                                </h3>

                            <OrderedProductsSelectProducts
                                setProductIds={setFreeProductIds}
                                productIds={freeProductIds}
                            />

                            <div style={{
                                marginTop: "15px"
                            }}></div>

                            <h3 className='inputFieldLabel'>
                                Selected Free Products
                                </h3>

                            <OrderedProductsSelectedProductItems
                                productList={freeProductList}
                                setProductList={setFreeProductList}
                            /> */}
          </Modal>

          <MediaLibrary
            setvisible={setvisibleMedia}
            visible={visibleMedia}
            setmyImages={setmyImages}
            myImages={myImages}
            isModalOpenForImages={false}
          />
        </>
      )}
    </Formik>
  );
};

export default AddNewBrand;
