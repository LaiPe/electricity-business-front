import { useState } from "react";
import ActionBookingTable from "./ActionBookingTable";
import { BookingsProvider, useBookingsContext } from "../../../contexts/BookingsContext";



export default function DualBookingView( { bookings, onError, asVehicleOwner, asStationOwner } ) {
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
            {asVehicleOwner && <AsVehicleOwnerBookingList onError={onError} />}
            {asStationOwner && <AsStationOwnerBookingList onError={onError} />}
        </BookingsProvider>
    );
    
}


function AsVehicleOwnerBookingList({ onError }) {
    const [activeTab, setActiveTab] = useState('upcoming');
    const bookings = useBookingsContext();

    console.log("AsVehicleOwnerBookingList bookings:", bookings);

    return (
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`} 
                            aria-current={activeTab === "upcoming" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("upcoming")}
                        >
                            À venir
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "past" ? "active" : ""}`} 
                            aria-current={activeTab === "past" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("past")}
                        >
                            Passées
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "cancelled" ? "active" : ""}`} 
                            aria-current={activeTab === "cancelled" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("cancelled")}
                        >
                            Annulées
                        </a>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                {activeTab === 'upcoming' && (
                    <div>
                        <h3>Upcoming Bookings</h3>
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <h3>Past Bookings</h3>
                    </div>
                )}
                {activeTab === 'cancelled' && (
                    <div>
                        <h3>Cancelled Bookings</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

function AsStationOwnerBookingList({ onError }) {
    const [activeTab, setActiveTab] = useState('pending');
    const bookings = useBookingsContext();

    console.log("AsStationOwnerBookingList bookings:", bookings);

    return (
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "pending" ? "active" : ""}`} 
                            aria-current={activeTab === "pending" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("pending")}
                        >
                            En attente
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "accepted" ? "active" : ""}`} 
                            aria-current={activeTab === "accepted" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("accepted")}
                        >
                            Acceptées
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "rejected" ? "active" : ""}`} 
                            aria-current={activeTab === "rejected" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("rejected")}
                        >
                            Refusées
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${activeTab === "past" ? "active" : ""}`} 
                            aria-current={activeTab === "past" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("past")}
                        >
                            Passées
                        </a>
                    </li>
                </ul>
            </div>
            <div className="card-body">
                {activeTab === 'pending' && (
                    <div>
                        <ActionBookingTable bookings={bookings?.pending} onError={onError} />
                    </div>
                )}
                {activeTab === 'accepted' && (
                    <div>
                        <h3>Acceptées</h3>
                    </div>
                )}
                {activeTab === 'rejected' && (
                    <div>
                        <h3>Refusées</h3>
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <h3>Passées</h3>
                    </div>
                )}
                
            </div>
        </div>
    );
}
        