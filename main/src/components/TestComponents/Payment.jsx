// Payment.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        payment_method: paymentMethod,
        amount: parseFloat(amount),
        currency: 'USD'
      };

      // Add method-specific data
      if (paymentMethod === 'mpesa') {
        paymentData.phone = phone;
      }

      const response = await axios.post('/api/payments/create/', paymentData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (paymentMethod === 'stripe') {
        // Handle Stripe payment
        await handleStripePayment(response.data);
      } else if (paymentMethod === 'mpesa') {
        // Handle M-Pesa payment
        await handleMpesaPayment(response.data);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async (paymentData) => {
    // This will be implemented in StripeForm component
    console.log('Stripe payment data:', paymentData);
  };

  const handleMpesaPayment = async (paymentData) => {
    // Poll for M-Pesa payment status
    const checkPaymentStatus = async (paymentId) => {
      try {
        const response = await axios.get(`/api/payments/${paymentId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.status === 'completed') {
          alert('M-Pesa payment completed successfully!');
          return true;
        } else if (response.data.status === 'failed') {
          alert('M-Pesa payment failed');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error checking payment status:', error);
        return false;
      }
    };

    // Poll every 5 seconds for 2 minutes
    const paymentId = paymentData.payment_id;
    let attempts = 0;
    const maxAttempts = 24; // 2 minutes
    
    const pollInterval = setInterval(async () => {
      attempts++;
      const isComplete = await checkPaymentStatus(paymentId);
      
      if (isComplete || attempts >= maxAttempts) {
        clearInterval(pollInterval);
        if (attempts >= maxAttempts) {
          alert('Payment timeout. Please check your phone.');
        }
      }
    }, 5000);
  };

  return (
    <div className="payment-container">
      <h2>Make a Payment</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <div className="form-group">
          <label>Payment Method:</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="stripe">Credit/Debit Card (Stripe)</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bitcoin">Bitcoin</option>
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* M-Pesa Phone Number */}
        {paymentMethod === 'mpesa' && (
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XXXXXXXX"
              required
            />
          </div>
        )}

        {/* Stripe Card Elements */}
        {paymentMethod === 'stripe' && (
          <Elements stripe={stripePromise}>
            <StripeForm amount={amount} />
          </Elements>
        )}

        {/* Bitcoin Payment */}
        {paymentMethod === 'bitcoin' && (
          <div className="bitcoin-info">
            <p>Bitcoin payment details will be shown after initiation.</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
      </form>
    </div>
  );
};

export default Payment;