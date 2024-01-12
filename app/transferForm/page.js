"use client"
import { useState, useEffect } from 'react';
import styles from '../style/transferForm.module.css'
import accounting from 'accounting'
import braintree from 'braintree-web'

const Home = () => {
  const [amount, setAmount] = useState('');
  const [clientToken, setClientToken] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferId, setTransferId] = useState('');
  const [visible, setVisible] = useState(false)
  const [refundMessage, setRefundMessage] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const handleAmountChange = (e) => {
    const value = e.target.value;

    setAmount(value)
  }
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setRecipientEmail(value);
  }

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

  const handleTransfer = async (nonce) => {
    try {
      console.log('token_nonce', nonce)
      const response = await fetch('/api/braintreeConfig/processTransfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nonce, amount, recipientEmail }),
      });

      if (response.ok) {
        const data =  await response.json();
        console.log('Transfer successful!');
        setTransferId(data.transactionId);
        // Handle success, update UI, etc.
      } else {
        console.error('Transfer failed. Please check your information and try again.');
        // Handle failure, display error message, etc.
      }
    } catch (error) {
      console.error('Error initiating transfer:', error);
    }
  };

  const tokenizePaymentInfo = () => {
    return new Promise((resolve, reject) => {
      // Use Braintree's client SDK to tokenize the payment information
      braintree.client.create(
        {
          authorization: clientToken,
        },
        (clientErr, clientInstance) => {
          if (clientErr) {
            reject(clientErr);
            return;
          }

          clientInstance.request({
            endpoint: 'payment_methods/credit_cards',
            method: 'post',
            data: {
              creditCard: {
                number: '4111111111111111',
                expirationDate: '10/23',
              },
            },
          }, (tokenizeErr, payload) => {
            if (tokenizeErr) {
              // Handle tokenize error
              console.error('Tokenization error:', tokenizeErr);
              return;
            }
        
            // Handle successful tokenization
            console.log('Nonce:', payload.creditCards[0].nonce);
            const nonce = payload.creditCards[0].nonce

            //Send to server
            handleTransfer(nonce)
          });
        }
      );
    });
  };

  const handleVisibleState = () => {
    setVisible(true);
  }

  const handleIdChange = (e) => {
    const value = e.target.value;
    setTransactionId(value);
  }

  const handleRefund = async () => {
    try{
      const response = await fetch('/api/braintreeConfig/paymentRefund', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({transactionId,amount})
      })

      if (response.ok){
        const data = await response.json();
        console.log('Transaction ID sent to the server successfully')
        setRefundMessage(data.refundId)
      } else {
        console.error('There was an error sending the transsaction ID to the server')
      }
    } catch (error) {
      console.error(`Some form of error occured: ${error}`)
    }
  }

  return (
    <div className={styles.main}>
      <h1>Transfer Page</h1>
      <div className={styles.form}>
        <div clasName={styles.formBody}>
            <div className={styles.amount}>
                <h3>
                    Amount:
                </h3>
                <input type="number" value={amount} placeholder="$0.00" onChange={handleAmountChange} />
            </div>
           <div className={styles.email}>
                <h3>
                    Recipient Email:
                </h3>
                <input type="email" value={recipientEmail} placeholder="Enter recipient's email" onChange={handleEmailChange} />
           </div>
        </div>
        <button onClick={tokenizePaymentInfo}>Initiate Transfer</button>
      </div>
      {transferId && <div>Transfer Succefull!! TransactionID: {transferId}</div>}
      <button className={styles.button} onClick={handleVisibleState}>Make Refund</button>
      { visible &&
        <div className={styles.visibleForm}>
          <div>
            <h3>
                Transaction ID:
            </h3>
            <input type="text" value={transactionId} placeholder="Transction ID" onChange={handleIdChange} />
            <div className={styles.amount}>
                <h3>
                    Amount:
                </h3>
                <input type="number" value={amount} placeholder="$0.00" onChange={handleAmountChange} />
            </div>
          </div>
          <button onClick={handleRefund}>Initiate Refund</button>
        </div>
      }
      {refundMessage && <div> Refund Successful!! RefundID: {refundMessage}</div>}
    </div>
  );
};

export default Home;
