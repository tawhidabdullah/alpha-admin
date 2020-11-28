import React, { useEffect, useState } from 'react';


// import hooks
import { useHandleFetch } from '../../hooks';

// import components 
import Empty from "../../components/Empty";


// import libraries 
import { Select } from 'antd';


interface Props {
    setDisCountAmountType?: any;
    disCountAmountType?: any;
}

const { Option } = Select;

const DiscountType = ({ setDisCountAmountType, disCountAmountType }: Props) => {

    function onChange(value) {
        setDisCountAmountType(value);
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


    const options = [
        {
            value: 'fixed',
            name: 'Fixed'
        },
        {
            value: 'percentage',
            name: 'Percentage'
        }
    ]

    return (
        <>
            <h3 className='inputFieldLabel'>
                Discount Amount Type
          </h3>

            <Select
                showSearch
                style={{ width: '100%', borderRadius: '6px' }}
                placeholder='Select a Brand'
                optionFilterProp='children'
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                defaultValue={disCountAmountType}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    options.map((option) => {
                        return <Option value={option.value}>{option.name}</Option>;
                    })}
            </Select>
        </>
    );
};

export default DiscountType;
