import React, { useState } from 'react';
import { Checkbox, Row, Col, Input } from 'antd';
interface Props {
  checkedList?: any;
  setCheckedList?: any;
  plainOptions?: any;
  defaultValue?: any;
  checkAll?: any;
  setCheckAll?: any;
  setPlainOptions?: any;
  cityListState?: any;
}

const { Search } = Input;

const AccessCheckbox = ({
  checkedList,
  setCheckedList,
  plainOptions,
  defaultValue = [],
  checkAll,
  setCheckAll,
  cityListState,
  setPlainOptions,
}: Props) => {
  const [interminate, setInterminate] = useState(true);
  const [searchValue, setsearchValue] = useState('');

  const onChange = (checkedList) => {
    setCheckedList(checkedList);
    setInterminate(
      !!checkedList.length && checkedList.length < plainOptions.length
    );
    setCheckAll(checkedList.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    const checkedCities =
      plainOptions && plainOptions.length > 0
        ? plainOptions.map((city) => {
            return city.value;
          })
        : [];
    setCheckedList(e.target.checked ? checkedCities : []);
    setInterminate(false);
    console.log('e.target.checked', e.target.checked);
    setCheckAll(e.target.checked);
  };

  console.log('defaultValue', defaultValue);

  const onSearchChange = (e) => {
    setsearchValue(e.target.value);

    if (e.target.value === '') {
      if (cityListState.data && cityListState.data.length > 0) {
        // @ts-ignore
        const categoryNames = cityListState.data.map((city) => {
          return {
            value: city.name,
            name: city.name,
          };
        });
        setPlainOptions(categoryNames);
      }
    } else {
      const newOptions =
        plainOptions.length > 0
          ? plainOptions.filter((option) => {
              return (
                option &&
                option.name.toLowerCase().includes(searchValue.toLowerCase())
              );
            })
          : [];

      setPlainOptions(newOptions);
    }
  };

  return (
    <>
      <div
        style={{
          borderBottom: '1px solid #eee',
          marginBottom: '10px',
        }}
        className='site-checkbox-all-wrapper'
      >
        <Checkbox
          style={{
            marginBottom: '10px',
          }}
          // indeterminate={interminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Select all
        </Checkbox>

        <Search
          width={'100%'}
          style={{
            height: '30px',
            borderRadius: '3px !important',
            borderColor: '#eee !important',
            margin: '10px 0',
          }}
          size='middle'
          placeholder=''
          onSearch={(value) => console.log(value)}
          onChange={onSearchChange}
        />
        <div
          style={{
            marginBottom: '10px',
          }}
        ></div>
      </div>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={checkedList}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        <Row>
          {plainOptions.map((accessItem) => {
            return (
              <Col
                style={{
                  marginBottom: '10px',
                }}
                span={8}
              >
                <Checkbox value={accessItem.value}>{accessItem.value}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </>
  );
};

export default AccessCheckbox;
