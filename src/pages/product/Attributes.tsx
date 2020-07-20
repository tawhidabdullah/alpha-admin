import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';

import InputSmall from '../../components/Field/InputSmall';
import { useFetch } from "../../hooks";
import {
    DeleteOutlined
} from '@ant-design/icons';

const Complete = ({ setAttributeList, attributeList, attribute }) => {

    const [suggestedOptions, setsuggesteOptions] = useState([]);
    const attributeLisState = useFetch([], [], 'attributeList', {});


    const [attributeItem, setAttributeITem] = useState({
        name: attribute.name,
        value: attribute.value
    })



    useEffect(() => {
        const positionInAttribute = () => {
            return attributeList.map(item => item.id).indexOf(attribute.id);
        }

        const index = positionInAttribute();

        const updatedItem = Object.assign({}, attributeList[index], { ...attributeItem });
        const updateAttributeList = [...attributeList.slice(0, index), updatedItem, ...attributeList.slice(index + 1)];
        setAttributeList(updateAttributeList);

    }, [attributeItem])


    const handleAttributeDelete = () => {

        const updateAttributeList = attributeList.filter(item => item.id !== attribute.id);
        setAttributeList(updateAttributeList);
    }



    useEffect(() => {
        if (attributeLisState.data && Object.keys(attributeLisState.data).length > 0) {
            const options = Object.keys(attributeLisState.data);
            const manupulatedOptions = options.map(option => {
                return {
                    value: option
                }
            })
            setsuggesteOptions(manupulatedOptions);
        };
    }, [attributeLisState.data]);






    const handleAttributeSelect = (value) => {

        if (attributeLisState && Object.keys(attributeLisState.data).length > 0) {
            if (attributeLisState.data[value]) {
                setAttributeITem({
                    ...attribute,
                    name: value,
                    value: attributeLisState.data[value]
                })
            }

        }

        else {
            setAttributeITem({
                ...attribute,
                name: value
            })
        }


    }

    const handleAttributeValueChange = (e) => {
        setAttributeITem({
            ...attribute,
            value: e.target.value
        });
    }

    return (
        <>

            <div
                key={attribute.id}
                className='addProductGridContainer__item-body-variationCard-item-attribute-item'>
                <div
                    onClick={handleAttributeDelete}
                    className='addProductGridContainer__item-body-variationCard-item-attribute-item-delete'>
                    <DeleteOutlined />
                </div>

                <h3 className='inputFieldLabel-small'>
                    Name
                </h3>
                <AutoComplete
                    value={attribute.name}
                    style={{ width: '100%' }}
                    options={suggestedOptions}
                    placeholder="attribute"
                    onChange={handleAttributeSelect}
                    filterOption={(inputValue, suggestedOption) =>
                        suggestedOption.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                />

                {attribute.name && (
                    <>
                        <div style={{ marginTop: '10px' }}></div>
                        <InputSmall
                            label='Value'
                            value={attribute.value}
                            name='value'
                            onChange={handleAttributeValueChange}
                        />
                    </>
                )}


            </div>



        </>
    )
}

export default Complete;
