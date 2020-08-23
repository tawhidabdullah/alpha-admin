import config from '../config.json';
import dataMap from '../dataMap.json';
import { product } from '../state/ducks';

class Converter {
	/**
   * @public
   * @method categoryList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async categoryList(resData) {
		const data = resData.data || [];

		const formatedData =
			data.length > 0 &&
			data.map((category) => {
				return {
					id: category._id || '',
					key: category._id || '',
					name: category.name && category.name,
					description: category.description && category.description,
					productCount: category.productCount || 0,
					parent: category.parent || '',
					cover: category.cover ? `${config['baseURL']}${category.cover.thumbnail}` : null,
					subCount:
						category.subCategory.length === 1
							? category.subCategory[0] && category.subCategory[0].name ? category.subCategory.length : 0
							: category.subCategory.length,
					...(category.subCategory &&
						category.subCategory.length > 0 &&
						category.subCategory[0] &&
						category.subCategory[0]['name'] && {
						children: category.subCategory.map((subCat) => {
							return {
								id: subCat._id || '',
								key: subCat._id,
								name: subCat.name && subCat.name,
								description: subCat.description && subCat.description,
								cover: subCat.cover ? `${config['baseURL']}${subCat.cover.thumbnail}` : ''
							};
						})
					})
				};
			});

		return formatedData;
	};


		/**
   * @public
   * @method postCategoryList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
  async postCategoryList(resData) {
	const data = resData.data || [];

	const formatedData =
		data.length > 0 &&
		data.map((category) => {
			return {
				id: category._id || '',
				key: category._id || '',
				name: category.name && category.name,
				description: category.description && category.description,
				// productCount: category.productCount || 0,
				parent: category.parent || '',
				cover: category.cover ? `${config['baseURL']}${category.cover.thumbnail}` : null,
				subCount:
					category.subCategory.length === 1
						? category.subCategory[0] && category.subCategory[0].name ? category.subCategory.length : 0
						: category.subCategory.length,
				...(category.subCategory &&
					category.subCategory.length > 0 &&
					category.subCategory[0] &&
					category.subCategory[0]['name'] && {
					children: category.subCategory.map((subCat) => {
						return {
							id: subCat._id || '',
							key: subCat._id,
							name: subCat.name && subCat.name,
							description: subCat.description && subCat.description,
							cover: subCat.cover ? `${config['baseURL']}${subCat.cover.thumbnail}` : ''
						};
					})
				})
			};
		});

	return formatedData;
};


	

	/**
* @public
* @method getAllNotification convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async getAllNotification(resData) {
		const data = resData.data || [];

		const formatedData =
			data.length > 0 &&
			data.map((noti) => {
				return {
					id: noti._id || '',
					key: noti._id || '',
					heading: noti.heading && noti.heading,
					text: noti.text && noti.text,
					type: noti.type,
					link: noti.link || '',
					added: noti.added || '',
					read: noti.read
				};
			});

		return formatedData;
	}








	/**
* @public
* @method categorySelectist convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async categorySelectist(resData) {
		const data = resData.data || [];

		const formatedData =
			data.length > 0 &&
			data.map((category) => {
				return {
					id: category._id || '',
					key: category._id || '',
					title: category.name && category.name,
					...(category.subCategory &&
						category.subCategory.length > 0 &&
						category.subCategory[0] &&
						category.subCategory[0]['name'] && {
						children: category.subCategory.map((subCat) => {
							return {
								id: subCat._id || '',
								key: subCat._id,
								title: subCat.name && subCat.name,
								cover: subCat.cover ? `${config['baseURL']}${subCat.cover.thumbnail ? subCat.cover.thumbnail : ""}` : ''
							};
						})
					})
				};
			});

		return formatedData;
	}




	/**
   * @public
   * @method categoryProducts convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async categoryProducts(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		const convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					description: product.description && product.description,
					cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
					regularPrice: product.price && product.price['regular'],
					offerPrice: product.price && product.price['offer'],
					url: product.url,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					available: product.pricing &&
					product.pricing.length > 0 ?
							 product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
							 : 0,
					minimum: product.pricing &&
					product.pricing.length > 0 ?
					product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum']
					: 0
				};
			});

		// return {
		// 	data: convertedData,
		// 	isNext: isNext
		// };

		return convertedData;
	}

	/**
   * @public
   * @method getCart convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async getCart(resData) {
		const cartItems = resData.items || [];
		const convertedData =
			cartItems.length > 0 &&
			cartItems.map((cartItem) => {
				return {
					id: cartItem._id || '',
					name: cartItem.name && cartItem.name,
					cover: `${config['baseURL']}${cartItem.cover.medium}`,
					regularPrice: cartItem.price && cartItem.price['regular'],
					offerPrice: cartItem.price && cartItem.price['offer'],
					quantity: cartItem.quantity,
					url: cartItem.url,
					cartKey: cartItem.cartKey
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method addtoCart convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async addtoCart(resData) {
		let data = false;

		if (resData['inserted']) {
			data = {
				id: resData['inserted']._id || '',
				name: resData['inserted'].name && resData['inserted'].name,
				cover: `${config['baseURL']}${resData['inserted'].cover.medium}`,
				regularPrice: resData['inserted'].price && resData['inserted'].price['regular'],
				offerPrice: resData['inserted'].price && resData['inserted'].price['offer'],
				quantity: resData['inserted'].quantity,
				url: resData['inserted'].url,
				cartKey: resData['inserted'].cartKey
			};
		}

		const convertedData = data;

		return convertedData;
	}

	/**
   * @public
   * @method removeFromCart convert api data from API to general format based on config server
   * @param {Object} resData response objectc from alpha
   * @returns {Object}  converted data
   */
	async removeFromCart(resData) {
		let convertedData = false;
		if (resData) {
			convertedData = true;
		}
		return convertedData;
	}

