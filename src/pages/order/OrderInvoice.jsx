import React, { useState, useEffect } from 'react';
import { Modal, Select, notification, Empty, Spin } from 'antd';
import * as Yup from 'yup';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

// import components
import { useHandleFetch } from '../../hooks';

import moment from 'moment';

const { Option } = Select;

const QuickEdit = ({ id, setShowInvoice, showInvoice }) => {
  const [orderDetailState, handleOrderDetailFetch] = useHandleFetch(
    {},
    'orderDetail'
  );

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
      onCancel={() => setShowInvoice(false)}
      width={'60vw'}
      okText='Print'
      onOk={() => handleOk()}
    >
      {orderDetailState.isLoading && <Spin />}
      {orderDetailState.data && Object.keys(orderDetailState.data).length > 0 && (
        <>
          <div className='invoiceContainer'>
            <table
              width='100%'
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align='center'
              className='fullTable'
              bgcolor='#e1e1e1'
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
                        <tr className='hiddenMobile'>
                          <td height={40} />
                        </tr>
                        <tr className='visibleMobile'>
                          <td height={30} />
                        </tr>
                        <tr>
                          <td>
                            <table
                              width={480}
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
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='left'
                                      className='col'
                                    >
                                      <tbody>
                                        {/* <tr>
                                                                                    <td align="left">
                                                                                        {" "}
                                                                                        // <img
                                                                                        //     src="http://www.supah.it/dribbble/017/logo.png"
                                                                                        //     width={32}
                                                                                        //     height={32}
                                                                                        //     alt="logo"
                                                                                        //     border={0}
                                                                                        // />
                                                                                    </td>
                                                                                </tr> */}
                                        <tr className='hiddenMobile'>
                                          <td height={40} />
                                        </tr>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 12,
                                              color: '#5b5b5b',
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                              textAlign: 'left',
                                            }}
                                          >
                                            Hello,{' '}
                                            {orderDetailState.data['name']}
                                            <br /> Thank you for your order.
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='right'
                                      className='col'
                                    >
                                      <tbody>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td height={5} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 21,
                                              color: '#ff0000',
                                              letterSpacing: '-1px',
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                              textAlign: 'right',
                                            }}
                                          >
                                            Invoice
                                          </td>
                                        </tr>
                                        <tr></tr>
                                        <tr className='hiddenMobile'>
                                          <td height={50} />
                                        </tr>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 12,
                                              color: '#5b5b5b',
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                              textAlign: 'right',
                                            }}
                                          >
                                            <small>ORDER</small> #
                                            {orderDetailState.data['shortCode']}
                                            <br />
                                            <small>
                                              {orderDetailState.data[
                                                'date_created'
                                              ] &&
                                                moment(
                                                  orderDetailState.data[
                                                    'date_created'
                                                  ]
                                                ).format(
                                                  'MMMM Do YYYY, h:mm a'
                                                )}
                                            </small>
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
            {/* /Header */}
            {/* Order Details */}
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
                  bgcolor='#e1e1e1'
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
                                  width={480}
                                  border={0}
                                  cellPadding={0}
                                  cellSpacing={0}
                                  align='center'
                                  className='fullPadding'
                                >
                                  <tbody>
                                    <tr>
                                      <th
                                        style={{
                                          fontSize: 12,
                                          fontFamily: '"Open Sans", sans-serif',
                                          color: '#5b5b5b',
                                          fontWeight: 'normal',
                                          lineHeight: 1.6,
                                          verticalAlign: 'top',
                                          padding: '0 10px 7px 0',
                                        }}
                                        width='52%'
                                        align='left'
                                      >
                                        Name
                                      </th>

                                      <th
                                        style={{
                                          fontSize: 12,
                                          fontFamily: '"Open Sans", sans-serif',
                                          color: '#5b5b5b',
                                          fontWeight: 'normal',
                                          lineHeight: 1.6,
                                          verticalAlign: 'top',
                                          padding: '0 0 7px',
                                        }}
                                        align='center'
                                      ></th>
                                      <th
                                        style={{
                                          fontSize: 12,
                                          fontFamily: '"Open Sans", sans-serif',
                                          color: '#5b5b5b',
                                          fontWeight: 'normal',
                                          lineHeight: 1.6,
                                          verticalAlign: 'top',
                                          padding: '0 0 7px',
                                        }}
                                        align='center'
                                      >
                                        Quantity
                                      </th>
                                      <th
                                        style={{
                                          fontSize: 12,
                                          fontFamily: '"Open Sans", sans-serif',
                                          color: '#1e2b33',
                                          fontWeight: 'normal',
                                          lineHeight: 1.6,
                                          verticalAlign: 'top',
                                          padding: '0 0 7px',
                                        }}
                                        align='right'
                                      >
                                        Unit Price
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
                                            <tr>
                                              <td height={10} colSpan={4} />
                                            </tr>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 12,
                                                  fontFamily:
                                                    '"Open Sans", sans-serif',
                                                  color: '#ff0000',
                                                  lineHeight: 1.6,
                                                  verticalAlign: 'top',
                                                  padding: '10px 0',
                                                }}
                                                className='article'
                                              >
                                                {item.name}
                                              </td>

                                              <td
                                                style={{
                                                  fontSize: 12,
                                                  fontFamily:
                                                    '"Open Sans", sans-serif',
                                                  color: '#646a6e',
                                                  lineHeight: 1.6,
                                                  verticalAlign: 'top',
                                                  padding: '10px 0',
                                                }}
                                                align='center'
                                              >
                                                {item.quantity}
                                              </td>
                                              <td
                                                style={{
                                                  fontSize: 12,
                                                  fontFamily:
                                                    '"Open Sans", sans-serif',
                                                  color: '#1e2b33',
                                                  lineHeight: 1.6,
                                                  verticalAlign: 'top',
                                                  padding: '10px 0',
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
                                          borderBottom: '1px solid #e4e4e4',
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
            {/* /Order Details */}
            {/* Total */}
            <table
              width='100%'
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align='center'
              className='fullTable'
              bgcolor='#e1e1e1'
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
                        <tr>
                          <td>
                            {/* Table Total */}
                            <table
                              width={480}
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
                                      fontFamily: '"Open Sans", sans-serif',
                                      color: '#646a6e',
                                      lineHeight: 1.6,
                                      verticalAlign: 'top',
                                      textAlign: 'right',
                                    }}
                                  >
                                    Total
                                  </td>
                                  <td
                                    style={{
                                      fontSize: 12,
                                      fontFamily: '"Open Sans", sans-serif',
                                      color: '#646a6e',
                                      lineHeight: 1.6,
                                      verticalAlign: 'top',
                                      textAlign: 'right',
                                      whiteSpace: 'nowrap',
                                    }}
                                    width={80}
                                  >
                                    {orderDetailState.data['total']}
                                  </td>
                                </tr>
                                {/* <tr>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#646a6e",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        Shipping &amp; Handling
                        </td>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#646a6e",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        $15.00
                        </td>
                                                                </tr> */}
                                {/* <tr>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#000",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        <strong>Grand Total (Incl.Tax)</strong>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#000",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        <strong>$344.90</strong>
                                                                    </td>
                                                                </tr> */}
                                {/* <tr>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#b0b0b0",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        <small>TAX</small>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            fontSize: 12,
                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                            color: "#b0b0b0",
                                                                            lineHeight: 1.6,
                                                                            verticalAlign: "top",
                                                                            textAlign: "right"
                                                                        }}
                                                                    >
                                                                        <small>$72.40</small>
                                                                    </td>
                                                                </tr> */}
                              </tbody>
                            </table>
                            {/* /Table Total */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* /Total */}
            {/* Information */}
            <table
              width='100%'
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align='center'
              className='fullTable'
              bgcolor='#e1e1e1'
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
                              width={480}
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
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='left'
                                      className='col'
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 11,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            <strong>BILLING INFORMATION</strong>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td width='100%' height={10} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 12,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            {orderDetailState.data['name']}
                                            <br />{' '}
                                            {orderDetailState.data['country']}
                                            <br />{' '}
                                            {orderDetailState.data['city']}
                                            <br />
                                            {orderDetailState.data['address']}
                                            <br />{' '}
                                            {orderDetailState.data['phone']}
                                            <br />{' '}
                                            {orderDetailState.data['email']}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='right'
                                      className='col'
                                    >
                                      <tbody>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 11,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            <strong>Status</strong>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td width='100%' height={10} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 12,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            {
                                              orderDetailState.data[
                                                'paymentStatus'
                                              ]
                                            }
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
                        <tr>
                          <td>
                            <table
                              width={480}
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
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='left'
                                      className='col'
                                    >
                                      <tbody>
                                        <tr className='hiddenMobile'>
                                          <td height={35} />
                                        </tr>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          {/* <td
                                                                                        style={{
                                                                                            fontSize: 11,
                                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                                            color: "#5b5b5b",
                                                                                            lineHeight: 1.6,
                                                                                            verticalAlign: "top"
                                                                                        }}
                                                                                    >
                                                                                        <strong>SHIPPING INFORMATION</strong>
                                                                                    </td> */}
                                        </tr>
                                        <tr>
                                          <td width='100%' height={10} />
                                        </tr>
                                        <tr>
                                          {/* <td
                                                                                        style={{
                                                                                            fontSize: 12,
                                                                                            fontFamily: '"Open Sans", sans-serif',
                                                                                            color: "#5b5b5b",
                                                                                            lineHeight: 1.6,
                                                                                            verticalAlign: "top"
                                                                                        }}
                                                                                    >
                                                                                        Sup Inc
                                  <br /> Another Place, Somewhere
                                  <br /> New York NY
                                  <br /> 4468, United States
                                  <br /> T: 202-555-0171
                                </td> */}
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      width={220}
                                      border={0}
                                      cellPadding={0}
                                      cellSpacing={0}
                                      align='right'
                                      className='col'
                                    >
                                      <tbody>
                                        <tr className='hiddenMobile'>
                                          <td height={35} />
                                        </tr>
                                        <tr className='visibleMobile'>
                                          <td height={20} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 11,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            {/* <strong>SHIPPING METHOD</strong> */}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td width='100%' height={10} />
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 12,
                                              fontFamily:
                                                '"Open Sans", sans-serif',
                                              color: '#5b5b5b',
                                              lineHeight: 1.6,
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            {/* UPS: U.S. Shipping Services */}
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
                        <tr className='hiddenMobile'>
                          <td height={60} />
                        </tr>
                        <tr className='visibleMobile'>
                          <td height={30} />
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* /Information */}
            <table
              width='100%'
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align='center'
              className='fullTable'
              bgcolor='#e1e1e1'
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
                      style={{ borderRadius: '0 0 10px 10px' }}
                    >
                      <tbody>
                        <tr>
                          <td>
                            <table
                              width={480}
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
                                      color: '#5b5b5b',
                                      fontFamily: '"Open Sans", sans-serif',
                                      lineHeight: 1.6,
                                      verticalAlign: 'top',
                                      textAlign: 'left',
                                    }}
                                  >
                                    Have a nice day.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr className='spacer'>
                          <td height={50} />
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
          </div>
          ;
        </>
      )}
    </Modal>
  );
};

export default QuickEdit;
