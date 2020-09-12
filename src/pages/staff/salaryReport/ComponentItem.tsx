import React, { useState, useEffect } from 'react';
import { AutoComplete, Tooltip } from 'antd';

import InputSmall from '../../../components/Field/InputSmall';

// import comp;onent
import Sfaffid from './Sfaffid';

import { useFetch } from '../../../hooks';
import {
  DeleteOutlined,
  FileAddOutlined,
  FileImageFilled,
  PlusOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const Complete = ({ setItemsList, itemsList, componentItem, brandState }) => {
  const [brandId, setBrandId] = useState('');

  const handleComponentItemsChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const updatedValue = {
      ...componentItem,
      [name]: value,
      id: componentItem.id,
    };

    const positionInAttribute = () => {
      return itemsList.map((item) => item.id).indexOf(componentItem.id);
    };

    const index = positionInAttribute();

    const updateAttributeList = [
      ...itemsList.slice(0, index),
      updatedValue,
      ...itemsList.slice(index + 1),
    ];
    setItemsList(updateAttributeList);
  };

  useEffect(() => {
    const updatedValue = {
      ...componentItem,
      _id: brandId,
      id: componentItem.id,
    };

    const positionInAttribute = () => {
      return itemsList.map((item) => item.id).indexOf(componentItem.id);
    };

    const index = positionInAttribute();

    const updateAttributeList = [
      ...itemsList.slice(0, index),
      updatedValue,
      ...itemsList.slice(index + 1),
    ];
    setItemsList(updateAttributeList);
  }, [brandId]);

  const handleAttributeDelete = () => {
    const updateComponentList = itemsList.filter(
      (item) => item.id !== componentItem.id
    );
    setItemsList(updateComponentList);
  };

  return (
    <>
      <div className='componentItemsContainer__item'>
        <h3 className='inputFieldLabel-small'>Staff</h3>
        <Sfaffid
          brandState={brandState}
          brandId={brandId}
          setBrandId={setBrandId}
        />
        <div
          style={{
            marginTop: '10px',
          }}
        ></div>
        <InputSmall
          type='number'
          label='Bonus'
          value={componentItem.title}
          name='bonus'
          onChange={handleComponentItemsChange}
        />
        <InputSmall
          type='number'
          label='Convince'
          value={componentItem.text}
          name='convince'
          onChange={handleComponentItemsChange}
        />

        <InputSmall
          type='number'
          label='Extra'
          value={componentItem.target}
          name='extra'
          onChange={handleComponentItemsChange}
        />

        <InputSmall
          type='number'
          label='Negative'
          value={componentItem.target}
          name='negative'
          onChange={handleComponentItemsChange}
        />
      </div>
    </>
  );
};

export default Complete;
