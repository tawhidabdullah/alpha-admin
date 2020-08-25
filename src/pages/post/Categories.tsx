import React, { useState, useEffect } from 'react';

// import components 
import Empty from "../../components/Empty";

// import hoooks
import { useHandleFetch } from '../../hooks';


// import libraries 
import { Input, Tree, Button, Spin } from 'antd';
import {
	PlusOutlined
} from '@ant-design/icons';


const { Search } = Input;



interface Props {
	setcategoryIds?: any;
	categoryOptions?: any;
	setCategoryOptions?: any;
}


const Categories = ({ setcategoryIds, categoryOptions, setCategoryOptions }: Props) => {
	const [options, setoptions] = useState([]);
	const [searchValue, setsearchValue] = useState('');

	const [categoryState, handleCategoryListFetch] = useHandleFetch({}, 'postSelectCategoryList');


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
		const checkedIds = checkedKeys.checked || [];
		setcategoryIds(checkedIds);
		setCategoryOptions(checkedIds);
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

	console.log('categoryState', categoryState);
	console.log('optionsCat', options);


	return (
		<div className='addProduct__categoryBoxContainer'>

			{categoryState.isLoading && (
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


			{categoryState.done && !(categoryState.data.length > 0) && (
				<div style={{
					width: '100%',
					height: "100%",
					display: "flex",
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Empty title='No category found' height={100} />
				</div>
			)}

			{categoryState.done && categoryState.data.length > 0 && options.length > 0 && (
				<>
					<div className='addProduct__categoryBoxContainer-searchBox'>
						<Search
							width={'100%'}
							style={{
								height: '30px',
								borderRadius: '3px !important',
								borderColor: '#eee !important'
							}}
							size='middle'
							placeholder='cloths, grocery'
							onSearch={(value) => console.log(value)}
							onChange={onSearchChange}
						/>
					</div>

					<div style={{
						// marginLeft: "-20px",
					}}>
						{options.length > 0 && (
							<Tree
								checkable
								checkedKeys={categoryOptions}
								onSelect={onSelect}
								onCheck={onCheck}
								treeData={options}
								defaultExpandAll={true}
								checkStrictly={true}

							/>
						)}
					</div>
				</>

			)}
			{/* <div style={{
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

			{/* <CheckboxGroup options={options} value={checkedList} onChange={onChange} /> */}
		</div>
	);
};

export default Categories;
