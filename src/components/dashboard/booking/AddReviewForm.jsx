import { useState } from 'react';
import { useApiCall } from '../../../hooks/useApiCall';
import { reviewBooking } from '../../../services/BookingService';
import { useBookingsDispatchMethodsContext } from '../../../contexts/BookingsContext';

/**
 * Composant pour ajouter un avis sur une réservation
 * Affiche un bouton qui ouvre une modale avec un système de notation par étoiles et un commentaire
 * 
 * @param {Object} props
 * @param {number} props.bookingId - L'ID de la réservation à évaluer
 */
function AddReviewForm({ bookingId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const { execute, loading } = useApiCall();
    const { reviewBooking } = useBookingsDispatchMethodsContext();
    

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRating(0);
        setHoverRating(0);
        setComment('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('Veuillez sélectionner une note');
            return;
        }

        const reviewData = {
            review_grade: rating,
            review_comment: comment
        };

        await execute(() => reviewBooking(bookingId, reviewData), {
            onSuccess: () => {
                handleCloseModal();
                reviewBooking({ id: bookingId, ...reviewData });
            }
        });
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoverRating || rating);
            stars.push(
                <button
                    key={i}
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    style={{ 
                        fontSize: '2rem', 
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease-in-out'
                    }}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                    aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
                >
                    <i 
                        className={`bi ${isFilled ? 'bi-star-fill' : 'bi-star'}`}
                        style={{ 
                            color: isFilled ? '#ffc107' : '#dee2e6',
                            transition: 'color 0.15s ease-in-out'
                        }}
                    ></i>
                </button>
            );
        }
        return stars;
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-outline-warning btn-sm"
                onClick={handleOpenModal}
                title="Laisser un avis"
            >
                <i className="bi bi-star me-1"></i>
                Laisser un avis
            </button>

            {isModalOpen && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={handleCloseModal}
                >
                    <div 
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-star-fill text-warning me-2"></i>
                                    Laisser un avis
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCloseModal}
                                    aria-label="Fermer"
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Notation par étoiles */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Note <span className="text-danger">*</span>
                                        </label>
                                        <div className="d-flex justify-content-center gap-1 mb-2">
                                            {renderStars()}
                                        </div>
                                        <div className="text-center text-muted">
                                            {rating > 0 ? (
                                                <span className="fw-medium">
                                                    {rating} / 5 étoile{rating > 1 ? 's' : ''}
                                                </span>
                                            ) : (
                                                <span>Cliquez pour noter</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Commentaire */}
                                    <div className="mb-3">
                                        <label htmlFor="reviewComment" className="form-label fw-semibold">
                                            Commentaire
                                        </label>
                                        <textarea
                                            id="reviewComment"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Partagez votre expérience avec cette borne de recharge..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            maxLength={500}
                                        ></textarea>
                                        <div className="form-text text-end">
                                            {comment.length} / 500 caractères
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={handleCloseModal}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-warning"
                                        disabled={loading || rating === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Envoi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-2"></i>
                                                Envoyer l'avis
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddReviewForm;
