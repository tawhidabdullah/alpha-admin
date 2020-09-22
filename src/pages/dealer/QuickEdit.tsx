import React,{useState, useEffect} from 'react';
import { Modal, Select,notification , Form, Empty } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { PlusOutlined, EditOutlined, DeleteOutlined,EditFilled, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';



// import components
import Input from '../../components/Field/Input';
import {useHandleFetch} from '../../hooks';
import Areas from "./Areas";



const { Option } = Select;


const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .label('Firstname')
      .required()
      .min(2, 'First name must have at least 2 characters '),
    lastName: Yup.string()
      .label('Lastname')
      .required()
      .min(2, 'Lastname must have at least 2 characters '),
    phone: Yup.string()
      .required('Please tell us your mobile number.')
      .max(13, 'Please enter a valid mobile number.'),
    password: Yup.string()
      .label('Password')
      .min(6, 'Password must have at least 6 characters'),
    email: Yup.string().label('Email').email('Please enter a valid email'),
  });



  
const openSuccessNotification = (message?: any) => {
	notification.success({
	  message: message || 'Dealer Updated',
	  description: '',
	  icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
	});
  };


  const openErrorNotification = (message?: any) => {
	notification.success({
	  message: message || 'Something Went Wrong',
	  description: '',
	  icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
	});
  };






interface Props {
	customer: any;
	setvisible: any; 
	visible: any;
	customerList?: any; 
	setCustomerList?:any

}

const QuickEdit = ({ customer, setvisible, visible, customerList, setCustomerList }: Props) => {
	const [updateCustomerState, handleUpdateCustomerFetch] = useHandleFetch({}, 'updateDealer');


	const [selectedCountryValue,setselectedCountryValue] = useState(''); 
    const [selectedCityValue,setselectedCityValue] = useState(''); 

    const [countryOptions,setcountryOptions] = useState([]); 
    const [cityOptions,setcityOptions] = useState([]); 

    const [countryListState, handleCountryListFetch] = useHandleFetch(
        [],
        'countryList'
      );
    
      const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');
    

	  const [tagIds, setTagIds] = useState([]);
	  const [selectedTags, setSelectedTags] = useState([]);
  


	  useEffect(() => {

		console.log('customerAreaCheck',customer)
		if (customer && customer.area && customer.area.length > 0) {
			const tagIds = customer.area.map(item => item._id);
			
			setSelectedTags(tagIds);
			setTagIds(tagIds)
        }
        else {
            setSelectedTags([]);

        }
	}, [customer.id]);
	



	const handleSubmit = async (values : any, actions : any) => {
	  const updateCustomerRes = await handleUpdateCustomerFetch({
		urlOptions: {
			placeHolders: {
			  id: values.id,
			}
		  },
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
			 if(updateCustomerRes && updateCustomerRes.status === 'ok'){
				// openSuccessNotification(); 
		
				setvisible(false); 

				const positionInTag = () => {
					return customerList.map(item => item.id).indexOf(customer.id);
				  }
		
				  const index = positionInTag();
		
				  // @ts-ignore
				  const updatedItem = Object.assign({}, customerList[index], { 
					  // @ts-ignore
					...updateCustomerRes, 
					
					id: updateCustomerRes['_id'] || '',
					key: updateCustomerRes['_id'] || '',
					name: updateCustomerRes['firstName'] + ' ' + updateCustomerRes['lastName'],

				   });
				  const updateTagList = [...customerList.slice(0, index), updatedItem, ...customerList.slice(index + 1)];
				  setCustomerList(updateTagList); 
				
			  }
			  else {
				openErrorNotification();
			  }
			
			  actions.setSubmitting(false);
	};
	


	useEffect(() => {
		if (!updateCustomerState['isLoading']) {
			const error = updateCustomerState['error'];
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
			!updateCustomerState['isLoading'] &&
			Object.keys(updateCustomerState.data).length > 0
		) {
			if (updateCustomerState['data']['status'] === 'ok') {
				openSuccessNotification('Dealer Updated Successfully');
				// history.push({
				//   pathname: '/orderDetails',
				//   state: checkoutState['data']
				// })

				// clearCart();
				// setIsModalShown(true);
			}
		}
	}, [updateCustomerState]);




	
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



	  const getisSubmitButtonDisabled = (values,isValid) => {
		if(!isValid ||
			!values.firstName ||
			!values.lastName ||
			// !values.password ||
			!values.phone ||
			!values.code ){
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
		  {...customer}
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
			width={'70vw'}
			visible={visible}
			onOk={(e : any) => handleSubmit(e)}
			onCancel={handleCancel}
			okText='Update'
			destroyOnClose={true}
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

	  {console.log('errorsupdatedealer',errors)}

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
											(!isSubmitting && updateCustomerState.error['error']['firstName'])}

										errorString={(touched.firstName && errors.firstName) ||
											(!isSubmitting && updateCustomerState.error['error']['firstName'])}
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
											(!isSubmitting && updateCustomerState.error['error']['lastName'])}

										errorString={(touched.lastName && errors.lastName) ||
											(!isSubmitting && updateCustomerState.error['error']['lastName'])}
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
											(!isSubmitting && updateCustomerState.error['error']['phone'])}

										errorString={(touched.phone && errors.phone) ||
											(!isSubmitting && updateCustomerState.error['error']['phone'])}
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
											(!isSubmitting && updateCustomerState.error['error']['email'])}

										errorString={(touched.email && errors.email) ||
											(!isSubmitting && updateCustomerState.error['error']['email'])}
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
										(!isSubmitting && updateCustomerState.error['error']['code'])}

									errorString={(touched.code && errors.code) ||
										(!isSubmitting && updateCustomerState.error['error']['code'])}
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
										(!isSubmitting && updateCustomerState.error['error']['password'])}

									errorString={(touched.password && errors.password) ||
										(!isSubmitting && updateCustomerState.error['error']['password'])}
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
										(!isSubmitting && updateCustomerState.error['error']['depositMoney'])}

									errorString={(touched.depositMoney && errors.depositMoney) ||
										(!isSubmitting && updateCustomerState.error['error']['depositMoney'])}
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
										(!isSubmitting && updateCustomerState.error['error']['commission'])}

									errorString={(touched.commission && errors.commission) ||
										(!isSubmitting && updateCustomerState.error['error']['commission'])}
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
											(!isSubmitting && updateCustomerState.error['error']['address'])}

										errorString={(touched.address && errors.address) ||
											(!isSubmitting && updateCustomerState.error['error']['address'])}
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


export default QuickEdit;
