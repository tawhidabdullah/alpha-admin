import React, { useEffect, useState } from 'react';
import { useHandleFetch } from '../../hooks';
import { Select, Skeleton } from 'antd';


interface Props {
    setProductIds?: any;
    productIds?: any;
}


const Tags = ({
    setProductIds,
    productIds
}: Props) => {
    const [options, setoptions] = useState([]);
    const [selectedOpions, setselectedOptions] = useState([]);
    const [tagState, handleTagListFetch] = useHandleFetch({}, 'productList');

    useEffect(() => {
        const setTags = async () => {
            const tagListRes = await handleTagListFetch({
                urlOptions: {
                    params: {
                        isSubCategory: false,
                        pageNumber: 1
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



    const handleChange = (selectItems) => {
        setselectedOptions(selectItems)

        if (tagState.done && tagState.data.length > 0 && selectItems.length > 0) {
            const selectedCategoryIds = selectItems.map((item) => {
                const selectedcategory = tagState.data.find(
                    (cat) => cat.name.toLowerCase() === item.toLowerCase()
                );
                if (selectedcategory) {
                    return selectedcategory;
                }
            });
            setProductIds(selectedCategoryIds);
        }
        else {
            setProductIds([])
        }


    }


    // console.log('selectedOpions', selectedOpions);


    return (
        <>

            <Skeleton loading={tagState.isLoading}>
                {tagState.done && tagState.data.length > 0 && <Select
                    mode="multiple"
                    placeholder="search products"
                    value={selectedOpions}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                >
                    {options.filter(o => !selectedOpions.includes(o)).map(item => (
                        <Select.Option key={item} value={item}>
                            {item}
                        </Select.Option>
                    ))}
                </Select>}
            </Skeleton>


        </>
    )
}

export default Tags
