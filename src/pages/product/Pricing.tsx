import React, { useState } from 'react';
import Attributes from "./Attributes";
import AddAttributeValues from "../attribute/AddAttributeValues";
import InputSmall from '../../components/Field/InputSmall';
import { Button } from 'antd';
import {

	PlusOutlined,
	CheckOutlined
} from '@ant-design/icons';

interface Props {
	handleAddPricing: any;
}

const Pricing = ({
	handleAddPricing
}: Props) => {

	const [price, setprice] = useState({
		regular: "",
		offer: ""
	});
	const [stock, setStock] = useState({
		available: "",
		minimum: ""
	});


	const [attributeList, setAttributeList] = useState([]);

	const handlePriceChange = e => {
		const name = e.target.name;
		const value = e.target.value;


		setprice({
			...price,
			[name]: value
		});
	};

	const handleStockChange = e => {
		const name = e.target.name;
		const value = e.target.value;

		setStock({
			...stock,
			[name]: value
		});
	};


	const handleSavePricing = (e) => {
		e.preventDefault();

		if (attributeList.length > 0) {
			const attribute = {};

			for (let item of attributeList) {
				attribute[item['name']] = item['value']
			}


			const priceItem = {
				price: price,
				stock: stock,
				attribute: attribute
			}


			setprice({
				regular: "",
				offer: ""
			})
			setStock({ available: "", minimum: "" })
			handleAddPricing(priceItem);
			setAttributeList([]);
		}
		else {
			const priceItem = {
				price: price,
				stock: stock,
				attribute: {}
			}

			setprice({
				regular: "",
				offer: ""
			})
			setStock({ available: "", minimum: "" })
			setAttributeList([]);
			handleAddPricing(priceItem);
		}

	}


	const handleAddAttribute = () => {
		setAttributeList([...attributeList, {
			name: '',
			value: '',
			id: `${attributeList.length}`
		}])
	}


	const getiCreatePricingIsDisabled = () => {
		if (!price.regular || !stock.available) {
			return true;
		}
		else return false;
	}

	// console.log('attributeList', attributeList);


	return (
		<>
			<div className='addProductGridContainer__item-body-variationCard'>

				<div className='addProductGridContainer__item-body-variationCard-left'>

					<div className='addProductGridContainer__item-body-variationCard-item'>
						<h4>
							Price
				</h4>
						<div className='addProductGridContainer__item-body-variationCard-item-container'>
							<div className='addProductGridContainer__item-body-variationCard-item-container-left'>
								<InputSmall
									label='Regular  *'
									value={price.regular}
									name='regular'
									onChange={handlePriceChange}
								/>
							</div>
							<div className='addProductGridContainer__item-body-variationCard-item-container-right'>
								<InputSmall
									size='small'
									label='Offer'
									value={price.offer}
									name='offer'
									onChange={handlePriceChange}
								/>
							</div>
						</div>



						<div className='addProductGridContainer__item-body-variationCard-item'>
							<h4>
								Stock
				</h4>
							<div className='addProductGridContainer__item-body-variationCard-item-container'>
								<div className='addProductGridContainer__item-body-variationCard-item-container-left'>
									<InputSmall
										label='Available  *'
										value={stock.available}
										name='available'
										onChange={handleStockChange}
									/>


								</div>
								<div className='addProductGridContainer__item-body-variationCard-item-container-right'>

									<InputSmall
										label='Minimum'
										value={stock.minimum}
										name='minimum'
										onChange={handleStockChange}
									/>
								</div>
							</div>
						</div>

					</div>



					<div className='addProductGridContainer__item-body-variationCard-right'>
						<div className='addProductGridContainer__item-body-variationCard-item'>
							<h4>
								Attributes
				</h4>
							<div className='addProductGridContainer__item-body-variationCard-item-attribute'>

								{attributeList.map(attribute => {
									return <Attributes
										attribute={attribute}
										attributeList={attributeList} setAttributeList={setAttributeList} />
								})}
								<Button size='small'
									onClick={handleAddAttribute}
									style={{
										width: '180px',
										minHeight: '75px',
										marginTop: '0px',
										borderRadius: "8px"
									}} type="dashed" icon={<PlusOutlined />}>Add Attribute</Button>
							</div>

						</div>
					</div>
				</div>
			</div>


			{/* <Button
          // type="primary"
         
          icon={<PlusOutlined />}
          onClick={() => setAddNewCategoryVisible(true)}
        >
        Add New
      </Button> */}

			<Button

				style={{
					marginLeft: '10px'
				}}
				onClick={handleSavePricing}
				disabled={getiCreatePricingIsDisabled()}
				className='btnAddToPrice'
				icon={<CheckOutlined />}
			>
				Add To Pricing
				</Button>



		</>
	)
}

export default Pricing
