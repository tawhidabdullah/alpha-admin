import React, { Children } from 'react'

// import 3rd-party lib
import {
    Table
} from "antd";


interface Props {
    children: any,
    data: any;
    handlePageChange?: any
    limit?: number;
    loading?: any;
    total?: any;
    current?: any;
}

const TableListWithPagination = ({ children, data, handlePageChange, limit, loading, total }: Props) => {

    return (
        <Table
            loading={loading}
            style={{
                paddingTop: "10px",
                borderRadius: "5px !important",
                overflow: "hidden",
                boxShadow:
                    "0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)",
            }}
            size="small"
            pagination={
                {
                    onChange: handlePageChange,
                    pageSize: limit,
                    total, defaultCurrent: 1, hideOnSinglePage: true
                }
            }
            dataSource={data}
            tableLayout={"auto"}
            onHeaderRow={(_) => {
                return {
                    style: {
                        color: "red !important",
                    },
                };
            }}
        >
            {children}
        </Table>

    )
}

export default TableListWithPagination
