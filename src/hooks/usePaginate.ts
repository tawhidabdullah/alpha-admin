import { useState, useEffect, useCallback } from "react";
import { usePaginatedQuery, useQueryCache } from 'react-query';
import Connector from '../lib/connector.js';

const connector = new Connector();

type TInitialData = any;
type TItem = string;

interface IState {
    readonly isLoading: boolean;
    readonly isFetching: boolean;
    readonly status: any;
    readonly resolvedData: any;
    readonly latestData: any;
    readonly error: any;
    readonly data: TInitialData;
    readonly isError: boolean;
    readonly isSuccess: boolean;
    setPage: any;
    isFetchingMore: any;
}

const useQueryPaginate = (
    item: TItem,
    options?: any,
    key?: string,
): IState => {
    const cache = useQueryCache()
    const [page, setPage] = useState(1)

    const fetchProjects = useCallback(async (_, page = 1) => {
        options = {
            ...options,
            urlOptions: {
                ...options?.urlOptions,
                params: {
                    ...options?.urlOptions?.params,
                    pageNumber: page
                }
            }
        };
        return connector.request(item, 'json', options);
    }, [])


    const { isLoading, isError, data, error, isSuccess, isFetching, status, resolvedData, latestData, isFetchingMore } = usePaginatedQuery(
        [key || item, page],
        fetchProjects,
        {
            retry: 0,
            refetchOnWindowFocus: false,
        }
    );


    // Prefetch the next page!
    useEffect(() => {
        // @ts-ignore
        if (latestData?.next) {
            cache.prefetchQuery([key || item, page + 1], fetchProjects)
        }
    }, [latestData, fetchProjects, page]);


    return {
        isLoading,
        isError,
        data,
        error,
        isSuccess,
        isFetching,
        status,
        resolvedData,
        latestData,
        setPage,
        isFetchingMore
    };
};

export default useQueryPaginate;
