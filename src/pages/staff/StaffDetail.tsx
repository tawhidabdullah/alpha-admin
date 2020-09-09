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
import StaffEdit from './StaffEdit';
import moment from 'moment';

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'staffDetail'
  );
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'tagProducts'
  );
  const [tagEditVisible, setTagEditVisible] = useState(false);

  const params = useParams();
  const tagId = params['id'];
  const [customerDetail, setCustomerDetail] = useState({});

  useEffect(() => {
    const getBrandDetail = async () => {
      const res = await handleTagDetailFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });

      // @ts-ignore
      if (res) {
        // @ts-ignore
        setCustomerDetail(res);
      }
    };

    getBrandDetail();
  }, [tagId]);

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

  console.log('tagProductsState', tagProductsState);

  console.log('brandParams', params);
  console.log('staffDetail', tagDetailState);

  return (
    <div className='brandDetailContainer'>
      <div className='brandDetailContainer__heading'>
        <h3>Staff Detail</h3>

        {tagDetailState.done &&
          customerDetail &&
          Object.keys(customerDetail).length > 0 && (
            <>
              <StaffEdit
                addNewCategoryVisible={tagEditVisible}
                setAddNewCategoryVisible={setTagEditVisible}
                customer={customerDetail}
                setCustomer={setCustomerDetail}
              />
              <Button
                onClick={() => setTagEditVisible(true)}
                type='link'
                icon={<EditOutlined />}
              >
                Edit
              </Button>
            </>
          )}
      </div>
      <Skeleton paragraph={{ rows: 2 }} loading={tagDetailState.isLoading}>
        {tagDetailState.done &&
          customerDetail &&
          !(Object.keys(customerDetail).length > 0) && (
            <Empty
              description='No Staffs found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          customerDetail &&
          Object.keys(customerDetail).length > 0 && (
            <div className='brandDetailContainer__header'>
              <div className='brandDetailContainer__header-info'>
                <h2>{customerDetail['name']}</h2>
                <h3>{customerDetail['description']}</h3>
                {customerDetail['designation'] && (
                  <h3>
                    DESIGNATION:
                    <span>{customerDetail['designation']}</span>
                  </h3>
                )}
                {customerDetail['salary'] && (
                  <h3>
                    SALARY:
                    <span>{customerDetail['salary']}</span>
                  </h3>
                )}

                {customerDetail['NID'] && (
                  <h3>
                    NID:
                    <span>{customerDetail['NID']}</span>
                  </h3>
                )}

                {customerDetail['joiningDate'] && (
                  <h3>
                    JOINED:
                    <span>
                      {customerDetail['joiningDate'] &&
                        moment(customerDetail['joiningDate']).format(
                          'MMMM Do YYYY, h:mm a'
                        )}
                    </span>
                  </h3>
                )}

                {customerDetail['fatherName'] && (
                  <h3>
                    FATHER'S NAME:
                    <span>{customerDetail['fatherName']}</span>
                  </h3>
                )}
                {customerDetail['motherName'] && (
                  <h3>
                    MOTHER'S NAME:
                    <span>{customerDetail['motherName']}</span>
                  </h3>
                )}

                {customerDetail['phone'] && (
                  <h3>
                    PHONE:
                    <span>{customerDetail['phone']}</span>
                  </h3>
                )}
                {customerDetail['email'] && (
                  <h3>
                    EMAIL:
                    <span>{customerDetail['email']}</span>
                  </h3>
                )}
              </div>
            </div>
          )}
      </Skeleton>

      {/* <div className='brandDetailContainer__heading'>
                <h3>
                    Products
                </h3>
            </div>
            <div className='brandDetailContainer__body'>
                {tagProductsState.isLoading && <DataTableSkeleton />}
                {tagProductsState.done && !(tagProductsState.data.length > 0) && (
                    <div style={{
                        marginTop: '100px'
                    }}>
                        <Empty description='No Orderss exists for this Customer ' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}

                {tagProductsState.done && tagProductsState.data && tagProductsState.data.length > 0 && (
                    <>
                        <Table
                            style={{
                                paddingTop: '10px',
                                borderRadius: '5px !important',
                                overflow: 'hidden',
                                boxShadow: '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)'
                            }}
                            // expandable={{
                            //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                            //     rowExpandable: record => record.name !== 'Not Expandable',
                            //   }}
                            // bordered={true}
                            size='small'
                            // pagination={false}
                            dataSource={tagProductsState.data}
                            tableLayout={'auto'}
                            onHeaderRow={column => {
                                return {
                                    style: {
                                        color: 'red !important'
                                    }

                                };
                            }}
                        >
                            <Column
                                title=""
                                dataIndex="cover"
                                key="id"
                                width={'80px'}

                                className='classnameofthecolumn'

                                render={(cover, record: any) => (
                                    <>
                                        <img
                                            onClick={() => {
                                                history.push(`/admin/product/${record.id}`)
                                            }}
                                            src={cover} alt='cover img' style={{
                                                height: '40px',
                                                width: '40px',
                                                objectFit: "contain",
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }} />




                                    </>
                                )}
                            />

                            <Column
                                title="Name"
                                dataIndex="name"
                                key="id"
                                className='classnameofthecolumn'
                                render={(text, record: any) => (
                                    <>
                                        <h4
                                            onClick={() => {
                                                history.push(`/admin/product/${record.id}`)
                                            }}
                                            style={{
                                                fontWeight: 400,
                                                color: '#555',
                                                cursor: 'pointer'

                                            }}>
                                            {text}
                                        </h4>


                                    </>
                                )}

                            />

                            <Column
                                title="Offer Price"
                                dataIndex="offerPrice"
                                key="id"
                                className='classnameofthecolumn'

                            />


                            <Column
                                title="Price"
                                dataIndex="price"
                                key="id"
                                className='classnameofthecolumn'

                            />

                        </Table>
                    </>
                )}

            </div> */}
    </div>
  );
};

export default NewBrandDetail;
