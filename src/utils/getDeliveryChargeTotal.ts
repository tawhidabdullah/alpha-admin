const getDeliveryChargeTotal = (delivery, totalPrice) => {
	try {
		if (!delivery) return;
		if (delivery && !(Object.keys(delivery).length > 0)) return;

		let deliveryAmount = delivery && Object.keys(delivery.charge);
		deliveryAmount.sort((a: any, b: any) => a - b);

		let deliveryCharge;

		// get the delivery charge according to totalPrice
		if (totalPrice < deliveryAmount && deliveryAmount[0]) {
			return 'Minium order amount is ' + deliveryCharge && deliveryCharge[0];
		} else if (totalPrice >= deliveryAmount && deliveryAmount[deliveryAmount.length - 1]) {
			// higher than all amount
			deliveryCharge = delivery.charge[deliveryAmount.length - 1];
		} else {
			// iterate through all items

			for (let index in deliveryAmount) {
				// check if price is between the current amount and the next

				if (
					totalPrice >= deliveryAmount[index] &&
					totalPrice < deliveryAmount[+index + 1]
				) {
					// set the charge of the amount as delivery charge
					deliveryCharge = delivery.charge[deliveryAmount[index]];
					break;
				}
			}
		}

		return deliveryCharge;
	}
	catch (err) {

	}
};
export default getDeliveryChargeTotal;