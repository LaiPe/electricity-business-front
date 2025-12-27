import { useState } from "react";
import GenericBookingTable from "./GenericBookingTable";
import { BookingsProvider, useBookingsContext } from "../../../contexts/BookingsContext";



export default function DualBookingView( { bookings, asVehicleOwner, asStationOwner } ) {
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
            {asVehicleOwner && <AsVehicleOwnerBookingList />}
            {asStationOwner && <AsStationOwnerBookingList />}
        </BookingsProvider>
    );
    
}


function AsVehicleOwnerBookingList() {
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
                        <GenericBookingTable 
                            bookings={bookings?.upcoming} 
                            showStatus 
                            showCancel 
                            showPdfDownload 
                            showLocateStation 
                            isVehicleOwnerView 
                        />
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.past} 
                            showStatus 
                            showLocateStation 
                            isVehicleOwnerView 
                        />
                    </div>
                )}
                {activeTab === 'cancelled' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.cancelled} 
                            showStatus 
                            showLocateStation 
                            isVehicleOwnerView 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function AsStationOwnerBookingList() {
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
                        <GenericBookingTable 
                            bookings={bookings?.pending} 
                            showAcceptReject 
                        />
                    </div>
                )}
                {activeTab === 'accepted' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.accepted} 
                            showPdfDownload
                        />
                    </div>
                )}
                {activeTab === 'rejected' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.rejected} 
                        />
                    </div>
                )}
                {activeTab === 'cancelled' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.cancelled} 
                        />
                    </div>
                )}
                {activeTab === 'past' && (
                    <div>
                        <GenericBookingTable 
                            bookings={bookings?.past} 
                            showPdfDownload 
                        />
                    </div>
                )}
                
            </div>
        </div>
    );
}
        