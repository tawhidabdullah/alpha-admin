import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

// import hooks
import { useHandleFetch } from '../../hooks';

// import lib
import {
  FileOutlined,
  InboxOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import {
  Skeleton,
  Empty,
  Popconfirm,
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Table,
  Space,
  Input as CoolInput,
  Tooltip,
  Modal,
} from 'antd';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import OrderEdit from './OrderEdit';
import OrderNoteEdit from './OrderNoteEdit';
import OrderInvoice from './OrderInvoice';
import { OrderDetail } from '.';

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Order Updated',
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

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'orderDetail'
  );
  const [orderDetailNotesState, handleOrderDetailNotesFetch] = useHandleFetch(
    {},
    'getOrderNote'
  );
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'tagProducts'
  );
  const [deleteOrderNoteState, handleDeleteOrderNoteFetch] = useHandleFetch(
    {},
    'deleteOrderNote'
  );
  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [activeOrderNote, setActiveOrderNote] = useState({});
  const [isOrderNoteEdit, setIsOrderNoteEdit] = useState(false);
  const [isInvoiceShow, setIsInvoiceShow] = useState(false);

  console.log('orderDetailNotesState', orderDetailNotesState);

  const params = useParams();
  const history = useHistory();
  const tagId = params['id'];
  const [orderNotes, setOrderNotes] = useState([]);

  useEffect(() => {
    const getBrandDetail = async () => {
      await handleTagDetailFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });

      const orderNotes = await handleOrderDetailNotesFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });

      // @ts-ignore
      if (orderNotes) {
        // @ts-ignore
        setOrderNotes(orderNotes);
      }
    };
    getBrandDetail();
  }, [tagId]);

  console.log('orderDetailState', tagDetailState);

  useEffect(() => {
    const getTagProducts = async () => {
      await handleTagProductsFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });
    };

    getTagProducts();
  }, [tagId]);

  console.log('orderDetailState', tagDetailState);

  console.log('brandParams', params);

  const handleDeleteOrderNote = async (id) => {
    const res = await handleDeleteOrderNoteFetch({
      urlOptions: {
        placeHolders: {
          id: id,
        },
      },
    });

    // @ts-ignore
    if (res && res.status === 'ok') {
      const newOrderNoteList =
        orderNotes && orderNotes.filter((item) => item._id !== id);
      setOrderNotes(newOrderNoteList);
      openSuccessNotification('Order note deleted!');
    }
  };

  console.log(
    "tagDetailState.data['products']",
    tagDetailState.data['products']
  );

  return (
    <div className='brandDetailContainer'>
      <OrderNoteEdit
        setOrderNotes={setOrderNotes}
        orderNotes={orderNotes}
        tagEditVisible={isOrderNoteEdit}
        setTagEditVisible={setIsOrderNoteEdit}
        customer={tagDetailState.data}
        activeNote={activeOrderNote}
      />
      <div className='brandDetailContainer__heading'>
        <h3>Order Detail</h3>

        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 && (
            <>
              <div>
                <OrderInvoice
                  setShowInvoice={setIsInvoiceShow}
                  showInvoice={isInvoiceShow}
                  id={tagDetailState['data']['id']}
                />
                <OrderEdit
                  setOrderNotes={setOrderNotes}
                  orderNotes={orderNotes}
                  tagEditVisible={tagEditVisible}
                  setTagEditVisible={setTagEditVisible}
                  customer={tagDetailState.data}
                />
                <Button
                  onClick={() => setIsInvoiceShow(true)}
                  type='link'
                  icon={<EyeOutlined />}
                >
                  Generate Invoice
                </Button>
                <Button
                  onClick={() => setTagEditVisible(true)}
                  type='link'
                  icon={<PlusOutlined />}
                >
                  Add note
                </Button>
              </div>
            </>
          )}
      </div>
      <Skeleton paragraph={{ rows: 2 }} loading={tagDetailState.isLoading}>
        {tagDetailState.done &&
          tagDetailState.data &&
          !(Object.keys(tagDetailState.data).length > 0) && (
            <Empty
              description='No Order found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 && (
            <>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    marginRight: '20px',
                  }}
                  className='brandDetailContainer__header'
                >
                  <div className='brandDetailContainer__header-info'>
                    <h2>{tagDetailState.data['name']}</h2>
                    <h3>{tagDetailState.data['description']}</h3>
                    {tagDetailState.data['url'] && (
                      <h3>
                        URL:
                        <span>{tagDetailState.data['url']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['country'] && (
                      <h3>
                        COUNTRY:
                        <span>{tagDetailState['data']['country']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['city'] && (
                      <h3>
                        CITY:
                        <span>{tagDetailState['data']['city']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['address1'] && (
                      <h3>
                        ADDRESS:
                        <span>{tagDetailState['data']['address1']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['phone'] && (
                      <h3>
                        PHONE:
                        <span>{tagDetailState['data']['phone']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['email'] && (
                      <h3>
                        EMAIL:
                        <span>{tagDetailState['data']['email']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['paymentMethod'] && (
                      <h3>
                        PAYMENT METHOD:
                        <span>{tagDetailState['data']['paymentMethod']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['paymentStatus'] && (
                      <h3>
                        PAYMENT STATUS:
                        <span>{tagDetailState['data']['paymentStatus']}</span>
                      </h3>
                    )}

                    {tagDetailState['data']['status'] && (
                      <h3>
                        ORDER STATUS:
                        <span>{tagDetailState['data']['status']}</span>
                      </h3>
                    )}

                    {/* 
                            {tagDetailState['data']['deliveryCharge'] && (
                                <h3>
                                    DELIVERY CHARGE:
                                    <span>
                                        {tagDetailState['data']['deliveryCharge']}
                                    </span>
                                </h3>
                            )} */}

                    {tagDetailState['data']['deliveryName'] && (
                      <h3>
                        DELIVERY LOCATION:
                        <span>
                          {`${tagDetailState['data']['deliveryName']}, ${tagDetailState['data']['deliveryPickUpLocation']}, ${tagDetailState['data']['deliveryCountryName']}`}
                        </span>
                      </h3>
                    )}

                    {tagDetailState['data']['total'] && (
                      <h3>
                        TOTAL ORDER PRICE:
                        <span>{`${tagDetailState['data']['total']}`}</span>
                      </h3>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    maxWidth: '35%',
                    minWidth: '35%',
                  }}
                  className='brandDetailContainer__header'
                >
                  <div
                    style={{
                      width: '100%',
                    }}
                    className='brandDetailContainer__header-info'
                  >
                    <h2>Notes</h2>

                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      {orderDetailNotesState.done &&
                        orderNotes &&
                        orderNotes.length > 0 &&
                        orderNotes.map((noteItem: any) => {
                          return (
                            <div className='OrderNoteItem'>
                              <div className='OrderNoteItem__action'>
                                {/* <span>
																		<EditOutlined />
																		</span> */}
                                <span
                                  className='OrderNoteItem__action-edit'
                                  onClick={() => {
                                    setActiveOrderNote(noteItem);
                                    setIsOrderNoteEdit(true);
                                  }}
                                >
                                  <EditOutlined />
                                </span>
                                <span
                                  className='OrderNoteItem__action-delete'
                                  onClick={() =>
                                    handleDeleteOrderNote(noteItem._id)
                                  }
                                >
                                  <DeleteOutlined />
                                </span>
                              </div>
                              <h4>
                                <span>NOTE:</span>
                                {` ${noteItem.note}`}
                              </h4>

                              {noteItem.summary && (
                                <>
                                  <h4>
                                    <span>SUMMARY :</span>

                                    {` ${noteItem.summary}`}
                                  </h4>
                                </>
                              )}
                            </div>
                          );
                        })}

                      {orderDetailNotesState.done &&
                        orderNotes &&
                        !(Object.keys(orderNotes).length > 0) && (
                          <>
                            <div
                              style={{
                                width: '100%',
                                margin: '100px 0',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Empty
                                description='No Notes found'
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                              />
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                </div>

                <div></div>
              </div>
            </>
          )}
      </Skeleton>

      {tagDetailState.done && (
        <>
          <div className='brandDetailContainer__heading'>
            <h3>Products</h3>
          </div>
        </>
      )}

      <div className='brandDetailContainer__body'>
        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 &&
          tagDetailState.data['products'] &&
          !(tagDetailState.data['products'].length > 0) && (
            <div
              style={{
                marginTop: '100px',
              }}
            >
              <Empty
                description='No Products exists for this order'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}

        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 &&
          tagDetailState.data['products'] &&
          tagDetailState.data['products'].length > 0 && (
            <>
              <Table
                style={{
                  paddingTop: '10px',
                  borderRadius: '5px !important',
                  overflow: 'hidden',
                  boxShadow:
                    '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)',
                }}
                size='small'
                dataSource={tagDetailState.data['products']}
                tableLayout={'auto'}
                onHeaderRow={(column) => {
                  return {
                    style: {
                      color: 'red !important',
                    },
                  };
                }}
              >
                <Column
                  title=''
                  dataIndex='cover'
                  key='id'
                  width={'80px'}
                  className='classnameofthecolumn'
                  render={(cover, record: any) => (
                    <>
                      <img
                        onClick={() => {
                          history.push(`/admin/product/${record.id}`);
                        }}
                        src={cover}
                        alt='cover img'
                        style={{
                          height: '40px',
                          width: '40px',
                          objectFit: 'contain',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      />
                    </>
                  )}
                />

                <Column
                  title='Name'
                  dataIndex='name'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <>
                      <h4
                        onClick={() => {
                          history.push(`/admin/product/${record.id}`);
                        }}
                        style={{
                          fontWeight: 400,
                          color: '#555',
                          cursor: 'pointer',
                        }}
                      >
                        {text}
                      </h4>
                    </>
                  )}
                />

                <Column
                  title='stock'
                  dataIndex='inStock'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <>
                      <h4
                        style={{
                          fontWeight: 400,
                          color: '#555',
                          cursor: 'pointer',
                        }}
                      >
                        {text ? 'inStock' : 'out of stock'}
                      </h4>
                    </>
                  )}
                />

                <Column
                  title='Unit Price'
                  dataIndex='unitPrice'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Quantity'
                  dataIndex='quantity'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Total Price'
                  dataIndex='price'
                  key='id'
                  className='classnameofthecolumn'
                />
              </Table>
            </>
          )}
      </div>
    </div>
  );
};

export default NewBrandDetail;
