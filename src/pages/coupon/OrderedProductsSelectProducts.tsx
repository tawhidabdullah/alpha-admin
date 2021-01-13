import React, { useEffect, useState } from 'react';
import { useHandleFetch } from '../../hooks';
import { Select, Skeleton } from 'antd';
import Empty from "../../components/Empty";


interface Props {
    setProductIds?: any;
    productIds?: any;
}


const Products = ({ setProductIds, productIds }: Props) => {
    const [options, setoptions] = useState([]);
    const [selectedOpions, setselectedOptions] = useState([]);
    const [productState, handleProductListFetch] = useHandleFetch({}, "productList");

    useEffect(() => {
        const setProducts = async () => {
            const productListRes = await handleProductListFetch({
                urlOptions: {
                    params: {
                        limit:100000,
                        sortItem:"name",
                        sortOrderValue:"1",
                        productType:"product",
                        pageNumber: 1,
                
                    }
                }
            });
            console.log({productListRes})
            // @ts-ignore
            if (productListRes && productListRes.data.length > 0) {
                // @ts-ignore
                const tagOptions = productListRes.data.map((tag) => {
                    return tag.name
                });
                setoptions(tagOptions);
            }

        };

        setProducts();
    }, []);



    useEffect(() => {
        if (productIds && productIds.length > 0) {
            console.log('shippingRunning')
            const selecttedOptions = productIds.map(item => item.name);
            setselectedOptions(selecttedOptions)
        }
    }, [productIds]);

    useEffect(()=>{
        console.log({productState})
    }, [productState])

    const handleChange = (selectItems) => {
        setselectedOptions(selectItems);

        // console.log('selectedProducts', selectItems);
        console.log({productState})
        if (productState.done && productState.data && productState.data.data.length > 0 && selectItems.length > 0) {
            const selectedCategoryIds = selectItems.map((item) => {
                const selectedcategory = productState.data.data.find(
                    (cat) => cat.name.toLowerCase() === item.toLowerCase()
                );
                if (selectedcategory) {
                    return selectedcategory;
                }
            });
            // console.log('selectedCategoryIds', selectedCategoryIds);
            setProductIds(selectedCategoryIds);
        }
        else {
            setProductIds([])
        }


    }


    // console.log('selectedOpions', selectedOpions);


    return (
        <>

            <Skeleton loading={productState.isLoading}>
                {console.log(productState)}
                {productState.done && productState.data && productState.data.data.length > 0 && <Select
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
                {productState.done && productState.data && productState.data.data && !(productState.data.data.length > 0) && (
                    <div style={{
                        marginLeft: '32px'
                    }}>
                        <Empty title='No Product Found' height={150} />
                    </div>
                )}

            </Skeleton>


        </>
    )
}

export default Products
