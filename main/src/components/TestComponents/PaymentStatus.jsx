// PaymentStatus.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentStatus = ({ paymentId }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/payments/${paymentId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPayment(response.data);
      } catch (error) {
        console.error('Error fetching payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
    
    // Poll for status updates if payment is pending
    if (!payment || payment.status === 'pending') {
      const interval = setInterval(fetchPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [paymentId, payment]);

  if (loading) return <div>Loading payment status...</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'failed': return 'red';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="payment-status">
      <h3>Payment Status</h3>
      {payment && (
        <div className={`status ${payment.status}`}>
          <p>
            <strong>Amount:</strong> ${payment.amount} {payment.currency}
          </p>
          <p>
            <strong>Method:</strong> {payment.payment_method}
          </p>
          <p>
            <strong>Status:</strong> 
            <span style={{color: getStatusColor(payment.status)}}>
              {payment.status}
            </span>
          </p>
          <p>
            <strong>Transaction ID:</strong> {payment.transaction_id}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;