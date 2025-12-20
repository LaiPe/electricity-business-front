import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeroMap from '../components/home/hero/HeroMap';

function Home() {
    const { isAuthenticated, username } = useAuth();

    return (
        <main className="home-page">
            {/* Hero Section */}
            <section className="hero text-white hero-fullscreen-height-minus-footer but-not-on-mobile container-fluid" style={{position: "relative"}}>
                <HeroMap />
            </section>
            
            {/* Features Section */}
            <section className="features py-5">
                <div className="container">
                    <div className="row text-center mb-5">
                        <div className="col-12">
                            <h2 className="h1 mb-3">Pourquoi choisir Electricity Business ?</h2>
                            <p className="lead text-muted">
                                Une solution complète pour l'écosystème de la recharge électrique
                            </p>
                        </div>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <i className="bi bi-search text-primary fs-1"></i>
                                    </div>
                                    <h4 className="card-title">Recherche Intelligente</h4>
                                    <p className="card-text text-muted">
                                        Trouvez les stations de recharge proches de vous avec 
                                        géolocalisation et filtres avancés.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <i className="bi bi-calendar-check text-success fs-1"></i>
                                    </div>
                                    <h4 className="card-title">Réservation Facile</h4>
                                    <p className="card-text text-muted">
                                        Réservez un créneau de recharge en quelques clics 
                                        et gérez vos réservations en temps réel.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <div className="feature-icon mb-3">
                                        <i className="bi bi-shield-check text-warning fs-1"></i>
                                    </div>
                                    <h4 className="card-title">Sécurisé & Fiable</h4>
                                    <p className="card-text text-muted">
                                        Authentification sécurisée, paiements protégés 
                                        et évaluations communautaires.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta bg-primary bg-opacity-10 py-5">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h3 className="h2 mb-3">Prêt à rejoindre la révolution électrique ?</h3>
                            <p className="lead text-muted mb-4">
                                Que vous soyez propriétaire de véhicule électrique ou gestionnaire de stations, 
                                notre plateforme s'adapte à vos besoins.
                            </p>
                            {!isAuthenticated ? (
                                <div className="d-flex justify-content-center gap-3">
                                    <Link to="/register" className="btn btn-primary btn-lg">
                                        Commencer
                                    </Link>
                                    <Link to="/login" className="btn btn-outline-secondary btn-lg">
                                        Se connecter
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <p className="mb-3">Bonjour {username} ! 👋</p>
                                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                                        Accéder au tableau de bord
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats py-5">
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className="display-4 text-primary fw-bold">1000+</h3>
                                <p className="text-muted">Stations partenaires</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className="display-4 text-success fw-bold">5000+</h3>
                                <p className="text-muted">Utilisateurs actifs</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className="display-4 text-warning fw-bold">15000+</h3>
                                <p className="text-muted">Recharges effectuées</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stat-item">
                                <h3 className="display-4 text-info fw-bold">24/7</h3>
                                <p className="text-muted">Support disponible</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;