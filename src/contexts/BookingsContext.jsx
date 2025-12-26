import { createContext, useContext, useReducer, useMemo } from 'react';

function StationOwnerBookingsReducer(state, action) {
    switch (action.type) {
        case 'ACCEPT_BOOKING':
            return {
                ...state,
                pending: state.pending.filter(booking => booking.id !== action.payload.id),
                accepted: [...state.accepted, { ...action.payload, state: 'ACCEPTED' }]
            };
        case 'REJECT_BOOKING':
            return {
                ...state,
                pending: state.pending.filter(booking => booking.id !== action.payload.id),
                rejected: [...state.rejected, { ...action.payload, state: 'REJECTED' }]
            };
        default:
            return state;
    }
}

function VehicleOwnerBookingsReducer(state, action) {
    switch (action.type) {
        case 'CANCEL_BOOKING':
            return {
                ...state,
                upcoming: state.upcoming.filter(booking => booking.id !== action.payload.id),
                cancelled: [...state.cancelled, { ...action.payload, state: 'CANCELLED' }]
            };
        default:
            return state;
    }
}

const BookingsContext = createContext(null);
const BookingsDispatchContext = createContext(null);

export function BookingsProvider({ initialBookings, asVehicleOwner, asStationOwner, children }) {
    // S'assurer que initialBookings est un tableau
    const safeInitialItems = Array.isArray(initialBookings) ? initialBookings : [];
    
    console.log('BookingsProvider - initialBookings:', initialBookings);
    console.log('BookingsProvider - safeInitialItems:', safeInitialItems);

    if (asVehicleOwner && asStationOwner) {
        throw new Error('BookingsProvider cannot be both asVehicleOwner and asStationOwner.');
    }

    let reducer;
    if (asVehicleOwner) {
        reducer = VehicleOwnerBookingsReducer;
    } else if (asStationOwner) {
        reducer = StationOwnerBookingsReducer;
    } else {
        throw new Error('BookingsProvider must be either asVehicleOwner or asStationOwner.');
    }

    const [state, dispatch] = useReducer(
        reducer,
        null,
        () => {
            // Initialiser toutes les catégories avec des tableaux vides
            const initialState = asVehicleOwner 
                ? { upcoming: [], past: [], cancelled: [] }
                : { pending: [], accepted: [], rejected: [], past: [] };
            
            safeInitialItems.forEach((booking) => {
                console.log('Processing booking:', booking);
                let category;
                if (asVehicleOwner) {
                    const upcomingStates = ['PENDING_ACCEPT', 'ACCEPTED', 'ONGOING'];
                    if (upcomingStates.includes(booking.state)) {
                        category = 'upcoming';
                    } else if (booking.state === 'COMPLETED') {
                        category = 'past';
                    } else if (booking.state === 'CANCELLED' || booking.state === 'REJECTED') {
                        category = 'cancelled';
                    }
                } else if (asStationOwner) {
                    if (booking.state === 'PENDING_ACCEPT') {
                        category = 'pending';
                    } else if (booking.state === 'ACCEPTED' || booking.state === 'ONGOING') {
                        category = 'accepted';
                    } else if (booking.state === 'REJECTED') {
                        category = 'rejected';
                    } else if (booking.state === 'COMPLETED') {
                        category = 'past';
                    }
                }
                
                console.log('Category for booking:', category);

                if (category) {
                    initialState[category].push(booking);
                }
            });
            
            console.log('Initial state computed:', initialState);
            return initialState;
        }
    );
    
    console.log('BookingsProvider - final state:', state);
    
    const dispatchMethods = useMemo(() => {
        if (asVehicleOwner) {
            return {
                cancelBooking: (booking) => dispatch({ type: 'CANCEL_BOOKING', payload: booking })
            };
        } else if (asStationOwner) {
            return {
                acceptBooking: (booking) => dispatch({ type: 'ACCEPT_BOOKING', payload: booking }),
                rejectBooking: (booking) => dispatch({ type: 'REJECT_BOOKING', payload: booking })
            };
        }
        return {};
    }, [asVehicleOwner, asStationOwner, dispatch]);

    return (
        <BookingsContext.Provider value={state}>
            <BookingsDispatchContext.Provider value={dispatchMethods}>
                {children}
            </BookingsDispatchContext.Provider>
        </BookingsContext.Provider>
    );
}

export function useBookingsContext() {
    return useContext(BookingsContext);
}

export function useBookingsDispatchMethodsContext() {
    return useContext(BookingsDispatchContext);
}