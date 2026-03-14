const emailService = require('../services/emailService');

class EmailController {
    async getEmails(req, res) {
        try {
            const emails = await emailService.getEmails();
            res.status(200).json({ success: true, count: emails.length, data: emails });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server Error', details: error.message });
        }
    }

    async getEmail(req, res) {
        try {
            const email = await emailService.getEmailById(req.params.id);
            if (!email) return res.status(404).json({ success: false, error: 'Email not found' });
            res.status(200).json({ success: true, data: email });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async sendEmail(req, res) {
        try {
            const email = await emailService.sendEmail(req.body);
            res.status(201).json({ success: true, data: email });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = new EmailController();