	/**
   * @public
   * @method updateCartItem convert api data from API to general format based on config server
   * @param {Object} resData response objectc from alpha
   * @returns {Object}  converted data
   */
	async updateCartItem(resData) {
		let convertedData = false;
		if (resData['updated']) {
			convertedData = {
				quantity: resData.updated['quantity']
			};
		}
		return convertedData;
	}

	/**
   * @public
   * @method clearCart convert api data from API to general format based on config server
   * @param {Object} resData response objectc from alpha
   * @returns {Object}  converted data
   */
	async clearCart(data) {
		if (data && data['msg']) {
			return {
				status: 'ok'
			};
		}
		return data;
	}

	/**
   * @public
   * @method getWishlist convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async getWishlist(resData) {
		// const cartItems = resData.items || [];
		const convertedData = resData;

		return convertedData;
	}

	/**
   * @public
   * @method addWishlist convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async addWishlist(resData) {
		if (resData && resData['msg'] === 'wishlist updated') {
			return {
				status: 'ok'
			};
		}

		return false;
	}

	/**
   * @public
   * @method removeFromWishlist convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async removeFromWishlist(resData) {
		if (resData && resData['msg'] === 'wishlist updated') {
			return {
				status: 'ok'
			};
		}

		return false;
	}

	/**
   * @public
   * @method removeAllWishlist convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async removeAllWishlist(resData) {
		if (resData && resData['msg'] === 'wishlist updated') {
			return {
				status: 'ok'
			};
		}

		return false;
	}

	/**
   * @public
   * @method tagProducts convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async tagProducts(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		const convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					description: product.description && product.description,
					cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
					regularPrice: product.price && product.price['regular'],
					offerPrice: product.price && product.price['offer'],
					url: product.url,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					avalable: product.pricing &&
					product.pricing.length > 0 ?
							 product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
							 : 0,
					minimum: product.pricing &&
					product.pricing.length > 0 ?
					product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum'] : 0
				};
			});

		// return {
		// 	data: convertedData,
		// 	isNext: isNext
		// };

		return convertedData;
	}

	/**
   * @public
   * @method brandProducts convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async brandProducts(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		const convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					description: product.description && product.description,
					cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
					regularPrice: product.price && product.price['regular'],
					offerPrice: product.price && product.price['offer'],
					url: product.url,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					avalable: product.pricing &&
					product.pricing.length > 0 ?
							 product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
							 : 0,
					minimum: product.pricing &&
					product.pricing.length > 0 ?
					product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum']
					: 0
				};
			});

		// return {
		// 	data: convertedData,
		// 	isNext: isNext
		// };

		return convertedData;
	}

	/**
   * @public
   * @method productSearch convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async productSearch(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		const convertedData =
			(data.length > 0 &&
				data.map((product) => {
					return {
						id: product._id || '',
						name: product.name && product.name,
						description: product.description && product.description,
						cover: `${config['baseURL']}${product.cover.thumbnail}`,
						regularPrice: product.price && product.price['regular'],
						offerPrice: product.price && product.price['offer'],
						url: product.url,
						unit: product.unit,
						date: product.date,
						venue: product.venue,
						pricing: product.pricing
					};
				})) ||
			[];

		return {
			data: convertedData,
			isNext
		};
	}

	/**
   * @public
   * @method productList convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async productList(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		let convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					description: product.description && product.description,
					cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
					regularPrice: product.price && product.price['regular'],
					offerPrice: product.price && product.price['offer'],
					url: product.url,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,
					price:
					parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					available: product.pricing &&
					product.pricing.length > 0 ?
							 product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
							 : 0,
					minimum: product.pricing &&
					product.pricing.length > 0 ?
					product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum']
					: 0
							
				};
			});

		// convertedData = {
		// 	data: convertedData,
		// 	isNext
		// };

		return convertedData;
	}



	/**
   * @public
   * @method bundleList convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async bundleList(resData) {
		const data = resData || [];

		let convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					description: product.description && product.description,
					cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
					regularPrice: product.price && product.price['regular'],
					offerPrice: product.price && product.price['offer'],
					url: product.url,
					startDate: product.startDate,
					endDate: product.endDate,
					actualPrice: product.actualPrice,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,
					product: product['product'],
					productCount: product['product'].length,
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
				};
			});

		// convertedData = {
		// 	data: convertedData,
		// 	isNext
		// };

		return convertedData;
	}



	/**
* @public
* @method bundleDetail convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async bundleDetail(resData) {
		const data = resData || {};

		if (Object.keys(data).length > 0) {
			return {
				id: data._id || '',
				name: data.name && data.name,
				description: data.description && data.description,
				cover: `${config['baseURL']}${(data.cover && data.cover['thumbnail']) || ''}`,
				regularPrice: data.price && data.price['regular'],
				offerPrice: data.price && data.price['offer'],
				url: data.url,
				startDate: data.startDate,
				endDate: data.endDate,
				actualPrice: data.actualPrice,
				unit: data.unit,
				category: data.category,
				pricing: data.pricing,
				date: data.date,
				time: data.time,
				venue: data.venue,
				brand: data.brand,
				tags: data.tags,
				products: data.product,
				productCount: data['product'].length,
				price:
					parseInt(data.price['offer']) > parseInt(data.price['regular'])
						? data.price['offer']
						: data.price['regular'],
			}
		}

		else return data;

		// convertedData = {
		// 	data: convertedData,
		// 	isNext
		// };

	}



	


	
	/**
   * @public
   * @method getAnalyticsPageVisits convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
  async getAnalyticsPageVisits(resData) {
	const data = resData && resData.data ? resData.data : [];

	console.log('getAnalyticsPageVisits',resData); 

	let convertedData =
		data.length > 0 &&
		data.map((item) => {
			return {
				id: item._id || '',
				visit: item.count || '',
				name: item['item'] && item['item']['name'] ,
				url: item['item'] && item['item']['url'] ,
				itemId: item['item'] && item['item']['_id'] ,
			};
		});

	// convertedData = {
	// 	data: convertedData,
	// 	isNext
	// };

	return convertedData;
}



	
	/**
   * @public
   * @method getAnalyticsPageVisitCount convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
  async getAnalyticsPageVisitCount(resData) {
	return resData; 
	}


	/**
   * @public
   * @method getAnalyticsDemographicVisits convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
  	async getAnalyticsDemographicVisits(resData) {

		const data = resData && resData.data ? resData.data : [];
		if(data){
			return data; 
		}
		else return []
	}


	/**
   * @public
   * @method getAnalyticsOrders convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
   async getAnalyticsOrders(resData) {
	if(resData.orders && Object.keys(resData.orders).length > 0){
		return resData.orders['data']; 
	}
 	return []; 
	}



		/**
	 * @public
	 * @method getAnalyticsTotalUserCount convert api data from API to general format based on config server
	 * @param {Object} data response objectc from wc
	 * @returns {Object}  converted data
	 */
	async getAnalyticsTotalUserCount(resData) {
		return resData; 
	}


