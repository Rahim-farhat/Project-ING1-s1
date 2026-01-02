import axios from 'axios';

export const getTechnicalQuestions = async (req, res) => {
    try {
        // Validation could be added here if we expect parameters like difficulty, topic, etc.
        // const { topic, difficulty } = req.body;

        // Get n8n webhook URL from environment or use a placeholder that needs updating
        // The previous URL 'https://rahim-farhat.app.n8n.cloud/webhook/bd1fe569-0009-4ed3-bb14-6e05a6eazertyu' had a typo
        const webhookUrl = process.env.N8N_TECHNICAL_QUIZ_WEBHOOK_URL;

        if (!webhookUrl) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: N8N_TECHNICAL_QUIZ_WEBHOOK_URL is not set'
            });
        }

        console.log('Calling Technical Quiz webhook:', webhookUrl);

        // Forward request to n8n webhook
        // We pass the body just in case the webhook is updated to use it later
        const response = await axios.post(webhookUrl, req.body || {}, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        console.log('Technical Quiz webhook response status:', response.status);

        // n8n might return the data directly or wrapped
        const data = response.data;

        if (!data) {
            return res.status(502).json({
                success: false,
                message: 'Received empty response from quiz service'
            });
        }

        // Return the response from n8n
        res.json(data);

    } catch (error) {
        console.error('Technical Quiz webhook error:', error);

        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: 'Error from quiz service: ' + (error.response.data?.message || error.message),
                data: error.response.data
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Internal server error processing quiz request'
            });
        }
    }
};
