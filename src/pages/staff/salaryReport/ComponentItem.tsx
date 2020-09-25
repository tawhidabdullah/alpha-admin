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
  DeleteColumnOutlined,
} from '@ant-design/icons';

const Complete = ({
  setItemsList,
  itemsList,
  componentItem,
  brandState,
  index,
}) => {
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

  console.log('componentItem322',   
  componentItem);
  return (
    <>
      <div className='staffComponentItemsContainer__item'>
        <div
          className='staffComponentItemsContainer__name'
          style={{
            marginTop: index === 0 ? '-5px' : '-35px',
          }}
        >
          {!index && (
            <h3 className='inputFieldLabel-small' style={{}}>
              Name
            </h3>
          )}

          <h4
            style={{
              margin: 0,
              padding: 0,
              textTransform: 'uppercase',
              fontSize: '13px',
              marginTop: '33px',
            }}
          >
            {componentItem.name}
          </h4>
        </div>

        <div
          style={{
            marginTop: index === 0 ? '-5px' : '-35px',
          }}
          className='staffComponentItemsContainer__salary'
        >
          {!index && (
            <h3 className='inputFieldLabel-small' style={{}}>
              Salary
            </h3>
          )}

          <h5
            style={{
              margin: 0,
              padding: 0,
              fontSize: '12px',
              marginTop: '33px',
            }}
          >
            {componentItem.salary}
          </h5>
        </div>

        <div className='staffComponentItemsContainer__input'>
          {!index && (
            <h3
              className='inputFieldLabel-small'
              style={{
                marginBottom: '20px',
              }}
            >
              Bonus
            </h3>
          )}
          <div>
            <InputSmall
              type='number'
              label={''}
              value={componentItem.title}
              name='bonus'
              onChange={handleComponentItemsChange}
            />
          </div>
        </div>
        <div className='staffComponentItemsContainer__input'>
          {!index && (
            <h3
              className='inputFieldLabel-small'
              style={{
                marginBottom: '20px',
              }}
            >
              Convince
            </h3>
          )}

          <InputSmall
            type='number'
            label={''}
            value={componentItem.text}
            name='convince'
            onChange={handleComponentItemsChange}
          />
        </div>
        <div className='staffComponentItemsContainer__input'>
          {!index && (
            <h3
              className='inputFieldLabel-small'
              style={{
                marginBottom: '20px',
              }}
            >
              Extra
            </h3>
          )}

          <InputSmall
            type='number'
            label={''}
            value={componentItem.target}
            name='extra'
            onChange={handleComponentItemsChange}
          />
        </div>
        <div className='staffComponentItemsContainer__input'>
          {!index && (
            <h3
              className='inputFieldLabel-small'
              style={{
                marginBottom: '20px',
              }}
            >
              Negative
            </h3>
          )}

          <InputSmall
            type='number'
            label={''}
            value={componentItem.target}
            name='negative'
            onChange={handleComponentItemsChange}
          />
        </div>

        <div
          onClick={() => handleAttributeDelete()}
          className='staffComponentItemsContainer__input'
          style={{
            marginTop: index === 0 ? '15px' : '-10px',
          }}
        >
          <span
            style={{
              color: 'rgba(255, 166, 0, 0.733)',
              cursor: 'pointer',
            }}
          >
            <DeleteOutlined />
          </span>
        </div>
      </div>
    </>
  );
};

export default Complete;
