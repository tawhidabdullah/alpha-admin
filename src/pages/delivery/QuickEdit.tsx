import React, { useState, useEffect } from 'react';
import { Modal, Select, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CheckCircleOutlined } from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import { useHandleFetch } from '../../hooks';


const { Option } = Select;


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



const openSuccessNotification = (message?: any) => {
	notification.success({
		message: message || 'Tag Created',
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


interface Props {
	customer: any;
	setvisible: any;
	visible: any;
	regionList?: any;
	setRegionList?: any;
}

const QuickEdit = ({ customer, setvisible, visible, setRegionList, regionList }: Props) => {
	const [updateRegionState, handleUpdateRegionFetch] = useHandleFetch({}, 'updateRegion');


	const [selectedCountryValue, setselectedCountryValue] = useState('');
	const [selectedCityValue, setselectedCityValue] = useState('');

	const [countryOptions, setcountryOptions] = useState([]);
	const [cityOptions, setcityOptions] = useState([]);

	const [countryListState, handleCountryListFetch] = useHandleFetch(
		[],
		'countryList'
	);

	const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');

	const [countryList, setCountryList] = useState([]);
	const [cityList, setCityList] = useState([]);



	const handleSubmit = async (values: any, actions: any) => {
		// console.log('selectedCityValue',selectedCityValue)

		const addRegionRes = await handleUpdateRegionFetch({

			body: {
				name: values.name,
				pickUpLocation: values.pickUpLocation,
				time: values.time,
				country: selectedCountryValue,
				city: selectedCityValue,
				charge: {}
			},
		});

		// @ts-ignore
		if (addRegionRes && addRegionRes.status === 'ok') {
			openSuccessNotification();

			const positionInTag = () => {
				return regionList.map(item => item.id).indexOf(customer.id);
			}

			const index = positionInTag();

			// @ts-ignore
			const updatedItem = Object.assign({}, regionList[index], { ...addRegionRes });
			const updateRegionList = [...regionList.slice(0, index), updatedItem, ...regionList.slice(index + 1)];
			setRegionList(updateRegionList);

		}
		else {
			openErrorNotification();
		}

		actions.setSubmitting(false);
		setvisible(false)

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







	const handleCancel = (e: any) => {
		setvisible(false);
	};



	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!isValid ||
			!values.name ||
			!values.pickUpLocation ||
			!values.time) {

			return true;
		}
		return false;
	}

	return (
		<Formik
			onSubmit={(values, actions) => handleSubmit(values, actions)}
			validationSchema={validationSchema}
			validateOnBlur={false}
			enableReinitialize={true}
			initialValues={
				{ ...customer }
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
							title="Quick Edit"
							visible={visible}
							onOk={(e: any) => handleSubmit(e)}
							onCancel={handleCancel}
							okText='Update'
							okButtonProps={{
								loading: isSubmitting,
								htmlType: "submit",
								disabled: getisSubmitButtonDisabled(values, isValid)
							}}
							bodyStyle={{
								margin: '0',
								padding: '10px'
							}}
						>


							<div className='dubbleRowInputs'>
								<div className='dubbleRowInputs__item'>
									<Input
										label='Name'
										value={values.name}
										name='name'
										isError={(touched.name && errors.name) ||
											(!isSubmitting && updateRegionState.error['error']['name'])}

										errorString={(touched.name && errors.name) ||
											(!isSubmitting && updateRegionState.error['error']['name'])}
										onChange={(e: any) => {
											handleChange(e);
											setFieldTouched('name');
										}}
									/>
								</div>
								<div className='dubbleRowInputs__item'>
									<Input
										label='Pick up Location'
										value={values.pickUpLocation}
										name='pickUpLocation'
										isError={(touched.pickUpLocation && errors.pickUpLocation) ||
											(!isSubmitting && updateRegionState.error['error']['pickUpLocation'])}

										errorString={(touched.pickUpLocation && errors.pickUpLocation) ||
											(!isSubmitting && updateRegionState.error['error']['pickUpLocation'])}
										onChange={(e: any) => {
											handleChange(e);
											setFieldTouched('pickUpLocation');
										}}
									/>
								</div>




							</div>








							<div style={{
								marginRight: '10px'
							}}>
								<Input
									label='Time'
									value={values.time}
									name='time'
									isError={(touched.time && errors.time) ||
										(!isSubmitting && updateRegionState.error['error']['time'])}

									errorString={(touched.time && errors.time) ||
										(!isSubmitting && updateRegionState.error['error']['time'])}
									onChange={(e: any) => {
										handleChange(e);
										setFieldTouched('time');
									}}
								/>
							</div>



							<div className='dubbleRowInputs'>
								<div className='dubbleRowInputs__item'>
									<h3 className='inputFieldLabel'>
										Country
            </h3>
									<Select
										showSearch
										style={{ width: '100%' }}
										placeholder='Select a Country'
										optionFilterProp='children'
										defaultValue={customer && customer.country}
										onChange={onChangeCountry}
										filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{countryListState.done &&
											countryListState.data.length > 0 &&
											countryOptions.map((option) => {
												return <Option value={option.value}>{option.name}</Option>;
											})}
									</Select>
								</div>
								<div className='dubbleRowInputs__item'>
									<h3 className='inputFieldLabel'>
										City
            </h3>
									<Select
										showSearch
										style={{ width: '100%' }}
										placeholder='Select a city'
										optionFilterProp='children'
										defaultValue={customer && customer.city}
										onChange={onChangeCity}
										filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									>
										{cityListState.done &&
											cityListState.data.length > 0 &&
											cityOptions.map((option) => {
												return <Option value={option.value}>{option.name}</Option>;
											})}
									</Select>
								</div>

							</div>

							<div style={{
								marginTop: '12px'
							}}></div>

						</Modal>

					</>
				)}
		</Formik>
	);
};


export default QuickEdit;
