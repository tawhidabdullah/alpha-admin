// @ts-nocheck
import React, { useState, useEffect } from 'react';

// import hooks
import { useHandleFetch } from '../../hooks';

// import libraries
import { Formik } from 'formik';
import * as Yup from 'yup';
import { message, Tooltip, Modal, Tabs, Empty, Badge } from 'antd';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import {
  DeleteOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  FileImageFilled,
  FileImageOutlined,
  FileImageTwoTone,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';
import DatePicker from '../../components/Field/DatePicker';
import {
  openSuccessNotification,
  openErrorNotification,
} from '../../components/Notification';
import Tags from './Tags';
import Brands from './Brands';
import Categories from './Categories';
import Pricing from './Pricing';
import MetaTags from '../category/MetaTags';

const { TabPane } = Tabs;

const validationSchema = Yup.object().shape({
  // name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});

const initialValues = {
  name: '',
  description: '',
  model: '',
  unit: '',
  regular: '',
  offer: '',
  available: '',
  minimum: '',
  image: [],
  url: '',
  cover: '',
  pricing: [],
  venue: '',
  date: '',
  time: '',
  purchaseLimit: null,
  bnUnit: '',
  bnName: '',
  bnDescription: '',
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
}

const AddNewProduct = ({
  addNewCategoryVisible,
  setAddNewCategoryVisible,
  productList,
  setProductList,
}: Props) => {
  const [addProductState, handleAddProductFetch] = useHandleFetch(
    {},
    'addProduct'
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
  const [date, setDateFeild] = useState('');
  const [time, setTimeFeild] = useState('');
  const [description, setDescription] = useState('');
  const [bnDescription, setBNDescription] = useState('');
  const [metaTags, setMetaTags] = useState([]);
  const [bnMetaTags, setBnMetaTags] = useState([]);
  const [editpricingItem, setEditPricingItem] = useState({});
  const [pricingTagActiveKey, setpricingTagActiveKey] = useState('1');
  const [isPricingEditActive, seTisPricingEditActive] = useState(false);

  const makeEmptyCategoryOptions = (setEmpty) => {
    setEmpty([]);
  };

  const handleSubmit = async (values: any, actions: any) => {
    // @ts-ignore
    const imagesIds = myImages
      ? myImages.map((image) => {
          return image.id;
        })
      : [];

    const addProductRes = await handleAddProductFetch({
      body: {
        name: values.name.trim(),
        description: description,
        model: values.model,
        unit: values.unit,
        category: categoryids,
        tags: tagIds,
        brand: brandId,
        image: imagesIds,
        cover: coverImageId || imagesIds[0] ? imagesIds[0] : '',
        pricing: pricing,
        // metaTitle: values.metaTitle,
        // metaDescription: values.metaDescription,
        // metaTags: metaTags.join(','),

        // bn: {
        // 	metaTitle: values.bnMetaTitle,
        // 	metaDescription: values.bnMetaDescription,
        // 	metaTags: bnMetaTags.join(','),
        // 	name: values.bnName.trim(),
        // 	unit: values.metaUnit,
        // 	description: bnDescription,
        // }
      },
    });

    // @ts-ignore
    if (addProductRes && addProductRes.status === 'ok') {
      openSuccessNotification('Product Created');
      setAddNewCategoryVisible(false);

      setProductList([
        {
          // @ts-ignore
          ...addProductRes,
          id: addProductRes['_id'] || '',
          key: addProductRes['_id'] || '',
          name: addProductRes['name'] || '',
          description: addProductRes['description'] || '',
          cover: addProductRes['cover'] || '',
        },
        ...productList,
      ]);
      // @ts-ignore
      setmyImages([]);
      setCoverImageId('');
      setPricing([]);
      setTagIds([]);
      setSelectedTags([]);
      setBrandId('');
      setcategoryIds([]);
      setCategoryOptions([]);
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
  };

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (
      !values.name ||
      !(pricing.length > 0) ||
      !(categoryids.length > 0) ||
      !isValid
    ) {
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

  const handleDeleteFromSelectedImage = () => {};

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

  const handleAddPricing = (priceItem) => {
    setPricing([
      {
        ...priceItem,
        id: pricing.length,
      },
      ...pricing,
    ]);
    message.info('Product Pricing Added');
  };

  const handleUpdatePricing = (priceItem) => {
    const positionInPricing = () => {
      return pricing.map((item) => item.id).indexOf(priceItem.id);
    };

    const index = positionInPricing();

    // @ts-ignore
    const updatedItem = Object.assign({}, pricing[index], { ...priceItem });
    const updatePricingList = [
      ...pricing.slice(0, index),
      updatedItem,
      ...pricing.slice(index + 1),
    ];

    setPricing(updatePricingList);

    message.info('Product Pricing Updated');
    seTisPricingEditActive(true);
    setpricingTagActiveKey('2');
  };

  const handleEditPricing = (id) => {
    seTisPricingEditActive(true);
    const pricingItem = pricing.find((item) => item.id === id);
    if (pricingItem) {
      setEditPricingItem(pricingItem);
    }
  };

  const handleDeletePricing = (id) => {
    const newPricing = pricing.filter((item) => item.id !== id);
    setPricing(newPricing);
    message.info('Product Pricing Deleted');
  };

  const isCategoryInValid = () => {
    if (
      addProductState.error['error']['category'] &&
      !categoryids &&
      categoryids.length
    ) {
      return true;
    } else if (categoryids && categoryids.length > 0) {
      return false;
    }
  };

  const handleDateChange = (date, dateString) => {
    setDateFeild(dateString);
    // console.log('date', date, dateString);
  };

  const handleTimeChange = (date, dateString) => {
    setTimeFeild(dateString);
    // console.log('date', date, dateString);
  };

  console.log('pricingingi', pricing);

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
            bodyStyle={{
              margin: 0,
              padding: 0,
            }}
            width={'70vw'}
            title='Add New Product'
            visible={addNewCategoryVisible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Create'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
            }}
          >
            <section className='addProductGridContainer'>
              <div className='addProductGridContainer__left'>
                <div className='addProductGridContainer__name'>
                  <div className='addProductGridContainer__item-header'>
                    <h3>Product Information *</h3>

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
                      value={values.name}
                      // placeHolder={'Rafty ox'}
                      name='name'
                      isError={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          addProductState.error['error']['name'])
                      }
                      errorString={
                        (touched.name && errors.name) ||
                        (!isSubmitting &&
                          addProductState.error['error']['name'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('name');
                      }}
                    />

                    {/* <Input
											label='BN Name'
											value={values.bnName}
											placeHolder={'রাফতি অক্স'}
											name='bnName'
											isError={(touched.bnName && errors.bnName) ||
												(!isSubmitting && addProductState.error['error']['bnName'])}

											errorString={(touched.bnName && errors.bnName) ||
												(!isSubmitting && addProductState.error['error']['bnName'])}
											onChange={(e: any) => {
												handleChange(e);
												setFieldTouched('bnName');
											}}
										/> */}

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

                    <Input
                      label='Unit'
                      value={values.unit}
                      name='unit'
                      // placeHolder={'KG,POUND,GM'}
                      isError={
                        (touched.unit && errors.unit) ||
                        (!isSubmitting &&
                          addProductState.error['error']['unit'])
                      }
                      errorString={
                        (touched.unit && errors.unit) ||
                        (!isSubmitting &&
                          addProductState.error['error']['unit'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('unit');
                      }}
                    />

                    {/* <Input
											label='BN Unit'
											value={values.bnUnit}
											placeHolder={'কেজি,গ্রাম'}
											name='bnUnit'
											isError={(touched.bnUnit && errors.bnUnit) ||
												(!isSubmitting && addProductState.error['error']['bnUnit'])}

											errorString={(touched.bnUnit && errors.bnUnit) ||
												(!isSubmitting && addProductState.error['error']['bnUnit'])}
											onChange={(e: any) => {
												handleChange(e);
												setFieldTouched('bnUnit');
											}}
										/> */}

                    <Input
                      label='Model Number'
                      value={values.model}
                      name='model'
                      isError={
                        (touched.model && errors.model) ||
                        (!isSubmitting &&
                          addProductState.error['error']['model'])
                      }
                      errorString={
                        (touched.model && errors.model) ||
                        (!isSubmitting &&
                          addProductState.error['error']['model'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('model');
                      }}
                    />

                    <h3 className='inputFieldLabel'>Description</h3>

                    <div
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                      }}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        data={description}
                        onInit={(editor) => {
                          // You can store the "editor" and use when it is needed.
                          console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setDescription(data);
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
													marginTop:"15px"
												}}></div> */}

                    {/* <h3 className='inputFieldLabel'>
												BN Description
                                             </h3>

											<div style={{
												width: '100%',
												maxWidth: '100%'
											}}>
												<CKEditor
													editor={ClassicEditor}
													data={bnDescription}
													onInit={editor => {
														// You can store the "editor" and use when it is needed.
														console.log('Editor is ready to use!', editor);
													}}
													onChange={(event, editor) => {
														const data = editor.getData();
														setBNDescription(data);
													}}
													onBlur={(event, editor) => {
														console.log('Blur.', editor);
													}}
													onFocus={(event, editor) => {
														console.log('Focus.', editor);
													}}
												/>
											</div> */}
                  </div>
                </div>

                <div className='addProductGridContainer__price'>
                  <div className='addProductGridContainer__item-header'>
                    <h3>Product Pricing *</h3>

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
                    <Tabs
                      animated={true}
                      tabPosition='top'
                      type='card'
                      activeKey={pricingTagActiveKey}
                      onChange={(value) => {
                        setpricingTagActiveKey(`${value}`);
                      }}
                    >
                      <TabPane tab='Add Variation' key='1'>
                        <Pricing
                          handleAddPricing={handleAddPricing}
                          pricingItem={editpricingItem}
                          handleUpdatePricing={handleUpdatePricing}
                          isPricingEditActive={isPricingEditActive}
                        />
                      </TabPane>
                      <TabPane tab='Pricing List' key='2'>
                        <div className='addProductGridContainer__item-body-pricingContainer'>
                          {pricing.length > 0 &&
                            pricing.map((item) => {
                              return (
                                <div className='addProductGridContainer__item-body-pricingContainer-item'>
                                  <div className='addProductGridContainer__item-body-pricingContainer-item-edit'>
                                    {/* <span>
																		<EditOutlined />
																		</span> */}
                                    <span
                                      className='pricingEditIcon'
                                      onClick={() => {
                                        handleEditPricing(item.id);
                                        setpricingTagActiveKey('1');
                                      }}
                                    >
                                      <EditOutlined />
                                    </span>
                                    <span
                                      className='pricingDeleteIcon'
                                      onClick={() =>
                                        handleDeletePricing(item.id)
                                      }
                                    >
                                      <DeleteOutlined />
                                    </span>
                                  </div>
                                  <div className='addProductGridContainer__item-body-pricingContainer-item-two'>
                                    <div>
                                      <h3>Price</h3>
                                      <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                        {item.price.offer ? (
                                          <>
                                            <h4>{item.price.offer}</h4>/
                                            <h5
                                              style={{
                                                textDecoration: 'line-through',
                                              }}
                                            >
                                              {item.price.regular}
                                            </h5>
                                          </>
                                        ) : (
                                          <h4>{item.price.regular}</h4>
                                        )}
                                      </div>
                                    </div>

                                    {item.stock && item.stock['available'] && (
                                      <div>
                                        <Badge
                                          overflowCount={999}
                                          count={item.stock.available}
                                        >
                                          <h3>Stock</h3>
                                        </Badge>
                                        {item.stock['minimum'] && (
                                          <>
                                            <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                              <div>
                                                <h6>
                                                  min
                                                  <Badge
                                                    className='site-badge-count-4'
                                                    overflowCount={999}
                                                    count={item.stock.minimum}
                                                  />
                                                </h6>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {item.attribute &&
                                    Object.values(item.attribute).length >
                                      0 && (
                                      <>
                                        <h3>Attributes</h3>
                                        <div className='addProductGridContainer__item-body-pricingContainer-item-body'>
                                          {item.attribute &&
                                            Object.keys(item.attribute).length >
                                              0 &&
                                            Object.keys(item.attribute).map(
                                              (attributeItem) => {
                                                return (
                                                  <div>
                                                    <h6>{attributeItem}</h6>
                                                    <h4>
                                                      {
                                                        item.attribute[
                                                          attributeItem
                                                        ]
                                                      }
                                                    </h4>
                                                  </div>
                                                );
                                              }
                                            )}
                                        </div>
                                      </>
                                    )}
                                </div>
                              );
                            })}

                          {!(pricing.length > 0) && (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Empty
                                description='No Pricing added'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            </div>
                          )}
                        </div>
                      </TabPane>
                    </Tabs>

                    <div className='addProductGridContainer__item-body-container'></div>
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
                  <div className='addProductGridContainer__item-body'>
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
                      // placeHolder={'category...'}
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

                    {/* <Input
                      label='BN Meta title'
                      value={values.bnMetaTitle}
                      placeHolder={'ক্যাটাগড়ি...'}
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
                    /> */}

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

                    {/* <TextArea
                      label='BN Meta Description'
                      value={values.bnMetaDescription}
                      placeholder={'এইয় মেট...'}
                      name='bnMetaDescription'
                      isError={
                        (touched.bnMetaDescription &&
                          errors.bnMetaDescription) ||
                        (!isSubmitting &&
                          addProductState.error['error']['bnMetaDescription'])
                      }
                      errorString={
                        (touched.bnMetaDescription &&
                          errors.bnMetaDescription) ||
                        (!isSubmitting &&
                          addProductState.error['error']['bnMetaDescription'])
                      }
                      onChange={(e: any) => {
                        handleChange(e);
                        setFieldTouched('bnMetaDescription');
                      }}
                    /> */}

                    <h3 className='inputFieldLabel'>Meta Tags</h3>

                    <MetaTags
                      // @ts-ignore
                      setTags={setMetaTags}
                      tags={metaTags}
                    />

                    {/* <div
                      style={{
                        marginTop: '15px',
                      }}
                    ></div>

                    <h3 className='inputFieldLabel'>
                      BN Meta Tags (মুদিখানা,ফ্যাশন)
                    </h3>

                    <MetaTags
                      // @ts-ignore
                      setTags={setBnMetaTags}
                      tags={bnMetaTags}
                    /> */}
                  </div>
                </div>
              </div>
              <div className='addProductGridContainer__right'>
                <div className='addProductGridContainer__category'>
                  <div className='addProductGridContainer-rightItemContainer'>
                    <div className='addProductGridContainer-rightItemContainer-header'>
                      <h3>Categories *</h3>

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
                      <h3>Tags</h3>
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
                <div className='addProductGridContainer__brand'>
                  <div className='addProductGridContainer-rightItemContainer'>
                    <div className='addProductGridContainer-rightItemContainer-header'>
                      <h3>Brand</h3>
                    </div>
                    <div className='addProductGridContainer-rightItemContainer-body'>
                      <Brands setBrandId={setBrandId} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
