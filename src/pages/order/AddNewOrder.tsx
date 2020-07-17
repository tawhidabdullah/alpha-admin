import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Empty, Steps, Form, Checkbox } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined,
	PlusOutlined,
	CheckCircleOutlined,
	CaretRightOutlined,
	CaretLeftOutlined,
	CaretRightFilled,
	UserOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import AddNewOrderSummary from './AddNewOrderSummary';
import CustomersId from './CustomersId';
import AddProducts from './AddProducts';
import { product } from '../../state/ducks';


const { Option } = Select;
const { Step } = Steps;

const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Category Updated',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
};


const openErrorNotification = (message?: any) => {
	notification.success({
		message: message || 'Something Went Wrong',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
};






const validationSchema = Yup.object().shape({
	firstName: Yup.string()
		.label('First name')
		.required()
		.min(2, 'First name must have at least 2 characters '),
	lastName: Yup.string()
		.label('Last name')
		.required()
		.min(2, 'Last name must have at least 2 characters '),
	phone: Yup.string()
		.required('Please tell us your mobile number.')
		.max(13, 'Please enter a valid mobile number.'),
	password: Yup.string()
		.label('Password')
		.required()
		.min(6, 'Password must have at least 6 characters'),
	address1: Yup.string()
		.label('Address line 1')
		.required()
		.min(3, 'Address line 1 must have at least 3 characters '),

	email: Yup.string().label('Email').email('Please enter a valid email'),

});




const initialValues = {
	phone: '',
	email: '',
	firstName: '',
	lastName: '',
	address1: '',
	address2: '',
	zipCode: '',
	additionalInfo: ''

};


const steps = [
	{
		title: 'Order Information',
		content: '',
		// description: 'Add Customer & Products'
	},
	{
		title: 'Billing Address',

	},
	{
		title: 'Shipping Address',
		content: '',
	},
	{
		title: 'Payment Details',
		content: '',
	},
	{
		title: 'Review your Order',
		content: '',
	},
];




interface Props {

}

const AddNewOrder = ({ }: Props) => {

	const [addOrderState, handleOrderFetch] = useHandleFetch({}, 'addOrder');
	const [selectedCountryValue, setselectedCountryValue] = useState('');
	const [selectedCityValue, setselectedCityValue] = useState('');
	const [productIds, setProductIds] = useState([]);
	const [productList, setProductList] = useState([]);
	const [customerId, setCustomerId] = useState([]);

	const [countryOptions, setcountryOptions] = useState([]);
	const [cityOptions, setcityOptions] = useState([]);

	const [countryListState, handleCountryListFetch] = useHandleFetch(
		[],
		'countryList'
	);

	const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

	const [countryList, setCountryList] = useState([]);
	const [cityList, setCityList] = useState([]);
	const [current, setCurrent] = useState(0);


	const next = () => {
		const newCurrent = current + 1;
		setCurrent(newCurrent);
	}


	const prev = () => {
		const newCurrent = current - 1;
		setCurrent(newCurrent);
	}


	const handleSubmit = async (values: any, actions: any) => {
		console.log('selectedCityValue', selectedCityValue)

		const addRegionRes = await handleOrderFetch({

			body: {
				name: values.name,
				pickUpLocation: values.pickUpLocation,
				time: values.time,
				country: selectedCountryValue,
				city: selectedCityValue,
				// charge
			},
		});


		// @ts-ignore
		if (addRegionRes && addRegionRes.status === 'ok') {
			openSuccessNotification();


			actions.resetForm();
		}
		else {
			openErrorNotification();
		}


		actions.setSubmitting(false);
	};



	const onChangeCity = (value) => {
		setselectedCityValue(value);
	}

	const onChangeCountry = (value) => {
		setselectedCountryValue(value);
	}

	useEffect(() => {
		const setCountries = async () => {
			const CountryListRes = await handleCountryListFetch({});

			// @ts-ignore
			if (CountryListRes && CountryListRes.length > 0) {
				// @ts-ignore
				const countryOptions = CountryListRes.map((country) => {
					return {
						value: country.name,
						name: country.name
					};
				});
				setcountryOptions(countryOptions);
			}
		};

		setCountries();
	}, []);


	useEffect(() => {
		const setCities = async () => {
			const cityListRes = await handleCityListFetch({
				urlOptions: {
					placeHolders: {
						country: selectedCountryValue,
					},
				},
			});

			// @ts-ignore
			if (cityListRes && cityListRes.length > 0) {
				// @ts-ignore
				const cityOptions = cityListRes.map((city) => {
					return {
						value: city.name,
						name: city.name
					};
				});
				setcityOptions(cityOptions);
			}
		};

		setCities();
	}, [selectedCountryValue]);





	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!isValid ||
			!values.name ||
			!values.pickUpLocation ||
			!values.time) {

			return true;
		}
		return false;
	}



	const handleAddDeliveryCharge = () => {

	};



	useEffect(() => {

		if (productIds.length > 0) {

			if (productIds.length > productList.length) {
				setProductList([...productList, {
					_id: productIds[productIds.length - 1],
					variation: '5f0a8f0e10cf2f1dc280d915',
					quantity: 1
				}]);
			}


			else if (productIds.length < productList.length) {
				const newProductList = productList.filter(item => {
					let isTrue = false;
					productIds.forEach(productId => {
						if (productId === item._id) {
							isTrue = true;
						}
					});
					return isTrue;
				})
				setProductList(newProductList);

			}

		}
		else {
			setProductList([]);
		}
		console.log('productIds', productIds)


	}, [productIds])


	console.log('productList', productList)

	return (
		<Formik
			onSubmit={(values, actions) => handleSubmit(values, actions)}
			validationSchema={validationSchema}
			validateOnBlur={false}
			enableReinitialize={true}
			initialValues={
				{ ...initialValues }
			}
		>
			{({
				handleChange,
				values,
				handleSubmit,
				errors,
				isValid,
				isSubmitting,
				touched,
				handleBlur,
				setFieldTouched,
				handleReset,
			}) => (
					<>
						<div className='addOrderContainer'>
							<h3>
								Add New Order
							</h3>
							<div className='addOrderContainer__container'>
								<Steps current={current}>
									{steps.map(item => (
										<Step
											key={item.title}
											title={item.title} />
									))}
								</Steps>

								{current === 0 && (
									<div className='addOrderContainer__container-OrderInfoContainer'>
										<div className='addOrderContainer__container-OrderInfoContainer-left'>
											<h3 className='addOrderContainer-sectionTitle'>

												<span>
													<UserOutlined />
												</span>
                                            Customers And products
                                           </h3>

											<h4 className='inputFieldLabel'>
												Customer
											</h4>
											<CustomersId setCustomerId={setCustomerId} />
											<div style={{
												marginTop: '15px'
											}}></div>
											<h4 className='inputFieldLabel'>
												Products
											</h4>
											<AddProducts setProductIds={setProductIds} />
										</div>
										<div className='addOrderContainer__container-OrderInfoContainer-right'>
											<AddNewOrderSummary
												setProductList={setProductList}
												productList={productList} />
										</div>
									</div>
								)}



								{current === 1 && (
									<div className='addOrderContainer__container-address'>

										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='First Name'
													value={values.firstName}
													name='firstName'
													isError={(touched.firstName && errors.firstName) ||
														(!isSubmitting && addOrderState.error['error']['firstName'])}

													errorString={(touched.firstName && errors.firstName) ||
														(!isSubmitting && addOrderState.error['error']['firstName'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('firstName');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Last Name'
													value={values.lastName}
													name='lastName'
													isError={(touched.lastName && errors.lastName) ||
														(!isSubmitting && addOrderState.error['error']['lastName'])}

													errorString={(touched.lastName && errors.lastName) ||
														(!isSubmitting && addOrderState.error['error']['lastName'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('lastName');
													}}
												/>
											</div>




										</div>



										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Phone'
													value={values.phone}
													name='phone'
													isError={(touched.phone && errors.phone) ||
														(!isSubmitting && addOrderState.error['error']['phone'])}

													errorString={(touched.phone && errors.phone) ||
														(!isSubmitting && addOrderState.error['error']['phone'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('phone');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Email'
													value={values.email}
													name='email'
													isError={(touched.email && errors.email) ||
														(!isSubmitting && addOrderState.error['error']['email'])}

													errorString={(touched.email && errors.email) ||
														(!isSubmitting && addOrderState.error['error']['email'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('email');
													}}
												/>
											</div>
										</div>


										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<h3 className='inputFieldLabel'>
													Country
									</h3>


												<Form.Item
													validateStatus={(addOrderState.error['error']['country']) ? "error" : ""}
													help={addOrderState.error['error']['country']}
												// noStyle={true}
												>
													<Select
														notFoundContent={<Empty description='No Country Found' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
														showSearch
														style={{ width: '100%' }}
														placeholder='Select a Country'
														optionFilterProp='children'
														onChange={onChangeCountry}
														filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
													>
														{countryListState.done &&
															countryListState.data.length > 0 &&
															countryOptions.map((option) => {
																return <Option value={option.value}>{option.name}</Option>;
															})}
													</Select>

												</Form.Item>




											</div>
											<div className='dubbleRowInputs__item'>
												<h3 className='inputFieldLabel'>
													City
                                    </h3>
												<Form.Item
													// noStyle={true}
													validateStatus={(addOrderState.error['error']['city']) ? "error" : ""}
													help={addOrderState.error['error']['city']}

												>
													<Select
														className='selectClassName'
														notFoundContent={<Empty description='First Select a Country' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
														showSearch
														style={{ width: '100%' }}
														placeholder='Select a city'
														optionFilterProp='children'
														onChange={onChangeCity}
														filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
													>
														{cityListState.done &&
															cityListState.data.length > 0 &&
															cityOptions.map((option) => {
																return <Option value={option.value}>{option.name}</Option>;
															})}
													</Select>
												</Form.Item>
											</div>

										</div>

										<div style={{
											marginTop: '12px'
										}}></div>



										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Address'
													value={values.address1}
													name='address1'
													isError={(touched.address1 && errors.address1) ||
														(!isSubmitting && addOrderState.error['error']['address1'])}

													errorString={(touched.address1 && errors.address1) ||
														(!isSubmitting && addOrderState.error['error']['address1'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('address1');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='More specific address'
													value={values.address2}
													name='address2'
													isError={(touched.address2 && errors.address2) ||
														(!isSubmitting && addOrderState.error['error']['address2'])}

													errorString={(touched.address2 && errors.address2) ||
														(!isSubmitting && addOrderState.error['error']['address2'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('address2');
													}}
												/>
											</div>

										</div>



									</div>
								)}







								{current === 2 && (
									<div className='addOrderContainer__container-address'>

										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='First Name'
													value={values.firstName}
													name='firstName'
													isError={(touched.firstName && errors.firstName) ||
														(!isSubmitting && addOrderState.error['error']['firstName'])}

													errorString={(touched.firstName && errors.firstName) ||
														(!isSubmitting && addOrderState.error['error']['firstName'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('firstName');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Last Name'
													value={values.lastName}
													name='lastName'
													isError={(touched.lastName && errors.lastName) ||
														(!isSubmitting && addOrderState.error['error']['lastName'])}

													errorString={(touched.lastName && errors.lastName) ||
														(!isSubmitting && addOrderState.error['error']['lastName'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('lastName');
													}}
												/>
											</div>




										</div>



										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Phone'
													value={values.phone}
													name='phone'
													isError={(touched.phone && errors.phone) ||
														(!isSubmitting && addOrderState.error['error']['phone'])}

													errorString={(touched.phone && errors.phone) ||
														(!isSubmitting && addOrderState.error['error']['phone'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('phone');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Email'
													value={values.email}
													name='email'
													isError={(touched.email && errors.email) ||
														(!isSubmitting && addOrderState.error['error']['email'])}

													errorString={(touched.email && errors.email) ||
														(!isSubmitting && addOrderState.error['error']['email'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('email');
													}}
												/>
											</div>




										</div>








										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<h3 className='inputFieldLabel'>
													Country
									</h3>


												<Form.Item
													validateStatus={(addOrderState.error['error']['country']) ? "error" : ""}
													help={addOrderState.error['error']['country']}
												// noStyle={true}
												>
													<Select
														notFoundContent={<Empty description='No Country Found' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
														showSearch
														style={{ width: '100%' }}
														placeholder='Select a Country'
														optionFilterProp='children'
														onChange={onChangeCountry}
														filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
													>
														{countryListState.done &&
															countryListState.data.length > 0 &&
															countryOptions.map((option) => {
																return <Option value={option.value}>{option.name}</Option>;
															})}
													</Select>

												</Form.Item>




											</div>
											<div className='dubbleRowInputs__item'>
												<h3 className='inputFieldLabel'>
													City
                                    </h3>
												<Form.Item
													// noStyle={true}
													validateStatus={(addOrderState.error['error']['city']) ? "error" : ""}
													help={addOrderState.error['error']['city']}

												>
													<Select
														className='selectClassName'
														notFoundContent={<Empty description='First Select a Country' image={Empty.PRESENTED_IMAGE_SIMPLE} />}
														showSearch
														style={{ width: '100%' }}
														placeholder='Select a city'
														optionFilterProp='children'
														onChange={onChangeCity}
														filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
													>
														{cityListState.done &&
															cityListState.data.length > 0 &&
															cityOptions.map((option) => {
																return <Option value={option.value}>{option.name}</Option>;
															})}
													</Select>
												</Form.Item>
											</div>

										</div>

										<div style={{
											marginTop: '12px'
										}}></div>



										<div className='dubbleRowInputs'>
											<div className='dubbleRowInputs__item'>
												<Input
													label='Address'
													value={values.address1}
													name='address1'
													isError={(touched.address1 && errors.address1) ||
														(!isSubmitting && addOrderState.error['error']['address1'])}

													errorString={(touched.address1 && errors.address1) ||
														(!isSubmitting && addOrderState.error['error']['address1'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('address1');
													}}
												/>
											</div>
											<div className='dubbleRowInputs__item'>
												<Input
													label='More specific address'
													value={values.address2}
													name='address2'
													isError={(touched.address2 && errors.address2) ||
														(!isSubmitting && addOrderState.error['error']['address2'])}

													errorString={(touched.address2 && errors.address2) ||
														(!isSubmitting && addOrderState.error['error']['address2'])}
													onChange={(e: any) => {
														handleChange(e);
														setFieldTouched('address2');
													}}
												/>
											</div>

										</div>



									</div>
								)}

								{/* {current === steps.length - 1 && (

									<Button type="primary" onClick={() => message.success('Processing complete!')}>
										Done
									</Button>
								)} */}
								{current > 0 && (
									<Button
										style={{ marginRight: '15px', marginTop: '10px' }}
										// type="primary"
										className='btnPrimaryClassNameoutline'
										type="primary" onClick={() => prev()}
									>
										<CaretLeftOutlined />	Previous

									</Button>

								)}

								{current < steps.length - 1 && (
									<Button
										style={{
											marginTop: '10px'
										}}

										className='btnPrimaryClassNameoutline'
										type="primary" onClick={() => next()}
									>
										Next< CaretRightOutlined />

									</Button>

								)}


								{/* <div className='addOrderContainer__container-left'>
								
								</div>
								<div className='addOrderContainer__container-right'>
									<AddNewOrderSummary />
								</div> */}

							</div>
						</div>

					</>
				)}
		</Formik>




	);
};

export default AddNewOrder;
