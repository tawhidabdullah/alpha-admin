import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';

// import hooks
import { useHandleFetch } from '../../hooks';
import ReactHtmlParser from 'react-html-parser';

// import lib
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
// import TagEdit from "./TagEdit";

const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;

interface Props {
  productRecord?: any;
}

const NewBrandDetail = (props: Props) => {
  const [tagProductsState, handleTagProductsFetch] = useHandleFetch(
    {},
    'tagProducts'
  );
  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDetailState, handleTagDetailFetch] = useHandleFetch(
    {},
    'pageDetail'
  );
  const [tagDetailData, setTagDetailData] = useState({});

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
        <h3>Page Detail</h3>

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <>
              {/* <TagEdit
                            tagEditVisible={tagEditVisible}
                            setTagEditVisible={setTagEditVisible}
                            tagDetailData={tagDetailData}
                            setTagDetailData={setTagDetailData}
                        /> */}
              <Button
                onClick={() => {
                  history.push(`/admin/page/edit/${tagDetailData['_id']}`);
                }}
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
              description='No Page found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

        {tagDetailState.done &&
          tagDetailData &&
          Object.keys(tagDetailData).length > 0 && (
            <>
              <div className='brandDetailContainer__header'>
                <div className='brandDetailContainer__header-coverContainer'>
                  <img
                    src={
                      tagDetailData['cover'] && tagDetailData['cover']['cover']
                    }
                    alt=''
                  />
                </div>
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

              <div className='brandDetailContainer__heading'>
                <h3>Content</h3>
              </div>

              <div className='brandDetailContainer__header'>
                {ReactHtmlParser(tagDetailData['content'])}
              </div>
            </>
          )}
      </Skeleton>
    </div>
  );
};

export default NewBrandDetail;
