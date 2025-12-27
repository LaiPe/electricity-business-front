import { useState } from "react";
import StationOwnerBookingTable from "./StationOwnerBookingTable";
import VehicleOwnerBookingTable from "./VehicleOwnerBookingTable";
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
                        <VehicleOwnerBookingTable bookings={bookings?.upcoming} />
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <VehicleOwnerBookingTable bookings={bookings?.past} />
                    </div>
                )}
                {activeTab === 'cancelled' && (
                    <div>
                        <VehicleOwnerBookingTable bookings={bookings?.cancelled} />
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
                            className={`nav-link ${activeTab === "cancelled" ? "active" : ""}`} 
                            aria-current={activeTab === "cancelled" ? "true" : "false"}
                            href="#" 
                            onClick={() => setActiveTab("cancelled")}
                        >
                            Annulées
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
                        <StationOwnerBookingTable bookings={bookings?.pending} onError={onError} showAcceptReject />
                    </div>
                )}
                {activeTab === 'accepted' && (
                    <div>
                        <StationOwnerBookingTable bookings={bookings?.accepted} onError={onError} showCancel showPdfDownload />
                    </div>
                )}
                {activeTab === 'rejected' && (
                    <div>
                        <StationOwnerBookingTable bookings={bookings?.rejected} />
                    </div>
                )}
                {activeTab === 'cancelled' && (
                    <div>
                        <StationOwnerBookingTable bookings={bookings?.cancelled} />
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <StationOwnerBookingTable bookings={bookings?.past} onError={onError} showPdfDownload />
                    </div>
                )}
                
            </div>
        </div>
    );
}
        