import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateSection } from '../api/profileService';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
        summary: ''
    });

    // Load profile data on component mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const response = await getProfile();

                if (response.success && response.data.profile) {
                    const { personalInfo } = response.data.profile;
                    setFormData({
                        fullName: personalInfo.fullName || '',
                        phone: personalInfo.phone || '',
                        address: personalInfo.address || '',
                        linkedin: personalInfo.linkedin || '',
                        github: personalInfo.github || '',
                        summary: personalInfo.summary || ''
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear save message when user starts typing
        if (saveMessage) setSaveMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSaving(true);
            setSaveMessage('');

            const response = await updateSection('personalInfo', formData);

            if (response.success) {
                setSaveMessage('Profile saved successfully! ✓');
                setTimeout(() => setSaveMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage('Error saving profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Mon Profil</h2>
                <p className="subtitle">Gérez vos informations personnelles pour votre CV</p>
            </div>

            <div className="content-card">
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-section">
                        <h3>Informations personnelles</h3>

                        <div className="form-group">
                            <label htmlFor="fullName">Nom complet</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Jean Dupont"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+33 6 12 34 56 78"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Adresse</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Paris, France"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Liens professionnels</h3>

                        <div className="form-group">
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input
                                type="url"
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="github">GitHub</label>
                            <input
                                type="url"
                                id="github"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Résumé professionnel</h3>

                        <div className="form-group">
                            <label htmlFor="summary">À propos</label>
                            <textarea
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Décrivez brièvement votre profil professionnel..."
                                rows="5"
                                className="textarea-input"
                                disabled={isSaving}
                            />
                            <small>Décrivez votre expérience et vos compétences principales</small>
                        </div>
                    </div>

                    {saveMessage && (
                        <div className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
                            {saveMessage}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner-small"></span>
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer le profil'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
