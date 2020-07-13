import config from '../config.json';
import dataMap from '../dataMap.json';

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
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					url: product.url,
					unit: product.unit
				};
			});

		return {
			data: convertedData,
			isNext: isNext
		};
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
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					url: product.url,
					unit: product.unit
				};
			});

		return {
			data: convertedData,
			isNext: isNext
		};
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
					price:
						parseInt(product.price['offer']) > parseInt(product.price['regular'])
							? product.price['offer']
							: product.price['regular'],
					url: product.url,
					unit: product.unit
				};
			});

		return {
			data: convertedData,
			isNext: isNext
		};
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
						unit: product.unit
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
					pricing: product.pricing
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
					country: customer.country || '',
					city: customer.city || '',
					email: customer.email || '',
					phone: customer.phone || '',
					created: customer.created || ''
				};
			});

		return convertedData;
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
   * @method getDeliveryCharge convert api data from API to general format based on config server
   * @param {Object} data response objectc from alpha
   * @returns {Object}  converted data
   */
	async getDeliveryCharge(data) {
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
				cover: `${config['baseURL']}${data.cover.original}`,
				availableStock: data.availableStock,
				minimumStock: data.minimumStock,
				unit: data.unit,
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
				brand:
					(data.brand &&
						data.brand.length > 0 &&
						data.brand.map((b) => {
							return {
								id: b._id,
								name: b.name
							};
						})) ||
					data.brand,
				tags:
					(data.tags &&
						data.tags.length > 0 &&
						data.tags.map((tag) => {
							return {
								id: tag._id,
								name: tag.name
							};
						})) ||
					data.tags,

				image:
					(data.image &&
						data.image.length > 0 &&
						data.image.map((img) => `${config.baseURL}${img.medium}`)) ||
					[]
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
				cover: `${config['baseURL']}${data.cover.medium}`,
				unit: data.unit,
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
				brand:
					(data.brand &&
						data.brand.length > 0 &&
						data.brand.map((b) => {
							return {
								id: b._id,
								name: b.name
							};
						})) ||
					data.brand,
				tags:
					(data.tags &&
						data.tags.length > 0 &&
						data.tags.map((tag) => {
							return {
								id: tag._id,
								name: tag.name
							};
						})) ||
					data.tags,
				availableStock: data.availableStock,
				image:
					(data.image &&
						data.image.length > 0 &&
						data.image.map((img) => `${config.baseURL}${img.medium}`)) ||
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
	}

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
   * @method categoryDetail convert api data from API to general format based on config server
   * @param {Object} data response objectc from wc
   * @returns {Object}  converted data
   */
	async categoryDetail(data) {
		const convertedData = {
			id: data.id || data._id || '',
			name: data.name && data.name,
			description: data.description && data.description,
			productCount: data.count || data.productCount,
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
			image:
				(data.image && data.image.length > 0 && data.image.map((img) => `${config.baseURL}${img.medium}`)) || []
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
						id: item.id || item._id,
						billingAddress: item.billingAddress,
						status: item.status,
						total: item.totalPrice,
						products: item.products,
						date_created: item.date,
						paymentMethod: item['payment']['paymentMethod']
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
}

export default Converter;
