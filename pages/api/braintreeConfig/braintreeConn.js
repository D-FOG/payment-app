// pages/api/braintree.js
import { getSession } from 'next-auth/react';
import braintree from 'braintree';

export default async function handler(req, res) {
  const session = await getSession({ req });

  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Change to Production for live environment
    merchantId: process.env.MerchantId,
    publicKey: process.env.PublicKey,
    privateKey: process.env.PrivateKey,
  });

  const clientToken = await gateway.clientToken.generate();

  console.log(clientToken)


  res.status(200).json({clientToken: clientToken.clientToken});
}
