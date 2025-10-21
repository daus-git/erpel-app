// WhatsApp Business API Service
class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.VUE_APP_WHATSAPP_API_URL || 'https://api.whatsapp.com/v1';
    this.accessToken = process.env.VUE_APP_WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.VUE_APP_WHATSAPP_PHONE_NUMBER_ID;
  }

  async sendMessage(to, message) {
    try {
      const response = await fetch(`${this.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message
          }
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(customerPhone, orderDetails) {
    const message = `Halo! Pesanan Anda telah dikonfirmasi.\n\nDetail Pesanan:\n${orderDetails}\n\nTerima kasih telah memilih salon kami!`;
    return this.sendMessage(customerPhone, message);
  }

  async sendAppointmentReminder(customerPhone, serviceName, date, time) {
    const message = `Halo! Reminder janji temu Anda:\n\nLayanan: ${serviceName}\nTanggal: ${date}\nWaktu: ${time}\n\nMohon datang 15 menit sebelum waktu yang dijadwalkan.`;
    return this.sendMessage(customerPhone, message);
  }

  async sendStatusUpdate(customerPhone, orderId, newStatus) {
    const statusMessages = {
      'Processing': 'Pesanan Anda sedang diproses.',
      'Scheduled': 'Pesanan Anda telah dijadwalkan.',
      'Completed': 'Pesanan Anda telah selesai! Terima kasih.',
      'Cancelled': 'Pesanan Anda telah dibatalkan.'
    };

    const message = `Update Status Pesanan #${orderId}:\n${statusMessages[newStatus] || 'Status pesanan telah diperbarui.'}`;
    return this.sendMessage(customerPhone, message);
  }
}

export default new WhatsAppService();
