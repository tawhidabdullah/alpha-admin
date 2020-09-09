import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

// import hooks
import { useHandleFetch } from '../../../hooks';

// import lib
import { EditOutlined } from '@ant-design/icons';

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
import { DataTableSkeleton } from '../../../components/Placeholders';
import TagEdit from './AreaEdit';
import moment from 'moment';
const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'dealerAreaDetail'
  );
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'dealerListByArea'
  );

  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDetailData, setTagDetailData] = useState({});

  console.log('dealerListByArea', tagProductsState);
  const params = useParams();
  const history = useHistory();
  const tagId = params['id'];

  useEffect(() => {
    const getBrandDetail = async () => {
      const tagDetailRes = await handleTagDetailFetch({
        urlOptions: {
          placeHolders: {
            id: tagId,
          },
        },
      });

      // @ts-ignore
      if (tagDetailRes) {
        console.log('tagDetailRes', tagDetailRes);
        // @ts-ignore
        setTagDetailData(tagDetailRes);
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
        <h3>Area Detail</h3>

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <>
              <TagEdit
                tagEditVisible={tagEditVisible}
                setTagEditVisible={setTagEditVisible}
                tagDetailData={tagDetailData}
                setTagDetailData={setTagDetailData}
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
          tagDetailData &&
          !(Object.keys(tagDetailData).length > 0) && (
            <Empty
              description='No Area found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <div className='brandDetailContainer__header'>
              <div className='brandDetailContainer__header-info'>
                <h2>{tagDetailData['name']}</h2>
                {tagDetailData['url'] && (
                  <h3>
                    URL:
                    <span>{tagDetailData['url']}</span>
                  </h3>
                )}
              </div>
            </div>
          )}
      </Skeleton>

      <div className='brandDetailContainer__heading'>
        <h3>Dealers</h3>
      </div>
      <div className='brandDetailContainer__body'>
        {tagProductsState.isLoading && <DataTableSkeleton />}
        {tagProductsState.done && !(tagProductsState.data.length > 0) && (
          <div
            style={{
              marginTop: '100px',
            }}
          >
            <Empty
              description='No Dealer exists for this area'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}

        {tagProductsState.done &&
          tagProductsState.data &&
          tagProductsState.data.length > 0 && (
            <>
              <Table
                style={{
                  paddingTop: '10px',
                  borderRadius: '5px !important',
                  overflow: 'hidden',
                  boxShadow:
                    '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)',
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
                onHeaderRow={(column) => {
                  return {
                    style: {
                      color: 'red !important',
                    },
                  };
                }}
              >
                <Column
                  title='Code'
                  dataIndex='code'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <>
                      <h4
                        onClick={() => {
                          history.push(`/admin/dealer/${record.id}`);
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
                  title='Name'
                  dataIndex='name'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <>
                      <h4
                        onClick={() => {
                          history.push(`/admin/dealer/${record.id}`);
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
                  title='Commission'
                  dataIndex='commission'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  title='Deposit Money'
                  dataIndex='depositMoney'
                  key='id'
                  className='classnameofthecolumn'
                />

                <Column
                  width={150}
                  title='Created'
                  dataIndex='created'
                  key='id'
                  className='classnameofthecolumn'
                  render={(text, record: any) => (
                    <Space size='middle'>
                      <h5>
                        {text && moment(text).format('MMMM Do YYYY, h:mm:ss a')}
                      </h5>
                    </Space>
                  )}
                />
              </Table>
            </>
          )}
      </div>
    </div>
  );
};

export default NewBrandDetail;
