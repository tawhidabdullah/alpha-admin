import React,{useState, useEffect} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import {useHandleFetch} from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal } from 'antd';

import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	DeleteOutlined,
	FileAddOutlined,
	PlusOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import DeliveryCharge from './DeliveryCharge';


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




const initialValues = {
    name: '',
    pickUpLocation: '',
    time: '',
  };
  



interface Props {
	addNewCategoryVisible: any; 
	setAddNewCategoryVisible: any; 
	categoryList?: any; 
}

const AddNewRegion = ({ addNewCategoryVisible, setAddNewCategoryVisible,categoryList }: Props) => {

    const [addRegionState, handleRegionFetch] = useHandleFetch({}, 'addRegion');
    const [selectedCountryValue,setselectedCountryValue] = useState(''); 
    const [selectedCityValue,setselectedCityValue] = useState(''); 

    const [countryOptions,setcountryOptions] = useState([]); 
    const [cityOptions,setcityOptions] = useState([]); 

    const [countryListState, handleCountryListFetch] = useHandleFetch(
        [],
        'countryList'
      );
    
      const [cityListState, handleCityListFetch] = useHandleFetch([], 'cityList');
    
      const [countryList, setCountryList] = useState([]);
      const [cityList, setCityList] = useState([]);

	  const [deliveryChargeList, setdeliveryChargeList] = useState([]);


	const handleSubmit = async (values : any, actions : any) => {
		console.log('selectedCityValue',selectedCityValue)

		if(deliveryChargeList.length > 0){
			const charge = {}; 

			for (let item of deliveryChargeList){
				if(charge[item['minimumOrder']] !== '' && item['charge'] !== ''){
					charge[item['minimumOrder']] = item['charge']
				}
				
			}

			const addRegionRes = await handleRegionFetch({
		
				body: {
					name: values.name,
					pickUpLocation: values.pickUpLocation,
					time: values.time,
					country: selectedCountryValue,
					city: selectedCityValue,
					charge
				},
			  });

		}
		else {
			const addRegionRes = await handleRegionFetch({
		
				body: {
					name: values.name,
					pickUpLocation: values.pickUpLocation,
					time: values.time,
					country: selectedCountryValue,
					city: selectedCityValue,
					charge: {}
				},
			  });
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




	const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
      };


	const getisSubmitButtonDisabled = (values,isValid) => {
		if(!isValid ||
            !values.name ||
            !values.pickUpLocation ||
            !values.time ){ 
	
			return true; 
		}
		return false; 
	  }



	  const handleAddDeliveryCharge = () => {
		setdeliveryChargeList([...deliveryChargeList, {
			minimumOrder: '',
			charge: '',
			id: `${deliveryChargeList.length}`
		}])
	  }; 




	return (
		<Formik
		onSubmit={(values, actions) => handleSubmit(values, actions)}
		validationSchema={validationSchema}
		validateOnBlur={false}
		enableReinitialize={true}
		initialValues={
		  {...initialValues}
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
				top: '40px'
            }}
            
            bodyStyle={{
                margin: '0',
                padding: '10px'
            }}
			title="Add New Region"
			visible={addNewCategoryVisible}
			onOk={(e : any) => handleSubmit(e)}
			onCancel={handleCancel}
			okText='Create'
			okButtonProps={{
			loading: isSubmitting,
			htmlType: "submit",
			disabled: getisSubmitButtonDisabled(values, isValid)
			}}
  >
		

            <div className='dubbleRowInputs'>
         <div className='dubbleRowInputs__item'>
         <Input 
			   label='Name'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && addRegionState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && addRegionState.error['error']['name'])}
			   onChange={(e : any) => {
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
				  (!isSubmitting && addRegionState.error['error']['pickUpLocation'])}
			  
				  errorString={(touched.pickUpLocation && errors.pickUpLocation) ||
					  (!isSubmitting && addRegionState.error['error']['pickUpLocation'])}
			   onChange={(e : any) => {
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
				  (!isSubmitting && addRegionState.error['error']['time'])}
			  
				  errorString={(touched.time && errors.time) ||
					  (!isSubmitting && addRegionState.error['error']['time'])}
			   onChange={(e : any) => {
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
		 mode="multiple"
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
         </div>

            </div>


			<div style={{
                marginTop: '12px'
            }}></div>
 <h3 className='inputFieldLabel'>
                Delivery Charges
            </h3>

			{deliveryChargeList.map(deliveryChargeItem => {
				return 	<DeliveryCharge 
				deliveryChargeItem={deliveryChargeItem}
				deliveryChargeList={deliveryChargeList} setdeliveryChargeList={setdeliveryChargeList}/> 
			})}
			
			

           
			<Button size='middle' 
				onClick={handleAddDeliveryCharge}
                type="dashed" icon={<PlusOutlined />}>Add Attribute</Button>

  </Modal>


			
	
			</>
		  )}
	  </Formik>


		

	);
};

export default AddNewRegion;
