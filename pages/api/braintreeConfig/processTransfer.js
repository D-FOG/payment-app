import braintree from 'braintree'

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Use Sandbox for testing, change to Production in a live environment
    merchantId: process.env.MerchantId,
    publicKey: process.env.PublicKey,
    privateKey: process.env.PrivateKey,
  });

export default async function handler(req, res) {
    if (req.method !== 'POST'){
        return res.status(405).json({error: 'Method not allowed'})
    }

    const { nonce, amount, recipientEmail } = req.body;
    try{
        const result = await gateway.transaction.sale({
            amount,
            paymentMethodNonce: nonce, // Replace with the actual nonce from the client
            options: {
              submitForSettlement: true,
            },
            customer: {
              email: recipientEmail,
            },
          });

          if (result.success) {
            console.log('Transaction ID:', result.transaction.id);
            // Handle success, update database, send confirmation, etc.
            res.status(200).json({ success: true, transactionId: result.transaction.id });
          } else {
            console.error('Transaction failed:', result.message);
            // Handle failure, send error response, etc.
            res.status(500).json({ success: false, error: result.message });
          }
    } catch (error) {
      console.error('Error processing transfer:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
}