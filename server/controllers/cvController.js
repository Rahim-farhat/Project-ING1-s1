import CV from '../models/CV.js';
import Profile from '../models/Profile.js';

// Get all CV versions for user
export const getCVs = async (req, res) => {
    try {
        const cvs = await CV.find({ user: req.user.id })
            .sort('-generatedDate')
            .select('-profileSnapshot'); // Exclude large snapshot from list view

        res.json({
            success: true,
            count: cvs.length,
            data: cvs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching CVs',
            error: error.message
        });
    }
};

// Get single CV by ID
export const getCVById = async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        res.json({
            success: true,
            data: cv
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching CV',
            error: error.message
        });
    }
};

// Create new CV version from current profile
export const createCV = async (req, res) => {
    try {
        const { versionName, description, setAsDefault } = req.body;

        if (!versionName) {
            return res.status(400).json({
                success: false,
                message: 'Version name is required'
            });
        }

        // Get current profile
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please create a profile first.'
            });
        }

        // Create snapshot of current profile
        const profileSnapshot = {
            personalInfo: {
                ...profile.personalInfo,
                email: req.user.email // Add email from user account
            },
            education: profile.education,
            workExperience: profile.workExperience,
            projects: profile.projects,
            skills: profile.skills,
            certifications: profile.certifications,
            languages: profile.languages
        };

        // Create CV
        const cv = await CV.create({
            user: req.user.id,
            versionName,
            description,
            profileSnapshot,
            isDefault: setAsDefault || false
        });

        res.status(201).json({
            success: true,
            message: 'CV version created successfully',
            data: cv
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating CV',
            error: error.message
        });
    }
};

// Update CV metadata
export const updateCV = async (req, res) => {
    try {
        const { versionName, description } = req.body;

        const cv = await CV.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { versionName, description },
            { new: true, runValidators: true }
        ).select('-profileSnapshot');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        res.json({
            success: true,
            message: 'CV updated successfully',
            data: cv
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating CV',
            error: error.message
        });
    }
};

// Set CV as default
export const setDefaultCV = async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        cv.isDefault = true;
        await cv.save();

        res.json({
            success: true,
            message: 'Default CV updated successfully',
            data: cv
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error setting default CV',
            error: error.message
        });
    }
};

// Delete CV
export const deleteCV = async (req, res) => {
    try {
        const cv = await CV.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        res.json({
            success: true,
            message: 'CV deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting CV',
            error: error.message
        });
    }
};

// Download CV (returns CV data in structured format)
export const downloadCV = async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        // Format CV data for download
        const cvData = {
            version: cv.versionName,
            generatedDate: cv.generatedDate,
            ...cv.profileSnapshot
        };

        // Return as JSON (can be enhanced later to generate PDF)
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=cv-${cv.versionName.replace(/\s/g, '-')}.json`);
        res.json(cvData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error downloading CV',
            error: error.message
        });
    }
};

// Get CV usage statistics
export const getCVStats = async (req, res) => {
    try {
        const cvs = await CV.find({ user: req.user.id })
            .select('versionName usageCount isDefault generatedDate')
            .sort('-usageCount');

        const total = cvs.length;
        const defaultCV = cvs.find(cv => cv.isDefault);
        const mostUsed = cvs[0];

        res.json({
            success: true,
            data: {
                total,
                defaultCV: defaultCV ? {
                    id: defaultCV._id,
                    name: defaultCV.versionName
                } : null,
                mostUsed: mostUsed ? {
                    id: mostUsed._id,
                    name: mostUsed.versionName,
                    usageCount: mostUsed.usageCount
                } : null,
                cvs
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching CV statistics',
            error: error.message
        });
    }
};
