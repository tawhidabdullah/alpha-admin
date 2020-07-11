import React, { useState, useEffect } from 'react';
import { useFetch, useHandleFetch } from '../../hooks';
import { Checkbox, Input } from 'antd';
const CheckboxGroup = Checkbox.Group;

const { Search } = Input;

interface Props {
	setcategoryIds?: any;
}

const Categories = ({ setcategoryIds }: Props) => {
	const [ checkedList, setcheckedList ] = useState([]);
	const [ options, setoptions ] = useState([]);
	const [ searchValue, setsearchValue ] = useState('');

	const [ categoryState, handleCategoryListFetch ] = useHandleFetch({}, 'categoryList');

	useEffect(() => {
		const setCategories = async () => {
			const categoryListRes = await handleCategoryListFetch({});

			// @ts-ignore
			if (categoryListRes && categoryListRes.length > 0) {
				// @ts-ignore
				const categoryNames = categoryListRes.map((cat) => cat.name);
				setoptions(categoryNames);
			}
		};

		setCategories();
	}, []);

	const onChange = (checkList) => {
		setcheckedList(checkList);

		if (categoryState.done && categoryState.data.length > 0 && checkList.length > 0) {
			const selectedCategoryIds = checkList.map((item) => {
				const selectedcategory = categoryState.data.find(
					(cat) => cat.name.toLowerCase() === item.toLowerCase()
				);
				if (selectedcategory) {
					return selectedcategory.id;
				}
			});
			setcategoryIds(selectedCategoryIds);
		}
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
							return option.includes(searchValue);
						})
					: [];

			setoptions(newOptions);
		}
	};

	console.log('optons', options);
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

			<CheckboxGroup options={options} value={checkedList} onChange={onChange} />
		</div>
	);
};

export default Categories;
