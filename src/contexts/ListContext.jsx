import { createContext, useContext } from 'react';
import useList from '../hooks/useList';


const ListContext = createContext(null);
const ListDispatchContext = createContext(null);

export function ListProvider({ initialItems, children }) {
    const {list, dispatchMethods} = useList(initialItems);

    return (
        <ListContext.Provider value={list}>
            <ListDispatchContext.Provider value={dispatchMethods}>
                {children}
            </ListDispatchContext.Provider>
        </ListContext.Provider>
    );
}

export function useListContext() {
    return useContext(ListContext);
}

export function useListDispatchMethodsContext() {
    return useContext(ListDispatchContext);
}