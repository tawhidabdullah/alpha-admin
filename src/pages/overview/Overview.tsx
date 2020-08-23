import React, { useEffect, useState } from 'react';

// import components 
import ApiVisits from "./ApiVisits";
import OrderOverView from "./OrderOverView";
import PlatformVisits from "./PlatformVisits";
import PageVisits from "./PageVisits";

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
import { useHandleFetch } from "../../hooks";


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
			<div className="overviewContainer__header">

				{totalUserCountState.done && totalUserCountState.data && (
					<>
					<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<UserOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Users
							</h3>
							<h2>
								{totalUserCountState.data['totalIndex'] || 0}
							</h2>
						</div>
					</div>
					<div className="overviewContainer__header-card-footer">
						<h3>
							<span>
								<CalendarOutlined />
							</span>
								In the last month
					     </h3>
					</div>
				</div>
					</>
				)}


				{analyticsProductVisitCountState.done && analyticsProductVisitCountState.data && (
					<>
					<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<UserOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Products
							</h3>
							<h2>
								{analyticsProductVisitCountState.data['totalIndex'] || 0}
							</h2>
						</div>
					</div>
					<div className="overviewContainer__header-card-footer">
						<h3>
							<span>
								<CalendarOutlined />
							</span>
								In the last month
					     </h3>
					</div>
				</div>
					</>
				)}




				{analyticsCategoryVisitCountState.done && analyticsCategoryVisitCountState.data && (
					<>
					<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<UserOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Category
							</h3>
							<h2>
								{analyticsCategoryVisitCountState.data['totalIndex'] || 0}
							</h2>
						</div>
					</div>
					<div className="overviewContainer__header-card-footer">
						<h3>
							<span>
								<CalendarOutlined />
							</span>
								In the last month
					     </h3>
					</div>
				</div>
					</>
				)}



				<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<ShoppingCartOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Orders
							</h3>
							<h2>
								8503
							</h2>
						</div>
					</div>
					<div className="overviewContainer__header-card-footer">
						<h3>
							<span>
								<CalendarOutlined />
							</span>

								In the last month
					     </h3>
					</div>
				</div>


			</div>


			<div className="overviewContainer__body">
				<PageVisits />
				<PlatformVisits />
			</div>
			<div className="overviewContainer__body">
			</div>
			<OrderOverView />
			<ApiVisits />
		</div>
	);
};

export default Overview;
