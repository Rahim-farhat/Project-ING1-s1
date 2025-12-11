import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateApplicationStatus, deleteApplication } from '../api/jobApplicationsApi';

const ApplicationsTable = ({ applications, cvVersions, onRefresh, onEdit }) => {
    const navigate = useNavigate();
    const [updatingStatus, setUpdatingStatus] = useState({});
    const [viewingCV, setViewingCV] = useState(null);

    const getJobTypeLabel = (jobType) => {
        const labels = {
            'Internship': 'Stage',
            'Full-Time': 'Temps plein',
            'Part-Time': 'Temps partiel',
            'Contract': 'Contrat',
            'Freelance': 'Freelance'
        };
        return labels[jobType] || jobType;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Applied': '#3b82f6',
            'Interview': '#f59e0b',
            'Offer': '#10b981',
            'Rejected': '#ef4444',
            'Withdrawn': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [applicationId]: true }));
        try {
            await updateApplicationStatus(applicationId, { status: newStatus });
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    const handleDelete = async (applicationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            try {
                await deleteApplication(applicationId);
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error('Error deleting application:', error);
                alert('Erreur lors de la suppression de la candidature');
            }
        }
    };

    const handleViewCV = (cvVersion) => {
        if (!cvVersion) {
            alert('Aucun CV associé à cette candidature');
            return;
        }
        setViewingCV(cvVersion);
    };

    const closeCV = () => {
        setViewingCV(null);
    };

    if (!applications || applications.length === 0) {
        return (
            <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <h3>Aucune candidature</h3>
                <p>Commencez par créer votre première candidature</p>
            </div>
        );
    }

    return (
        <>
            <div className="applications-table-container">
                <div className="applications-table-header">
                    <h3>📋 Mes Candidatures</h3>
                    <span className="applications-count">{applications.length} candidature{applications.length > 1 ? 's' : ''}</span>
                </div>

                <div className="table-wrapper">
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Entreprise</th>
                                <th>Poste</th>
                                <th>Type</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>CV</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => {
                                const cvVersion = cvVersions.find(cv => cv._id === app.cvVersion?._id);

                                return (
                                    <tr key={app._id}>
                                        <td className="company-cell">
                                            <strong>{app.company}</strong>
                                            {app.location && (
                                                <div className="location-tag">📍 {app.location}</div>
                                            )}
                                        </td>
                                        <td>{app.position}</td>
                                        <td>
                                            <span className="job-type-badge">
                                                {getJobTypeLabel(app.jobType)}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                                disabled={updatingStatus[app._id]}
                                                style={{ borderLeft: `3px solid ${getStatusColor(app.status)}` }}
                                            >
                                                <option value="Applied">Candidature Envoyée</option>
                                                <option value="Interview">Entretien</option>
                                                <option value="Offer">Offre Reçue</option>
                                                <option value="Rejected">Refusée</option>
                                                <option value="Withdrawn">Retirée</option>
                                            </select>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(app.applicationDate).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="cv-cell">
                                            {cvVersion ? (
                                                <button
                                                    className="btn-view-cv"
                                                    onClick={() => handleViewCV(cvVersion)}
                                                    title={cvVersion.versionName}
                                                >
                                                    📄 Voir CV
                                                </button>
                                            ) : (
                                                <span className="no-cv">-</span>
                                            )}
                                        </td>
                                        <td className="actions-cell">
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon btn-edit"
                                                    onClick={() => onEdit(app)}
                                                    title="Modifier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn-icon btn-delete"
                                                    onClick={() => handleDelete(app._id)}
                                                    title="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CV Viewer Modal */}
            {viewingCV && (
                <div className="modal-overlay" onClick={closeCV}>
                    <div className="modal-container cv-viewer-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📄 {viewingCV.versionName}</h2>
                            <button className="close-btn" onClick={closeCV}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body cv-content-viewer">
                            <div className="cv-meta-info">
                                <p><strong>Généré le:</strong> {new Date(viewingCV.generatedDate).toLocaleDateString('fr-FR')}</p>
                                <p><strong>Langue:</strong> {viewingCV.language === 'en' ? 'Anglais' : 'Français'}</p>
                            </div>

                            {viewingCV.profileSnapshot && (
                                <div className="cv-snapshot-preview">
                                    <h3>Aperçu du Profil</h3>

                                    {viewingCV.profileSnapshot.personalInfo && (
                                        <div className="snapshot-section">
                                            <h4>{viewingCV.profileSnapshot.personalInfo.fullName}</h4>
                                            <p>{viewingCV.profileSnapshot.personalInfo.headline}</p>
                                            <small>{viewingCV.profileSnapshot.personalInfo.email} • {viewingCV.profileSnapshot.personalInfo.phone}</small>
                                        </div>
                                    )}

                                    {viewingCV.profileSnapshot.skills && viewingCV.profileSnapshot.skills.length > 0 && (
                                        <div className="snapshot-section">
                                            <h4>Compétences</h4>
                                            <div className="skills-tags">
                                                {viewingCV.profileSnapshot.skills.slice(0, 10).map((skill, i) => (
                                                    <span key={i} className="skill-tag">{skill}</span>
                                                ))}
                                                {viewingCV.profileSnapshot.skills.length > 10 && <span>+ {viewingCV.profileSnapshot.skills.length - 10} autres</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="cv-actions-footer">
                                <p className="info-text">Le PDF complet est disponible dans la section "Mes CVs"</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeCV}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplicationsTable;
