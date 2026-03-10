/**
 * Alipay Sandbox Payment Service
 * Official Documentation: https://opendocs.alipay.com/open/270/105898
 */

export interface AlipayConfig {
  projectId: string; // Firebase Project ID
  appId: string; // AppID assigned by Alipay
  gatewayUrl: string; // Alipay Gateway URL (Sandbox: https://openapi-alipaydev.com/gateway.do)
  notifyUrl: string; // Path for asynchronous notification from Alipay server
  returnUrl: string; // Path to redirect back to merchant page after successful payment
  merchantPrivateKey: string; // Merchant Private Key (RSA2)
  alipayPublicKey: string; // Alipay Public Key
}

// Configuration for user to fill in (Sandbox environment)
export const alipayConfig: AlipayConfig = {
  projectId: 'cheeseo-f6059',
  appId: '9021000161682492', // Fill in your Sandbox AppID
  gatewayUrl: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  notifyUrl: window.location.origin + '/api/payment/alipay/notify',
  returnUrl: window.location.origin + '/projects',
  merchantPrivateKey: 'MIIEogIBAAKCAQEAiz0eoCO7297T9qLvAQ4cb5CkSzyLtp4969g9FokNXBfNoCTA/37NXxfXqubSJLRSpmZkr3fRQObyrKlvmzzSZuFGTGaEIOqONRKf/GF5N7vyyOxyVCb9y4lrEQy0v32yVLqnRrJ4zJSfOE5zY6SRMbctExw4mPd3NZUkB04zbv5P5kgOwjhsNcJpOV7frhYuy74XMeUbNN6utMIK4OzXnLA/qFZkBQGFNRb/xbLgUaUUDwJid8szXziV+5afrCezItu8KQV195OoO2KK2x73DZ1JKHp2Ol1nfE+CIjEX8R80CM3q1VpLlmab8FcBRSMnr2hUzq/uZpkJD0aCu0Zy2QIDAQABAoIBABn7RKyzHknP0ZOTIa/7tximT9HuMU/ZRUqt5fA/kKufkXIRiaXjPmVBKLAuNAY/U7DTKHSJkhVfQucvErFP7x7daGW3N26A9ho3KH1KnvjkbFBLtqW3ROJm+QCMc2nMBavDzJTnlpzuGqvCD8wHGETDnniTaog4nRj1hGyMjhJmwX8EyyYAIiTxY7m/Cj1TSzA3qXH3aMHb158QMViNMq6x6KVKwvZwiSk3kvIoWC+im5zyJVVZZ0Stt6ZbnFjdYsO3ykkfxuLnkgiTIlYFr6BIYruoqnA8/az4IahA9CU4MM+dYGtYN9thTalWgcGxvH+ajt4E2AdOGIxstK5C3AUCgYEAwHFF3HbBMijP7Thp7zi+pI1QmI4VIOT5ZwmgyJQVqhOqaWQToHudDtt3the5OtgxGq+e+VZ8CvyJPupDuBuj3nzdfFhxzZK6hJqqaeCTN/kd2o9WVhcc5cE49csVW7Imf35f6+PvsOHrFyLLHXF5FvLXpULkKqbnQKKicE8S5BcCgYEAuTmM5o95US5N+ORobn5PuI9MXQyBcJUskhHAY7dHGzMOWZSYq8XGsTii0nzmcV7ZtRiC6QaKUybQfhDbm9Y68l9PEyTK1tT11zy2+rVWj5Tylro6q1Qvst0GoBgAPafHvYaC2GODctWeDwlfMbeqWrsJK8wcW+STyatlLzpzho8CgYBRuEhIZI2J9VbGj6w8j8Y1LmVJQxypyVI3dRk309qXTJ6S/pJvFc8OHhhp1Q0tddz0ThueGiG2sKK/es+jAOnHcxLC2PQKrgJSiTNQnrMlk74fr7qj+FCnKDQ9/C1nsPE0NsAY9cQ1QtqICphiOmuHWTxFy3AExLdy9R0xwAJvpQKBgH2Axz35/SPKkj6Q1Un5AB93yTBLJvGXwkl/CbMHHoEJiTGdhAzvx3+RdpHU23f54t3YK+uk6NkKtb6VwZfIAszzU2sPRPln9uPOWdVqRaqoK++BY/tu4Zr6NGEJojAknSyIFeR1GT4YDC74FK5lWmJ71Oz+MkD5kkHVhowHuPt1AoGAI03UAj9GYS7ycKn4EJaIibnDmVjw89IOqweVnTaGj0MIFil9s6hUNn9HIg2ZoONpyQIhtV9TECXanbakNorQ30ANahvLgqPdB9EcVOpQ1S3JQOObFiyfoHBjiOLNBen11txz/J2YisHFAWReeRleS6uyjEUYh112uzidJJ0w3J4=', // Fill in your Merchant Private Key (RSA2)
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoA4M33DC6SolzJPlK4Ijz6Q0F0JR5ZszKSZJW2ihZ3+UC+IjvGebx3BRD9Bz+5xZZhlYv+8rs45p7LmXXT/5fKAFqwGn8Ty6isml/3BFFrwJvkzmP4mRizWV7ybEsfeMufwCn8T+Ic58Ta50/oPBeIM98hHxBT8J9M/xVGYvOW6OIDOmUxTJHFtIbtTQtTlfns35c0SqqzazyFMi/Xey8/fKn7t2+FPd/zFojteGkJAUKJbj7QGIgiqR8CgXNH4xH76NR9vv80R1ofZvMsECnsdJ9f72hKi8H8MbnGbar1vB6PlpXmn9tPlWZX+xZ211JuCOyeTXHsFHJ+V0dOf30wIDAQAB', // Fill in your Alipay Public Key
};

export const alipayService = {
  /**
   * Initiate Alipay Sandbox payment (via Firebase Cloud Function signature and redirect)
   */
  async initiatePayment(orderId: string, amount: number, subject: string): Promise<boolean> {
    console.log(`[Alipay API] Requesting signature from Firebase Functions for order ${orderId}...`);
    
    // Firebase Cloud Function URL
    const functionUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? `http://127.0.0.1:5001/${alipayConfig.projectId}/us-central1/createAlipayOrder`
      : `https://us-central1-${alipayConfig.projectId}.cloudfunctions.net/createAlipayOrder`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: amount.toFixed(2),
          subject,
          returnUrl: alipayConfig.returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Cloud Function signature failed');
      }

      const { url } = await response.json();

      if (url) {
        console.log('[Alipay API] Form HTML received. Processing redirect...');
        
        // If returning HTML form (default behavior of Alipay SDK)
        if (url.includes('<form') && url.includes('submit()')) {
          // Create a temporary div to hold the form and auto-submit it
          const div = document.createElement('div');
          div.innerHTML = url;
          document.body.appendChild(div);
          const form = div.querySelector('form');
          if (form) {
            form.submit();
          }
          return true;
        }

        // If it's a regular URL, redirect directly
        window.location.href = url;
        return true;
      } else {
        throw new Error('No URL returned from cloud function');
      }
    } catch (error: any) {
      console.error('Alipay Integration Error:', error);
      alert('Payment failed to initiate. Please ensure Firebase Cloud Functions are deployed or the local emulator is running.');
      return false;
    }
  },

  /**
   * Simulate notify logic (for frontend demo)
   */
  async simulateNotify(orderId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[Alipay API] Received success signal for: ${orderId}`);
    return true;
  }
};
