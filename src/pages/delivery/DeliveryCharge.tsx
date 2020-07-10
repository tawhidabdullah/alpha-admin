import React, { useState, useEffect } from 'react';

// import components
import Input from '../../components/Field/Input';

interface Props {
	setdeliveryChargeList: any;
	deliveryChargeList: any;
	deliveryChargeItem: any;
}

const DeliveryCharge = ({ deliveryChargeItem, setdeliveryChargeList, deliveryChargeList }: Props) => {
	const [ deliveryCharge, setdeliveryCharge ] = useState({
		minimumOrder: deliveryChargeItem.minimumOrder,
		charge: deliveryChargeItem.charge
	});

	const handleDeliveryChargeChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setdeliveryCharge({
			...deliveryCharge,
			[name]: value
		});
	};

	useEffect(
		() => {
			const positionInAttribute = () => {
				return deliveryChargeList.map((item) => item.id).indexOf(deliveryChargeItem.id);
			};

			const index = positionInAttribute();

			const updatedItem = Object.assign({}, deliveryChargeList[index], { ...deliveryCharge });
			const updateAttributeList = [
				...deliveryChargeList.slice(0, index),
				updatedItem,
				...deliveryChargeList.slice(index + 1)
			];
			setdeliveryChargeList(updateAttributeList);
		},
		[ deliveryCharge ]
	);

	const handleAttributeDelete = () => {
		const updateAttributeList = deliveryChargeList.filter((item) => item.id !== deliveryChargeItem.id);
		setdeliveryChargeList(updateAttributeList);
	};

	return (
		<div className='dubbleRowInputs'>
			<div className='dubbleRowInputs__item'>
				<Input
					type='number'
					addonBefore='Minimum Order'
					value={deliveryCharge.minimumOrder}
					name='minimumOrder'
					onChange={handleDeliveryChargeChange}
				/>
			</div>
			<div className='dubbleRowInputs__item'>
				<Input
					type='number'
					addonBefore='Charge'
					value={deliveryCharge.charge}
					name='charge'
					onChange={handleDeliveryChargeChange}
				/>
			</div>
		</div>
	);
};

export default DeliveryCharge;
