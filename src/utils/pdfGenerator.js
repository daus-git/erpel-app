import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { showError } from './sweetAlert'

export async function generatePDF(tableElement, title, logoUrl = '/icons/logo.png', includeStats = false, statsData = null) {
  try {
    // Extract table data
    const headers = []
    const data = []

    // Get headers
    const headerCells = tableElement.querySelectorAll('thead th')
    const headersArray = Array.from(headerCells).map(cell => cell.textContent.trim())
    const hasActions = headersArray.some(h => h.toLowerCase() === 'actions')

    // Filter headers if there's an Actions column
    const filteredHeaders = hasActions ? headersArray.filter(h => h.toLowerCase() !== 'actions') : headersArray
    headers.push(...filteredHeaders)

    // Get data rows
    const rows = tableElement.querySelectorAll('tbody tr')
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim())
      const filteredCells = hasActions ? cells.slice(0, -1) : cells
      if (filteredCells.length > 0) {
        data.push(filteredCells)
      }
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Add letterhead
    try {
      const logoWidth = 30
      const logoHeight = 30
      pdf.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight)
    } catch (logoError) {
      console.warn('Logo not found, continuing without logo')
    }

    // App name and title
    pdf.setFontSize(18)
    pdf.text('Salon App', 50, 20)
    pdf.setFontSize(14)
    pdf.text(title, 50, 30)

    // Date
    const date = new Date().toLocaleDateString()
    pdf.setFontSize(10)
    pdf.text(`Generated on: ${date}`, 10, 45)

    let startY = 55

    // Add statistics if provided
    if (includeStats && statsData) {
      pdf.setFontSize(12)
      pdf.text('Summary Statistics:', 10, startY)
      startY += 10

      pdf.setFontSize(10)
      pdf.text(`Total Transactions: ${statsData.totalTransactions}`, 15, startY)
      startY += 6
      pdf.text(`Total Revenue: Rp ${statsData.totalRevenue.toLocaleString('id-ID')}`, 15, startY)
      startY += 6
      pdf.text(`Average Transaction: Rp ${statsData.averageTransaction.toLocaleString('id-ID')}`, 15, startY)
      startY += 15
    }

    // Add table using autoTable
    autoTable(pdf, {
      head: [headers],
      body: data,
      startY: startY,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [243, 244, 246], // Light gray
        textColor: [0, 0, 0], // Black text
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Very light gray for alternate rows
      },
      columnStyles: {
        // Make columns wrap text properly
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' }
      },
      margin: { top: startY, left: 10, right: 10 },
      tableWidth: 'auto'
    })

    // Save PDF
    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    showError('Gagal Generate PDF', 'Gagal membuat PDF. Silakan coba lagi.')
  }
}
