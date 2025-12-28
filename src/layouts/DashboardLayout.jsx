import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Détecter si on est sur mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 991);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    let sidebarClass;
    let sidebarStyle = {};
    if (isMobile) {
        sidebarClass = 'position-sticky';
        sidebarStyle = {
            bottom: "0",
            zIndex: "1000", 
            width: "100%",
            backgroundColor: "#fff",
            borderTop: "1px solid #ddd",
        };
    } else {
        sidebarClass = `position-sticky hero-fullscreen-strict-height-minus-footer ${isCollapsed ? 'collapsed' : ''}`;
        sidebarStyle = {
            top: "var(--header-height)",
            minWidth: isCollapsed ? "60px" : "200px", 
            maxWidth: isCollapsed ? "60px" : "250px", 
            borderRight: "1px solid #ddd",
            transition: "all 0.3s ease"
        };
    }

    return (
        <div className={`dashboard-layout d-flex ${isMobile ? 'flex-column-reverse hero-fullscreen-height' : 'flex-row hero-fullscreen-height hero-fullscreen-height-minus-footer'} `}>
            <aside className={sidebarClass} style={sidebarStyle}>
                <div className={`px-2 py-3 ${isMobile ? 'py-2' : ''}`}>
                    {!isMobile && (
                        <button 
                            className="btn btn-outline-secondary btn-sm mb-3 w-100" 
                            onClick={toggleSidebar}
                            title={isCollapsed ? "Étendre le menu" : "Réduire le menu"}
                        >
                            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                            {!isCollapsed && <span className="ms-2">Réduire</span>}
                        </button>
                    )}
                    
                    <nav>
                        <ul className={`nav ${isMobile ? 'flex-row justify-content-around' : 'flex-column'} ${isCollapsed ? 'align-items-center' : 'ms-2'} ${isMobile ? 'gap-1' : 'gap-3 '}`}>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard" className={`nav-link d-flex ${isMobile ? 'flex-column' : 'flex-row'} p-0 align-items-center`} title="Vue d'ensemble">
                                    <i className={`bi bi-speedometer2 ${isCollapsed || isMobile ? '' : 'me-2'} ${isMobile ? 'fs-5' : ''}`}></i>
                                    {(!isCollapsed || isMobile) && <span style={isMobile ? {fontSize: '0.7rem'} : {}}>Vue d'ensemble</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/bookings" className={`nav-link d-flex ${isMobile ? 'flex-column' : 'flex-row'} p-0 align-items-center`} title="Mes réservations">
                                    <i className={`bi bi-calendar-check ${isCollapsed || isMobile ? '' : 'me-2'} ${isMobile ? 'fs-5' : ''}`}></i>
                                    {(!isCollapsed || isMobile) && <span style={isMobile ? {fontSize: '0.7rem'} : {}}>Mes réservations</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/vehicles" className={`nav-link d-flex ${isMobile ? 'flex-column' : 'flex-row'} p-0 align-items-center`} title="Mes véhicules">
                                    <i className={`bi bi-car-front ${isCollapsed || isMobile ? '' : 'me-2'} ${isMobile ? 'fs-5' : ''}`}></i>
                                    {(!isCollapsed || isMobile) && <span style={isMobile ? {fontSize: '0.7rem'} : {}}>Mes véhicules</span>}
                                </NavLink>
                            </li>
                            <li className="nav-item" style={{width:"fit-content"}}>
                                <NavLink to="/dashboard/stations" className={`nav-link d-flex ${isMobile ? 'flex-column' : 'flex-row'} p-0 align-items-center`} title="Mes bornes">
                                    <i className={`bi bi-lightning-charge ${isCollapsed || isMobile ? '' : 'me-2'} ${isMobile ? 'fs-5' : ''}`}></i>
                                    {(!isCollapsed || isMobile) && <span style={isMobile ? {fontSize: '0.7rem'} : {}}>Mes bornes</span>}
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