import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

// import hooks
import { useHandleFetch } from '../../hooks';

// import lib
import { EditOutlined } from '@ant-design/icons';

import {
  Skeleton,
  Empty,
  Button,
  notification,
  Table,
  Space,
  Input as CoolInput,
  Tooltip,
  Modal,
  Badge,
} from 'antd';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import ProductEdit from './ProductEdit';

// import state
import { isAccess } from '../../utils';
import { connect } from 'react-redux';

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

interface Props {
  roles: any;
}

const NewBrandDetail = ({ roles }: Props) => {
  const [productDetailState, handleProductDetailFetch] = useHandleFetch(
    {},
    'productDetailById'
  );

  const params = useParams();
  const history = useHistory();
  const productId = params['id'];
  const [productEditVisible, setProductEditVisible] = useState(false);
  const [productDetailData, setProductDetailData] = useState({});

  useEffect(() => {
    const getProductDetail = async () => {
      const productDetailRes = await handleProductDetailFetch({
        urlOptions: {
          placeHolders: {
            id: productId,
          },
        },
      });

      // @ts-ignore
      if (productDetailRes) {
        // @ts-ignore
        setProductDetailData(productDetailRes);
      }

      console.log('productDetailRes', productDetailRes);
    };

    getProductDetail();
  }, [productId]);

  console.log('productDetailState', productDetailState);

  console.log('brandParams', params);

  const getImagesInCollumn = (imgs) => {
    if (!imgs[0]) return false;
    imgs = imgs.map((item) => item.cover);
    const columns = {};

    let localIndex = 0;
    let columnNumber = 0;

    imgs.forEach((item, index) => {
      if (localIndex < 3) {
        if (columns[columnNumber]) {
          columns[columnNumber] = [...columns[columnNumber], item];
        } else columns[columnNumber] = [item];

        localIndex = localIndex + 1;
        columnNumber = columnNumber + 1;
      } else {
        localIndex = 0;
        columnNumber = 0;
        console.log('localIndex', localIndex);
      }
    });

    return columns;
  };

  const row =
    productDetailState.done && productDetailData && productDetailData['image']
      ? getImagesInCollumn(productDetailData['image'])
      : [];

  return (
    <div className='brandDetailContainer'>
      <div className='brandDetailContainer__heading'>
        <h3>Product Detail</h3>

        {productDetailState.done &&
          productDetailData &&
          Object.keys(productDetailData).length > 0 && (
            <>
              <ProductEdit
                productEditVisible={productEditVisible}
                setProductEditVisible={setProductEditVisible}
                productDetailData={productDetailData}
                setProductDetailData={setProductDetailData}
              />
              {isAccess('postCatalogue', roles) && (
                <Button
                  onClick={() => setProductEditVisible(true)}
                  type='link'
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
              )}
            </>
          )}
      </div>
      <Skeleton
        avatar
        paragraph={{ rows: 3 }}
        loading={productDetailState.isLoading}
      >
        {productDetailState.done &&
          productDetailData &&
          !(Object.keys(productDetailData).length > 0) && (
            <Empty
              description='No Product found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {productDetailState.done &&
          productDetailData &&
          Object.keys(productDetailData).length > 0 && (
            <>
              <div className='brandDetailContainer__header'>
                <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-product'>
                  <img
                    src={
                      productDetailData['cover'] &&
                      productDetailData['cover']['cover']
                    }
                    alt=''
                  />
                </div>
                <div className='brandDetailContainer__header-info'>
                  <h2>{productDetailData['name']}</h2>
                  <h4>{productDetailData['price']}</h4>
                  <h3>{productDetailData['description']}</h3>

                  {productDetailData['url'] && (
                    <h3>
                      URL:
                      <span>{productDetailData['url']}</span>
                    </h3>
                  )}

                  {/* 
                                {productDetailData['tags'] && productDetailData['tags'].length > 0 &&
                                    (<>
                                        <h3>
                                            TAGS:
                                        {productDetailData['tags'].map(tag => {
                                            return (
                                                <span>
                                                    {tag.name}
                                                </span>
                                            )
                                        })}
                                        </h3>

                                    </>)
                                } */}

                  {productDetailData['category'] &&
                    productDetailData['category'].length > 0 && (
                      <>
                        <h3>
                          CATEGORIES:
                          {productDetailData['category'].map((cat) => {
                            return (
                              <span
                                onClick={() =>
                                  history.push(`/admin/category/${cat.id}`)
                                }
                              >
                                {cat.name}
                              </span>
                            );
                          })}
                        </h3>
                      </>
                    )}

                  {productDetailData['tags'] &&
                    productDetailData['tags'].length > 0 && (
                      <>
                        <h3>
                          TAGS:
                          {productDetailData['tags'].map((cat) => {
                            return (
                              <span
                                onClick={() =>
                                  history.push(`/admin/tag/${cat._id}`)
                                }
                              >
                                {cat.name}
                              </span>
                            );
                          })}
                        </h3>
                      </>
                    )}
                </div>
              </div>

              {productDetailData['icon'] && (
                <>
                  <div className='brandDetailContainer__heading'>
                    <h3>Icon</h3>
                  </div>

                  <div className='brandDetailContainer__inlineBox'>
                    <div className='brandDetailContainer__header-coverContainer brandDetailContainer__header-coverContainer-icon'>
                      <img
                        src={
                          productDetailData['icon'] && productDetailData['icon']
                        }
                        alt=''
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: '25px',
                    }}
                  ></div>
                </>
              )}

              {productDetailData['pricing'] &&
                productDetailData['pricing'].length > 0 && (
                  <>
                    <div className='brandDetailContainer__heading'>
                      <h3>Pricing</h3>
                    </div>

                    <div className='brandDetailContainer__pricing'>
                      <div className='addProductGridContainer__item-body-pricingContainer'>
                        {productDetailData['pricing'].map((item) => {
                          return (
                            <div className='addProductGridContainer__item-body-pricingContainer-item'>
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

                                {item.stock && (
                                  <div>
                                    <Badge
                                      overflowCount={999}
                                      count={item.stock.available}
                                    >
                                      <h3>Stock</h3>
                                    </Badge>
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
                                  </div>
                                )}
                              </div>

                              {item.attribute &&
                                Object.values(item.attribute).length > 0 && (
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
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: '25px',
                      }}
                    ></div>
                  </>
                )}

              {productDetailData['image'] &&
                productDetailData['image'].length > 0 && (
                  <>
                    <div className='brandDetailContainer__heading'>
                      <h3>Image Gallary</h3>
                    </div>

                    <div className='brandDetailContainer__imageGallary'>
                      <div className='imgGallaryContainer'>
                        <div className='imgGallary-row'>
                          {row &&
                            Object.keys(row).map((column) => {
                              return (
                                <div className='imgGallary-column'>
                                  {row[column] &&
                                    row[column].map((img) => {
                                      return (
                                        <img
                                          src={img}
                                          style={{
                                            width: '100%',
                                          }}
                                        />
                                      );
                                    })}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: '25px',
                      }}
                    ></div>
                  </>
                )}

              {productDetailData['brand'] &&
                Object.keys(productDetailData['brand']).length > 0 && (
                  <>
                    <div className='brandDetailContainer__heading'>
                      <h3>Brand</h3>
                    </div>

                    <div
                      onClick={() =>
                        history.push(
                          `/admin/brand/${productDetailData['brand']['id']}`
                        )
                      }
                      className='brandDetailContainer__brand'
                    >
                      <div className='brandDetailContainer__brand-coverbox'>
                        <img
                          src={
                            productDetailData['brand']['cover'] &&
                            productDetailData['brand']['cover']
                          }
                          alt=''
                        />
                      </div>
                      <div className='brandDetailContainer__brand-info'>
                        <h2>{productDetailData['brand']['name']}</h2>
                        <h3>{productDetailData['brand']['description']}</h3>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: '25px',
                      }}
                    ></div>
                  </>
                )}

              {productDetailData['primaryCategory'] &&
                Object.keys(productDetailData['primaryCategory']).length >
                  0 && (
                  <>
                    <div className='brandDetailContainer__heading'>
                      <h3>Primary Category</h3>
                    </div>

                    <div
                      onClick={() =>
                        history.push(
                          `/admin/category/${productDetailData['primaryCategory']['id']}`
                        )
                      }
                      className='brandDetailContainer__brand'
                    >
                      <div className='brandDetailContainer__brand-coverbox'>
                        <img
                          src={
                            productDetailData['primaryCategory']['cover'] &&
                            productDetailData['primaryCategory']['cover']
                          }
                          alt=''
                        />
                      </div>
                      <div className='brandDetailContainer__brand-info'>
                        <h2>{productDetailData['primaryCategory']['name']}</h2>
                        <h3>
                          {productDetailData['primaryCategory']['description']}
                        </h3>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: '25px',
                      }}
                    ></div>
                  </>
                )}
            </>
          )}
      </Skeleton>
    </div>
  );
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, null)(NewBrandDetail);
