import { useState } from "react";
import ActionBookingTable from "./ActionBookingTable";

const isUpcomingBooking = (booking) => {
    const upcomingStates = ['PENDING_ACCEPT', 'ACCEPTED', 'ONGOING'];
    return upcomingStates.includes(booking.state);
}

export default function DualBookingView( { bookings, onError, asVehicleOwner, asStationOwner } ) {
    if (asVehicleOwner && asStationOwner) {
        onError('DualBookingView component cannot be both asVehicleOwner and asStationOwner.');
        return null;
    }

    if (asVehicleOwner) {
        const parsedBookings = {
            upcoming: bookings.filter(isUpcomingBooking),
            past: bookings.filter(booking => booking.state === 'COMPLETED'),
            cancelled: bookings.filter(booking => booking.state === 'CANCELLED' || booking.state === 'REJECTED'),
        };
        return <AsVehicleOwnerBookingList bookings={parsedBookings} onError={onError} />;
    }

    if (asStationOwner) {
        const parsedBookings = {
            pending: bookings.filter(booking => booking.state === 'PENDING_ACCEPT'),
            accepted: bookings.filter(booking => booking.state === 'ACCEPTED' || booking.state === 'ONGOING'),
            rejected: bookings.filter(booking => booking.state === 'REJECTED'),
            past: bookings.filter(booking => booking.state === 'COMPLETED'),
        };
        return <AsStationOwnerBookingList bookings={parsedBookings} onError={onError} />;
    }

    onError('DualBookingView component must be either asVehicleOwner or asStationOwner.');
    return null;
}


function AsVehicleOwnerBookingList({ bookings, onError }) {
    const [activeTab, setActiveTab] = useState('upcoming');

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

function AsStationOwnerBookingList({ bookings, onError }) {
    const [activeTab, setActiveTab] = useState('pending');

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
                        <ActionBookingTable bookings={bookings.pending} onError={onError} />
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
        