// pages/api/process-payment.js
//import transporter from './mailerTransporter'
import gateway from './braintreeConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    amount,
    cardholderName,
    cardNumber,
    expirationDate,
    cvv,
    email,
  } = req.body;

  try {
    // Create a transaction using Braintree
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: cardNumber, // For simplicity; use Braintree.js for secure client-side tokenization
      options: {
        submitForSettlement: true, // Set to true to settle the transaction immediately
      },
    });

    if (result.success) {
      // Payment successful
      // You can update user accounts, send confirmation emails, etc.
      const transactionId = result.transaction.id;
      const message = `Payment of $${amount} was successful. Transaction ID: ${transactionId}`;
      sendUserNotification(email, message); // Implement this function to notify users
      
      console.log(res.status(200).json({ success: true, message }));
    } else {
      // Payment failed
      const message = 'Payment failed. Please check your payment details and try again';
      sendUserNotification(email, message);
      console.log(res.status(400).json({ success: false, message: 'Payment failed', errors: result.errors.deepErrors() }));
    }
  } catch (error) {
    console.error(error);
    console.log(res.status(500).json({ success: false, message: 'Internal server error' }));
  }
}

// function sendUserNotification(email, message) {
//     // Implement this function to send notifications to the user via email, SMS, or any other desired method.
//     // Define email content
//     const mailOptions = {
//       from: 'your_email_address',
//       to: email,
//       subject: 'Notification Subject',
//       text: message,
//     };
  
//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Email notification error:', error);
//       } else {
//         console.log('Email notification sent:', info.response);
//       }
//     });
// }