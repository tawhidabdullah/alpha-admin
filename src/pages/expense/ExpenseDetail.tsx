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

import moment from 'moment';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import ExpenseEdit from './ExpenseEdit';

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'expenseDetail'
  );
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'tagProducts'
  );
  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDetailData,setTagDetailData] = useState({}); 

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
      if(res){
        // @ts-ignore
        setTagDetailData(res); 
      }; 



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
        <h3>Expense Detail</h3>

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <>
              <ExpenseEdit
                addNewCategoryVisible={tagEditVisible}
                setAddNewCategoryVisible={setTagEditVisible}
                category={tagDetailData}
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
              description='No Expense found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <div className='brandDetailContainer__header'>
              <div className='brandDetailContainer__header-info'>
                {tagDetailData['topic'] && (
                  <h3>
                    TOPIC:
                    <span>{tagDetailData['topic']}</span>
                  </h3>
                )}
                {tagDetailData['amount'] && (
                  <h3>
                    AMOUNT:
                    <span>{tagDetailData['amount']}</span>
                  </h3>
                )}
                {tagDetailData['date'] && (
                  <h3>
                    DATE:
                    <span>
                      {tagDetailState['data']['date'] &&
                        moment(tagDetailState['data']['date']).format(
                          'MMMM Do YYYY, h:mm a'
                        )}
                    </span>
                  </h3>
                )}
                {tagDetailData[''] && (
                  <h3>
                    ASSOCIATIVE STAFF:
                    <span>{tagDetailData['date']}</span>
                  </h3>
                )}
              </div>
            </div>
          )}
      </Skeleton>
    </div>
  );
};

export default NewBrandDetail;
