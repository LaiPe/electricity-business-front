import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Composant pour afficher la moyenne des avis d'une borne avec étoiles
 * Cliquable pour ouvrir une modale avec la liste des avis
 * 
 * @param {Object} props
 * @param {Object} props.station - La borne avec average_rating et ratings
 */
function ReviewViewer({ station }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const averageRating = station?.average_rating || 0;
    const ratings = station?.ratings || [];

    const handleOpenModal = (e) => {
        e.stopPropagation();
        if (ratings.length > 0) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Rendu des étoiles pour la moyenne
    const renderStars = (rating, size = '1rem') => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            let iconClass;
            let color;

            if (i <= fullStars) {
                iconClass = 'bi-star-fill';
                color = '#ffc107';
            } else if (i === fullStars + 1 && hasHalfStar) {
                iconClass = 'bi-star-half';
                color = '#ffc107';
            } else {
                iconClass = 'bi-star';
                color = '#dee2e6';
            }

            stars.push(
                <i
                    key={i}
                    className={`bi ${iconClass}`}
                    style={{ color, fontSize: size }}
                ></i>
            );
        }
        return stars;
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Si pas de ratings, afficher un texte simple
    if (ratings.length === 0) {
        return (
            <div className="d-inline-flex align-items-center text-muted">
                <span style={{ fontSize: '0.875rem' }}>
                    {renderStars(0, '0.875rem')}
                </span>
                <small className="ms-1">(Aucun avis)</small>
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center"
                onClick={handleOpenModal}
                title="Voir les avis"
                style={{ border: 'none', background: 'none' }}
            >
                <span className="me-1">
                    {renderStars(averageRating, '0.875rem')}
                </span>
                <small className="text-muted">
                    ({ratings.length} avis)
                </small>
            </button>

            {isModalOpen && createPortal(
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    onClick={handleCloseModal}
                >
                    <div 
                        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-star-fill text-warning me-2"></i>
                                    Avis sur {station?.name}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCloseModal}
                                    aria-label="Fermer"
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Résumé de la note moyenne */}
                                <div className="text-center mb-4 pb-3 border-bottom">
                                    <div className="mb-2">
                                        {renderStars(averageRating, '1.5rem')}
                                    </div>
                                    <h4 className="mb-1">
                                        {averageRating.toFixed(1)} / 5
                                    </h4>
                                    <small className="text-muted">
                                        Basé sur {ratings.length} avis
                                    </small>
                                </div>

                                {/* Liste des avis */}
                                <div className="d-flex flex-column gap-3">
                                    {ratings.map((review, index) => (
                                        <div 
                                            key={review.booking_id || index} 
                                            className="card"
                                        >
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <div 
                                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                                            style={{ width: '40px', height: '40px', fontSize: '1rem' }}
                                                        >
                                                            {review.user?.first_name?.charAt(0) || 'U'}
                                                            {review.user?.last_name?.charAt(0) || ''}
                                                        </div>
                                                        <div>
                                                            <strong>
                                                                {review.user?.first_name} {review.user?.last_name}
                                                            </strong>
                                                            {review.user?.signin_date && (
                                                                <small className="text-muted d-block">
                                                                    Membre depuis {formatDate(review.user.signin_date)}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        {renderStars(review.rating, '1rem')}
                                                        <div className="fw-bold">{review.rating}/5</div>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="mb-0 fst-italic text-secondary">
                                                        "{review.comment}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={handleCloseModal}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default ReviewViewer;
