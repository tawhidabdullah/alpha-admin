import React, { useEffect, useState } from 'react';


// import hooks
import { useHandleFetch } from '../../hooks';

// import components 
import Empty from "../../components/Empty";


// import libraries 
import { Button, Tag, Input } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';




const { CheckableTag } = Tag;
const { Search } = Input;
const tagsData = ['Movies', 'Books', 'Music', 'Sports'];

interface Props {
  setTagIds?: any;
}


const Tags = ({
  setTagIds
}: Props) => {
  const [options, setoptions] = useState([]);
  const [selectedOpions, setselectedOptions] = useState([]);
  const [tagState, handleTagListFetch] = useHandleFetch({}, 'tagList');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchValue, setsearchValue] = useState('');


  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  }




  useEffect(() => {
    const setTags = async () => {
      const tagListRes = await handleTagListFetch({
        urlOptions: {
          params: {
            isSubCategory: false
          }
        }
      });

      // @ts-ignore
      if (tagListRes && tagListRes.length > 0) {
        // @ts-ignore
        const tagOptions = tagListRes.map((tag) => {
          return tag.name
        });
        setoptions(tagOptions);
      }

    };

    setTags();
  }, []);



  // const handleChange = (selectItems) => {
  //   setselectedOptions(selectItems)

  //   if (tagState.done && tagState.data.length > 0 && selectItems.length > 0) {
  //     const selectedCategoryIds = selectItems.map((item) => {
  //       const selectedcategory = tagState.data.find(
  //         (cat) => cat.name.toLowerCase() === item.toLowerCase()
  //       );
  //       if (selectedcategory) {
  //         return selectedcategory.id;
  //       }
  //     });
  //     setTagIds(selectedCategoryIds);
  //   }


  // }


  const onSearchChange = (e) => {
    setsearchValue(e.target.value);

    if (e.target.value === '') {
      if (tagState.data && tagState.data.length > 0) {
        // @ts-ignore
        const categoryNames = tagState.data.map((cat) => cat.name);
        setoptions(categoryNames);
      }
    } else {
      const newOptions =
        options.length > 0
          ? options.filter((option) => {
            return option.toLowerCase().includes(searchValue.toLowerCase());
          })
          : [];

      setoptions(newOptions);
    }
  };




  return (
    <>

      {tagState.done && !(tagState.data.length > 0) && (
        <div style={{
          width: '100%',
          height: "100%",
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Empty title='No Tag found' height={100} />
        </div>
      )}


      {/* 
      {tagState.done && tagState.data.length > 0 && options.length > 0 && <Select
        mode="multiple"
        placeholder="search tags"
        value={selectedOpions}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        {options.filter(o => !selectedOpions.includes(o)).map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>} */}

      {tagState.done && tagState.data.length > 0 && options.length > 0 && (
        <>
          <div className='addProduct__categoryBoxContainer-searchBox'>
            <Search
              width={'90%'}
              style={{
                height: '30px',
                borderRadius: '3px !important',
                borderColor: '#eee !important'
              }}
              size='middle'
              placeholder='top, hot'
              onSearch={(value) => console.log(value)}
              onChange={onSearchChange}
            />
          </div>

          {options.map(tag => (
            <>
              <CheckableTag
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={checked => handleChange(tag, checked)}
              >
                {tag}
              </CheckableTag>
            </>
          ))}
        </>
      )}





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
      </Button>
    </>
  )
}

export default Tags
