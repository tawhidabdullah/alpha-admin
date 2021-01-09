import React, { useEffect, useState, memo } from 'react';
import { useHandleFetch } from '../../hooks';
import { Select, Skeleton } from 'antd';


interface Props {
    setProductIds?: any;
    productIds?: any;
    productListState?: any;
}


const Tags = ({
    setProductIds,
    productIds,
    productListState
}: Props) => {
    const [options, setoptions] = useState([]);
    const [selectedOpions, setselectedOptions] = useState([]);


    useEffect(() => {
        if (productListState.done && productListState.data && productListState.data.data.length > 0) {
            // @ts-ignore
            const productOptions = productListState.data.data.map((product) => {
                return product.name
            });
            setoptions(productOptions);
        }

    }, [productListState]);



    const handleChange = (selectItems) => {
        setselectedOptions(selectItems);

        if (productListState.done && productListState.data.data.length > 0 && selectItems.length > 0) {
            const selectedCategoryIds = selectItems.map((item) => {
                const selectedcategory = productListState.data.data.find(
                    (cat) => cat.name.toLowerCase() === item.toLowerCase()
                );
                if (selectedcategory) {
                    return selectedcategory;
                }
            });
            console.log('selectedCategoryIds', selectedCategoryIds);
            setProductIds(selectedCategoryIds);
        }
        else {
            setProductIds([])
        }
    }


    // console.log('selectedOpions', selectedOpions);


    return (
        <>
            <Skeleton loading={productListState.isLoading}>
                {productListState.done && productListState.data.data.length > 0 && <Select
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

export default memo(Tags);
