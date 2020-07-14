import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Empty, Steps } from 'antd';

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
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import AddNewOrderSummary from './AddNewOrderSummary';
import CustomersId from './CustomersId';
import AddProducts from './AddProducts';


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
	name: Yup.string()
		.label('Name')
		.required()
		.min(2, 'Name must have at least 2 characters '),
	pickUpLocation: Yup.string()
		.label('Pick up Location')
		.required()
		.min(2, 'Pick up Location must have at least 2 characters '),
	time: Yup.string()
		.label('Time')
		.required()
		.min(2, 'Time must have at least 2 characters '),

});




const initialValues = {
	name: '',
	pickUpLocation: '',
	time: '',
};


const steps = [
	{
		title: 'Order Information',
		content: '',
		description: 'Add Customer & Products'
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

			// const isExistsInProductList =
			const productsOfids = productIds.map(item => {
				return {
					_id: item,
					variation: '5f0a8f0e10cf2f1dc280d915',
					quantity: 1
				}
			});

			setProductList([...productsOfids]);
		}
		else {
			setProductList([]);
		}
		console.log('productIds', productIds)


	}, [productIds])



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
											title={item.title} description={item.description} />
									))}
								</Steps>

								{current === 0 && (
									<div className='addOrderContainer__container-OrderInfoContainer'>
										<div className='addOrderContainer__container-OrderInfoContainer-left'>
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
