// Invoice PDF Generation Utility
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PaymentWithTransaction, Transaction } from '../types/payment';

interface InvoiceData {
    payment: PaymentWithTransaction;
    transaction: Transaction;
    userInfo: {
        name: string;
        email: string;
        phone?: string;
    };
}

/**
 * Generate a professional PDF invoice for a completed transaction
 */
export function generateInvoicePDF(data: InvoiceData): void {
    const { payment, transaction, userInfo } = data;
    const doc = new jsPDF();

    // Define colors
    const primaryColor = '#06B6D4'; // Cyan
    const secondaryColor = '#3B82F6'; // Blue
    const darkGray = '#374151';
    const lightGray = '#9CA3AF';
    const successColor = '#10B981';

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Header with gradient effect (simulated with rectangles)
    doc.setFillColor(6, 182, 212); // Cyan
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(pageWidth * 0.7, 0, pageWidth * 0.3, 50, 'F');

    // Logo/Brand area
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT', margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Transaction Confirmation', margin, 35);

    // Invoice Info Box (Top Right)
    const invoiceBoxX = pageWidth - margin - 60;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Receipt Number', invoiceBoxX, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(payment.payment_number, invoiceBoxX, 27);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Date', invoiceBoxX, 37);
    doc.setFontSize(10);
    const paymentDate = new Date(transaction.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    doc.text(paymentDate, invoiceBoxX, 44);

    // Status Badge
    let currentY = 65;
    doc.setFillColor(16, 185, 129); // Success green
    doc.roundedRect(margin, currentY, 35, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ PAID', margin + 6, currentY + 7);

    // Transaction timestamp
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const timestamp = new Date(transaction.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    doc.text(`Completed on ${timestamp}`, margin + 40, currentY + 7);

    currentY += 25;

    // Customer Information Section
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, currentY, (pageWidth - 2 * margin) / 2 - 5, 35, 'F');
    
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', margin + 5, currentY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(userInfo.name || 'Customer', margin + 5, currentY + 16);
    
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(userInfo.email, margin + 5, currentY + 23);
    if (userInfo.phone) {
        doc.text(userInfo.phone, margin + 5, currentY + 30);
    }

    // Transaction Details Section
    const detailsX = pageWidth / 2 + 5;
    doc.setFillColor(249, 250, 251);
    doc.rect(detailsX, currentY, (pageWidth - 2 * margin) / 2 - 5, 35, 'F');
    
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION DETAILS', detailsX + 5, currentY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Transaction ID:', detailsX + 5, currentY + 16);
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.text(transaction.transaction_id || 'N/A', detailsX + 5, currentY + 22);
    
    if (transaction.payu_transaction_id) {
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text('Gateway Reference:', detailsX + 5, currentY + 28);
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(8);
        doc.text(transaction.payu_transaction_id, detailsX + 5, currentY + 33);
    }

    currentY += 50;

    // Payment Description Section
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    currentY += 12;
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', margin, currentY);

    currentY += 10;

    // Payment details table
    autoTable(doc, {
        startY: currentY,
        head: [['Description', 'Amount']],
        body: [
            [
                {
                    content: payment.description,
                    styles: { cellWidth: pageWidth - 2 * margin - 50 }
                },
                {
                    content: `${payment.currency} ${payment.amount.toFixed(2)}`,
                    styles: { halign: 'right', fontStyle: 'bold' }
                }
            ]
        ],
        headStyles: {
            fillColor: [243, 244, 246],
            textColor: [55, 65, 81],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            textColor: [75, 85, 99],
            fontSize: 10
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        margin: { left: margin, right: margin },
        theme: 'grid'
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;

    // Total Amount Section (Highlighted)
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, currentY, pageWidth - 2 * margin, 20, 'F');
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.8);
    doc.rect(margin, currentY, pageWidth - 2 * margin, 20);

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', margin + 5, currentY + 13);
    
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(16);
    const totalText = `${payment.currency} ${payment.amount.toFixed(2)}`;
    const totalWidth = doc.getTextWidth(totalText);
    doc.text(totalText, pageWidth - margin - totalWidth - 5, currentY + 13);

    currentY += 35;

    // Payment Method Information
    if (transaction.payment_method) {
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Payment Method: ${transaction.payment_method}`, margin, currentY);
        currentY += 6;
    }

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text(`Payment Gateway: Secure Online Payment`, margin, currentY);
    currentY += 6;
    doc.text(`Status: ${transaction.status.toUpperCase()}`, margin, currentY);

    // Additional Notes Section (if any)
    if (payment.remarks) {
        currentY += 15;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 8;
        
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes', margin, currentY);
        
        currentY += 7;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const remarksLines = doc.splitTextToSize(payment.remarks, pageWidth - 2 * margin);
        doc.text(remarksLines, margin, currentY);
        currentY += remarksLines.length * 5;
    }

    // Footer
    const footerY = pageHeight - 30;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your payment!', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, footerY + 14, { align: 'center' });
    
    doc.setFontSize(7);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, footerY + 20, { align: 'center' });

    // Save the PDF
    const filename = `Receipt_${payment.payment_number}_${Date.now()}.pdf`;
    doc.save(filename);
}

/**
 * Generate invoice for a payment with transaction
 */
export function downloadInvoice(
    payment: PaymentWithTransaction,
    transaction: Transaction,
    userInfo: { name: string; email: string; phone?: string }
): void {
    try {
        generateInvoicePDF({ payment, transaction, userInfo });
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw new Error('Failed to generate invoice');
    }
}