		/**
	 * @public
	 * @method customerDetail convert api data from API to general format based on config server
	 * @param {Object} data response objectc from wc
	 * @returns {Object}  converted data
	 */
	async customerDetail(resData) {
		if(resData){
			return {
				id: resData._id || '',
				key: resData._id || '',
				firstName: resData.firstName || '',
				lastName: resData.lastName || '',
				name: resData.firstName + ' ' + resData.lastName,
				country: resData.country || '',
				city: resData.city || '',
				email: resData.email || '',
				phone: resData.phone || '',
				address1: resData.address1 || '',
				address2: resData.address2 || '',
				created: resData.created || ''
			}
		}
		else return resData; 
	}

	
	/**
   * @public
   * @method couponList convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async couponList(resData) {
		const data = resData || [];

		let convertedData =
			data.length > 0 &&
			data.map((product) => {
				return {
					id: product._id || '',
					name: product.name && product.name,
					code: product.code,
					minimumOrder: product.minimumOrder,
					maximumOrder: product.maximumOrder,
					offerPrice: product.price && product.price['offer'],
					orderedProducts: product.orderedProducts,
					freeProducts: product.freeProducts,
					orderedProductsCount: product.orderedProducts && product.orderedProducts.length,
					freeProductsCount: product.freeProducts && product.orderedProducts.length,
					amountType: product.amountType,
					amount: product.amount,
					freeDelivery: product.freeDelivery,
					startDate: product.startDate,
					endDate: product.endDate,
					maxUsePerUser: product.maxUsePerUser,
					actualPrice: product.actualPrice,
					unit: product.unit,
					category: product.category,
					pricing: product.pricing,
					date: product.date,
					time: product.time,
					venue: product.venue,
					brand: product.brand,
					tags: product.tags,

				};
			});

		// convertedData = {
		// 	data: convertedData,
		// 	isNext
		// };

		return convertedData;
	}






	/**
   * @public
   * @method tagList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async tagList(resData) {
		const data = resData.data || [];

		const convertedData =
			data.length > 0 &&
			data.map((tag) => {
				return {
					id: tag._id || '',
					key: tag._id || '',
					name: tag.name && tag.name,
					description: tag.description && tag.description
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method brandList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async brandList(resData) {
		const data = resData.data || [];

		const convertedData =
			data.length > 0 &&
			data.map((brand) => {
				return {
					id: brand._id || '',
					key: brand._id || '',
					name: brand.name && brand.name,
					description: brand.description && brand.description,
					cover: `${config['baseURL']}${brand.cover ? brand.cover.thumbnail : ''}`
				};
			});

		return convertedData;
	}


	/**
* @public
* @method setImageAsThumbnailToItem convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async setImageAsThumbnailToItem(resData) {
		if (resData.success) {
			return {
				status: 'ok'
			}
		}
		return {};
	}



	/**
* @public
* @method brandDetail convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async brandDetail(resData) {
		const data = Object.keys(resData).length > 0 ? resData : null;
		if (data) {
			return {
				id: data._id || '',
				key: data._id || '',
				name: data.name && data.name,
				description: data.description && data.description,
				url: data.url && data.url,
				cover: {
					cover: `${config['baseURL']}${data.cover ? data.cover.original && data.cover.original : ''}`,
					id: data.cover ? data.cover._id : ''
				},
				image:
					(data.image &&
						data.image.length > 0 &&
						data.image.map((img) => {
							return {
								id: img._id || '',
								name: img.name && img.name,
								cover: `${config['baseURL']}${img.thumbnail}`,
								added: img.added,
								title: img.title,
								labels: img.labels,
								alt: img.alt,
								caption: img.caption
							}
						})) ||
					[]
			}
		}

		return {};
	}


	/**
* @public
* @method tagDetail convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async tagDetail(resData) {
		const data = Object.keys(resData).length > 0 ? resData : null;
		if (data) {
			return {
				id: data._id || '',
				key: data._id || '',
				name: data.name && data.name,
				url: data.url && data.url,
				description: data.description && data.description,
			}
		}

		return {};
	}

	/**
   * @public
   * @method customerList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async customerList(resData) {
		const data = resData.data || [];

		const convertedData =
			data.length > 0 &&
			data.map((customer) => {
				return {
					id: customer._id || '',
					key: customer._id || '',
					firstName: customer.firstName || '',
					lastName: customer.lastName || '',
					name: customer.firstName + ' ' + customer.lastName,
					country: customer.country || '',
					city: customer.city || '',
					email: customer.email || '',
					phone: customer.phone || '',
					address1: customer.address1 || '',
					address2: customer.address2 || '',
					created: customer.created || ''
				};
			});

		return convertedData;
	}



	/**
   * @public
   * @method pageList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async pageList(resData) {
		const data = resData.data || [];

		const convertedData =
			data.length > 0 &&
			data.map((page) => {
				return {
					...page
				};
			});

		return convertedData;
	}



	/**
* @public
* @method themeList convert api data from API to general format based on config server
* @param {Object} data response objectc from alpha
* @returns {Object}  converted data
*/
	async themeList(resData) {
		const data = resData || [];

		const convertedData =
			data.length > 0 &&
			data.map((theme) => {
				return {
					id: theme._id || '',
					key: theme._id || '',
					name: theme.name || '',
					added: theme.added || '',
					thumbnail: `${config['baseURL']}${theme.thumbnail ? theme.thumbnail : ""}`,

				};
			});

		return convertedData;
	}


