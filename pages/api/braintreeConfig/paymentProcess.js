// pages/api/processPayment.js

import braintree from 'braintree';

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MerchantId,
  publicKey: process.env.PublicKey,
  privateKey: process.env.PrivateKey,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nonce, amount:amountValue } = req.body;
  console.log(nonce, amountValue);
  const extractAmount = amountValue.match(/\d+/);
  const amount = extractAmount ? parseInt(extractAmount[0], 10) : null;
  console.log(amount)

  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      res.status(200).json({ success: true });
    } else {
      console.error('Transaction failed:', result.message);
      res.status(500).json({ error: 'Transaction failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
