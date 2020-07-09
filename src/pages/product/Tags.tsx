import React from 'react'; 

import { Select } from 'antd';

const { Option } = Select;

interface Props {
    
}

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option value={'cool'} key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}



const Tags = (props: Props) => {
    return (
        <>
    <Select mode="tags" style={{ width: '100%' }} placeholder="Search Tags" onChange={handleChange}>
      {children}
    </Select>,
        </>
    )
}

export default Tags
