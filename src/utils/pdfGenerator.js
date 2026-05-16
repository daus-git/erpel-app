import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { showError } from './sweetAlert'
import logoImg from '../assets/logo.png'

export async function generatePDF(tableElement, title, includeStats = false, statsData = null) {
  try {
    // Extract table data
    const headers = []
    const data = []

// Get headers
    const headerCells = tableElement.querySelectorAll('thead th')
    const headersArray = Array.from(headerCells).map(cell => cell.textContent.trim())
    const hasActions = headersArray.some(h => 
      h.toLowerCase() === 'actions' || 
      h.toLowerCase() === 'aksi' ||
      h.toLowerCase() === 'action'
    )

    // Filter headers if there's an Actions column (supports English, Indonesian)
    const filteredHeaders = hasActions ? headersArray.filter(h => 
      h.toLowerCase() !== 'actions' && 
      h.toLowerCase() !== 'aksi' &&
      h.toLowerCase() !== 'action'
    ) : headersArray
    headers.push(...filteredHeaders)

// Get data rows
    const rows = tableElement.querySelectorAll('tbody tr')
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent.trim())
      // Remove last column if it contains actions column
      const filteredCells = hasActions ? cells.slice(0, -1) : cells
      if (filteredCells.length > 0) {
        data.push(filteredCells)
      }
    })

// Create PDF - default portrait, landscape for many columns (> 6)
    const pdf = new jsPDF('p', 'mm', 'a4')
    // Switch to landscape if many columns
    if (headers.length > 6) {
      pdf.internal.pageSize.setOrientation('l')
    }

// Add letterhead
    try {
      const logoWidth = 20
      const logoHeight = 20
      // Use imported logo image
      pdf.addImage(logoImg, 'PNG', 10, 12, logoWidth, logoHeight)
    } catch (logoError) {
      console.warn('Logo not found, continuing without logo:', logoError)
    }

    // Company info - Profil Objek Penelitian
    pdf.setFontSize(18)
    pdf.text('Erpel Salon', 50, 15)
    pdf.setFontSize(10)
    pdf.text('Jl. Ahmad Yani No. 126, Kelurahan Sungai Andai', 50, 22)
    pdf.text('Kecamatan Banjarmasin Utara, Kota Banjarmasin', 50, 27)
    pdf.text('Kalimantan Selatan 70124', 50, 32)
    pdf.text('Telp: (0511) 1234567 | Email: info@erpelsalon.com', 50, 37)

    // App name and title
    pdf.setFontSize(14)
    pdf.text(title, 50, 45)

    // Date
    const date = new Date().toLocaleDateString()
    pdf.setFontSize(10)
    pdf.text(`Generated on: ${date}`, 10, 52)

    let startY = 60

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
    let finalY
    
    // Constant table settings - same size regardless of column count
    const margin = 10
    const fontSize = 8
    const cellPadding = 2
    
    autoTable(pdf, {
      head: [headers],
      body: data,
      startY: startY,
      styles: {
        fontSize: fontSize,
        cellPadding: cellPadding,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [243, 244, 246], // Light gray
        textColor: [0, 0, 0], // Black text
        fontStyle: 'bold',
        fontSize: fontSize
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Very light gray for alternate rows
      },
columnStyles: {
        // All columns use equal width to fit on page
        0: { cellWidth: 'equal' },
        1: { cellWidth: 'equal' },
        2: { cellWidth: 'equal' },
        3: { cellWidth: 'equal' },
        4: { cellWidth: 'equal' },
        5: { cellWidth: 'equal' },
        6: { cellWidth: 'equal' },
        7: { cellWidth: 'equal' },
        8: { cellWidth: 'equal' },
        9: { cellWidth: 'equal' },
        10: { cellWidth: 'equal' },
        11: { cellWidth: 'equal' },
        12: { cellWidth: 'equal' },
        13: { cellWidth: 'equal' },
        14: { cellWidth: 'equal' }
      },
      margin: { top: startY, left: margin, right: margin },
      tableWidth: 'wrap',
      didDrawPage: function (data) {
        finalY = data.cursor.y
      }
    })

    // Add signature section below the table
    const signatureY = finalY + 20

    pdf.setFontSize(10)
    pdf.text('Mengetahui,', 140, signatureY)
    pdf.text('Banjarmasin, ' + new Date().toLocaleDateString('id-ID'), 140, signatureY + 5)
    pdf.text('Manager Erpel Salon', 140, signatureY + 25)

    // Save PDF
    pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    showError('Gagal Generate PDF', 'Gagal membuat PDF. Silakan coba lagi.')
  }
}
