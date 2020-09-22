import React, { useState } from 'react';
import { Checkbox, Row, Col } from 'antd';
interface Props {
  checkedList?: any;
  setCheckedList?: any;
  plainOptions?: any;
  defaultValue?: any;
  checkAll?: any;
  setCheckAll?: any;
}

const AccessCheckbox = ({
  checkedList,
  setCheckedList,
  plainOptions,
  defaultValue = [],
  checkAll,
  setCheckAll,
}: Props) => {
  const [interminate, setInterminate] = useState(true);

  const onChange = (checkedList) => {
    setCheckedList(checkedList);
    setInterminate(
      !!checkedList.length && checkedList.length < plainOptions.length
    );
    setCheckAll(checkedList.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setInterminate(false);
    setCheckAll(e.target.checked);
  };

  console.log('defaultValue', defaultValue);

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
          Super Admin
        </Checkbox>
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
                <Checkbox value={accessItem}>{accessItem}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
    </>
  );
};

export default AccessCheckbox;
