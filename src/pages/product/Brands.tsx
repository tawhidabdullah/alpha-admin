import React, { useEffect, useState } from 'react';
import { useHandleFetch } from '../../hooks';
import { Select } from 'antd';

interface Props {
	setBrandId?: any;
}

const { Option } = Select;

const Brands = ({ setBrandId }: Props) => {
	const [ options, setoptions ] = useState([]);
	const [ selectedBrandId, setSelectedBrandId ] = useState('');
	const [ brandState, handleTagListFetch ] = useHandleFetch({}, 'brandList');

	function onChange(value) {
		setSelectedBrandId(value);
		setBrandId(value);
		console.log(`selected ${value}`);
	}

	function onBlur() {
		console.log('blur');
	}

	function onFocus() {
		console.log('focus');
	}

	function onSearch(val) {
		console.log('search:', val);
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
		<Select
			showSearch
			style={{ width: 200 }}
			placeholder='Select a Brand'
			optionFilterProp='children'
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			onSearch={onSearch}
			filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
		>
			{brandState.done &&
				brandState.data.length > 0 &&
				options.map((option) => {
					return <Option value={option.value}>{option.name}</Option>;
				})}
		</Select>
	);
};

export default Brands;
