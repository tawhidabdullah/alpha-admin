import React, { useState, useEffect } from 'react';
import { useFetch, useHandleFetch } from '../../hooks';
import { Checkbox, Input, Tree } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;




interface Props {
	setcategoryIds?: any;
}

const Categories = ({ setcategoryIds }: Props) => {
	const [options, setoptions] = useState([]);
	const [searchValue, setsearchValue] = useState('');

	const [categoryState, handleCategoryListFetch] = useHandleFetch({}, 'categorySelectist');

	useEffect(() => {
		const setCategories = async () => {
			const categoryListRes = await handleCategoryListFetch({});

			// @ts-ignore
			if (categoryListRes && categoryListRes.length > 0) {
				// @ts-ignore
				setoptions(categoryListRes);
			}
		};

		setCategories();
	}, []);

	const onSelect = (selectedKeys, info) => {
		// console.log('selectedKeys', selectedKeys, info);
	};


	const onCheck = (checkedKeys, info) => {
		setcategoryIds(checkedKeys);
	};

	const onSearchChange = (e) => {
		setsearchValue(e.target.value);

		if (e.target.value === '') {
			if (categoryState.data && categoryState.data.length > 0) {
				// @ts-ignore
				const categoryNames = categoryState.data.map((cat) => cat.name);
				setoptions(categoryNames);
			}
		} else {
			const newOptions =
				options.length > 0
					? options.filter((option) => {
						return option.toLowerCase().includes(searchValue.toLowerCase());
					})
					: [];

			setoptions(newOptions);
		}
	};

	// console.log('optons', options);


	return (
		<div className='addProduct__categoryBoxContainer'>
			<div className='addProduct__categoryBoxContainer-searchBox'>
				<Search
					width={'100%'}
					style={{
						height: '30px',
						borderRadius: '3px !important',
						borderColor: '#eee !important'
					}}
					size='middle'
					placeholder='category name'
					onSearch={(value) => console.log(value)}
					onChange={onSearchChange}
				/>
			</div>

			<div style={{
				marginLeft: "-20px",
			}}>
				<Tree

					checkable
					onSelect={onSelect}
					onCheck={onCheck}
					treeData={options}
					defaultExpandAll={true}
				/>
			</div>


			{/* <CheckboxGroup options={options} value={checkedList} onChange={onChange} /> */}
		</div>
	);
};

export default Categories;
