"use client"
// pages/payment.js
import { useState, useEffect } from 'react';
import styles from '../style/pages.module.css'
import DropIn from 'braintree-web-drop-in';
import '../style/dropin.css'
import accounting from 'accounting'


const PaymentPage = () => {
   const [paymentResult, setPaymentResult] = useState('');
   const [clientToken, setClientToken] = useState('');
   const [dropInInstance, setDropInInstance] = useState(null);
   const [amount, setAmount] = useState('')

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await fetch('/api/braintreeConfig/braintreeConn'); // Adjust the path based on your API route
        const data = await response.json();
        setClientToken(data.clientToken);
      } catch (error) {
        console.error('Error fetching Braintree client token:', error);
      }
    };

    fetchClientToken();
  }, []);

  console.log(clientToken)

  useEffect(() => {
    if (clientToken) {
      // Initialize DropIn instance when clientToken is available
      DropIn.create(
        {
          authorization: clientToken,
          container: '#dropin-container', // Specify the container element
        },
        (error, instance) => {
          if (error) {
            console.error('Error creating DropIn instance:', error);
            return;
          }
          setDropInInstance(instance);
        }
      );
    }
  }, [clientToken]);

  
  const handlePayment = async () => {
    try {
      if (!dropInInstance) {
        console.error('DropIn instance not available');
        return;
      }

      const { nonce } = await dropInInstance.requestPaymentMethod();
      // Send the nonce to your server for payment processing
      await sendPaymentToServer(nonce);
      setPaymentResult('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentResult('Payment failed. Please check your information and try again.');
    }
  };

  const sendPaymentToServer = async (nonce) => {
    try {
      const response = await fetch('/api/braintreeConfig/paymentProcess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonce,
          amount
        }),
      });

      if (response.ok) {
        // Payment successful, handle accordingly
        setPaymentResult('Payment successful!');
      } else {
        // Payment failed, handle accordingly
        setPaymentResult('Payment failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error sending payment to server:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    const formattedValue = accounting.formatMoney(numericValue / 100, '$', 2);

    setAmount(formattedValue)
  }
  console.log(amount)
  return (
    <div>
      {clientToken ? (
        <div id="dropin-container"></div>
      ) : (
        <div>Loading...</div>
      )}
      {/* Additional form fields */}
      <div className={styles.main}>
        <input type='text' value={amount} placeholder='$0.00' onChange={handleInputChange} required/>
        <button className={styles.button} onClick={handlePayment} disabled={!clientToken}>
          Submit Payment
        </button>
      </div>
      <div>{paymentResult}</div>
    </div>

    
  );
};

export default PaymentPage;