	/**
   * @public
   * @method componentList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async componentList(resData) {
		const components = resData.components || {};

		if (components && components.length > 0) {
			const convertedData =
				components.length > 0 &&
				components.map((component) => {
					return {
						id: component._id || '',
						key: component._id || '',
						name: component.name || '',
						items: component.items.length > 0 ? component.items.map(item => {
							return {
								...item,
								image: item.image.length > 0 ? item.image.map(img => {
									return {
										cover: `${config['baseURL']}${img.thumbnail ? img.thumbnail : ""}`,
										id: img._id,
									}
								}) : []
							}
						}) : []
					};
				});

			return convertedData;
		}

		return [];
	}





	/**
   * @public
   * @method regionList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async regionList(data) {
		const convertedData =
			data.length > 0 &&
			data.map((region) => {
				return {
					id: region._id || '',
					key: region._id || '',
					name: region.name || '',
					pickUpLocation: region.pickUpLocation || '',
					country: region.country || '',
					countryCode: region.countryCode || '',
					countryName: region.countryName || '',
					city: region.city || '',
					time: region.time || '',
					charge: region.charge || {}
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method attributeList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async attributeList(data) {
		const convertedData = Object.keys(data).length > 0 && data;
		return convertedData;
	}

	/**
   * @public
   * @method ImageListFromLibrary convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async ImageListFromLibrary(resData) {
		const data = resData.data || [];

		const convertedData =
			data.length > 0 &&
			data.map((image) => {
				return {
					id: image._id || '',
					name: image.name && image.name,
					cover: `${config['baseURL']}${image.thumbnail}`,
					added: image.added,
					title: image.title,
					labels: image.labels,
					alt: image.alt,
					caption: image.caption
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method countryList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async countryList(resData) {
		const data = resData || [];

		const convertedData =
			data.length > 0 &&
			data.map((country) => {
				return {
					id: country._id || '',
					name: country.name && country.name
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method getDeliveryRegion convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */


   
	async getDeliveryRegion(data) {
		const convertedData = data;

		return convertedData;
	}

	
	/**
   * @public
   * @method cityList convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async cityList(resData) {
		const data = resData || [];

		const convertedData =
			data.length > 0 &&
			data.map((city) => {
				return {
					id: city._id || '',
					name: city.name && city.name
				};
			});

		return convertedData;
	}

	/**
   * @public
   * @method forAnalytics convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async forAnalytics(resData) {
		return resData;
	}

	/**
   * @public
   * @method productDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */

	async productDetail(data) {
		const convertedData =
			(Object.keys(data).length > 0 && {
				id: data._id || data.id || '',
				name: data.name || '',
				description: data.description.replace(/<[^>]+>/g, '') || '',
				regularPrice: data.price && data.price['regular'],
				offerPrice: data.price && data.price['offer'],
				url: data.url,
				availableStock: data.availableStock,
				minimumStock: data.minimumStock,
				unit: data.unit,
				date: data.date,
				venue: data.venue,
				brand: data.brand && Object.key(data.brand).length > 0 ? {
					id: data.brand.id,
					name: data.brand.name,

				} : {},
				price:
					parseInt(data.price['offer']) > parseInt(data.price['regular'])
						? data.price['offer']
						: data.price['regular'],
				pricing: data.pricing,
				category:
					(data.category &&
						data.category.length > 0 &&
						data.category.map((cat) => {
							return {
								id: cat._id,
								name: cat.name
							};
						})) ||
					data.category,
				tags: data.tags && data.tags.length > 0 ? data.tags : [],

				cover: {
					cover: `${config['baseURL']}${data.cover ? data.cover.original && data.cover.original : ''}`,
					id: data.cover ? data.cover._id : ''
				},
				image:
					(data.image &&
						data.image.length > 0 &&
						data.image.map((img) => {
							return {
								id: img._id || '',
								name: img.name && img.name,
								cover: `${config['baseURL']}${img.original}`,
								added: img.added,
								title: img.title,
								labels: img.labels,
								alt: img.alt,
								caption: img.caption
							}
						})) ||
					[],
					available: product.pricing &&
					product.pricing.length > 0 ?
							 product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
							 : 0,
					minimum: product.pricing &&
					product.pricing.length > 0 ?
					product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum']
					: 0
			}) ||
			{};

		return convertedData;
	}





