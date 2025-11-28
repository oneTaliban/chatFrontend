// StripeForm.jsx
import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const StripeForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post('/api/stripe/create-intent/', {
        amount: parseFloat(amount),
        currency: 'usd'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else {
        alert('Payment successful!');
        // Handle successful payment
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      alert('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <div className="stripe-form">
      <div className="form-group">
        <label>Card Details:</label>
        <CardElement options={cardElementOptions} />
      </div>
      
      <button 
        type="button" 
        onClick={handleSubmit} 
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </div>
  );
};

export default StripeForm;