const ApplicationStatusBadge = ({ status }) => {
    const statusConfig = {
        'Applied': { label: 'Candidature Envoyée', color: 'blue', icon: '📨' },
        'Interview': { label: 'Entretien', color: 'orange', icon: '🎯' },
        'Offer': { label: 'Offre Reçue', color: 'green', icon: '🎉' },
        'Rejected': { label: 'Refusée', color: 'red', icon: '❌' },
        'Withdrawn': { label: 'Retirée', color: 'gray', icon: '🚫' }
    };

    const config = statusConfig[status] || statusConfig['Applied'];

    return (
        <span className={`status-badge status-${config.color}`}>
            <span className="status-icon">{config.icon}</span>
            {config.label}
        </span>
    );
};

export default ApplicationStatusBadge;
