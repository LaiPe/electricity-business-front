import { NavLink } from 'react-router-dom';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout d-flex">
        <aside className="sidebar position-sticky hero-fullscreen-strict-height-minus-footer" style={{top: "var(--header-height)", overflowY: "auto", minWidth: "250px"}}>
            <nav className="p-3">
                <ul className='nav flex-column'>
                    <li className="nav-item"><NavLink to="/dashboard" className="nav-link">Vue d'ensemble</NavLink></li>
                    <li className="nav-item"><NavLink to="/dashboard/bookings" className="nav-link">Réservations</NavLink></li>
                    <li className="nav-item"><NavLink to="/dashboard/vehicles" className="nav-link">Véhicules</NavLink></li>
                    <li className="nav-item"><NavLink to="/dashboard/stations" className="nav-link">Bornes</NavLink></li>
                </ul>
            </nav>
        </aside>
        <main className="main-content flex-grow-1 px-4 py-3">
            {children}
        </main>
    </div>
  );
}

export default DashboardLayout;