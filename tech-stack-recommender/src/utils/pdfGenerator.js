import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Generate PDF from project recommendations
export const generateRecommendationsPDF = async (project) => {
  if (!project) {
    throw new Error('Project data is required');
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    if (!text || text.trim() === '') {
      return y;
    }
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(String(text), maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.35)); // Return new Y position
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  try {
    // Title
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Tech Stack Recommendations', margin, yPosition);
    yPosition += 15;

    // Project Name
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    yPosition = addWrappedText(project.projectName || project.name || 'Untitled Project', margin, yPosition, contentWidth, 18);
    yPosition += 5;

    // Project Description
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    yPosition = addWrappedText(project.description || 'No description provided', margin, yPosition, contentWidth, 12);
    yPosition += 10;

    // Project Details
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Project Details', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const projectDetails = [
      `Type: ${project.projectType || 'N/A'}`,
      `Budget: ${project.budget || 'N/A'}`,
      `Timeline: ${project.timeline || 'N/A'}`,
      `Team Size: ${project.teamSize || 'N/A'}`,
      `Experience Level: ${project.experience || 'N/A'}`,
      `Currency: ${project.currency || 'N/A'}`
    ];

    projectDetails.forEach(detail => {
      checkNewPage(5);
      pdf.text(`• ${detail}`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Features
    if (project.features && project.features.length > 0) {
      checkNewPage(20);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Required Features', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      project.features.forEach(feature => {
        checkNewPage(5);
        pdf.text(`• ${feature}`, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Frontend Recommendations
    if (project.recommendations?.frontend) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Frontend Stack', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Primary Technology:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(project.recommendations.frontend.primary, margin + 5, yPosition);
      yPosition += 8;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Reasoning:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      yPosition = addWrappedText(project.recommendations.frontend.reasoning, margin + 5, yPosition, contentWidth - 5, 10);
      yPosition += 5;

      if (project.recommendations.frontend.libraries && project.recommendations.frontend.libraries.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Key Libraries:', margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        project.recommendations.frontend.libraries.forEach(lib => {
          checkNewPage(5);
          pdf.text(`• ${lib}`, margin + 5, yPosition);
          yPosition += 5;
        });
      }
      yPosition += 10;
    }

    // Backend Recommendations
    if (project.recommendations?.backend) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Backend Stack', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Primary Technology:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(project.recommendations.backend.primary, margin + 5, yPosition);
      yPosition += 8;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Database:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(project.recommendations.backend.database, margin + 5, yPosition);
      yPosition += 8;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Reasoning:', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      yPosition = addWrappedText(project.recommendations.backend.reasoning, margin + 5, yPosition, contentWidth - 5, 10);
      yPosition += 10;
    }

    // DevOps & Deployment
    if (project.recommendations?.devTools) {
      checkNewPage(30);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('DevOps & Deployment', margin, yPosition);
      yPosition += 10;

      const devToolsData = [
        { label: 'Version Control', value: project.recommendations.devTools.versionControl },
        { label: 'Deployment', value: project.recommendations.devTools.deployment },
        { label: 'CI/CD', value: project.recommendations.devTools.cicd }
      ];

      devToolsData.forEach(tool => {
        if (tool.value) {
          checkNewPage(10);
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.text(`${tool.label}:`, margin, yPosition);
          yPosition += 6;

          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          yPosition = addWrappedText(tool.value, margin + 5, yPosition, contentWidth - 5, 10);
          yPosition += 5;
        }
      });
      yPosition += 5;
    }

    // Timeline Information
    if (project.recommendations?.timeline) {
      checkNewPage(40);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Timeline Analysis', margin, yPosition);
      yPosition += 10;

      if (project.recommendations.timeline.estimated) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Estimated Duration:', margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        const duration = `${project.recommendations.timeline.estimated.weeks || 'N/A'} weeks (${project.recommendations.timeline.estimated.months || 'N/A'} months)`;
        pdf.text(duration, margin + 5, yPosition);
        yPosition += 8;
      }

      if (project.recommendations.timeline.category) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Category:', margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        pdf.text(project.recommendations.timeline.category, margin + 5, yPosition);
        yPosition += 8;
      }

      if (project.recommendations.timeline.description) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Description:', margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        yPosition = addWrappedText(project.recommendations.timeline.description, margin + 5, yPosition, contentWidth - 5, 10);
        yPosition += 5;
      }

      // Phase Breakdown
      if (project.recommendations.timeline.breakdown) {
        checkNewPage(25);
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Phase Breakdown:', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const phases = [
          { name: 'Planning', weeks: project.recommendations.timeline.breakdown.planning },
          { name: 'Development', weeks: project.recommendations.timeline.breakdown.development },
          { name: 'Testing', weeks: project.recommendations.timeline.breakdown.testing },
          { name: 'Deployment', weeks: project.recommendations.timeline.breakdown.deployment }
        ];

        phases.forEach(phase => {
          if (phase.weeks) {
            checkNewPage(5);
            pdf.text(`• ${phase.name}: ${phase.weeks} weeks`, margin + 5, yPosition);
            yPosition += 5;
          }
        });
        yPosition += 5;
      }
    }

    // Cost Analysis
    if (project.recommendations?.estimatedCost) {
      checkNewPage(30);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Cost Analysis', margin, yPosition);
      yPosition += 10;

      const costData = [
        { label: 'Development Cost', value: project.recommendations.estimatedCost.development },
        { label: 'Hosting Cost', value: project.recommendations.estimatedCost.hosting },
        { label: 'Third-party Services', value: project.recommendations.estimatedCost.thirdParty }
      ];

      costData.forEach(cost => {
        if (cost.value) {
          checkNewPage(8);
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.text(`${cost.label}:`, margin, yPosition);
          
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'normal');
          pdf.text(cost.value, margin + 60, yPosition);
          yPosition += 8;
        }
      });
    }

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Generate PDF from HTML element (alternative method)
export const generatePDFFromElement = async (elementId, filename = 'recommendations.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw new Error('Failed to generate PDF from element');
  }
};

// Download PDF file
export const downloadPDF = (pdf, filename = 'tech-stack-recommendations.pdf') => {
  try {
    pdf.save(filename);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};