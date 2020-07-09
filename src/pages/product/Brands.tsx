import React from 'react';
import { Select } from 'antd';

interface Props {}

const { Option } = Select;

function onChange(value) {
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

const Brands = (props: Props) => {
	return (
		<Select
			showSearch
			style={{ width: 200 }}
			placeholder='Select a person'
			optionFilterProp='children'
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			onSearch={onSearch}
			filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
		>
			<Option value='jack'>Jack</Option>
			<Option value='lucy'>Lucy</Option>
			<Option value='tom'>Tom</Option>
		</Select>
	);
};

export default Brands;