	/**
   * @public
   * @method couponDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */

	async couponDetail(data) {
		const convertedData =
			(Object.keys(data).length > 0 && {
				id: data._id || '',
				name: data.name && data.name,
				code: data.code,
				minimumOrder: data.minimumOrder,
				maximumOrder: data.maximumOrder,
				orderedProducts: data.orderedProducts | [],
				freeProducts: data.freeProducts || [],
				orderedProductsCount: data.orderedProducts && data.orderedProducts.length,
				freeProductsCount: data.freeProducts && data.orderedProducts.length,
				amountType: data.amountType,
				amount: data.amount,
				freeDelivery: data.freeDelivery,
				startDate: data.startDate,
				endDate: data.endDate,
				maxUsePerUser: data.maxUsePerUser,
				actualPrice: data.actualPrice,
				unit: data.unit,
				category: data.category,
				pricing: data.pricing,
				date: data.date,
				time: data.time,
				venue: data.venue,
				brand: data.brand,
				tags: data.tags,
			}) ||
			{};

		return convertedData;
	}



    /**
   * @public
   * @method productDetailById convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async productDetailById(data) {
		const convertedData =
			(Object.keys(data).length > 0 && {
				id: data._id || data.id || '',
				name: data.name || '',
				description: data.description.replace(/<[^>]+>/g, '') || '',
				regularPrice: data.price && data.price['regular'],
				offerPrice: data.price && data.price['offer'],
				url: data.url,
				unit: data.unit,
				date: data.date,
				venue: data.venue,
				pricing: data.pricing,
				price:
					parseInt(data.price['offer']) > parseInt(data.price['regular'])
						? data.price['offer']
						: data.price['regular'],
				category:
					(data.category &&
						data.category.length > 0 &&
						data.category.map((cat) => {
							return {
								id: cat._id,
								name: cat.name,
								cover: `${config['baseURL']}${cat.cover ? cat.cover.original && cat.cover.original : ''}`

							};
						})) ||
					data.category,
				brand:
					data.brand &&
						Object.keys(data.brand).length > 0 ? {
							id: data.brand._id,
							name: data.brand.name,
							cover: `${config['baseURL']}${data.brand.cover ? data.brand.cover.original && data.brand.cover.original : ''}`
						} :
						data.brand,
				primaryCategory: data.primaryCategory &&
					Object.keys(data.primaryCategory).length > 0 ? {
						id: data.primaryCategory._id,
						name: data.primaryCategory.name,
						cover: `${config['baseURL']}${data.primaryCategory.cover ? data.primaryCategory.cover.original && data.primaryCategory.cover.original : ''}`
					} :
					data.primaryCategory,
				tags: data.tags && data.tags.length > 0 ? data.tags : [],
				availableStock: data.availableStock,
				cover: {
					cover: `${config['baseURL']}${data.cover ? data.cover.original && data.cover.original : ''}`,
					id: data.cover ? data.cover._id : ''
				},
				image:
					(data.image &&
						data.image.length > 0 &&
						data.image.map((img) => {
							return {
								id: img._id || '',
								name: img.name && img.name,
								cover: `${config['baseURL']}${img.original}`,
								added: img.added,
								title: img.title,
								labels: img.labels,
								alt: img.alt,
								caption: img.caption
							}
						})) ||
					[]
			}) ||
			{};

		return convertedData;
	}

	/**
   * @public
   * @method updateProduct convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateProduct(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				id: data.updated._id || data.updated.id || '',
				name: data.updated.name || '',
				description: data.updated.description.replace(/<[^>]+>/g, '') || '',
				regularPrice: data.updated.price && data.updated.price['regular'],
				offerPrice: data.updated.price && data.updated.price['offer'],
				url: data.updated.url,
				availableStock: data.updated.availableStock,
				minimumStock: data.updated.minimumStock,
				unit: data.updated.unit,
				date: data.updated.date,
				venue: data.updated.venue,
				brand: data.updated.brand && Object.key(data.updated.brand).length > 0 ? {
					id: data.updated.brand.id,
					name: data.updated.brand.name,

				} : {},
				price:
					parseInt(data.updated.price['offer']) > parseInt(data.updated.price['regular'])
						? data.updated.price['offer']
						: data.updated.price['regular'],
				pricing: data.updated.pricing,
				category:
					(data.updated.category &&
						data.updated.category.length > 0 &&
						data.updated.category.map((cat) => {
							return {
								id: cat._id,
								name: cat.name
							};
						})) ||
					data.updated.category,
				tags: data.updated.tags && data.updated.tags.length > 0 ? data.updated.tags : [],

				cover: {
					cover: `${config['baseURL']}${data.updated.cover ? data.updated.cover.original && data.updated.cover.original : ''}`,
					id: data.updated.cover ? data.updated.cover._id : ''
				},
				image:
					(data.updated.image &&
						data.updated.image.length > 0 &&
						data.updated.image.map((img) => {
							return {
								id: img._id || '',
								name: img.name && img.name,
								cover: `${config['baseURL']}${img.original}`,
								added: img.added,
								title: img.title,
								labels: img.labels,
								alt: img.alt,
								caption: img.caption
							}
						})) ||
					[],
					status: 'ok'

			};
		}

		return convertedData;
	}


	/**
* @public
* @method updateComponent convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async updateComponent(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
   * @public
   * @method updateImageFromLibrary convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateImageFromLibrary(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method updateTag convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateTag(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
* @public
* @method updatePage convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async updatePage(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method updateBrand convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateBrand(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method updateCategory convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateCategory(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method updateCustomer convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateCustomer(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method updateRegion convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateRegion(data) {
		const convertedData = data;

		if (data && data.updated) {
			return {
				...data.updated,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deleteProduct convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteProduct(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}



	/**
   * @public
   * @method deleteBundle convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteBundle(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}



	/**
   * @public
   * @method deleteCoupon convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteCoupon(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}




	/**
* @public
* @method pageDetail convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async pageDetail(data) {
		const convertedData = data;
		return convertedData;
	}


	/**
   * @public
   * @method updateOrderStatus convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateOrderStatus(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				...data,
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deleteImageFromLibrary convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteImageFromLibrary(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
* @public
* @method deletePage convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async deletePage(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}



	/**
   * @public
   * @method addTag convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addTag(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method addCategory convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addCategory(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}; 


		/**
   * @public
   * @method postAddCategory convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async postAddCategory(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	};
	/**
   * @public
   * @method addProduct convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addProduct(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}


		/**
   * @public
   * @method addPost convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */

