import { useInfiniteQuery } from 'react-query';
import Connector from '../lib/connector.js';

const connector = new Connector();

type TInitialData = any;
type TItem = string;

interface IState {
    isLoading: boolean;
    isFetching: any;
    isFetchingMore: any;
    canFetchMore: any;
    status: any;
    error: any;
    data: TInitialData;
    isError: boolean;
    fetchMore: any;
}

const useQueryPaginate = (
    item: TItem,
    options?: any,
    key?: string,
): IState => {

    const {
        isLoading, isError,
        status, data, error,
        isFetching, isFetchingMore,
        fetchMore, canFetchMore,
    } = useInfiniteQuery(
        [key || item],
        async (key, next = 1) => {
            options = {
                ...options,
                urlOptions: {
                    ...options?.urlOptions,
                    params: {
                        ...options?.urlOptions?.params,
                        pageNumber: next
                    }
                }
            };
            return connector.request(item, 'json', options);
        },
        {
            getFetchMore: lastGroup => lastGroup.next,
            retry: 0,
            refetchOnWindowFocus: false,
        },
    );



    const handleFetchMore = () => {
        if (canFetchMore) fetchMore();
    };


    return {
        isLoading, isError, status, data, error, isFetching, isFetchingMore, canFetchMore, fetchMore: handleFetchMore
    };
};

export default useQueryPaginate;