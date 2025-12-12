import Profile from '../models/Profile.js';
import JobApplication from '../models/JobApplication.js';
import axios from 'axios';

// Critique user profile using n8n webhook
export const critiqueProfile = async (req, res) => {
    try {
        const { jobApplicationId } = req.params;
        const userId = req.user.id;

        // Fetch user profile
        const profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please complete your profile first.'
            });
        }

        // Fetch job application
        const jobApplication = await JobApplication.findOne({
            _id: jobApplicationId,
            user: userId
        });

        if (!jobApplication) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found.'
            });
        }

        // Prepare payload for n8n webhook
        const payload = {
            profile: {
                personalInfo: profile.personalInfo,
                education: profile.education,
                workExperience: profile.workExperience,
                projects: profile.projects,
                skills: profile.skills,
                certifications: profile.certifications,
                languages: profile.languages
            },
            jobDescription: jobApplication.jobDescription || '',
            jobPosition: jobApplication.position,
            company: jobApplication.company
        };

        // Get n8n webhook URL from environment
        const webhookUrl = process.env.N8N_CRITIQUE_WEBHOOK_URL;

        if (!webhookUrl) {
            return res.status(500).json({
                success: false,
                message: 'Profile critique service is not configured. Please contact the administrator.'
            });
        }

        // Call n8n webhook
        const response = await axios.post(webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        // Return critique results
        res.json({
            success: true,
            data: {
                critique: response.data,
                jobApplication: {
                    id: jobApplication._id,
                    position: jobApplication.position,
                    company: jobApplication.company
                }
            }
        });

    } catch (error) {
        console.error('Profile critique error:', error);

        // Handle different error types
        if (error.response) {
            // n8n webhook returned an error
            return res.status(error.response.status).json({
                success: false,
                message: 'Error from critique service: ' + (error.response.data?.message || 'Unknown error')
            });
        } else if (error.request) {
            // Request was made but no response received
            return res.status(503).json({
                success: false,
                message: 'Critique service is unavailable. Please try again later.'
            });
        } else {
            // Other errors
            return res.status(500).json({
                success: false,
                message: 'Error processing profile critique'
            });
        }
    }
};
