import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCalendar.css";

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function BookingCalendar({ vehicleOwnerBookings = [], stationOwnerBookings = [] }) {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    // Fusionner tous les bookings avec leur type
    const allBookings = useMemo(() => {
        const vehicleBookings = (vehicleOwnerBookings || []).map(b => ({ ...b, ownerType: 'vehicleOwner' }));
        const stationBookings = (stationOwnerBookings || []).map(b => ({ ...b, ownerType: 'stationOwner' }));
        return [...vehicleBookings, ...stationBookings];
    }, [vehicleOwnerBookings, stationOwnerBookings]);

    // Créer un map des jours avec des réservations
    const bookingsByDate = useMemo(() => {
        const map = new Map();
        
        allBookings.forEach(booking => {
            if (!booking.start_date) return;
            
            const startDate = new Date(booking.start_date);
            const endDate = booking.expected_end_date ? new Date(booking.expected_end_date) : startDate;
            
            // Ajouter le booking pour chaque jour qu'il couvre
            const currentDay = new Date(startDate);
            currentDay.setHours(0, 0, 0, 0);
            
            const lastDay = new Date(endDate);
            lastDay.setHours(0, 0, 0, 0);
            
            while (currentDay <= lastDay) {
                const dateKey = currentDay.toISOString().split('T')[0];
                if (!map.has(dateKey)) {
                    map.set(dateKey, []);
                }
                map.get(dateKey).push(booking);
                currentDay.setDate(currentDay.getDate() + 1);
            }
        });
        
        return map;
    }, [allBookings]);

    // Obtenir les jours du mois
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        // Ajuster pour commencer le lundi (0 = lundi, 6 = dimanche)
        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay < 0) startDay = 6;
        
        const days = [];
        
        // Jours du mois précédent
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }
        
        // Jours du mois actuel
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }
        
        // Jours du mois suivant pour compléter la grille
        const remainingDays = 42 - days.length; // 6 semaines max
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }
        
        return days;
    }, [currentDate]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (day) => {
        const dateKey = day.date.toISOString().split('T')[0];
        const dayBookings = bookingsByDate.get(dateKey);
        
        if (dayBookings && dayBookings.length > 0) {
            setSelectedDay({ date: day.date, bookings: dayBookings });
            setShowPopup(true);
        }
    };

    const handleDetailsClick = (booking) => {
        const dateStr = new Date(booking.start_date).toISOString().split('T')[0];
        const viewType = booking.ownerType;
        const tab = getTabFromState(booking.state, viewType);
        
        // Naviguer vers la page Bookings avec les paramètres de filtre et l'onglet
        navigate(`/dashboard/bookings?view=${viewType}&filterDate=${dateStr}&tab=${tab}`);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedDay(null);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStateLabel = (state) => {
        const states = {
            'PENDING_ACCEPT': 'En attente',
            'ACCEPTED': 'Acceptée',
            'REJECTED': 'Refusée',
            'CANCELLED': 'Annulée',
            'IN_PROGRESS': 'En cours',
            'COMPLETED': 'Terminée'
        };
        return states[state] || state;
    };

    const getStateBadgeClass = (state) => {
        const classes = {
            'PENDING_ACCEPT': 'bg-warning text-dark',
            'ACCEPTED': 'bg-success',
            'REJECTED': 'bg-danger',
            'CANCELLED': 'bg-secondary',
            'IN_PROGRESS': 'bg-info',
            'COMPLETED': 'bg-primary'
        };
        return classes[state] || 'bg-secondary';
    };

    // Mapper le state du booking vers l'onglet approprié
    const getTabFromState = (state, ownerType) => {
        if (ownerType === 'vehicleOwner') {
            // Onglets: upcoming, past, cancelled
            switch (state) {
                case 'PENDING_ACCEPT':
                case 'ACCEPTED':
                case 'IN_PROGRESS':
                    return 'upcoming';
                case 'COMPLETED':
                    return 'past';
                case 'CANCELLED':
                    return 'cancelled';
                default:
                    return 'upcoming';
            }
        } else {
            // Onglets: pending, accepted, rejected, cancelled, past
            switch (state) {
                case 'PENDING_ACCEPT':
                    return 'pending';
                case 'ACCEPTED':
                case 'IN_PROGRESS':
                    return 'accepted';
                case 'REJECTED':
                    return 'rejected';
                case 'CANCELLED':
                    return 'cancelled';
                case 'COMPLETED':
                    return 'past';
                default:
                    return 'pending';
            }
        }
    };

    return (
        <div className="booking-calendar h-100 d-flex flex-column">
            {/* Header du calendrier */}
            <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={goToPreviousMonth}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                <div className="d-flex align-items-center gap-2">
                    <h5 className="mb-0">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={goToToday}>
                        Aujourd'hui
                    </button>
                </div>
                <button className="btn btn-outline-secondary btn-sm" onClick={goToNextMonth}>
                    <i className="bi bi-chevron-right"></i>
                </button>
            </div>

            {/* Grille du calendrier */}
            <div className="calendar-grid flex-grow-1">
                {/* Jours de la semaine */}
                <div className="calendar-weekdays">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="calendar-weekday">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Jours du mois */}
                <div className="calendar-days">
                    {calendarDays.map((day, index) => {
                        const dateKey = day.date.toISOString().split('T')[0];
                        const hasBookings = bookingsByDate.has(dateKey);
                        
                        return (
                            <div
                                key={index}
                                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''} ${hasBookings ? 'has-bookings' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                <span className="day-number">{day.date.getDate()}</span>
                                {hasBookings && (
                                    <span className="booking-indicator"></span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup des réservations */}
            {showPopup && selectedDay && (
                <div className="calendar-popup-overlay" onClick={closePopup}>
                    <div className="calendar-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-header d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">
                                Réservations du {selectedDay.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h6>
                            <button className="btn-close" onClick={closePopup}></button>
                        </div>
                        <div className="popup-content">
                            {selectedDay.bookings.map((booking, index) => (
                                <div key={index} className="booking-card card mb-2">
                                    <div className="card-body p-2">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <small className="text-muted">
                                                {formatTime(booking.start_date)} - {formatTime(booking.expected_end_date)}
                                            </small>
                                            <span className={`badge ${getStateBadgeClass(booking.state)}`}>
                                                {getStateLabel(booking.state)}
                                            </span>
                                        </div>
                                        <p className="mb-1 small">
                                            {booking.ownerType === 'vehicleOwner' ? (
                                                <>
                                                    <i className="bi bi-ev-station me-1"></i>
                                                    {booking.station?.name || 'Station'}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-car-front me-1"></i>
                                                    {booking.vehicle?.brand} {booking.vehicle?.model}
                                                </>
                                            )}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className={`badge ${booking.ownerType === 'vehicleOwner' ? 'bg-info' : 'bg-warning text-dark'}`}>
                                                {booking.ownerType === 'vehicleOwner' ? 'Mon véhicule' : 'Ma borne'}
                                            </span>
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleDetailsClick(booking)}
                                            >
                                                Détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
