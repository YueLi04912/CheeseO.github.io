const { onRequest } = require('firebase-functions/v2/https');
const AlipaySdk = require('alipay-sdk').AlipaySdk;

// Alipay Configuration
const alipaySdk = new AlipaySdk({
  appId: '9021000161682492',
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAiz0eoCO7297T9qLvAQ4cb5CkSzyLtp4969g9FokNXBfNoCTA/37NXxfXqubSJLRSpmZkr3fRQObyrKlvmzzSZuFGTGaEIOqONRKf/GF5N7vyyOxyVCb9y4lrEQy0v32yVLqnRrJ4zJSfOE5zY6SRMbctExw4mPd3NZUkB04zbv5P5kgOwjhsNcJpOV7frhYuy74XMeUbNN6utMIK4OzXnLA/qFZkBQGFNRb/xbLgUaUUDwJid8szXziV+5afrCezItu8KQV195OoO2KK2x73DZ1JKHp2Ol1nfE+CIjEX8R80CM3q1VpLlmab8FcBRSMnr2hUzq/uZpkJD0aCu0Zy2QIDAQABAoIBABn7RKyzHknP0ZOTIa/7tximT9HuMU/ZRUqt5fA/kKufkXIRiaXjPmVBKLAuNAY/U7DTKHSJkhVfQucvErFP7x7daGW3N26A9ho3KH1KnvjkbFBLtqW3ROJm+QCMc2nMBavDzJTnlpzuGqvCD8wHGETDnniTaog4nRj1hGyMjhJmwX8EyyYAIiTxY7m/Cj1TSzA3qXH3aMHb158QMViNMq6x6KVKwvZwiSk3kvIoWC+im5zyJVVZZ0Stt6ZbnFjdYsO3ykkfxuLnkgiTIlYFr6BIYruoqnA8/az4IahA9CU4MM+dYGtYN9thTalWgcGxvH+ajt4E2AdOGIxstK5C3AUCgYEAwHFF3HbBMijP7Thp7zi+pI1QmI4VIOT5ZwmgyJQVqhOqaWQToHudDtt3the5OtgxGq+e+VZ8CvyJPupDuBuj3nzdfFhxzZK6hJqqaeCTN/kd2o9WVhcc5cE49csVW7Imf35f6+PvsOHrFyLLHXF5FvLXpULkKqbnQKKicE8S5BcCgYEAuTmM5o95US5N+ORobn5PuI9MXQyBcJUskhHAY7dHGzMOWZSYq8XGsTii0nzmcV7ZtRiC6QaKUybQfhDbm9Y68l9PEyTK1tT11zy2+rVWj5Tylro6q1Qvst0GoBgAPafHvYaC2GODctWeDwlfMbeqWrsJK8wcW+STyatlLzpzho8CgYBRuEhIZI2J9VbGj6w8j8Y1LmVJQxypyVI3dRk309qXTJ6S/pJvFc8OHhhp1Q0tddz0ThueGiG2sKK/es+jAOnHcxLC2PQKrgJSiTNQnrMlk74fr7qj+FCnKDQ9/C1nsPE0NsAY9cQ1QtqICphiOmuHWTxFy3AExLdy9R0xwAJvpQKBgH2Axz35/SPKkj6Q1Un5AB93yTBLJvGXwkl/CbMHHoEJiTGdhAzvx3+RdpHU23f54t3YK+uk6NkKtb6VwZfIAszzU2sPRPln9uPOWdVqRaqoK++BY/tu4Zr6NGEJojAknSyIFeR1GT4YDC74FK5lWmJ71Oz+MkD5kkHVhowHuPt1AoGAI03UAj9GYS7ycKn4EJaIibnDmVjw89IOqweVnTaGj0MIFil9s6hUNn9HIg2ZoONpyQIhtV9TECXanbakNorQ30ANahvLgqPdB9EcVOpQ1S3JQOObFiyfoHBjiOLNBen11txz/J2YisHFAWReeRleS6uyjEUYh112uzidJJ0w3J4=
-----END RSA PRIVATE KEY-----`,
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoA4M33DC6SolzJPlK4Ijz6Q0F0JR5ZszKSZJW2ihZ3+UC+IjvGebx3BRD9Bz+5xZZhlYv+8rs45p7LmXXT/5fKAFqwGn8Ty6isml/3BFFrwJvkzmP4mRizWV7ybEsfeMufwCn8T+Ic58Ta50/oPBeIM98hHxBT8J9M/xVGYvOW6OIDOmUxTJHFtIbtTQtTlfns35c0SqqzazyFMi/Xey8/fKn7t2+FPd/zFojteGkJAUKJbj7QGIgiqR8CgXNH4xH76NR9vv80R1ofZvMsECnsdJ9f72hKi8H8MbnGbar1vB6PlpXmn9tPlWZX+xZ211JuCOyeTXHsFHJ+V0dOf30wIDAQAB',
  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
});

// Use 2nd generation Cloud Function definition (v2)
exports.createAlipayOrder = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { orderId, amount, subject, returnUrl } = req.body;

  try {
    const url = await alipaySdk.pageExec('alipay.trade.page.pay', {
      bizContent: {
        out_trade_no: orderId,
        product_code: 'FAST_INSTANT_TRADE_PAY',
        total_amount: amount,
        subject: subject,
      },
      returnUrl: returnUrl,
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error('Alipay Error:', error);
    res.status(500).json({ error: error.message });
  }
});