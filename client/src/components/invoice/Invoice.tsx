import React, { forwardRef } from 'react';
import { Flame, Leaf, Check, Building2, Phone, Mail, Globe } from 'lucide-react';

interface InvoiceItem {
  id: string;
  food: {
    name: string;
    price: number;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    isDiabeticSafe?: boolean;
    isVegan?: boolean;
  };
  quantity: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  orderDate: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  orderId: string;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(
  (
    {
      invoiceNumber,
      orderDate,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      paymentMethod,
      orderId,
    },
    ref
  ) => {
    const totalNutrition = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.food.nutrition.calories * item.quantity,
        protein: acc.protein + item.food.nutrition.protein * item.quantity,
        carbs: acc.carbs + item.food.nutrition.carbs * item.quantity,
        fat: acc.fat + item.food.nutrition.fat * item.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const gstAmount = Math.round(tax * 0.5);
    const cgst = gstAmount;
    const sgst = gstAmount;

    return (
      <div
        ref={ref}
        className="invoice-container"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          padding: '48px',
          maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                FE
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                  FitEats
                </h1>
                <p style={{ margin: 0, fontSize: '13px', color: '#666', marginTop: '2px' }}>
                  Healthy Food Delivery
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'inline-block',
              padding: '8px 20px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              letterSpacing: '0.5px'
            }}>
              TAX INVOICE
            </div>
          </div>
        </div>

        {/* Company & Invoice Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Building2 style={{ width: '16px', height: '16px', color: '#FF6B35' }} />
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</h3>
            </div>
            <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.8' }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>FitEats Pvt. Ltd.</p>
              <p style={{ margin: 0 }}>123 Wellness Tower, Health District</p>
              <p style={{ margin: 0 }}>Mumbai, Maharashtra 400001</p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <Phone style={{ width: '12px', height: '12px', color: '#888' }} /> +91 98765 43210
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail style={{ width: '12px', height: '12px', color: '#888' }} /> support@fiteats.com
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe style={{ width: '12px', height: '12px', color: '#888' }} /> www.fiteats.com
              </p>
              <p style={{ margin: 0, marginTop: '12px', fontSize: '11px', color: '#888', fontWeight: '500' }}>GSTIN: 27AABCF1234M1Z5</p>
            </div>
          </div>

          <div style={{ 
            padding: '20px', 
            borderRadius: '12px', 
            backgroundColor: '#f8f9fa',
            border: '1px solid #eee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Invoice No:</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{invoiceNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Order ID:</span>
              <span style={{ fontWeight: '500', color: '#1a1a1a', fontFamily: 'monospace' }}>{orderId.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Date:</span>
              <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{formatDate(orderDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#666' }}>Payment:</span>
              <span style={{ fontWeight: '500', color: '#1a1a1a', textTransform: 'capitalize' }}>{paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ 
          marginBottom: '32px', 
          padding: '20px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 142, 83, 0.04) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.15)'
        }}>
          <h3 style={{ margin: 0, marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill To</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{customerName}</p>
            <p style={{ margin: 0, color: '#555' }}>{deliveryAddress}</p>
            <p style={{ margin: 0, color: '#555' }}>{customerPhone}</p>
            <p style={{ margin: 0, color: '#555' }}>{customerEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: '600', color: 'white', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>#</th>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: '600', color: 'white', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: '600', color: 'white', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontWeight: '600', color: 'white', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontWeight: '600', color: 'white', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                  <td style={{ padding: '16px', color: '#888', fontWeight: '500' }}>{index + 1}</td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{item.food.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          fontSize: '11px', 
                          color: '#666',
                          backgroundColor: '#f5f5f5',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}>
                          <Flame style={{ width: '11px', height: '11px', color: '#FF6B35' }} />
                          {item.food.nutrition.calories} kcal
                        </span>
                        {item.food.isDiabeticSafe && (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px', 
                            fontSize: '10px', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                            color: '#16a34a',
                            fontWeight: '500'
                          }}>
                            <Check style={{ width: '10px', height: '10px' }} />
                            Safe
                          </span>
                        )}
                        {item.food.isVegan && (
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px', 
                            fontSize: '10px', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                            color: '#16a34a',
                            fontWeight: '500'
                          }}>
                            <Leaf style={{ width: '10px', height: '10px' }} />
                            Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: '500', color: '#1a1a1a' }}>{item.quantity}</td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#555' }}>₹{item.food.price}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#1a1a1a' }}>
                    ₹{item.food.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Nutrition Summary */}
          <div style={{ 
            padding: '20px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 142, 83, 0.04) 100%)',
            border: '1px solid rgba(255, 107, 53, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Flame style={{ width: '16px', height: '16px', color: '#FF6B35' }} />
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nutrition Summary</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Calories</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#FF6B35' }}>{totalNutrition.calories} kcal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Protein</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a' }}>{totalNutrition.protein}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Carbs</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#8b5cf6' }}>{totalNutrition.carbs}g</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Fat</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#f97316' }}>{totalNutrition.fat}g</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f8f9fa', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span style={{ fontWeight: '500', color: '#1a1a1a' }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#666' }}>Delivery Fee</span>
              <span style={{ fontWeight: '500', color: '#1a1a1a' }}>₹{deliveryFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px 0' }}>
              <span style={{ color: '#888' }}>CGST (2.5%)</span>
              <span style={{ fontWeight: '500', color: '#666' }}>₹{cgst}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#888' }}>SGST (2.5%)</span>
              <span style={{ fontWeight: '500', color: '#666' }}>₹{sgst}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0 0', marginTop: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#FF6B35' }}>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          paddingTop: '24px', 
          borderTop: '2px solid #f0f0f0', 
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
            Thank you for choosing FitEats! 🥗
          </p>
          <p style={{ margin: 0, marginBottom: '12px', fontSize: '12px', color: '#888' }}>
            This is a computer-generated invoice and does not require a signature.
          </p>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '16px', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            backgroundColor: '#f8f9fa',
            fontSize: '11px',
            color: '#666'
          }}>
            <span>📧 support@fiteats.com</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span>📞 +91 98765 43210</span>
            <span style={{ color: '#ddd' }}>|</span>
            <span>🌐 www.fiteats.com</span>
          </div>
        </div>
      </div>
    );
  }
);

Invoice.displayName = 'Invoice';

export default Invoice;
