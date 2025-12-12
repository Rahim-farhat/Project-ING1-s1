import Profile from '../models/Profile.js';
import JobApplication from '../models/JobApplication.js';
import CV from '../models/CV.js';

// Get all CVs for the user
export const getCVs = async (req, res) => {
    try {
        const cvs = await CV.find({ user: req.user.id })
            .sort({ generatedDate: -1 });

        res.json({
            success: true,
            count: cvs.length,
            data: cvs
        });
    } catch (error) {
        console.error('Error fetching CVs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching CVs',
            error: error.message
        });
    }
};

export const generateCV = async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobApplicationId } = req.body;

        // Validate input
        if (!jobApplicationId) {
            return res.status(400).json({
                success: false,
                message: 'Job application ID is required.'
            });
        }

        // Fetch the profile
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please complete your profile first.'
            });
        }

        // Fetch the job application
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

        // Extract job description from the application
        const jobDescription = jobApplication.jobDescription;

        // Prepare payload for n8n
        const payload = {
            profile: profile,
            jobDescription: jobDescription
        };

        try {
            // Send to n8n
            console.log('Sending data to n8n webhook...');
            const n8nResponse = await fetch('https://rahim-n8n.app.n8n.cloud/webhook/bd1fe569-0009-4ed3-bb14-6e05a6e89d97', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!n8nResponse.ok) {
                throw new Error(`n8n webhook failed with status ${n8nResponse.status}`);
            }

            const contentType = n8nResponse.headers.get("content-type");
            let latexCode = "";

            if (contentType && contentType.includes("application/json")) {
                const json = await n8nResponse.json();
                // Try to find the latex code in common fields
                latexCode = json.latex || json.output || json.text || json.content;

                // If not found in specific fields, check if it's a structure we can parse or if the whole thing is relevant
                if (!latexCode) {
                    // If the response IS the latex code wrapped in a generic object
                    if (typeof json === 'string') {
                        latexCode = json;
                    } else {
                        // Fallback: stringify it, but this is likely wrong if it's a complex object
                        // But if the user setup n8n to return "Respond to Webhook" with a single body property, it might be nested
                        // Let's assume the user sends back an object like { "latex": "..." } or just the text

                        // If structure is unknown, let's keep it empty and hope for text
                        console.warn('Could not extract latex from JSON:', json);
                        // Fallback to expecting it might be in 'data'
                        latexCode = json.data;
                    }
                }
            } else {
                latexCode = await n8nResponse.text();
            }

            // If we still don't have latexCode but have a successful response
            if (!latexCode) {
                // It's possible the response body IS the latex code but it was parsed as JSON?
                // Or maybe we missed it.
                // For now let's hope it's text or { latex: ... }
            }

            if (typeof latexCode === 'string') {
                // Clean up markdown code blocks if present
                latexCode = latexCode.replace(/^```latex\n?/, '').replace(/```$/, '').trim();
            }

            res.json({
                success: true,
                latex: latexCode
            });

        } catch (webhookError) {
            console.error('n8n Webhook Error:', webhookError);
            return res.status(502).json({
                success: false,
                message: 'Failed to communicate with CV generation service',
                error: webhookError.message
            });
        }

    } catch (error) {
        console.error('CV Generation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Save generated CV to database
export const saveGeneratedCV = async (req, res) => {
    try {
        const userId = req.user.id;
        const { versionName, description, latexCode, jobApplicationId } = req.body;

        // Validation
        if (!versionName || !latexCode) {
            return res.status(400).json({
                success: false,
                message: 'Version name and LaTeX code are required.'
            });
        }

        // Fetch the profile for snapshot
        const profile = await Profile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please complete your profile first.'
            });
        }

        // Create CV document
        const cv = new CV({
            user: userId,
            versionName,
            description: description || '',
            latexCode,
            profileSnapshot: {
                personalInfo: profile.personalInfo,
                education: profile.education,
                workExperience: profile.workExperience,
                projects: profile.projects,
                skills: profile.skills,
                certifications: profile.certifications,
                languages: profile.languages
            }
        });

        await cv.save();

        // If jobApplicationId is provided, attach CV to the job application
        if (jobApplicationId) {
            const jobApplication = await JobApplication.findOneAndUpdate(
                { _id: jobApplicationId, user: userId },
                { cvVersion: cv._id },
                { new: true, runValidators: false }
            ).populate('cvVersion', 'versionName generatedDate latexCode');

            if (!jobApplication) {
                return res.status(404).json({
                    success: false,
                    message: 'Job application not found.',
                    cvId: cv._id
                });
            }

            return res.status(201).json({
                success: true,
                message: 'CV saved and attached to job application successfully.',
                data: {
                    cv,
                    jobApplication: {
                        id: jobApplication._id,
                        company: jobApplication.company,
                        position: jobApplication.position,
                        cvVersion: jobApplication.cvVersion
                    },
                    attachedToApplication: true
                }
            });
        }

        res.status(201).json({
            success: true,
            message: 'CV saved successfully.',
            data: {
                cv,
                attachedToApplication: false
            }
        });

    } catch (error) {
        console.error('Save CV Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving CV',
            error: error.message
        });
    }
};