export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse the webhook notification
      const notification = req.body;
      // console.log('Parsed Webhook Notification:', notification);

      // Handle the webhook payload without verifying the signature
      // console.log('Webhook Event Type:', notification.kind);
      // console.log('Webhook Payload:', notification);

      // Add your custom logic to handle different webhook events
      let customResponseMessage;

      if (notification.kind === 'TRANSACTION_CREATED') {
        console.log("Transaction successful from webhook")
       // Simulate a failed refund (for testing purposes)
        if (notification.transaction.status === 'FAILED') {
          console.log('Refund failed. Handle accordingly.');
          customResponseMessage = 'Refund failed!';
        } else {
          console.log('Refund successful. Handle accordingly.');
          customResponseMessage = 'Refund processed successfully!';
        }
      }

      res.status(200).json({ message: customResponseMessage, payload: notification });
    } catch (error) {
      console.error('Error processing Braintree webhook:', error);
      res.status(500).end('Internal Server Error');
    }
  } else if (req.method === 'GET') {
    console.log('Received GET request');
    console.log('Environment Variables:', process.env);
    res.status(200).json({ message: 'Hello from the GET endpoint!' });
  } else {
    res.setHeader('Allow', 'POST, GET');
    res.status(405).end('Method Not Allowed');
  }
}
