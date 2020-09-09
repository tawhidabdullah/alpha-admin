import React, { useState, useEffect } from 'react';
import Attributes from './Attributes';
import AddAttributeValues from '../attribute/AddAttributeValues';
import InputSmall from '../../components/Field/InputSmall';
import { Button } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';

interface Props {
  handleAddPricing: any;
  pricingItem?: any;
  handleUpdatePricing?: any;
  isPricingEditActive?: any;
}

const Pricing = ({
  handleAddPricing,
  pricingItem,
  handleUpdatePricing,
  isPricingEditActive,
}: Props) => {
  const [price, setprice] = useState({
    regular: '',
    offer: '',
  });
  const [stock, setStock] = useState({
    available: '',
    minimum: '',
  });

  const [attributeList, setAttributeList] = useState([]);

  useEffect(() => {
    if (pricingItem && Object.keys(pricingItem).length > 0) {
      setprice({
        ...price,
        ...pricingItem['price'],
      });

      setStock({
        ...stock,
        ...pricingItem['stock'],
      });

      const attributeListItems = [];
      if (
        pricingItem.attribute &&
        Object.keys(pricingItem.attribute).length > 0
      ) {
        const attributeKeys = Object.keys(pricingItem.attribute);
        attributeKeys.forEach((attributeKey, index) => {
          attributeListItems.push({
            name: attributeKey,
            value: pricingItem.attribute[attributeKey],
            id: index,
          });
        });
      }

      setAttributeList(attributeListItems);
    }
  }, [pricingItem]);

  console.log('pricingItem', pricingItem);
  console.log('attributeList', attributeList);

  const handlePriceChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setprice({
      ...price,
      [name]: value,
    });
  };

  const handleStockChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setStock({
      ...stock,
      [name]: value,
    });
  };

  const handleSavePricing = (e) => {
    e.preventDefault();

    if (attributeList.length > 0) {
      const attribute = {};

      for (let item of attributeList) {
        console.log('itemofattribute', item);
        if (item['value'] && item['name']) {
          attribute[item['name']] = item['value'];
        }
      }

      const priceItem = {
        price: price,
        stock: stock,
        attribute: attribute,
      };

      setprice({
        regular: '',
        offer: '',
      });
      setStock({ available: '', minimum: '' });
      handleAddPricing(priceItem);
      setAttributeList([]);
    } else {
      const priceItem = {
        price: price,
        stock: stock,
        attribute: {},
      };

      setprice({
        regular: '',
        offer: '',
      });
      setStock({ available: '', minimum: '' });
      setAttributeList([]);
      handleAddPricing(priceItem);
    }
  };

  const handleUpdatePricingItem = (e) => {
    e.preventDefault();

    if (attributeList.length > 0) {
      const attribute = {};

      for (let item of attributeList) {
        console.log('itemofattribute', item);
        if (item['value'] && item['name']) {
          attribute[item['name']] = item['value'];
        }
      }

      const priceItem = {
        price: price,
        stock: stock,
        attribute: attribute,
        id: pricingItem.id,
      };

      setprice({
        regular: '',
        offer: '',
      });
      setStock({ available: '', minimum: '' });
      handleUpdatePricing(priceItem);
      setAttributeList([]);
    } else {
      const priceItem = {
        price: price,
        stock: stock,
        attribute: {},
        id: pricingItem.id,
      };

      setprice({
        regular: '',
        offer: '',
      });
      setStock({ available: '', minimum: '' });
      setAttributeList([]);
      handleUpdatePricing(priceItem);
    }
  };

  const handleAddAttribute = () => {
    setAttributeList([
      ...attributeList,
      {
        name: '',
        value: '',
        id: `${attributeList.length}`,
      },
    ]);
  };

  const getiCreatePricingIsDisabled = () => {
    if (!price.regular) {
      return true;
    } else return false;
  };

  // console.log('attributeList', attributeList);

  return (
    <>
      <div className='addProductGridContainer__item-body-variationCard'>
        <div className='addProductGridContainer__item-body-variationCard-left'>
          <div className='addProductGridContainer__item-body-variationCard-item'>
            <h4>Price</h4>
            <div className='addProductGridContainer__item-body-variationCard-item-container'>
              <div className='addProductGridContainer__item-body-variationCard-item-container-left'>
                <InputSmall
                  min={0}
                  type='number'
                  label='Regular  *'
                  value={price.regular}
                  name='regular'
                  onChange={handlePriceChange}
                />
              </div>
              <div className='addProductGridContainer__item-body-variationCard-item-container-right'>
                <InputSmall
                  min={0}
                  type='number'
                  size='small'
                  label='Offer'
                  value={price.offer}
                  name='offer'
                  onChange={handlePriceChange}
                />
              </div>
            </div>
          </div>

          <div className='addProductGridContainer__item-body-variationCard-right'>
            <div className='addProductGridContainer__item-body-variationCard-item'>
              <h4>Attributes</h4>
              <div className='addProductGridContainer__item-body-variationCard-item-attribute'>
                {attributeList.map((attribute) => {
                  return (
                    <Attributes
                      attribute={attribute}
                      attributeList={attributeList}
                      setAttributeList={setAttributeList}
                    />
                  );
                })}
                <Button
                  size='small'
                  onClick={handleAddAttribute}
                  style={{
                    width: '180px',
                    minHeight: '75px',
                    marginTop: '0px',
                    borderRadius: '8px',
                  }}
                  type='dashed'
                  icon={<PlusOutlined />}
                >
                  Add Attribute
                </Button>
              </div>
            </div>

            <div
              style={{
                marginTop: '25px',
              }}
              className='addProductGridContainer__item-body-variationCard-item'
            >
              <h4>Stock</h4>
              <div className='addProductGridContainer__item-body-variationCard-item-container'>
                <div className='addProductGridContainer__item-body-variationCard-item-container-left'>
                  <InputSmall
                    min={0}
                    type='number'
                    label='Available'
                    value={stock.available}
                    name='available'
                    onChange={handleStockChange}
                  />
                </div>
                <div className='addProductGridContainer__item-body-variationCard-item-container-right'>
                  <InputSmall
                    min={0}
                    type='number'
                    label='Minimum'
                    value={stock.minimum}
                    name='minimum'
                    onChange={handleStockChange}
                  />
                </div>
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
          marginLeft: '10px',
        }}
        onClick={
          isPricingEditActive ? handleUpdatePricingItem : handleSavePricing
        }
        disabled={getiCreatePricingIsDisabled()}
        className='btnAddToPrice'
        icon={<CheckOutlined />}
      >
        {isPricingEditActive ? 'Update Pricing' : 'Add To Pricing'}
      </Button>
    </>
  );
};

export default Pricing;
