import React, { useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import Invoice from '@/components/invoice/Invoice';
import { mockOrders } from '@/data/mockData';
import { toast } from 'sonner';

const InvoicePage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Check if coming from checkout (new order)
  const isNewOrder = location.state?.fromCheckout;
  const newOrderData = location.state?.orderData;

  // Find the order from mock data or use new order data
  const order = newOrderData || mockOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Invoice not found
          </h2>
          <p className="text-muted-foreground mb-6">
            The invoice you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/orders')} className="rounded-full">
            View Orders
          </Button>
        </div>
      </Layout>
    );
  }

  const generateInvoiceNumber = (orderId: string, date: string) => {
    const dateStr = new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
    return `INV-${dateStr}-${orderId.toUpperCase()}`;
  };

  const invoiceData = {
    invoiceNumber: generateInvoiceNumber(order.id, order.createdAt),
    orderDate: order.createdAt,
    items: order.items,
    subtotal: order.total - 40 - Math.round((order.total - 40) * 0.05),
    deliveryFee: 40,
    tax: Math.round((order.total - 40) * 0.05),
    total: order.total,
    customerName: newOrderData?.customerName || 'John Doe',
    customerEmail: newOrderData?.customerEmail || 'john.doe@email.com',
    customerPhone: newOrderData?.customerPhone || '+91 98765 43210',
    deliveryAddress: order.address,
    paymentMethod: newOrderData?.paymentMethod || 'UPI',
    orderId: order.id,
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    toast.loading('Generating PDF...');

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);

      toast.dismiss();
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FitEats Invoice - ${invoiceData.invoiceNumber}`,
          text: `Invoice for order ${order.id.toUpperCase()} - Total: ₹${order.total}`,
          url: window.location.href,
        });
      } catch (error) {
        toast.error('Unable to share');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Invoice link copied to clipboard!');
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12 print:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isNewOrder ? navigate('/orders') : navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                <span className="text-gradient-warm">Invoice</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                {invoiceData.invoiceNumber}
              </p>
            </div>
          </div>

          {isNewOrder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-success/10 border border-success/20"
            >
              <p className="text-success font-medium">
                ✓ Order placed successfully! Your invoice is ready.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8 print:hidden"
        >
          <Button
            onClick={handleDownloadPDF}
            className="gap-2 rounded-full btn-soft"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2 rounded-full"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2 rounded-full"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </motion.div>

        {/* Invoice Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Invoice ref={invoiceRef} {...invoiceData} />
        </motion.div>

        {/* Back to Orders */}
        <div className="mt-8 text-center print:hidden">
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
            className="rounded-full"
          >
            View All Orders
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-container, #invoice-container * {
            visibility: visible;
          }
          #invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default InvoicePage;
