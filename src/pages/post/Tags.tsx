import React, { useEffect, useState } from 'react';

// import hooks
import { useHandleFetch } from '../../hooks';

// import components
import Empty from '../../components/Empty';

// import libraries
import { Button, Tag, Input, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { CheckableTag } = Tag;
const { Search } = Input;

interface Props {
  setTagIds?: any;
  selectedTags?: any;
  setSelectedTags?: any;
}

const Tags = ({ setTagIds, setSelectedTags, selectedTags }: Props) => {
  const [options, setoptions] = useState([]);
  const [selectedOpions, setselectedOptions] = useState([]);
  const [tagState, handleTagListFetch] = useHandleFetch({}, 'postTagList');
  const [searchValue, setsearchValue] = useState('');

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);

    if (
      tagState.done &&
      tagState.data.length > 0 &&
      nextSelectedTags.length > 0
    ) {
      const selectedCategoryIds = nextSelectedTags.map((item) => {
        const selectedcategory = tagState.data.find(
          (cat) => cat.name.toLowerCase() === item.toLowerCase()
        );
        if (selectedcategory) {
          return selectedcategory.id;
        }
      });
      setTagIds(selectedCategoryIds);
    }
  };

  useEffect(() => {
    if (tagState.done && tagState.data.length > 0 && selectedTags.length > 0) {
      const selectedCategoryIds = selectedTags.map((item) => {
        const selectedcategory = tagState.data.find((cat) => cat.id === item);
        if (selectedcategory) {
          return selectedcategory.name;
        }
      });
      setSelectedTags(selectedCategoryIds);
    }
  }, [tagState]);

  useEffect(() => {
    const setTags = async () => {
      const tagListRes = await handleTagListFetch({
        urlOptions: {
          params: {
            isSubCategory: false,
          },
        },
      });

      // @ts-ignoref
      if (tagListRes && tagListRes.length > 0) {
        // @ts-ignore
        const tagOptions = tagListRes.map((tag) => {
          return tag.name;
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

  console.log('selectedTags', selectedTags);

  return (
    <>
      {tagState.isLoading && (
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

      {tagState.done && (
        <div className='addProduct__categoryBoxContainer-searchBox'>
          <Search
            width={'90%'}
            style={{
              height: '30px',
              borderRadius: '3px !important',
              borderColor: '#eee !important',
            }}
            size='middle'
            placeholder='top, hot'
            onSearch={(value) => console.log(value)}
            onChange={onSearchChange}
          />
        </div>
      )}

      {tagState.done && !(options.length > 0) && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty title='No tags found' height={100} />
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
          {options.map((tag) => (
            <>
              <CheckableTag
                key={tag}
                checked={selectedTags.indexOf(tag) > -1}
                onChange={(checked) => handleChange(tag, checked)}
              >
                {tag}
              </CheckableTag>
            </>
          ))}
        </>
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

export default Tags;
