const emailRepository = require('../repositories/emailRepository');

class EmailService {

    async sendEmail(emailReq) {
        if (!emailReq.recipient || !emailReq.subject || !emailReq.body || !emailReq.type) {
            throw new Error("Missing required email fields (recipient, subject, body, type)");
        }

        // 1. Create a record in the database with status PENDING
        const emailRecord = await emailRepository.saveEmail({
            ...emailReq,
            status: 'PENDING'
        });

        // 2. Simulate sending the email (e.g., via AWS SES, SendGrid, SMTP)
        let isSuccess = false;
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (Math.random() > 0.05) {
                isSuccess = true;
            } else {
                throw new Error("SMTP Provider timeout");
            }
        } catch (error) {
            console.error(`Failed to send email to ${emailReq.recipient}:`, error.message);
        }

        // 3. Update the database record with the final status
        const updatedEmail = await emailRepository.saveEmail({
            ...emailRecord,
            status: isSuccess ? 'SENT' : 'FAILED',
            sent_at: isSuccess ? new Date() : null
        });

        if (!isSuccess) {
            throw new Error("Failed to dispatch email via provider");
        }

        return updatedEmail;
    }

    async getEmails() {
        return await emailRepository.findAll();
    }

    async getEmailById(id) {
        return await emailRepository.findById(id);
    }
}

module.exports = new EmailService();
