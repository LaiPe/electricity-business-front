import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="dashboard-layout d-flex">
            <aside className={`sidebar position-sticky hero-fullscreen-strict-height-minus-footer ${isCollapsed ? 'collapsed' : ''}`} style={{
                top: "var(--header-height)", 
                overflowY: "auto", 
                minWidth: isCollapsed ? "60px" : "200px", 
                maxWidth: isCollapsed ? "60px" : "250px", 
                borderRight: "1px solid #ddd",
                transition: "all 0.3s ease"
            }}>
                <div className="px-2 py-3">
                    <button 
                        className="btn btn-outline-secondary btn-sm mb-3 w-100" 
                        onClick={toggleSidebar}
                        title={isCollapsed ? "Étendre le menu" : "Réduire le menu"}
                    >
                        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                        {!isCollapsed && <span className="ms-2">Réduire</span>}
                    </button>
                    
                    <nav>
                        <ul className={`nav flex-column ${isCollapsed ? 'align-items-center' : 'ms-2'}  gap-3`}>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard" className={`nav-link d-flex p-0 align-items-center`} title="Vue d'ensemble">
                                    <i className={`bi bi-speedometer2 ${isCollapsed ? '' : 'me-2'}`}></i>
                                    {!isCollapsed && <span>Vue d'ensemble</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/bookings" className={`nav-link  d-flex p-0 align-items-center`} title="Mes réservations">
                                    <i className={`bi bi-calendar-check ${isCollapsed ? '' : 'me-2'}`}></i>
                                    {!isCollapsed && <span>Mes réservations</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/vehicles" className={`nav-link d-flex p-0 align-items-center`} title="Mes véhicules">
                                    <i className={`bi bi-car-front ${isCollapsed ? '' : 'me-2'}`}></i>
                                    {!isCollapsed && <span>Mes véhicules</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/stations" className={`nav-link d-flex p-0 align-items-center`} title="Mes bornes">
                                    <i className={`bi bi-lightning-charge ${isCollapsed ? '' : 'me-2'}`}></i>
                                    {!isCollapsed && <span>Mes bornes</span>}
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <main className="main-content flex-grow-1 px-4 py-3">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;