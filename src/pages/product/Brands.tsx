import React, { useEffect, useState } from 'react';


// import hooks
import { useHandleFetch } from '../../hooks';

// import components 
import Empty from "../../components/Empty";


// import libraries 
import { Select, Button, Spin } from 'antd';
import {
	PlusOutlined
} from '@ant-design/icons';


interface Props {
	setBrandId?: any;
	brandId?: any;
	productDetailState?: any;
}

const { Option } = Select;

const Brands = ({ setBrandId, brandId, productDetailState }: Props) => {
	const [options, setoptions] = useState([]);
	const [selectedBrandId, setSelectedBrandId] = useState('');
	const [brandState, handleTagListFetch] = useHandleFetch({}, 'brandList');

	function onChange(value) {
		setSelectedBrandId(value);
		setBrandId(value);
		// console.log(`selected ${value}`);
	}

	function onBlur() {
		// console.log('blur');
	}

	function onFocus() {
		// console.log('focus');
	}

	function onSearch(val) {
		// console.log('search:', val);
	}

	useEffect(() => {
		const setBrands = async () => {
			const brandListRes = await handleTagListFetch({});

			// @ts-ignore
			if (brandListRes && brandListRes.length > 0) {
				// @ts-ignore
				const brandOptions = brandListRes.map((brand) => {
					return {
						value: brand.id,
						name: brand.name
					};
				});
				setoptions(brandOptions);
			}
		};

		setBrands();
	}, []);

	return (
		<>

			<div></div>

			{brandState.isLoading && (
				<div style={{
					padding: '15px 0',
					width: '100%',
					height: "100%",
					display: "flex",
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Spin />
				</div>
			)}



			{brandState.done && !(brandState.data.length > 0) && (
				<div style={{
					width: '100%',
					height: "100%",
					display: "flex",
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Empty title='No Brand found' height={100} />
				</div>
			)}


			{brandState.done && brandState.data.length > 0 && options.length > 0 && (

				<Select
					showSearch
					style={{ width: '210px', borderRadius: '6px' }}
					placeholder='Select a Organizer'
					optionFilterProp='children'
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
					onSearch={onSearch}
					defaultValue={brandId}
					filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{brandState.done &&
						brandState.data.length > 0 &&
						options.map((option) => {
							return <Option value={option.value}>{option.name}</Option>;
						})}
				</Select>
			)}






			{/* 
			<div style={{
				marginTop: '15px'
			}}>

			</div>
			<Button

				// type="primary"
				className='btnSecondaryPlusOutline'
				icon={<PlusOutlined />}
			>
				Add New
      </Button> */}
		</>
	);
};

export default Brands;
