import { NavLink } from 'react-router-dom';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">Vue d'ensemble</NavLink></li>
                    <li><NavLink to="/dashboard/bookings">Réservations</NavLink></li>
                    <li><NavLink to="/dashboard/vehicles">Véhicules</NavLink></li>
                    <li><NavLink to="/dashboard/stations">Bornes</NavLink></li>
                </ul>
            </nav>
        </aside>
        <main className="main-content">
            {children}
        </main>
    </div>
  );
}

export default DashboardLayout;