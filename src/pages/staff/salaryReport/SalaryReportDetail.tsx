import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

// import hooks
import { useHandleFetch } from '../../../hooks';

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

import moment from 'moment';

// import components
import { DataTableSkeleton } from '../../../components/Placeholders';

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'getSalaryReportDetail'
  );
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'tagProducts'
  );

  const history = useHistory();
  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDetailData, setTagDetailData] = useState({});

  console.log('tagDetailDataSalaryreport!', tagDetailData);

  const params = useParams();
  const tagId = params['id'];

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
        setTagDetailData(res);
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

  return (
    <div className='brandDetailContainer'>
      <div className='brandDetailContainer__heading'>
        <h3>Salary Report detail</h3>
      </div>
      <Skeleton paragraph={{ rows: 2 }} loading={tagDetailState.isLoading}>
        {tagDetailState.done &&
          tagDetailData &&
          !(Object.keys(tagDetailData).length > 0) && (
            <Empty
              description='No Expense found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <div className='brandDetailContainer__header'>
              <div className='brandDetailContainer__header-info'>
                {tagDetailData['year'] && (
                  <h3>
                    YEAR:
                    <span>{tagDetailData['year']}</span>
                  </h3>
                )}
                {tagDetailData['month'] && (
                  <h3>
                    MONTH:
                    <span>
                      {tagDetailData['month'] && months[tagDetailData['month']]}
                    </span>
                  </h3>
                )}

                {tagDetailData['totalSalary'] && (
                  <h3>
                    TOTAL SALARY:
                    <span>{tagDetailState['totalSalary']}</span>
                  </h3>
                )}

                {tagDetailData['totalBonus'] && (
                  <h3>
                    TOTAL BONUS:
                    <span>{tagDetailData['totalBonus']}</span>
                  </h3>
                )}

                {tagDetailData['totalConvince'] && (
                  <h3>
                    TOTAL CONVINCE:
                    <span>{tagDetailData['totalConvince']}</span>
                  </h3>
                )}

                {tagDetailData['totalExtra'] && (
                  <h3>
                    TOTAL EXTRA:
                    <span>{tagDetailData['totalExtra']}</span>
                  </h3>
                )}

                {tagDetailData['totalNegative'] && (
                  <h3>
                    TOTAL NEGATIVE:
                    <span>{tagDetailData['totalNegative']}</span>
                  </h3>
                )}
              </div>
            </div>
          )}
      </Skeleton>

      {tagDetailState.done &&
        tagDetailState.data &&
        Object.keys(tagDetailState.data).length > 0 && (
          <>
            <div className='brandDetailContainer__heading'>
              <h3>Staffs</h3>
            </div>
          </>
        )}

      <div className='brandDetailContainer__body'>
        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 &&
          tagDetailState.data['staff'] &&
          !(tagDetailState.data['staff'].length > 0) && (
            <div
              style={{
                marginTop: '100px',
              }}
            >
              <Empty
                description='No Staffs exists for this Salary report'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}

        {tagDetailState.done &&
          tagDetailState.data &&
          Object.keys(tagDetailState.data).length > 0 &&
          tagDetailState.data['staff'] &&
          tagDetailState.data['staff'].length > 0 && (
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
                dataSource={tagDetailState.data['staff']}
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
                  title='Name'
                  dataIndex='name'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <>
                      <h4
                        onClick={() => {
                          history.push(`/admin/staff/${record.id}`);
                          // setcategoryDetailVisible(true);
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
                  title='Total Salary'
                  dataIndex='totalSalary'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Convince'
                  dataIndex='convince'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Extra'
                  dataIndex='extra'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Negative'
                  dataIndex='negative'
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
