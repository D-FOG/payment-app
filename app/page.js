"use client"
import Image from 'next/image'
import styles from './page.module.css'
//import cardImage from '../public/creditCard.jpg'
import {useRouter} from 'next/navigation'


export default function home() {
  const router = useRouter();
  const handlePaymentRoute = () => {
   router.push('/pageForm');
  }
  const handleTransferRoute = () => {
   router.push('/transferForm');
  }
  return (
    <>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Pay - Go</h2>
          </div>

          <div className={styles.mainMenu}>
            <ul className={styles.menu}>
              <li className={styles.menuItem}>
                <p>Home</p>
              </li>
              <li className={styles.menuItem}>
                <p>Services</p>
              </li>
              <li className={styles.menuItem}>
                <p>Checkout</p>
              </li>
              <li className={styles.menuItem}>
                <p>Contact Us</p>
              </li>
            </ul>
          </div>

        </div>

        <div className={styles.mainBody}>
          <div className={styles.contentOne}>
            <h1>
              Make Payments
            </h1>
            <p>
              Discover a New Era of Payments with Pay-Go! Experience effortless transactions through our intuitive interface, backed by state-of-the-art security protocols that keep your financial information safe. Enjoy instant processing, tailored solutions for your business, and the ability to connect with customers worldwide. Our round-the-clock support is here for you. Embrace the future of seamless and secure payments – join Pay-Go today!
            </p>
            <div className={styles.button}>
              <button onClick={handlePaymentRoute}>Click to Pay</button>
              <button onClick={handleTransferRoute}>Make Transfer</button>
            </div>
          </div>
          <div className={styles.contentTwo}>
            <Image src='/images/creditCard.jpg' alt="payment image" loading="lazy" width={700} height={500} />
          </div>
        </div>
      </div>
      
    </>
  )
}