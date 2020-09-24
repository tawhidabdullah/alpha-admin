import React, { useState, useEffect } from 'react';

// import hooks
import { useHandleFetch } from '../../../hooks';

// import components
import { DataTableSkeleton } from '../../../components/Placeholders';

//

// import lib
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Line,
} from 'recharts';

import { useHistory } from 'react-router-dom';
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
  CalendarOutlined,
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
  Modal,
  Spin,
} from 'antd';

const { Option } = Select;

const { Column, ColumnGroup } = Table;

interface Props {}

const localOptions = [
  {
    value: 'category',
    name: 'Category',
  },
  {
    value: 'product',
    name: 'Product',
  },
];

const MONTHS = [
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

export const getMonthNameByOrder = (order: number): string | undefined =>
  `${MONTHS[order - 1]}`;

export const TooltipContainerStyles = {
  border: 0,
  borderRadius: '8px',
  fontSize: 14,
  boxShadow: '2px 2px 5px 3px rgba(0,0,0,0.15)',
};

const PageVisits = (props: Props) => {
  const history = useHistory();

  const [
    orderAnalyticsVisitsState,
    handleOrderAnalyticsVisitsStateFetch,
  ] = useHandleFetch({}, 'getAnalyticsOrders');
  const [orderData, setorderData] = useState([]);

  useEffect(() => {
    const getAnalyticsOrders = async () => {
      const ordersDataRes = await handleOrderAnalyticsVisitsStateFetch({
        urlOptions: {
          params: {
            metricType: 'month',
          },
        },
      });

      // @ts-ignore
      if (ordersDataRes) {
        // @ts-ignore
        setorderData(ordersDataRes);
      }
    };
    getAnalyticsOrders();
  }, []);

  console.log('orderAnalyticsVisitsStateMonth', orderAnalyticsVisitsState);

  return (
    <div className='overviewContainer__body-apiVisits'>
      <div className='overviewContainer__body-apiVisits-header'>
        <div className='overviewContainer__body-apiVisits-header-info'>
          <h2>BY MONTH</h2>
          <h3>Order report by month</h3>
        </div>
      </div>

      <div className='overviewContainer__body-body'>
        {orderAnalyticsVisitsState.isLoading && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '100px 0',
              }}
            >
              <Spin size='large' />
            </div>
          </>
        )}

        {orderAnalyticsVisitsState.done && orderData && orderData.length > 0 && (
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={orderData} fontSize={12}>
              <defs>
                <linearGradient id='rainGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#1890ff' />
                  <stop offset='100%' stopColor='#3066BE22' />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray='3 3'
                stroke='#d6d9da'
              />
              <XAxis dataKey={'month'} tickFormatter={getMonthNameByOrder} />
              <YAxis
                // unit="ml"
                orientation='left'
                width={20}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                contentStyle={TooltipContainerStyles}
                formatter={(value, name) => [`${value}`, `${name}`]}
              />
              <Area
                dataKey='count'
                name='Count'
                type='basis'
                fill='url(#rainGradient)'
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {orderAnalyticsVisitsState.done &&
          !(orderAnalyticsVisitsState.data.length > 0) && (
            <div
              style={{
                marginTop: '00px',
              }}
            >
              <Empty
                description={`No Visits for this months`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
      </div>
      <div className='overviewContainer__body-footer'>
        <h3>
          <span>
            <CalendarOutlined />
          </span>
          In the last month
        </h3>
      </div>
    </div>
  );
};

export default PageVisits;