  async addPost(data) {
	const convertedData = data;
	if (data && data.inserted) {
		return {
			...data.inserted[0],
			status: 'ok'
		};
	}
	return convertedData;
}


	
	/**
   * @public
   * @method addOrder convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */



  async addOrder(data) {
	const convertedData = data;
	if (data && data.inserted) {
		return {
			...data.inserted[0],
			status: 'ok'
		};
	}
	return convertedData;
}



	/**
* @public
* @method addTheme convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async addTheme(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
* @public
* @method addPage convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async addPage(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
   * @public
   * @method addBrand convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addBrand(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}
	/**
   * @public
   * @method addComponent convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addComponent(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}




	/**
   * @public
   * @method addCustomer convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addCustomer(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method addRegion convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addRegion(data) {
		const convertedData = data;
		if (data && data.inserted) {
			return {
				...data.inserted[0],
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deleteTag convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteTag(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}



	/**
   * @public
   * @method logout convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async logout(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
* @public
* @method activeTheme convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async activeTheme(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deletetheme convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deletetheme(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
   * @public
   * @method deleteCustomer convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteCustomer(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
* @public
* @method deleteComponent convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async deleteComponent(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}


	/**
   * @public
   * @method deleteBrand convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteBrand(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deleteCategory convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteCategory(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}

	/**
   * @public
   * @method deleteRegion convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async deleteRegion(data) {
		const convertedData = data;
		if (data && data.success) {
			return {
				status: 'ok'
			};
		}

		return convertedData;
	}



	/**
   * @public
   * @method siteSettings convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async siteSettings(resData) {
		const convertedData = resData;

		if (resData.data) {
			return {
				...resData.data
			}
		}

		return convertedData;
	}


	/**
* @public
* @method updateSiteSettings convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async updateSiteSettings(data) {

		if (data['updated']) {
			return {
				status: 'ok'
			}
		}

		return data;
	}

	/**
* @public
* @method updateInvoiceSettings convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async updateInvoiceSettings(data) {

		if (data['updated']) {
			return {
				status: 'ok'
			}
		}

		return data;
	}



	/**
   * @public
   * @method invoiceSettingsDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async invoiceSettingsDetail(resData) {
		const convertedData = resData;

		if (resData.data) {
			return {
				...resData.data
			}
		}

		return convertedData;
	}










	/**
   * @public
   * @method categoryDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async categoryDetail(data) {

		const convertedData = {
			id: data.id || data._id || '',
			name: data.name && data.name,
			description: data.description && data.description,
			productCount: data.productCount || 0,
			icon: data.icon ? `${config['baseURL']}${data.icon}` : '',
			type: data.subCategory.length > 0 && data.subCategory[0] && data.subCategory[0]['name'] ? 'Top category' : 'Child category',
			url: data.url || '',
			subCategory:
				data.subCategory.length > 0 && data.subCategory[0] && data.subCategory[0]['name']
					? data.subCategory.map((subCat) => {
						return {
							id: subCat._id || '',
							name: subCat.name && subCat.name,
							description: subCat.description && subCat.description,
							cover: subCat.cover ? `${config['baseURL']}${subCat.cover.medium}` : ''
						};
					})
					: [],
			cover: {
				cover: `${config['baseURL']}${data.cover ? data.cover.original && data.cover.original : ''}`,
				id: data.cover ? data.cover._id : ''
			},
			image:
				(data.image &&
					data.image.length > 0 &&
					data.image.map((img) => {
						return {
							id: img._id || '',
							name: img.name && img.name,
							cover: `${config['baseURL']}${img.medium}`,
							added: img.added,
							title: img.title,
							labels: img.labels,
							alt: img.alt,
							caption: img.caption
						}
					})) ||
				[]
		};

		return convertedData;
	}
	/**
   * @public
   * @method createOrder convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async createOrder(data) {
		//map props

		const formatedData = {
			...data
		};

		return formatedData;
	}


	

		/**
   * @public
   * @method adminRoleRegister convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async adminRoleRegister(data) {
		//map props

		if(data && data.length > 0){
			return {
				status: 'ok',
				...data[0]
			}
		}
		else return {}; 
	}


			/**
   * @public
   * @method adminList convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async adminList(resData) {
		//map props

		return resData; 
	}; 


				/**
   * @public
   * @method adminDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
  async adminDetail(resData) {
	//map props

	return resData; 
}; 


	


	/**
* @public
* @method orderDetail convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async orderDetail(data) {
		//map props
		const order = data.order || false;
		if (order) {
			return {
				id: order.id || order._id,
				shippingAddress: order.shippingAddress,
				name: order.shippingAddress['firstName'] + " " + order.shippingAddress['lastName'],
				country: order.shippingAddress['country'],
				city: order.shippingAddress['city'],
				address: order.shippingAddress['address'],
				phone: order.shippingAddress['phone'],
				email: order.shippingAddress['email'],
				status: order.status,
				total: order.totalPrice,
				products: order.products && order.products.length > 0 ? order.products.map(product => {
					return {
						id: product._id || '',
						name: product.name && product.name,
						description: product.description && product.description,
						cover: `${config['baseURL']}${(product.cover && product.cover['thumbnail']) || ''}`,
						regularPrice: product.price && product.price['regular'],
						offerPrice: product.price && product.price['offer'],
						url: product.url,
						unit: product.unit,
						category: product.category,
						pricing: product.pricing,
						date: product.date,
						time: product.time,
						venue: product.venue,
						brand: product.brand,
						tags: product.tags,
						price: product.price,
						available: product.pricing &&
						 product.pricing.length > 0 ?
						  product.pricing[0]['stock'] && product.pricing[0]['stock']['available']
						  : 0,
						  minimum: product.pricing &&
						 product.pricing.length > 0 ?
						  product.pricing[0]['stock'] && product.pricing[0]['stock']['minimum']
						  : 0
					}
				}) : [],
				date_created: order.added,
				paymentMethod: order['payment']['paymentMethod'],
				paymentStatus: order['payment']['status'],
				payment: order['payment'],
				customerId: order['customer'] ? order['customer']['_id'] : ''
			}
		}
		else return {}

	}

	/**
   * @public
   * @method signup convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async signup(data) {
		return {
			status: 'ok'
		};
	}

	/**
   * @public
   * @method signin convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async signin(data) {
		if (data['msg']) {
			return {
				status: 'ok'
			};
		}

		return false;
	}

	/**
   * @public
   * @method login convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async login(data) {
		if (data['msg']) {
			return {
				status: 'ok'
			};
		}

		return false;
	}

	/**
   * @public
   * @method addImageToLibrary convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addImageToLibrary(data) {
		return data;
	}

	/**
   * @public
   * @method getCurrentUserData convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async getCurrentCustomerData(data) {
		//map props
		// let generalFormat = dataMap[config['server']]['getCurrentUserData']; //get genereal format from dataMap

		const formatedData = {
			...data
		};

		return formatedData;
	}

	/**
   * @public
   * @method currentCustomerData convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async currentCustomerData(data) {
		//map props
		// let generalFormat = dataMap[config['server']]['currentCustomerData']; //get genereal format from dataMap

		const convertedData = {
			...data
		};

		return convertedData;
	}

	/**
   * @public
   * @method updateCurrentCustomerData convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async updateCurrentCustomerData(data) {
		//map props
		// let generalFormat = dataMap[config['server']]['updateCurrentCustomerData']; //get genereal format from dataMap

		const convertedData = {
			status: 'ok'
		};

		return convertedData;
	}

	/**
   * @public
   * @method changePassword convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async changePassword(data) {
		if (data['success']) {
			return {
				status: 'ok'
			};
		}

		return data;
	}

	/**
   * @public
   * @method getCurrentUserOrders convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async getCurrentUserOrders(resData) {
		const data = resData.data || [];
		const isNext = resData.page.next;

		let convertedData =
			(data.length > 0 &&
				data.map((item) => {
					return {
						...item,
						id: item.id || item._id,
						billingAddress: item.billingAddress,
						status: item.status,
						total: item.totalPrice,
						products: item.products,
						date_created: item.date,
						paymentMethod: item['payment']['paymentMethod'],
						customerId: item.customer['_id']
					};
				})) ||
			[];

		convertedData = {
			data: convertedData,
			isNext
		};

		return convertedData;
	}


	/**
* @public
* @method orderList convert api data from API to general format based on config server
* @param {Object} data response objectc from wc
* @returns {Object}  converted data
*/
	async orderList(resData) {
		const data = resData.orders ? resData.orders.data : [];
		// const isNext = resData.page.next;

		console.log('orderListDAta',data);

		let convertedData =
			(data.length > 0 &&
				data.map((item) => {
					return {
							id: item.id || item._id,
							shippingAddress: item.billingAddress,
							name: item.shippingAddress && item.shippingAddress['firstName'] && item.shippingAddress['firstName'] + " " +
							 item.shippingAddress && item.shippingAddress['lastName'] && item.shippingAddress['lastName'],
							country: item.shippingAddress && item.shippingAddress['country'] && item.shippingAddress['country'],
							city: item.shippingAddress && item.shippingAddress['city'] && item.shippingAddress['city'],
							status: item.status,
							total: item.totalPrice,
							products: item.products,
							date_created: item.added,
							paymentMethod: item['payment'] && item['payment']['paymentMethod'],
							paymentStatus: item['payment'] && item['payment']['status'],
							payment: item['payment'],
							customerId: item['customer'] ? item['customer']['_id'] : ''

					};
				})) ||
			[];

		// convertedData = {
		// 	data: convertedData,
		// 	isNext
		// };

		return convertedData;
	}


