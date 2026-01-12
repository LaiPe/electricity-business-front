import { useState, useEffect } from "react";
import GenericBookingTable from "./GenericBookingTable";
import { BookingsProvider, useBookingsContext } from "../../../contexts/BookingsContext";
import DateRangeFilter from "./DateRangeFilter";



export default function DualBookingView( { bookings, asVehicleOwner, asStationOwner, initialDateFilter = '', initialTab = '' } ) {
    if (!asVehicleOwner && !asStationOwner) {
        throw new Error('DualBookingView requires either asVehicleOwner or asStationOwner to be true.');
    }
    if (asVehicleOwner && asStationOwner) {
        throw new Error('DualBookingView cannot be both asVehicleOwner and asStationOwner.');
    }

    console.log("DualBookingView bookings:", bookings);

    // Utiliser une key basée sur la longueur des bookings pour forcer le re-mount du provider
    // quand les données changent (chargement initial -> données chargées)
    const providerKey = `bookings-${asVehicleOwner ? 'vehicleOwner' : 'stationOwner'}-${bookings?.length ?? 0}`;

    return (
        <BookingsProvider key={providerKey} initialBookings={bookings} asVehicleOwner={asVehicleOwner} asStationOwner={asStationOwner}>
            <UnifiedBookingList 
                asVehicleOwner={asVehicleOwner} 
                asStationOwner={asStationOwner}
                initialDateFilter={initialDateFilter}
                initialTab={initialTab}
            />
        </BookingsProvider>
    );
    
}


function UnifiedBookingList({ asVehicleOwner, asStationOwner, initialDateFilter = '', initialTab = '' }) {
    const bookings = useBookingsContext();
    
    // Tabs configuration based on the view type
    const tabs = asVehicleOwner 
        ? [
            { key: 'upcoming', label: 'À venir' },
            { key: 'past', label: 'Passées' },
            { key: 'cancelled', label: 'Annulées' }
          ]
        : [
            { key: 'pending', label: 'En attente' },
            { key: 'accepted', label: 'Acceptées' },
            { key: 'rejected', label: 'Refusées' },
            { key: 'cancelled', label: 'Annulées' },
            { key: 'past', label: 'Passées' }
          ];
    
    // Déterminer l'onglet initial (vérifier qu'il existe dans les tabs)
    const getValidInitialTab = () => {
        if (initialTab && tabs.some(t => t.key === initialTab)) {
            return initialTab;
        }
        return tabs[0].key;
    };
    
    const [activeTab, setActiveTab] = useState(getValidInitialTab());
    const [dateFilter, setDateFilter] = useState({ 
        startDate: initialDateFilter, 
        endDate: initialDateFilter 
    });
    
    // Réinitialiser le filtre et l'onglet quand le type de vue change ou quand les props changent
    useEffect(() => {
        if (initialDateFilter) {
            setDateFilter({ startDate: initialDateFilter, endDate: initialDateFilter });
        } else {
            setDateFilter({ startDate: '', endDate: '' });
        }
        
        // Mettre à jour l'onglet actif si initialTab change
        if (initialTab && tabs.some(t => t.key === initialTab)) {
            setActiveTab(initialTab);
        } else {
            setActiveTab(tabs[0].key);
        }
    }, [asVehicleOwner, asStationOwner, initialDateFilter, initialTab]);
    
    // Check if filter is active
    const isFilterActive = dateFilter.startDate || dateFilter.endDate;

    console.log("UnifiedBookingList bookings:", bookings);

    const filterBookingsByDate = (bookingsList) => {
        if (!bookingsList) return [];
        if (!dateFilter.startDate && !dateFilter.endDate) return bookingsList;

        return bookingsList.filter(booking => {
            // Utiliser start_date et expected_end_date (ou actual_end_date si disponible)
            const startDateValue = booking.start_date;
            const endDateValue = booking.actual_end_date || booking.expected_end_date;
            
            if (!startDateValue) {
                console.warn("No start_date found in booking:", booking);
                return false;
            }
            
            const bookingStartDate = new Date(startDateValue);
            const bookingEndDate = endDateValue ? new Date(endDateValue) : bookingStartDate;
            
            // Vérifier si les dates sont valides
            if (isNaN(bookingStartDate.getTime())) {
                console.warn("Invalid start_date format:", startDateValue, "in booking:", booking);
                return false;
            }
            
            let filterStart = null;
            let filterEnd = null;
            
            if (dateFilter.startDate) {
                filterStart = new Date(dateFilter.startDate);
                filterStart.setHours(0, 0, 0, 0); // Début de la journée
            }
            
            if (dateFilter.endDate) {
                filterEnd = new Date(dateFilter.endDate);
                filterEnd.setHours(23, 59, 59, 999); // Fin de la journée
            }

            // Une réservation est incluse si elle chevauche la fenêtre temporelle du filtre
            // Chevauchement: la réservation commence avant la fin du filtre ET se termine après le début du filtre
            if (filterStart && filterEnd) {
                return bookingStartDate <= filterEnd && bookingEndDate >= filterStart;
            } else if (filterStart) {
                // Seulement date de début: la réservation doit se terminer après cette date
                return bookingEndDate >= filterStart;
            } else if (filterEnd) {
                // Seulement date de fin: la réservation doit commencer avant cette date
                return bookingStartDate <= filterEnd;
            }
            return true;
        });
    };

    const renderTable = () => {
        const filteredBookings = filterBookingsByDate(bookings?.[activeTab]);

        if (asVehicleOwner) {
            const commonProps = {
                showStatus: true,
                showLocateStation: true,
                isVehicleOwnerView: true
            };

            if (activeTab === 'upcoming') {
                return <GenericBookingTable bookings={filteredBookings} {...commonProps} showCancel showPdfDownload />;
            }
            if (activeTab === 'past') {
                return <GenericBookingTable bookings={filteredBookings} isVehicleOwnerView showReview showPdfDownload />;
            }
            return <GenericBookingTable bookings={filteredBookings} {...commonProps} />;
        }

        // Station owner view
        if (activeTab === 'pending') {
            return <GenericBookingTable bookings={filteredBookings} showAcceptReject />;
        }
        if (activeTab === 'accepted') {
            return <GenericBookingTable bookings={filteredBookings} showPdfDownload showCancel />;
        }
        if (activeTab === 'past') {
            return <GenericBookingTable bookings={filteredBookings} showReview showPdfDownload />;
        }
        return <GenericBookingTable bookings={filteredBookings} />;
    };

    return (
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    {tabs.map(tab => (
                        <li key={tab.key} className="nav-item">
                            <a 
                                className={`nav-link ${activeTab === tab.key ? "active" : ""}`} 
                                aria-current={activeTab === tab.key ? "true" : "false"}
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveTab(tab.key);
                                }}
                            >
                                {tab.label}
                            </a>
                        </li>
                    ))}
                    <li className="nav-item ms-auto">
                        <div className="dropdown position-relative mt-1">
                            <button 
                                className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                                type="button" 
                                id="filterDropdown" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i className="bi bi-funnel"></i> Filtrer
                            </button>
                            {isFilterActive && (
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            )}
                            <div className="dropdown-menu dropdown-menu-end p-3" aria-labelledby="filterDropdown" style={{ minWidth: '400px' }}>
                                <DateRangeFilter 
                                    startDate={dateFilter.startDate} 
                                    endDate={dateFilter.endDate} 
                                    onFilterChange={setDateFilter} 
                                />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                {renderTable()}
            </div>
        </div>
    );
}
        