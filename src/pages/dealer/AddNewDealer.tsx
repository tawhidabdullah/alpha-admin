import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Empty, Form } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';

import Areas from "./Areas";
const { Option } = Select;



const validationSchema = Yup.object().shape({
	firstName: Yup.string()
		.label('First name')
		.required()
		.min(2, 'First name must have at least 2 characters '),
	lastName: Yup.string()
		.label('Lastname')
		.required()
		.min(2, 'Last name must have at least 2 characters '),
	phone: Yup.string()
		.required('Please tell us your mobile number.')
		.max(13, 'Please enter a valid mobile number.'),
	password: Yup.string()
		.label('Password')
		.required()
		.min(6, 'Password must have at least 6 characters'),

	email: Yup.string().label('Email').email('Please enter a valid email'),
});




const initialValues = {
	phone: '',
	email: '',
	firstName: '',
	lastName: '',
	address: '',
	zipCode: '',
	password: '',
	code: '',
	commission: '',
	depositMoney: ''
};


const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Dealer Created!',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
};


const openErrorNotification = (message?: any) => {
	notification.error({
		message: message || 'Something Went Wrong',
		description: '',
		icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
};


interface Props {
	addNewCategoryVisible: any;
	setAddNewCategoryVisible: any;
	customerList?: any;
	setCustomerList?: any;
}

const AddNewCategory = ({ addNewCategoryVisible, setAddNewCategoryVisible, customerList, setCustomerList }: Props) => {

	const [addCustomerState, handleAddCustomerFetch] = useHandleFetch({}, 'addDealer');
	const [selectedCountryValue, setselectedCountryValue] = useState('');
	const [selectedCityValue, setselectedCityValue] = useState('');

	const [countryOptions, setcountryOptions] = useState([]);
	const [cityOptions, setcityOptions] = useState([]);

	const [countryListState, handleCountryListFetch] = useHandleFetch(
		[],
		'countryList'
	);

	const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

	const [tagIds, setTagIds] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);




	const handleSubmit = async (values: any, actions: any) => {

		const addCustomerRes = await handleAddCustomerFetch({

			body: {
				phone: values.phone,
				email: values.email,
				password: values.password,
				address: values.address,
				firstName: values.firstName,
				lastName: values.lastName,
				code: values.code,
				commission: values.commission,
				depositMoney: values.depositMoney,
				dealerArea: tagIds
			},
		});


		// @ts-ignore
		if (addCustomerRes && addCustomerRes.status === 'ok') {
			// openSuccessNotification();

			setCustomerList([{
				id: addCustomerRes['_id'] || '',
				key: addCustomerRes['_id'] || '',
				name: addCustomerRes['firstName'] + ' ' + addCustomerRes['lastName'],
				// @ts-ignore
				...addCustomerRes
			},...customerList])
			setAddNewCategoryVisible(false);
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
		console.log('selectedCountryValue1',selectedCountryValue)
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



	
	useEffect(() => {
		if (!addCustomerState['isLoading']) {
			const error = addCustomerState['error'];
			if (error['isError'] && Object.keys(error['error']).length > 0) {

				if (error['error']['registerError']) {
					// setServerErrors(error['error']['registerError']);
				} else if (error['error']['checkoutError']) {
					// setServerErrors(error['error']['checkoutError']);
				}

				else {
					// setServerErrors(error['error']);
				}

				const errors =
					Object.values(error['error']).length > 0
						? Object.values(error['error'])
						: [];
				errors.forEach((err, i) => {
					if (typeof err === 'string') {
						openErrorNotification(err);

					}
					else if (typeof err === 'object') {
						if (err && Object.keys(err).length > 0) {
							const errs = Object.values(err);
							errs.forEach(err => {
								openErrorNotification(err);
							})

						}
					}
				});
			}
		}

		if (
			!addCustomerState['isLoading'] &&
			Object.keys(addCustomerState.data).length > 0
		) {
			if (addCustomerState['data']['status'] === 'ok') {
				openSuccessNotification('Dealer Created Successfully');
				// history.push({
				//   pathname: '/orderDetails',
				//   state: checkoutState['data']
				// })

				// clearCart();
				// setIsModalShown(true);
			}
		}
	}, [addCustomerState]);




	const handleCancel = (e: any) => {
		setAddNewCategoryVisible(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!isValid ||
			!values.firstName ||
			!values.lastName ||
			!values.password ||
			!values.phone ||
			!values.code 
			) {
			return true;
		}
		return false;
	}



	console.log('cityListState', cityListState)




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
						<Modal
							style={{
								top: '40px',

							}}
							bodyStyle={{
								margin: 0,
								padding: 0,
							}}
							width={'70vw'}
							title="Add New Dealer"
							visible={addNewCategoryVisible}
							onOk={(e: any) => handleSubmit(e)}
							onCancel={handleCancel}
							okText='Create'
							okButtonProps={{
								loading: isSubmitting,
								htmlType: "submit",
								disabled: getisSubmitButtonDisabled(values, isValid)
							}}
						>

								

							<section className='addProductGridContainer'>
								<div className='addProductGridContainer__left'>
									<div className='addProductGridContainer__name'>
										<div className='addProductGridContainer__item-header'>
											<h3>
												Dealer Information *
											</h3>

											
										</div>
										<div className='addProductGridContainer__item-body'>

										<div className='dubbleRowInputs'>
								<div className='dubbleRowInputs__item'>
									<Input
										label='First Name'
										value={values.firstName}
										name='firstName'
										isError={(touched.firstName && errors.firstName) ||
											(!isSubmitting && addCustomerState.error['error']['firstName'])}

										errorString={(touched.firstName && errors.firstName) ||
											(!isSubmitting && addCustomerState.error['error']['firstName'])}
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
											(!isSubmitting && addCustomerState.error['error']['lastName'])}

										errorString={(touched.lastName && errors.lastName) ||
											(!isSubmitting && addCustomerState.error['error']['lastName'])}
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
											(!isSubmitting && addCustomerState.error['error']['phone'])}

										errorString={(touched.phone && errors.phone) ||
											(!isSubmitting && addCustomerState.error['error']['phone'])}
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
											(!isSubmitting && addCustomerState.error['error']['email'])}

										errorString={(touched.email && errors.email) ||
											(!isSubmitting && addCustomerState.error['error']['email'])}
										onChange={(e: any) => {
											handleChange(e);
											setFieldTouched('email');
										}}
									/>
								</div>




							</div>


							<div className='dubbleRowInputs'>
								<div className='dubbleRowInputs__item'>
								<Input
									label='Dealer Code'
									type='text'
									value={values.code}
									name='code'
									isError={(touched.code && errors.code) ||
										(!isSubmitting && addCustomerState.error['error']['code'])}

									errorString={(touched.code && errors.code) ||
										(!isSubmitting && addCustomerState.error['error']['code'])}
									onChange={(e: any) => {
										handleChange(e);
										setFieldTouched('code');
									}}
								/>
								</div>
								<div className='dubbleRowInputs__item'>
								<Input
									label='Password'
									type='password'
									value={values.password}
									name='password'
									isError={(touched.password && errors.password) ||
										(!isSubmitting && addCustomerState.error['error']['password'])}

									errorString={(touched.password && errors.password) ||
										(!isSubmitting && addCustomerState.error['error']['password'])}
									onChange={(e: any) => {
										handleChange(e);
										setFieldTouched('password');
									}}
								/>
								</div>

							</div>



							
							<div className='dubbleRowInputs'>
								<div className='dubbleRowInputs__item'>
								<Input
									label='Deposit Money'
									type='text'
									value={values.depositMoney}
									name='depositMoney'
									isError={(touched.depositMoney && errors.depositMoney) ||
										(!isSubmitting && addCustomerState.error['error']['depositMoney'])}

									errorString={(touched.depositMoney && errors.depositMoney) ||
										(!isSubmitting && addCustomerState.error['error']['depositMoney'])}
									onChange={(e: any) => {
										handleChange(e);
										setFieldTouched('depositMoney');
									}}
								/>
								</div>
								<div className='dubbleRowInputs__item'>
								<Input
									label='Commission'
									type='commission'
									value={values.commission}
									name='commission'
									isError={(touched.commission && errors.commission) ||
										(!isSubmitting && addCustomerState.error['error']['commission'])}

									errorString={(touched.commission && errors.commission) ||
										(!isSubmitting && addCustomerState.error['error']['commission'])}
									onChange={(e: any) => {
										handleChange(e);
										setFieldTouched('commission');
									}}
								/>
								</div>

							</div>


							<div style={{
								marginTop: '12px'
							}}></div>


									<Input
										label='Address'
										value={values.address}
										name='address'
										isError={(touched.address && errors.address) ||
											(!isSubmitting && addCustomerState.error['error']['address'])}

										errorString={(touched.address && errors.address) ||
											(!isSubmitting && addCustomerState.error['error']['address'])}
										onChange={(e: any) => {
											handleChange(e);
											setFieldTouched('address');
										}}
									/>

										</div>



									</div>


								</div>
								<div className='addProductGridContainer__right'>

									<div className='addProductGridContainer__tag'>
										<div className='addProductGridContainer-rightItemContainer'>
											<div className='addProductGridContainer-rightItemContainer-header'>
												<h3>
													Areas *
												</h3>
											</div>
											<div className='addProductGridContainer-rightItemContainer-body'>
												<Areas
													setSelectedTags={setSelectedTags}
													selectedTags={selectedTags}
													setTagIds={setTagIds} />
											</div>
										</div>

									</div>

								</div>
							</section>

	




						</Modal>

					</>
				)}
		</Formik>




	);
};

export default AddNewCategory;
