import React, { useEffect, useState } from 'react';

// import hooks
import { useHandleFetch } from '../../../hooks';

// import components
import Empty from '../../../components/Empty';

// import libraries
import { Select, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Props {
  setBrandId?: any;
  brandId?: any;
  brandState?: any;
}

const { Option } = Select;

const Brands = ({ setBrandId, brandId, brandState }: Props) => {
  const [options, setoptions] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');

  useEffect(() => {
    if (brandState.done && brandState.data && brandState.data.length > 0) {
      const brandOptions = brandState.data.map((brand) => {
        return {
          value: brand.id,
          name: brand.name,
        };
      });
      setoptions(brandOptions);
    } else {
      setoptions([]);
    }
  }, [brandState]);

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

  return (
    <>
      <div></div>

      {brandState.isLoading && (
        <div
          style={{
            padding: '15px 0',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      )}

      {brandState.done && !(brandState.data.length > 0) && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty title='No Staff found' height={100} />
        </div>
      )}

      {brandState.done &&
        brandState.data &&
        brandState.data.length > 0 &&
        options.length > 0 && (
          <Select
            showSearch
            style={{ width: '100%', borderRadius: '6px' }}
            placeholder='Select a Staff'
            optionFilterProp='children'
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
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
