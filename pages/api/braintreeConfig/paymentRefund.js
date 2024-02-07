import braintree from 'braintree';

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, // Use Sandbox for testing, change to Production in a live environment
  merchantId: process.env.MerchantId,
  publicKey: process.env.PublicKey,
  privateKey: process.env.PrivateKey,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transactionId, amount } = req.body;
  // console.log(transactionId)
  // console.log(amount)

  try {
    const result = await gateway.transaction.refund(transactionId, amount);

    if (result.success) {
      console.log('Refund ID:', result.transaction.id);
      // Handle success, update database, send confirmation, etc.
      res.status(200).json({ success: true, refundId: result.transaction.id });
    } else {
      console.error('Refund failed:', result.message);
      // Handle failure, send error response, etc.
      res.status(400).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    if (error.type === 'notFoundError') {
      // Handle specific notFoundError
      res.status(404).json({ success: false, error: 'Transaction ID not found' });
    } else {
      // Handle other errors
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}
