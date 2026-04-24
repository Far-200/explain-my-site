/**
 * Generates and downloads a PDF report of the analysis.
 * Uses jsPDF directly (no html2canvas) for reliable server-side-free generation.
 *
 * @param {string} url - The analyzed URL
 * @param {Object} result - { summary, techStack, uiUx, security }
 */
export async function downloadReportAsPDF(url, result) {
  // Dynamic import to keep bundle size small
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // --- Helper functions ---
  const addText = (text, fontSize, color, bold = false, x = margin) => {
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)
    if (bold) doc.setFont('helvetica', 'bold')
    else doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, x, y)
    y += lines.length * (fontSize * 0.4) + 2
    return lines.length
  }

  const addSection = (emoji, title, content, accentR, accentG, accentB) => {
    // Check if we need a new page
    if (y > 240) {
      doc.addPage()
      y = margin
    }

    // Section accent bar
    doc.setFillColor(accentR, accentG, accentB)
    doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')

    // Section title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(accentR, accentG, accentB)
    doc.text(`${emoji}  ${title}`, margin + 8, y + 6)
    y += 14

    // Section content
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 80)

    const lines = doc.splitTextToSize(content || 'No data available.', contentWidth)
    lines.forEach(line => {
      if (y > 270) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 5.5
    })
    y += 6
  }

  // --- HEADER ---
  // Background rectangle
  doc.setFillColor(5, 5, 8)
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(124, 106, 255)
  doc.text('ExplainMyWebsite', margin, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(140, 140, 180)
  doc.text('AI-Powered Website Analysis Report', margin, 26)

  // URL
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 140)
  doc.text(`Analyzed: ${url}`, margin, 34)

  // Date
  const dateStr = new Date().toLocaleString()
  doc.text(`Generated: ${dateStr}`, margin, 40)

  y = 55

  // Divider
  doc.setDrawColor(30, 30, 46)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // --- SECTIONS ---
  addSection('🧠', 'Summary', result.summary, 124, 106, 255)
  addSection('⚙️', 'Tech Stack', result.techStack, 106, 255, 218)
  addSection('🎨', 'UI/UX Feedback', result.uiUx, 255, 106, 158)
  addSection('🔐', 'Security Observations', result.security, 255, 180, 60)

  // --- FOOTER ---
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(80, 80, 100)
    doc.text(
      `ExplainMyWebsite.ai  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  // --- SAVE ---
  const domain = new URL(url).hostname.replace(/^www\./, '').replace(/\./g, '-')
  doc.save(`analysis-${domain}.pdf`)
}
