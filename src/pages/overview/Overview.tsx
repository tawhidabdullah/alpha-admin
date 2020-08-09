import React from 'react';

// import components 
import ApiVisits from "./ApiVisits";
import PlatformVisits from "./PlatformVisits";

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


interface Props { }

const Overview = (props: Props) => {
	return (
		<div className='overviewContainer'>
			<div className="overviewContainer__header">
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

				<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<GoldOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Product visits
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

				<div className="overviewContainer__header-card">
					<div className="overviewContainer__header-card-body">
						<div className='overviewContainer__header-card-body-iconbox'>
							<TagOutlined />
						</div>
						<div className='overviewContainer__header-card-body-info'>
							<h3>
								+ Category Products
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
				<ApiVisits />
				<PlatformVisits />
			</div>

		</div>
	);
};

export default Overview;
