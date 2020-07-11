import React from 'react';
import { Carousel } from 'antd';

interface Props {}

const CategoryDetail = (props: Props) => {
	return (
		<div className='categoryDetailContainer'>
			<div className='categoryDetailContainer__item'>
				<div className='categoryDetailContainer__item-carousel'>
					<Carousel autoplay>
						<div className='categoryDetailContainer__item-carousel-item'>
							<img
								alt='category img'
								src='https://images-na.ssl-images-amazon.com/images/I/41Leu3gBUFL.jpg'
							/>
						</div>
						<div>
							<h3>2</h3>
						</div>
						<div>
							<h3>3</h3>
						</div>
						<div>
							<h3>4</h3>
						</div>
					</Carousel>
				</div>
			</div>

			<div className='categoryDetailContainer__item' />
		</div>
	);
};

export default CategoryDetail;
