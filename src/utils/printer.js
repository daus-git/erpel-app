/**
 * Alternative method to print table using browser's native print
 * This produces output that looks exactly like the HTML
 */

export function printTableHTML(tableElement, title) {
// Clone the table to remove action buttons without affecting the original
  const tableClone = tableElement.cloneNode(true)
  
  // Remove action buttons from the clone
  const actionButtons = tableClone.querySelectorAll('button, .actions-column, [class*="action"]')
  actionButtons.forEach(btn => btn.remove())
  
  // Also remove images from the clone (for Services table)
  const images = tableClone.querySelectorAll('img')
  images.forEach(img => {
    const td = img.parentElement
    if (td.tagName === 'TD' || td.tagName === 'TH') {
      // Replace image with text placeholder
      td.innerHTML = '(gambar)'
    } else {
      img.remove()
    }
  })
  
  // Also check for Actions column header and remove the column
  const headers = tableClone.querySelectorAll('th')
  headers.forEach(th => {
    if (th.textContent.toLowerCase().includes('aksi') || 
        th.textContent.toLowerCase().includes('action') ||
        th.textContent.toLowerCase().includes('image') ||
        th.textContent.toLowerCase().includes('img')) {
      const headerIndex = Array.from(th.parentNode.children).indexOf(th)
      th.remove()
      // Remove corresponding td cells in all rows
      const rows = tableClone.querySelectorAll('tr')
      rows.forEach(row => {
        const cells = row.querySelectorAll('td')
        if (cells[headerIndex]) cells[headerIndex].remove()
      })
    }
  })
  
  // Get table HTML from the cleaned clone
  const tableHTML = tableClone.outerHTML
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('Please allow popups for printing')
    return
  }
  
  // Write print-friendly HTML
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          color: #000;
          padding: 20px;
        }
        .header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #000;
        }
        .header h1 {
          font-size: 18px;
          margin-bottom: 5px;
        }
        .header p {
          font-size: 10px;
          color: #666;
        }
        .date {
          font-size: 10px;
          color: #666;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background: #f5f5f5;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background: #fafafa;
        }
        @media print {
          body {
            padding: 0;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Erpel Salon</h1>
        <p>Jl. Ahmad Yani No. 126, Sungai Andai, Banjarmasin Utara</p>
        <p>Kalimantan Selatan 70124 | Telp: (0511) 1234567</p>
      </div>
      <h2 style="margin-bottom: 10px;">${title}</h2>
      <div class="date">Generated on: ${new Date().toLocaleDateString('id-ID')}</div>
      ${tableHTML}
      <div style="margin-top: 30px;">
        <p style="font-size: 10px;">Mengetahui,</p>
        <p style="margin-top: 40px;">Manager Erpel Salon</p>
      </div>
<script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 250);
        }
      </script>
    </body>
    </html>
  `)
  
  printWindow.document.close()
}

/**
 * Print using browser print dialog with custom styling
 * Accepts a CSS string for custom print styles
 */
export function printElement(element, customStyles = '') {
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('Please allow popups for printing')
    return
  }
  
  const elementHTML = element.outerHTML
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 15px;
        }
        ${customStyles}
        @media print {
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
${elementHTML}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.close();
          }, 250);
        }
      </script>
    </body>
    </html>
  `)
  
  printWindow.document.close()
}
