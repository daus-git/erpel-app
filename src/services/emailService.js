// Email Service using a generic email API (can be configured for SendGrid, Mailgun, etc.)
class EmailService {
  constructor() {
    this.apiUrl = process.env.VUE_APP_EMAIL_API_URL || 'https://api.emailprovider.com/v1';
    this.apiKey = process.env.VUE_APP_EMAIL_API_KEY;
    this.fromEmail = process.env.VUE_APP_FROM_EMAIL || 'noreply@salonapp.com';
    this.fromName = 'SalonApp';
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: {
            email: this.fromEmail,
            name: this.fromName
          },
          to: [{
            email: to
          }],
          subject: subject,
          html: htmlContent,
          text: textContent || this.stripHtml(htmlContent)
        })
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  async sendOrderConfirmation(customerEmail, customerName, orderDetails) {
    const subject = 'Konfirmasi Pesanan SalonApp';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #B08C6A;">Halo ${customerName}!</h2>
        <p>Pesanan Anda telah dikonfirmasi. Berikut detail pesanan:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          ${orderDetails}
        </div>
        <p>Terima kasih telah memilih salon kami!</p>
        <p style="color: #666; font-size: 12px;">SalonApp Team</p>
      </div>
    `;
    return this.sendEmail(customerEmail, subject, htmlContent);
  }

  async sendAppointmentReminder(customerEmail, customerName, serviceName, date, time) {
    const subject = 'Reminder Janji Temu SalonApp';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #B08C6A;">Reminder Janji Temu</h2>
        <p>Halo ${customerName},</p>
        <p>Ini adalah reminder untuk janji temu Anda:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Layanan:</strong> ${serviceName}</p>
          <p><strong>Tanggal:</strong> ${date}</p>
          <p><strong>Waktu:</strong> ${time}</p>
        </div>
        <p>Mohon datang 15 menit sebelum waktu yang dijadwalkan.</p>
        <p style="color: #666; font-size: 12px;">SalonApp Team</p>
      </div>
    `;
    return this.sendEmail(customerEmail, subject, htmlContent);
  }

  async sendStatusUpdate(customerEmail, customerName, orderId, newStatus) {
    const statusMessages = {
      'Processing': 'Pesanan Anda sedang diproses.',
      'Scheduled': 'Pesanan Anda telah dijadwalkan.',
      'Completed': 'Pesanan Anda telah selesai! Terima kasih.',
      'Cancelled': 'Pesanan Anda telah dibatalkan.'
    };

    const subject = `Update Status Pesanan #${orderId}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #B08C6A;">Update Status Pesanan</h2>
        <p>Halo ${customerName},</p>
        <p>Status pesanan Anda (#${orderId}) telah diperbarui:</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="font-size: 18px; font-weight: bold; color: #B08C6A;">${statusMessages[newStatus] || 'Status pesanan telah diperbarui.'}</p>
        </div>
        <p>Jika Anda memiliki pertanyaan, silakan hubungi kami.</p>
        <p style="color: #666; font-size: 12px;">SalonApp Team</p>
      </div>
    `;
    return this.sendEmail(customerEmail, subject, htmlContent);
  }
}

export default new EmailService();
