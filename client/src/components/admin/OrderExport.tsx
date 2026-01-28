import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

// Mock orders data for export
const mockOrdersForExport = [
  {
    id: 'ORD001',
    date: '2024-12-24',
    customer: 'Rahul Sharma',
    email: 'rahul@example.com',
    items: 'Grilled Chicken Quinoa Bowl (2), Salmon Poke Bowl (1)',
    total: 1047,
    status: 'Delivered',
    paymentMethod: 'UPI',
    address: '123 Health Street, Wellness City',
  },
  {
    id: 'ORD002',
    date: '2024-12-24',
    customer: 'Priya Patel',
    email: 'priya@example.com',
    items: 'Vegan Buddha Bowl (1)',
    total: 279,
    status: 'Out for Delivery',
    paymentMethod: 'Card',
    address: '456 Green Avenue, Eco Town',
  },
  {
    id: 'ORD003',
    date: '2024-12-23',
    customer: 'Amit Singh',
    email: 'amit@example.com',
    items: 'Mediterranean Wrap (2), Keto Salad (1)',
    total: 797,
    status: 'Preparing',
    paymentMethod: 'Cash',
    address: '789 Fitness Lane, Health District',
  },
  {
    id: 'ORD004',
    date: '2024-12-23',
    customer: 'Sneha Gupta',
    email: 'sneha@example.com',
    items: 'Green Detox Smoothie Bowl (2)',
    total: 458,
    status: 'Pending',
    paymentMethod: 'UPI',
    address: '321 Organic Street, Fresh Town',
  },
  {
    id: 'ORD005',
    date: '2024-12-22',
    customer: 'Karan Mehta',
    email: 'karan@example.com',
    items: 'Spicy Thai Basil Chicken (1)',
    total: 329,
    status: 'Delivered',
    paymentMethod: 'Card',
    address: '555 Spice Road, Flavor City',
  },
];

type ExportField = 'id' | 'date' | 'customer' | 'email' | 'items' | 'total' | 'status' | 'paymentMethod' | 'address';

const fieldLabels: Record<ExportField, string> = {
  id: 'Order ID',
  date: 'Date',
  customer: 'Customer Name',
  email: 'Email',
  items: 'Items',
  total: 'Total Amount',
  status: 'Status',
  paymentMethod: 'Payment Method',
  address: 'Delivery Address',
};

