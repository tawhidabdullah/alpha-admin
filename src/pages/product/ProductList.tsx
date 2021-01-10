//@ts-nocheck

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { queryCache, useMutation, useQueryCache } from 'react-query'
import config from "../../config.json";
import {
  notification,
  Table,
  Menu,
  Dropdown,
  Space,
  Button,
  Input,
  Tooltip,
  Popconfirm,
} from "antd";


import {
  CheckCircleOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";

/// import hooks
import { useHandleFetch, usePaginate } from "../../hooks";
import Empty from "../../components/Empty";


// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewProduct from "./AddNewProduct";
import ProductQuickEdit from "./ProductQuickEdit";
import UploadCSV from "./UploadCSV";
// import QuickEdit from './QuickEdit';

// ** IMPORT TABLE
import TableListWithPagination from "../../components/TableListWithPagination";

// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";


const { Column, ColumnGroup } = Table;
const { Search } = Input;

const openSuccessNotification = (msg?: any) => {
  notification.success({
    message: msg || "Product Deleted",
    description: "",
    icon: <CheckCircleOutlined style={{ color: "rgba(0, 128, 0, 0.493)" }} />,
  });
};

interface myTableProps {
  data: any;
  setProductList: any;
  roles: any;
  productListState: any
  searchList?: any;
}

const MyTable = ({ data, setProductList, roles, productListState, searchList }: myTableProps) => {
  const [visible, setvisible] = useState(false);
  const [limit, setLimit] = useState(11);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);

  const [deleteProductState, handleDeleteProductFetch] = useHandleFetch(
    {},
    "deleteProduct"
  );
  const [productDetailVisible, setproductDetailVisible] = useState(false);
  const [updateOrderStatusState, handleUpdateOrderStatusFetch] = useHandleFetch(
    {},
    "updateStock"
  );

  const history = useHistory();
  const cache = useQueryCache();

  const handleDeleteProduct = async (id) => {
    const deleteProductRes = await handleDeleteProductFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteProductRes && deleteProductRes.status === "ok") {
      const queries = cache.getQueries();
      const queriesKeyMap = queries.filter(query => {
        const queryKey = query?.queryKey;
        // @ts-ignore
        return queryKey?.[0] === 'product' && typeof queryKey?.[1] === 'number'
      }).map(query => query?.queryKey);

      const idQueryKey = queriesKeyMap.find(key => {
        let isKey = false;
        // @ts-ignore
        if (cache.getQueryData(key)?.data.find(item => item.id === id)) {
          isKey = true;
        }
        return isKey;
      })
      if (idQueryKey?.[0]) {
        // @ts-ignore
        cache.setQueryData(idQueryKey, ((prev) => {
          return {
            // @ts-ignore
            ...prev,
            // @ts-ignore
            data: prev.data?.filter(item => item.id !== id),
          }
        }))
      }

      // console.log({ idQueryKey: idQueryKey })

      openSuccessNotification();

    }

  };



  const handleUpdateOrderStatus = async (record, id, newStatus) => {
    const updateOrderStatusRes = await handleUpdateOrderStatusFetch({
      body: {
        inStock: newStatus,
      },
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (updateOrderStatusRes && updateOrderStatusRes.status === "ok") {
      openSuccessNotification("Updated Stock");

      const positionInTag = () => {
        return data.map((item) => item.id).indexOf(id);
      };

      const index = positionInTag();
      // console.log("recordis", record, index);

      // @ts-ignore
      const updatedItem = Object.assign({}, data[index], {
        inStock: newStatus,
      });
      const updateOrderList = [
        ...data.slice(0, index),
        updatedItem,
        ...data.slice(index + 1),
      ];
      // console.log("updateOrderList", updateOrderList, "-----", setProductList);
      setProductList(updateOrderList);
    }
  };

  const StatusItemMenu = (record, id) => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => handleUpdateOrderStatus(record, id, true)}
          key="1"
          icon={<CheckOutlined />}
        >
          In stock
        </Menu.Item>

        <Menu.Item
          onClick={() => handleUpdateOrderStatus(record, id, false)}
          key="1"
          icon={<CheckOutlined />}
        >
          Out of stock
        </Menu.Item>
      </Menu>
    );
  };

  const getCover = (record: any) => {
    if (record.cover) {
      return record.cover;
    } else return "";
  };

  return (
    <>
      <TableListWithPagination
        data={searchList?.length > 0 ? searchList : productListState?.resolvedData?.data || []}
        total={productListState?.resolvedData?.total}
        loading={productListState.status === 'loading' || productListState.isFetching}
        limit={productListState.limit}
        handlePageChange={(pageNumber, _) => {
          productListState?.setPage(pageNumber)
        }}
        handleShowSizeChange={(current, pageNumber) => {
          setLimit(pageNumber);
          productListState?.setLimit(pageNumber)
        }}
      >
        <Column
          title=""
          dataIndex="cover"
          key="id"
          width={"80px"}
          className="classnameofthecolumn"
          render={(cover, record: any) => (
            <>
              <div
                className="listCoverImage"
                onClick={() => {
                  history.push(`/admin/product/${record.id}`);
                  setactiveCategoryForEdit(record);
                }}
              >
                <img src={getCover(record)} alt="" />
              </div>
            </>
          )}
        />

        <Column
          title="Name"
          dataIndex="name"
          key="id"
          className="classnameofthecolumn"
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/product/${record.id}`);
                  setactiveCategoryForEdit(record);
                }}
                style={{
                  fontWeight: 400,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                {text}
              </h4>
            </>
          )}
        />

        <Column
          title="Offer Price"
          dataIndex="offerPrice"
          key="id"
          className="classnameofthecolumn"
        />

        <Column
          title="Price"
          dataIndex="price"
          key="id"
          className="classnameofthecolumn"
        />

        <Column
          title="Available"
          dataIndex="available"
          key="id"
          className="classnameofthecolumn"
        />

        <Column
          align="right"
          title="Stock"
          dataIndex="inStock"
          key="id"
          className="classnameofthecolumn"
          render={(text, record: any) => (
            <>
              {isAccess("postCatalogue", roles) ? (
                <Dropdown
                  overlay={() => StatusItemMenu(record, record.id)}
                  placement="bottomRight"
                >
                  <a href="##">
                    <span
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {text ? "In Stock" : "Out of stock"}
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "10px",
                        }}
                      >
                        <DownOutlined />
                      </span>
                    </span>
                  </a>
                </Dropdown>
              ) : (
                  <a href="##">
                    <span
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {text ? "In Stock" : "Out of stock"}
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "10px",
                        }}
                      ></span>
                    </span>
                  </a>
                )}
            </>
          )}
        />
        {isAccess("postCatalogue", roles) && (
          <Column
            className="classnameofthecolumn"
            title=""
            key="action"
            align="right"
            render={(text, record: any) => (
              <Space size="middle">
                <a href="##">
                  <Tooltip placement="top" title="Edit Product">
                    <span
                      className="iconSize"
                      onClick={() => {
                        setvisible(true);
                        setactiveCategoryForEdit(record);
                      }}
                    >
                      <EditOutlined />
                    </span>
                  </Tooltip>
                </a>

                <Popconfirm
                  onConfirm={() => handleDeleteProduct(record.id)}
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                >
                  <span className="iconSize iconSize-danger">
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              </Space>
            )}
          />
        )}
      </TableListWithPagination>

      {activeCategoryForEdit && (
        <ProductQuickEdit
          productList={data}
          productListState={productListState}
          setProductList={setProductList}
          setProductEditVisible={setvisible}
          productEditVisible={visible}
          productDetailData={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props {
  roles?: any;
}

const ProductList = ({ roles }: Props) => {
  const [productList, setProductList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [isUploadCSVModalOpen, setIsUploadCSVModalOpen] = useState(false);
  const [keyWord, setKeyWord] = useState("");

  const [productState, handleProductListFetch] = useHandleFetch(
    {},
    "productList"
  );

  const productListState = usePaginate('productList', {
    urlOptions: {
      params: {
        limitNumber: 11,
        sortItem: 'name',
        sortOrderValue: '1',
        pageNumber: 1
      }
    },
  }, `product`);

  // const [searchResultState, handleSearchResult] = useHandleFetch([], "searchProduct");

  async function getSearchResult() {
    if (keyWord) {
      const searchResponse = await requestApi.get("/api/search?limit=1000&query=" + keyWord);
      if (searchResponse && searchResponse.data) {
        setSearchList(searchResponse.data)
      }

    }
  }

  useEffect(() => {
    getSearchResult();
  }, [keyWord])


  useEffect(() => { console.log({ searchList }) }, [searchList])

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  // console.log('productState', productState)

  const handleSearch = async (value) => {



    if (value === '') {
      setSearchList([]);
      setKeyWord("")
    }
    else {
      setKeyWord(value);
    }

  };

  return (
    <>
      <div className="categoryListContainer">
        <div className="categoryListContainer__header">
          <div className="categoryListContainer__header-searchBar">
            <h2 className="categoryListContainer__header-title">Products</h2>

            <Search
              enterButton={false}
              className="searchbarClassName"
              placeholder="search products.."
              onChange={(e) => handleSearch(e.target.value)}
            // style={{ width: 300 }}
            />
          </div>

          <div>
            {isAccess("postCatalogue", roles) && (
              <Button
                style={{
                  marginRight: '15px'
                }}
                className="btnPrimaryClassNameoutline"
                icon={<DownloadOutlined />}
                onClick={() => {
                  window.open(`${config.baseURL}/admin/api/product/csv`);
                }}
              >
                Export CSV
              </Button>
            )}

            {isAccess("postCatalogue", roles) && (
              <Button
                style={{
                  marginRight: '15px'
                }}
                className="btnPrimaryClassNameoutline"
                icon={<UploadOutlined />}
                onClick={() => setIsUploadCSVModalOpen(true)}
              >
                Upload CSV
              </Button>
            )}


            {isAccess("postCatalogue", roles) && (
              <Button
                // type="primary"
                className="btnPrimaryClassNameoutline"
                icon={<PlusOutlined />}
                onClick={() => setAddNewCategoryVisible(true)}
              >
                Add New
              </Button>
            )}
          </div>
        </div>

        <div className="categoryListContainer__afterHeader" />

        <div className="categoryListContainer__categoryList">
          {productListState.resolvedData?.data?.length > 0 && (
            <MyTable
              productListState={productListState}
              roles={roles}
              setProductList={setProductList}
              data={[]}
              searchList={searchList}
            />
          )}
          {productListState.status === 'loading' && <DataTableSkeleton />}

          {productListState.isError || (productListState.isSuccess && !(productListState.resolvedData?.data?.length > 0)) && (
            <div
              style={{
                marginTop: "50px",
              }}
            >
              <Empty title="No Product found" />
            </div>
          )}

        </div>
      </div>

      {productListState.isSuccess && (
        <AddNewProduct
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          productList={productState.data}
          setProductList={setProductList}
          productListState={productListState}
        />
      )}

      <UploadCSV
        isUploadCSVModalOpen={isUploadCSVModalOpen}
        setIsUploadCSVModalOpen={setIsUploadCSVModalOpen}
      />


    </>
  );
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, null)(ProductList);
