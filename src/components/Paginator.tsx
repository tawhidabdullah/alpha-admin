import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// import loader 


const UseLessComponent = () => <></>;

const Paginator = ({ children, dataLen, fetchData, hasMore }) => {
    return (
        <InfiniteScroll
            dataLength={dataLen}
            next={fetchData}
            hasMore={hasMore}
            loader={UseLessComponent}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>You have reached to the bottom</b>
        //   </p>
        // }
        >
            {children}
        </InfiniteScroll>
    );
};


// @ts-ignore
export default Paginator;
