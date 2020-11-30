import React, { useState, useEffect, useRef } from 'react';
import { Modal, Select, notification, Empty, Spin, Button } from 'antd';
import ReactToPdf from 'react-to-pdf';

import * as Yup from 'yup';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import ReactToPrint from 'react-to-print';

// import components
import config from '../../config.json';

// import components
import { useHandleFetch } from '../../hooks';

import moment from 'moment';

const { Option } = Select;

class ComponentToPrint extends React.Component {
  render() {
    const { orderDetailState, invoiceSettingsState, anotherRef } = this.props;

    return (
      <>
        <div ref={anotherRef} className='invoiceContainer'>
          <table
            width='100%'
            border={0}
            cellPadding={0}
            cellSpacing={0}
            align='center'
            className='fullTable'
            bgcolor='#fff'
          >
            <tbody>
              <tr>
                <td height={20} />
              </tr>
              <tr>
                <td>
                  <table
                    width={600}
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    align='center'
                    className='fullTable'
                    bgcolor='#ffffff'
                    style={{ borderRadius: '10px 10px 0 0' }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <table
                            width={570}
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            align='center'
                            className='fullPadding'
                          >
                            <tbody>
                              <tr>
                                <td>
                                  <table
                                    width={'100%'}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align='left'
                                    className='col'
                                    style={{
                                      borderBottom: '1px solid #eee',
                                      paddingBottom: '40px',
                                      marginBottom: '15px',
                                    }}
                                  >
                                    <tbody
                                      style={{
                                        marginBottom: '50px',
                                      }}
                                    >
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 12,
                                            color: '#5b5b5b',

                                            lineHeight: 1.6,
                                            verticalAlign: 'top',
                                            textAlign: 'left',
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              fontSize: '14px',
                                              fontWeight: '600',
                                              color: '#000',
                                            }}
                                          >
                                            Bill From:
                                          </span>
                                          <p>{invoiceSettingsState.done &&
                                            invoiceSettingsState.data &&
                                            Object.keys(
                                              invoiceSettingsState.data
                                            ).length > 0 &&
                                            invoiceSettingsState.data[
                                            'invoiceTitle'
                                            ]}
                                          </p>
                                          <p>
                                            {invoiceSettingsState.done &&
                                              invoiceSettingsState.data &&
                                              Object.keys(
                                                invoiceSettingsState.data
                                              ).length > 0 &&
                                              invoiceSettingsState.data[
                                              'address'
                                              ]}
                                          </p>
                                          <p>
                                            {invoiceSettingsState.done &&
                                              invoiceSettingsState.data &&
                                              Object.keys(
                                                invoiceSettingsState.data
                                              ).length > 0 &&
                                              invoiceSettingsState.data[
                                              'phone'
                                              ]}
                                          </p>
                                          <p>
                                            {invoiceSettingsState.done &&
                                              invoiceSettingsState.data &&
                                              Object.keys(
                                                invoiceSettingsState.data
                                              ).length > 0 &&
                                              invoiceSettingsState.data[
                                              'email'
                                              ]}
                                          </p>
                                          <br />



                                        </td>

                                        <td
                                          style={{
                                            verticalAlign: 'top',
                                          }}
                                          align='right'
                                        >
                                          {' '}
                                          <img
                                            src={`${config.baseURL}/images/logo.png`}
                                            style={{
                                              width: '175px'
                                            }}
                                            alt='logo'
                                            border={0}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    width={'100%'}
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    align='left'
                                    className='col'
                                  >
                                    <tbody>
                                      <tr className='visibleMobile'>
                                        <td height={20} />
                                      </tr>
                                      <tr>
                                        <td height={5} />
                                      </tr>
                                      <tr></tr>
                                      <tr></tr>
                                      <tr>
                                        <td
                                          style={{
                                            fontSize: 12,
                                            color: '#5b5b5b',

                                            lineHeight: 1.6,
                                            verticalAlign: 'top',
                                            textAlign: 'left',
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              fontSize: '14px',
                                              fontWeight: '600',
                                              color: '#000',
                                            }}
                                          >
                                            Bill To:
                                          </span>

                                          <p>
                                            {orderDetailState.data['name']}
                                          </p>
                                          <p>
                                            {orderDetailState.data['phone']}
                                          </p>
                                          <p>
                                            {orderDetailState.data['address']}
                                          </p>
                                          <p>
                                            {orderDetailState.data['email']}
                                          </p>
                                        </td>

                                        <td
                                          style={{
                                            fontSize: 13,
                                            color: '#5b5b5b',

                                            lineHeight: 1.6,
                                            verticalAlign: 'top',
                                            textAlign: 'right',
                                          }}
                                        >
                                          <p><strong>ORDER ID #
                                          {orderDetailState.data['shortCode']}</strong></p>
                                          <span>
                                            {orderDetailState.data[
                                              'date_created'
                                            ] &&
                                              moment(
                                                orderDetailState.data[
                                                'date_created'
                                                ]
                                              ).format('MMMM Do YYYY, h:mm a')}
                                          </span>
                                          <br />
                                          <span>
                                            <br />
                                            <p><strong>Delivery Zone:</strong></p>
                                            {`${orderDetailState['data']['deliveryName']}, ${orderDetailState['data']['deliveryPickUpLocation']}, ${orderDetailState['data']['deliveryCountryName']}`}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          {orderDetailState.data &&
            orderDetailState.data['products'] &&
            orderDetailState.data['products'].length > 0 && (
              <table
                width='100%'
                border={0}
                cellPadding={0}
                cellSpacing={0}
                align='center'
                className='fullTable'
                bgcolor='#fff'
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        width={600}
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        align='center'
                        className='fullTable'
                        bgcolor='#ffffff'
                      >
                        <tbody>
                          <tr></tr>
                          <tr className='hiddenMobile'>
                            <td height={60} />
                          </tr>
                          <tr className='visibleMobile'>
                            <td height={40} />
                          </tr>
                          <tr>
                            <td>
                              <table
                                width={570}
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                align='center'
                                className='fullPadding'
                              >
                                <tbody>
                                  <tr
                                    style={{
                                      backgroundColor: '#eee',
                                    }}
                                  >
                                    <th
                                      style={{
                                        fontSize: 12,
                                        color: '#5b5b5b',
                                        fontWeight: 'normal',
                                        lineHeight: 1.6,
                                        verticalAlign: 'top',
                                        padding: '5px 10px 5px 5px',
                                      }}
                                      width='50%'
                                      align='left'
                                    >
                                      Name
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 12,
                                        color: '#5b5b5b',
                                        fontWeight: 'normal',
                                        lineHeight: 1.6,
                                        verticalAlign: 'center',
                                        textAlign: 'center'
                                      }}
                                      align='left'
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 12,
                                        color: '#1e2b33',
                                        fontWeight: 'normal',
                                        lineHeight: 1.6,
                                        verticalAlign: 'center',
                                        textAlign: 'center'
                                      }}
                                      align='left'
                                    >
                                      Unit Price
                                    </th>
                                    <th
                                      style={{
                                        fontSize: 12,
                                        color: '#1e2b33',
                                        fontWeight: 'normal',
                                        lineHeight: 1.6,
                                        verticalAlign: 'center',
                                        textAlign: 'right',
                                        paddingRight: '5px',
                                      }}
                                      align='right'
                                    >
                                      Total Price
                                    </th>
                                  </tr>

                                  {orderDetailState.data['products'].map(
                                    (item) => {
                                      return (
                                        <>
                                          <tr>
                                            <td
                                              height={1}
                                              style={{
                                                background: '#bebebe',
                                              }}
                                              colSpan={4}
                                            />
                                          </tr>
                                          {/* <tr>
                                            <td height={10} colSpan={4} />
                                          </tr> */}
                                          <tr>
                                            <td
                                              width='30%'
                                              style={{
                                                fontSize: 12,
                                                color: '#ff0000',
                                                lineHeight: 1.6,
                                                verticalAlign: 'top',
                                                padding: '6px 0',
                                              }}
                                              className='article'
                                            >
                                              {item.name}
                                            </td>

                                            <td
                                              style={{
                                                fontSize: 12,
                                                color: '#646a6e',
                                                lineHeight: 1.6,
                                                verticalAlign: 'top',
                                                padding: '6px 0',
                                                textAlign: 'center'
                                              }}
                                              align='left'
                                            >
                                              {item.quantity}
                                            </td>
                                            <td
                                              style={{
                                                fontSize: 12,
                                                color: '#1e2b33',
                                                lineHeight: 1.6,
                                                verticalAlign: 'top',
                                                padding: '6px 0',
                                                textAlign: 'center'
                                              }}
                                              align='left'
                                            >
                                              {item.unitPrice}
                                            </td>

                                            <td
                                              style={{
                                                fontSize: 12,

                                                color: '#1e2b33',
                                                lineHeight: 1.6,
                                                verticalAlign: 'top',
                                                padding: '6px 0',
                                              }}
                                              align='right'
                                            >
                                              {item.quantity * item.unitPrice}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    }
                                  )}
                                  <tr>
                                    <td
                                      height={1}
                                      colSpan={4}
                                      style={{
                                        borderBottom: '1px solid #eee',
                                      }}
                                    />
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td height={20} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          <table
            width='100%'
            border={0}
            cellPadding={0}
            cellSpacing={0}
            align='center'
            className='fullTable'
            bgcolor='#fff'
          >
            <tbody>
              <tr>
                <td>
                  <table
                    width={600}
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    align='center'
                    className='fullTable'
                    bgcolor='#ffffff'
                  >
                    <tbody
                      style={{
                        marginBottom: '20px',
                      }}
                    >
                      <tr>
                        <td>
                          {/* Table Total */}
                          <table
                            style={{
                              marginBottom: '50px',
                              marginTop: '30px',
                            }}
                            width={570}
                            border={0}
                            cellPadding={0}
                            cellSpacing={0}
                            align='center'
                            className='fullPadding'
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: '#646a6e',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                  }}
                                >
                                  Total Price
                                </td>
                                <td
                                  style={{
                                    fontSize: 13,
                                    color: '#646a6e',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '600',
                                    marginBottom: '5px',
                                  }}
                                  width={80}
                                >
                                  {orderDetailState.data['total']}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: '#646a6e',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                  }}
                                >
                                  Shipping &amp; Delivery
                                </td>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: '#646a6e',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                  }}
                                >
                                  {orderDetailState.data &&
                                    orderDetailState.data['total'] > 5000
                                    ? 'Free'
                                    : orderDetailState.data &&
                                      orderDetailState.data[
                                      'deliveryCharge'
                                      ] === 0
                                      ? 'Free'
                                      : `+${orderDetailState.data &&
                                      orderDetailState.data['deliveryCharge']
                                      }`}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: '#000',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                  }}
                                >
                                  <strong>Grand Total (Incl.Delivery)</strong>
                                </td>
                                <td
                                  style={{
                                    fontSize: 12,
                                    color: '#000',
                                    lineHeight: 1.6,
                                    verticalAlign: 'top',
                                    textAlign: 'right',
                                  }}
                                >
                                  <strong>
                                    {orderDetailState.data['total'] +
                                      orderDetailState.data['deliveryCharge'] ||
                                      0}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

