import { useReducer, useMemo } from 'react';

function listReducer(state, action) {
    switch (action.type) {
        case 'DELETE_ITEM':
            return {
                ...state,
                list: state.list.filter(item => item.id !== action.payload)
            };
        case 'ADD_ITEM':
            return {
                ...state,
                list: [...state.list, { ...action.payload, id: action.payload.id || state.nextId }],
                nextId: (action.payload.id || state.nextId) + 1
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                list: state.list.map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload } : item
                )
            };
        default:
            return state;
    }
}

function useList(initialItems = [], lastUsedId) {
    // S'assurer que initialItems est un tableau
    const safeInitialItems = Array.isArray(initialItems) ? initialItems : [];
    
    const [state, dispatch] = useReducer(
        listReducer,
        {
            nextId: lastUsedId + 1 || safeInitialItems.length + 1,
            list: [...safeInitialItems]
        }
    );

    const dispatchMethods = useMemo(() => ({
        deleteItem: (item) => dispatch({ type: 'DELETE_ITEM', payload: item.id }),
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        updateItem: (item) => dispatch({ type: 'UPDATE_ITEM', payload: item })
    }), []);

    return {
        list: state.list,
        dispatchMethods
    };
}

export default useList;