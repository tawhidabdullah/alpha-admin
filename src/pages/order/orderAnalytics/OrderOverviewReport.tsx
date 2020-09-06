import React, { useEffect, useState } from 'react';

// import components 
import ThisMonthOrderReport from "./ThisMonthOrderReport";
import ThisWeekOrderReport from "./ThisWeekOrderReport";
import DateOrderReport from "./DateOrderReport";
import HourOrderReport from "./HourOrderReport";
import MonthOrderReport from "./MonthOrderReport";
import YearOrderReport from "./YearOrderReport";
import DeliveryRegionReport from "./DeliveryRegionReport";

// import lib 
import { message, Tooltip, Modal, Tabs, Empty, Badge } from 'antd';

import {
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined,
	FileImageFilled,
	FileImageOutlined,
	FileImageTwoTone,
	PlusOutlined,
	PlusCircleOutlined,
	CloseOutlined,
	CheckOutlined,
	InfoCircleOutlined,
	UserOutlined,
	CalendarOutlined,
	GoldOutlined,
	ShoppingCartOutlined,
	TagOutlined
} from '@ant-design/icons';

// import hooks
import { useHandleFetch } from "../../../hooks";


interface Props { }

const Overview = (props: Props) => {
	const [analyticsProductVisitCountState, handleAnalyticsProductVisitCountFetch] = useHandleFetch({}, 'getAnalyticsPageVisitCount');
	const [analyticsCategoryVisitCountState, handleAnalyticsCategoryVisitCountFetch] = useHandleFetch({}, 'getAnalyticsPageVisitCount');
	const [totalUserCountState, handleGetTotalUserCountFetch] = useHandleFetch({}, 'getAnalyticsTotalUserCount');



	useEffect(() => {

		const getTotalUserCount = async () => {
			await handleGetTotalUserCountFetch({});
		}

		getTotalUserCount();
	}, []);


	
	useEffect(()=>{
		const getProductVisitCount = async () => {
			await handleAnalyticsProductVisitCountFetch({
				params: 'product'
			})
		}; 
		getProductVisitCount();
	},[])



	useEffect(()=>{
		const getCategoryVisitCount = async () => {
			await handleAnalyticsCategoryVisitCountFetch({
				params: 'category'
			})
		}; 
		getCategoryVisitCount();
	},[])






	return (
		<div className='overviewContainer'>
			<div className="overviewContainer__body">
				<DeliveryRegionReport/>
				<ThisWeekOrderReport />
				<ThisMonthOrderReport />
			</div>

			<div className="overviewContainer__body">
				<DateOrderReport />
				<HourOrderReport />
			</div>

			<div className="overviewContainer__body">
				<MonthOrderReport />
				<YearOrderReport />
			</div>
		</div>
	);
};

export default Overview;