const OrderInvoice = ({ id, setShowInvoice, showInvoice }) => {
  const [orderDetailState, handleOrderDetailFetch] = useHandleFetch(
    {},
    'orderDetail'
  );
  const componentRef = useRef();

  const ref = React.createRef();
  const options = {
    orientation: 'a4',
    unit: 'in',
    format: [4, 2],
  };

  const [invoiceSettingsState, handlSiteInvoiceSettingsFetch] = useHandleFetch(
    {},
    'invoiceSettingsDetail'
  );

  useEffect(() => {
    const getSiteSettings = async () => {
      const invoiceSettingsRes = await handlSiteInvoiceSettingsFetch({});
      // console.log('siteSettingsRes', siteSettingsRes);
    };
    getSiteSettings();
  }, []);

  useEffect(() => {
    const getOrderDetail = async () => {
      await handleOrderDetailFetch({
        urlOptions: {
          placeHolders: {
            id,
          },
        },
      });
    };

    getOrderDetail();
  }, [id]);

  console.log('orderDetailState', orderDetailState);

  const handleOk = () => {
    window.print();
  };

  return (
    <Modal
      title='Invoice'
      visible={showInvoice}
      bodyStyle={{
        margin: '0',
        padding: '10px',
      }}
      style={{
        top: '40px',
      }}
      onCancel={() => setShowInvoice(false)}
      width={'48vw'}
      okText='Print'
      onOk={() => handleOk()}
      footer={false}
    >
      {orderDetailState.isLoading && <Spin />}
      {orderDetailState.data && Object.keys(orderDetailState.data).length > 0 && (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              padding: '20px 20px 20px 20px',
            }}
          >
            <ReactToPdf
              targetRef={ref}
              y={15}
              x={25}
              filename={`order-${orderDetailState.data['shortCode']}-invoice`}
              options={{
                orientation: 'a4',
              }}
            >
              {({ toPdf }) => (
                <Button
                  style={{
                    marginRight: '15px',
                  }}
                  onClick={toPdf}
                  // type="primary"
                  className='btnPrimaryClassNameoutline'
                  icon={<FilePdfOutlined />}
                >
                  Download as pdf
                </Button>
              )}
            </ReactToPdf>
            <ReactToPrint
              documentTitle='Order Invoice'
              trigger={() => (
                <Button
                  // type="primary"
                  className='btnPrimaryClassNameoutline'
                  icon={<PrinterOutlined />}
                >
                  Print
                </Button>
              )}
              content={() => componentRef.current}
            />
          </div>
          <ComponentToPrint
            ref={componentRef}
            anotherRef={ref}
            invoiceSettingsState={invoiceSettingsState}
            orderDetailState={orderDetailState}
          />
        </>
      )}
    </Modal>
  );
};
export default OrderInvoice;
