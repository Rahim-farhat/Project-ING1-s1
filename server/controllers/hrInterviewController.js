import axios from 'axios';

// HR Interview webhook proxy
export const hrInterviewWebhook = async (req, res) => {
    try {
        const { sessionId, message, step } = req.body;

        if (!sessionId || message === undefined || step === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: sessionId, message, or step'
            });
        }

        // Get n8n webhook URL from environment or use default
        const webhookUrl = process.env.N8N_HR_INTERVIEW_WEBHOOK_URL || 'https://aramfilali.app.n8n.cloud/webhook/hr-interview';

        console.log('Calling HR Interview webhook:', { sessionId, message, step });

        // Forward request to n8n webhook
        const response = await axios.post(webhookUrl, {
            sessionId,
            message,
            step
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        console.log('HR Interview webhook response:', response.data);

        // Return the response from n8n
        res.json(response.data);

    } catch (error) {
        console.error('HR Interview webhook error:', error);

        // Handle different error types
        if (error.response) {
            // n8n webhook returned an error
            return res.status(error.response.status).json({
                success: false,
                message: 'Error from HR interview service: ' + (error.response.data?.message || 'Unknown error'),
                data: error.response.data
            });
        } else if (error.request) {
            // Request was made but no response received
            return res.status(503).json({
                success: false,
                message: 'HR interview service is unavailable. Please try again later.'
            });
        } else {
            // Other errors
            return res.status(500).json({
                success: false,
                message: 'Error processing HR interview request'
            });
        }
    }
};
