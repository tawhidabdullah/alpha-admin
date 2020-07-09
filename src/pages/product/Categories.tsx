import React, { useState } from 'react';

import { Checkbox, Input } from 'antd';
const CheckboxGroup = Checkbox.Group;

const { Search } = Input;

function onChange(e) {
	console.log(`checked = ${e.target.checked}`);
}

interface Props {}

const Categories = (props: Props) => {
	const [ checkedList, setcheckedList ] = useState([]);
	const [ options, setoptions ] = useState([ 'Apple', 'Pear', 'Orange' ]);
	const [ searchValue, setsearchValue ] = useState('');

	const onChange = (checkedList) => {
		setcheckedList(checkedList);
	};

	const onSearchChange = (e) => {
		setsearchValue(e.target.value);
		const newOptions =
			options.length > 0
				? options.filter((option) => {
						return options.includes(searchValue);
					})
				: [];

		setoptions(newOptions);
	};

	console.log('optons', options);
	return (
		<div className='addProduct__categoryBoxContainer'>
			<div className='addProduct__categoryBoxContainer-searchBox'>
				<Search
					size='middle'
					placeholder='input search text'
					onSearch={(value) => console.log(value)}
					onChange={onSearchChange}
				/>
			</div>

			<CheckboxGroup options={options} value={checkedList} onChange={onChange} />
		</div>
	);
};

export default Categories;
