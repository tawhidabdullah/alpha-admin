import React, { useState, useEffect } from 'react';

// import components
import Input from '../../components/Field/Input';
import {
  DeleteOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  FileImageFilled,
  FileImageOutlined,
  FileImageTwoTone,
  PlusOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';

interface Props {
  setdeliveryChargeList: any;
  deliveryChargeList: any;
  deliveryChargeItem: any;
}

const DeliveryCharge = ({
  deliveryChargeItem,
  setdeliveryChargeList,
  deliveryChargeList,
}: Props) => {
  const handleDeliveryChargeChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const updatedValue = {
      ...deliveryChargeItem,
      [name]: value,
      id: deliveryChargeItem.id,
    };

    const positionInAttribute = () => {
      return deliveryChargeList
        .map((item) => item.id)
        .indexOf(deliveryChargeItem.id);
    };

    const index = positionInAttribute();

    const updateAttributeList = [
      ...deliveryChargeList.slice(0, index),
      updatedValue,
      ...deliveryChargeList.slice(index + 1),
    ];
    setdeliveryChargeList(updateAttributeList);
  };

  const handleAttributeDelete = () => {
    console.log('delete---deliveryChargeItem', deliveryChargeItem);
    console.log('delete-----deliveryChargeList', deliveryChargeList);

    const positionInAttribute = () => {
      return deliveryChargeList
        .map((item) => item.id)
        .indexOf(deliveryChargeItem.id);
    };

    const index = positionInAttribute();

    const updateAttributeList = [
      ...deliveryChargeList.slice(0, index),
      ...deliveryChargeList.slice(index + 1),
    ];
    setdeliveryChargeList([...updateAttributeList]);

    console.log('updated-----deliveryChargeList', updateAttributeList);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '45%',
          marginRight: '10px',
        }}
      >
        <Input
          min={0}
          type='number'
          addonBefore='Minimum Order'
          value={deliveryChargeItem.minimumOrder}
          name='minimumOrder'
          onChange={handleDeliveryChargeChange}
        />
      </div>
      <div
        style={{
          width: '45%',
          marginRight: '10px',
        }}
      >
        <Input
          min={0}
          type='number'
          addonBefore='Charge'
          value={deliveryChargeItem.charge}
          name='charge'
          onChange={handleDeliveryChargeChange}
        />
      </div>
      <div
        onClick={() => handleAttributeDelete()}
        style={{
          width: '5%',
          marginBottom: '15px',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        <CloseOutlined />
      </div>
    </div>
  );
};

export default DeliveryCharge;