		/**
		* @public
		* @method orderListForCustomer convert api data from API to general format based on config server
		* @param {Object} data response objectc from wc
		* @returns {Object}  converted data
		*/
		async orderListForCustomer(resData) {
			const data = resData.orders ? resData.orders.data : [];
			// const isNext = resData.page.next;

			let convertedData =
				(data.length > 0 &&
					data.map((item) => {
						return {
							id: item.id || item._id,
							shippingAddress: item.billingAddress,
							name: item.shippingAddress && item.shippingAddress['firstName'] && item.shippingAddress['firstName'] + " " +
							 item.shippingAddress && item.shippingAddress['lastName'] && item.shippingAddress['lastName'],
							country: item.shippingAddress && item.shippingAddress['country'] && item.shippingAddress['country'],
							city: item.shippingAddress && item.shippingAddress['city'] && item.shippingAddress['city'],
							status: item.status,
							total: item.totalPrice,
							products: item.products,
							date_created: item.added,
							paymentMethod: item['payment'] && item['payment']['paymentMethod'],
							paymentStatus: item['payment'] && item['payment']['status'],
							payment: item['payment'],
							customerId: item['customer'] ? item['customer']['_id'] : ''

						};
					})) ||
				[];

			// convertedData = {
			// 	data: convertedData,
			// 	isNext
			// };

			return convertedData;
		}


