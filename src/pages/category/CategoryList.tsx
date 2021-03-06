import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Table,
  notification,
  Space,
  Tag,
  Button,
  Input,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { AddNewCategory, QuickEdit } from "../category";
import CategoryNewQuickEdit from "./CategoryNewQuickEdit";

/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import Empty from "../../components/Empty";

// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";
import { setNestedObjectValues } from "formik";

const { Column } = Table;
const { Search } = Input;

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || "Category Created",
    description: "",
    icon: <CheckCircleOutlined style={{ color: "rgba(0, 128, 0, 0.493)" }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || "Something Went Wrong",
    description: "",
    icon: <CheckCircleOutlined style={{ color: "rgb(241, 67, 67)" }} />,
  });
};

interface myTableProps {
  data: any;
  setcategoryList?: any;
  history?: any;
  roles?: any;
  data2?: any;
}

const MyTable = ({
  data,
  setcategoryList,
  history,
  roles,
  data2,
}: myTableProps) => {
  console.log("categoryList22222", data2);
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteCategoryState, handleDeleteCategoryFetch] = useHandleFetch(
    {},
    "deleteCategory"
  );
  // console.log('activeCategoryForEdit',activeCategoryForEdit);

  const handleDeleteCategory = async (id) => {
    const deleteCategoryRes = await handleDeleteCategoryFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteCategoryRes && deleteCategoryRes.status === "ok") {
      openSuccessNotification("Deleted Category");
      const newCategoryList = data.filter((item) => item.id !== id);
      setcategoryList(newCategoryList);
    }
  };

  const getCover = (record: any) => {
    if (record.cover) {
      return record.cover;
    } else if (!record.cover && record.icon) {
      return record.icon;
    } else return "";
  };

  console.log("catshit", data2);
  return (
    <>
      <Table
        style={{
          paddingTop: "10px",
          borderRadius: "5px !important",
          overflow: "hidden",
          boxShadow:
            "0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)",
        }}
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        // bordered={true}
        size="small"
        // pagination={false}
        dataSource={data}
        tableLayout={"auto"}
        onHeaderRow={(column) => {
          return {
            style: {
              color: "red !important",
            },
          };
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
                  history.push(`/admin/category/${record.id}`);
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
                  history.push(`/admin/category/${record.id}`);
                  // setcategoryDetailVisible(true);
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
          title="Sub Cateogory"
          dataIndex="subCount"
          key="id"
          className="classnameofthecolumn"
        />

        <Column
          title="Product"
          dataIndex="productCount"
          key="id"
          className="classnameofthecolumn"
        />

        {/* <Column 
          
          className='classnameofthecolumn'

          title="Product" dataIndex="product" key="product" /> */}

        {/* <Column 
          
          className='classnameofthecolumn'

          title="Sub Category" dataIndex="subCategory" key="subCategory" /> */}

        {/* <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <>
              {tags.map((tag : any) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          )}
        /> */}

        {isAccess("postCatalogue", roles) && (
          <Column
            className="classnameofthecolumn"
            title=""
            key="action"
            align="right"
            render={(text, record: any) => (
              <Space size="middle">
                <a href="##">
                  <Tooltip placement="top" title="Edit Category">
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
                  onConfirm={() => handleDeleteCategory(record.id)}
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
      </Table>

      {activeCategoryForEdit && (
        <CategoryNewQuickEdit
          categoryDetailData={activeCategoryForEdit}
          setcategoryList={setcategoryList}
          categoryList={data}
          setAddNewCategoryVisible={setvisible}
          addNewCategoryVisible={visible}
          categoryList2={data2}
        />
      )}
    </>
  );
};

interface Props {
  history: any;
  roles?: any;
}

const CategoryList = ({ history, roles }: Props) => {
  const [categoryState, handleCategoryListFetch] = useHandleFetch(
    {},
    "categoryList"
  );
  const [categoryList, setcategoryList] = useState([]);
  const [categoryList2, setcategoryList2] = useState([]);

  useEffect(() => {
    const setCategories = async () => {
      const categories = await handleCategoryListFetch({
        urlOptions: {
          params: {
            isSubCategory: true,
            productCountValue: true,
            sortItem: "added",
            sortOrderValue: "-1",
            limitNumber: 5000000,
          },
        },
      });
      // @ts-ignore
      setcategoryList(categories);
      // @ts-ignore
      setcategoryList2(categories);
    };
    setCategories();
  }, []);

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

  // console.log('categoryState',categoryState);

  const handleSearch = (value) => {
    if (categoryState.data.length > 0) {
      const newCategoryList = categoryState.data.filter((item) => {
        if (item.name.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
        if (
          item.subCategory &&
          item.subCategory.length > 0 &&
          item.subCategory[0] &&
          item.subCategory[0]["name"]
            ?.toLowerCase()
            .includes(value?.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
      setcategoryList(newCategoryList);
    }
  };

  console.log("categoryList22", categoryList2);

  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className="categoryListContainer">
        <div className="categoryListContainer__header">
          <div className="categoryListContainer__header-searchBar">
            <h2 className="categoryListContainer__header-title">Categories</h2>

            <Search
              enterButton={false}
              className="searchbarClassName"
              placeholder="search categories.."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {isAccess("postCatalogue", roles) && (
            <Button
              // type="primary"
              className="btnPrimaryClassNameoutline"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddNewCategoryVisible(true);
              }}
            >
              Add New
            </Button>
          )}
        </div>

        <div className="categoryListContainer__afterHeader">
          {/* <Search
              placeholder="search categories.."
              size="large"
              onSearch={value => console.log(value)}
              style={{ width: 300 }}
            /> */}
        </div>

        <div className="categoryListContainer__categoryList">
          {categoryState.done && categoryList.length > 0 && (
            <MyTable
              roles={roles}
              history={history}
              setcategoryList={setcategoryList}
              data={categoryList}
              data2={categoryList2}
            />
          )}
          {categoryState.isLoading && <DataTableSkeleton />}

          {categoryState.done && !(categoryList.length > 0) && (
            <div
              style={{
                marginTop: "50px",
              }}
            >
              <Empty title="No Category found" />
            </div>
          )}
        </div>
      </div>

      {categoryState.done && (
        <AddNewCategory
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          categoryList={categoryList}
          setcategoryList={setcategoryList}
          categoryList2={categoryList2}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
});

// @ts-ignore
export default connect(mapStateToProps, null)(withRouter(CategoryList));
