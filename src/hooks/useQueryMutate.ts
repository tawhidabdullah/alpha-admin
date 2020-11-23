// import lib
// @ts-nocheck
import { useQuery } from 'react-query';
import Connector from '../lib/connector.js';

const connector = new Connector();

const fetchFunction = async (item, options = {}) => {
    return connector.request(item, 'json', options);
};

type TInitialData = any;
type TItem = string;

interface IState {
    readonly isLoading: boolean;
    readonly error: object | null;
    readonly data: TInitialData;
    readonly isError: boolean;
    readonly isSuccess: boolean;
    readonly refetch: any;
}

const useQueryFetch = (item: TItem, options?: any, key?: string, anotherKey?: any): IState => {

    const [mutate] = useMutation(createSighting, {
        xonSuccess: (newSighting) => {
            // queryCache.refetchQueries("sightings");
            queryCache.setQueryData("sightings", (prev) => [...prev, newSighting]);
        },

        onMutate: (newData) => {
            queryCache.cancelQueries("sightings");

            const snapshot = queryCache.getQueryData("sightings");

            queryCache.setQueryData("sightings", (prev) => [
                ...prev,
                { ...newData, id: new Date().toISOString() },
            ]);

            return () => queryCache.setQueryData("sightings", snapshot);
        },
        onError: (error, newData, rollback) => rollback(),
        onSettled: () => queryCache.refetchQueries("sightings"),
    });


    return {
        isLoading,
        isError,
        data,
        error,
        isSuccess,
        refetch,
        status
    };
};

export default useQueryFetch;