const OrderExport: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<ExportField[]>([
    'id',
    'date',
    'customer',
    'items',
    'total',
    'status',
  ]);

  const allFields: ExportField[] = ['id', 'date', 'customer', 'email', 'items', 'total', 'status', 'paymentMethod', 'address'];

  const toggleField = (field: ExportField) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const getFilteredOrders = () => {
    let orders = [...mockOrdersForExport];

    // Filter by status
    if (statusFilter !== 'all') {
      orders = orders.filter((o) => o.status.toLowerCase() === statusFilter);
    }

    // Filter by date range
    const today = new Date();
    if (dateRange === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      orders = orders.filter((o) => o.date === todayStr);
    } else if (dateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      orders = orders.filter((o) => new Date(o.date) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      orders = orders.filter((o) => new Date(o.date) >= monthAgo);
    } else if (dateRange === 'custom' && startDate && endDate) {
      orders = orders.filter((o) => o.date >= startDate && o.date <= endDate);
    }

    return orders;
  };

  const exportToCSV = () => {
    const orders = getFilteredOrders();
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    // Create CSV header
    const headers = selectedFields.map((f) => fieldLabels[f]).join(',');

    // Create CSV rows
    const rows = orders.map((order) =>
      selectedFields
        .map((field) => {
          const value = order[field];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success(`Exported ${orders.length} orders to CSV`);
  };

  const exportToPDF = () => {
    const orders = getFilteredOrders();
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Report', pageWidth / 2, 20, { align: 'center' });

    // Subtitle with date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, 28, {
      align: 'center',
    });

    // Summary
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    doc.setFontSize(12);
    doc.text(`Total Orders: ${orders.length}`, 14, 40);
    doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString()}`, 14, 48);

    // Table Header
    let yPos = 60;
    doc.setFillColor(59, 130, 246);
    doc.rect(14, yPos - 6, pageWidth - 28, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');

    const colWidths = [25, 25, 35, 60, 25, 25];
    const tableFields: ExportField[] = ['id', 'date', 'customer', 'items', 'total', 'status'];
    let xPos = 14;
    tableFields.forEach((field, i) => {
      doc.text(fieldLabels[field], xPos + 2, yPos);
      xPos += colWidths[i];
    });

    // Table Rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    yPos += 10;

    orders.forEach((order, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(14, yPos - 5, pageWidth - 28, 8, 'F');
      }

      xPos = 14;
      tableFields.forEach((field, i) => {
        let value = String(order[field]);
        if (field === 'total') value = `₹${order.total}`;
        if (field === 'items') value = value.substring(0, 30) + (value.length > 30 ? '...' : '');
        doc.text(value, xPos + 2, yPos);
        xPos += colWidths[i];
      });

      yPos += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('NutriFood - Order Export Report', pageWidth / 2, 290, { align: 'center' });

    // Download
    doc.save(`orders_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success(`Exported ${orders.length} orders to PDF`);
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }

    setIsExporting(false);
  };

  const filteredOrderCount = getFilteredOrders().length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Export Orders</h2>
        <p className="text-sm text-muted-foreground">
          Download order data for accounting and reporting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Export Settings</CardTitle>
            <CardDescription>Configure your export options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Export Format</Label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExportFormat('csv')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    exportFormat === 'csv'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <FileSpreadsheet
                    className={`w-8 h-8 mx-auto mb-2 ${
                      exportFormat === 'csv' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <p className="font-medium">CSV</p>
                  <p className="text-xs text-muted-foreground">For spreadsheets</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExportFormat('pdf')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <FileText
                    className={`w-8 h-8 mx-auto mb-2 ${
                      exportFormat === 'pdf' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <p className="font-medium">PDF</p>
                  <p className="text-xs text-muted-foreground">For reports</p>
                </motion.button>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Date Range</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['today', 'week', 'month', 'custom'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                    className="capitalize"
                  >
                    {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : range}
                  </Button>
                ))}
              </div>
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Order Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field Selection (CSV only) */}
            {exportFormat === 'csv' && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Fields to Export</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allFields.map((field) => (
                    <div
                      key={field}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <label
                        htmlFor={field}
                        className="text-sm cursor-pointer select-none"
                      >
                        {fieldLabels[field]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Summary</CardTitle>
            <CardDescription>Review before exporting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-3 mb-4">
                {exportFormat === 'csv' ? (
                  <FileSpreadsheet className="w-10 h-10 text-primary" />
                ) : (
                  <FileText className="w-10 h-10 text-primary" />
                )}
                <div>
                  <p className="font-medium">
                    {exportFormat === 'csv' ? 'CSV Export' : 'PDF Report'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredOrderCount} orders
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <Badge variant="secondary">{exportFormat.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date Range</span>
                  <Badge variant="secondary" className="capitalize">
                    {dateRange === 'week'
                      ? 'Last 7 Days'
                      : dateRange === 'month'
                      ? 'Last 30 Days'
                      : dateRange}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="capitalize">
                    {statusFilter}
                  </Badge>
                </div>
                {exportFormat === 'csv' && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fields</span>
                    <Badge variant="secondary">{selectedFields.length} selected</Badge>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting || filteredOrderCount === 0}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {filteredOrderCount} Orders
                </>
              )}
            </Button>

            {filteredOrderCount === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No orders match your filters
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Exports</CardTitle>
          <CardDescription>Your export history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'orders_export_2024-12-23.csv', date: '23 Dec 2024', size: '12 KB', count: 45 },
              { name: 'orders_report_2024-12-20.pdf', date: '20 Dec 2024', size: '156 KB', count: 128 },
              { name: 'orders_export_2024-12-15.csv', date: '15 Dec 2024', size: '8 KB', count: 32 },
            ].map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {file.name.endsWith('.csv') ? (
                    <FileSpreadsheet className="w-8 h-8 text-green-500" />
                  ) : (
                    <FileText className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.date} • {file.size} • {file.count} orders
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderExport;