	/**
   * @public
   * @method currentUserOrders convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async currentUserOrders(data) {
		//map props
		let generalFormat = dataMap[config['server']]['currentUserOrders']; //get genereal format from dataMap

		const convertedData =
			(data.length > 0 &&
				data.map((item) => {
					return {
						...generalFormat,
						id: item.id,
						status: item.status,
						total: item.total,
						line_items: item.line_items,
						date_created: item.date_created
					};
				})) ||
			[];

		return convertedData;
	}

	/**
   * @public
   * @method payment convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */

	async payment(data) {
		const paymentItems = data.items;
		if (!paymentItems.length > 0) {
			return paymentItems;
		}

		const items = paymentItems.map((item) => {
			return {
				name: item.name || '',
				number: item.text || ''
			};
		});
		return items;
	}

	/**
   * @public
   * @method welcome convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async welcome(data) {
		return {
			text: data.text
		};
	}

	/**
   * @public
   * @method logo convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async logo(data) {
		const src = data.image && data.image.length > 0 ? `${config['baseURL']}${data.image[0]['original']}` : '';
		return {
			src,
			target: data.target
		};
	}

	/**
   * @public
   * @method hotline convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async hotline(data) {
		return {
			text: data.text
		};
	}

	/**
   * @public
   * @method navLinks convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async navLinks(data) {
		const navLinkItems = data.items;
		if (!navLinkItems.length > 0) {
			return [];
		}

		const items = navLinkItems.map((item) => {
			return {
				text: item.name || item.text,
				target: item.target
			};
		});

		return items;
	}

	/**
   * @public
   * @method slider convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async slider(data) {
		const sliderItems = data.items;
		if (!sliderItems.length > 0) {
			return sliderItems;
		}

		const images = sliderItems.map((item) => {
			return {
				target: item.target,
				src: `${config['baseURL']}${item.image[0]['medium']}`
			};
		});
		return images;
	}

	/**
   * @public
   * @method sliderRight convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async sliderRight(data) {
		const sliderRightItems = data.items;
		if (!sliderRightItems.length > 0) {
			return sliderRightItems;
		}

		const images = sliderRightItems.map((item) => {
			return {
				target: item.target,
				src: `${config['baseURL']}${item.image[0]['medium']}`
			};
		});
		return images;
	}

	/**
   * @public
   * @method address convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async address(data) {
		return {
			name: data.name,
			text: data.text
		};
	}

	/**
   * @public
   * @method Links convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async Links(data) {
		const servicesItems = data.items;
		if (!servicesItems.length > 0) {
			return servicesItems;
		}

		const items = servicesItems.map((item) => {
			return {
				target: item.target,
				name: item.name || item.text
			};
		});
		return items;
	}

	/**
   * @public
   * @method Account convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async Account(data) {
		const accountItems = data.items;
		if (!accountItems.length > 0) {
			return accountItems;
		}

		const items = accountItems.map((item) => {
			return {
				target: item.target,
				name: item.name || item.text
			};
		});
		return items;
	}




	/**
   * @public
   * @method 'About Us' convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async 'About Us'(data) {
		const aboutUsItems = data.items;
		if (!aboutUsItems.length > 0) {
			return aboutUsItems;
		}

		const items = aboutUsItems.map((item) => {
			return {
				target: item.target,
				name: item.name || item.text
			};
		});
		return items;
	}



	/**
   * @public
   * @method 'getTotalUserCount Us' convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async getTotalUserCount(data) {
		return data;
	}


	/**
   * @public
   * @method addCoupon Us' convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async addCoupon(data) {
		if (data && data[0]) {
			return {
				status: 'ok',
				...data[0]
			}
		}
		return {};
	}





}

export default Converter;
