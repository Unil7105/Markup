# 🔁 JWT-Based Password Reset Flow with Token Validation

## ✅ Why Use JWT for Password Reset?

| ✅ Pros                             | 🛑 Cons (Mitigated with Expiry)     |
|------------------------------------|-------------------------------------|
| No need to store token in DB       | If token is leaked, can be reused   |
| Easy to verify + decode            | Needs a short expiry (15–60 mins)   |
| Token contains all needed info     | Must be signed with secret key      |

---

## 🧱 Setup

Install JWT:

```bash
npm install jsonwebtoken
```

Add your `.env`:
```env
JWT_SECRET=your-reset-token-secret
```

---

## 🔁 Flow with JWT as Token

```plaintext
1. User requests password reset → you create a JWT with their email and 15 min expiry
2. Send a link like: /reset-password?token=xxxx
3. User opens the link and enters a new password
4. You verify the token and reset their password
```

---

## 📦 Step-by-Step Code

### ✅ 1. POST `/forgot-password` → Send JWT as Reset Link

```js
const jwt = require('jsonwebtoken');
const User = require('./models/User');

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  console.log(`Reset link to send via email: ${resetLink}`);

  res.json({ message: 'Password reset link sent (simulated)' });
});
```

---

### ✅ 2. POST `/reset-password` → Verify JWT & Set New Password

```js
const bcrypt = require('bcrypt');

app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});
```

---

## ✅ Example Test Flow

1. **POST** `/forgot-password`  
   ```json
   { "email": "user@example.com" }
   ```

2. Copy the token from the console:
   ```
   http://localhost:3000/reset-password?token=eyJhbGciOiJI...
   ```

3. **POST** `/reset-password`  
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR...",
     "newPassword": "supersecure123"
   }
   ```

---

## 🔒 Secure Practices

| Good Practice                    | Code Implemented? |
|----------------------------------|-------------------|
| Token has expiration             | ✅ 15 mins        |
| Secret stored in `.env`          | ✅ Yes            |
| Password is hashed               | ✅ bcrypt         |
| Token is not stored in DB        | ✅ Stateless      |
| Token contains only email (no ID)| ✅ Safe Payload   |

---

## ✅ Reset Link and Token Validation

### Reset Link
```bash
http://localhost:3000/reset-password?token=<JWT_HERE>
```

### Frontend (React)

```js
import { useSearchParams } from 'react-router-dom';
const [searchParams] = useSearchParams();
const token = searchParams.get('token');

axios.post('/reset-password', {
  token,
  newPassword: 'myNewPassword123'
});
```

---

## ✅ Backend: Validating the Token

```js
const jwt = require('jsonwebtoken');

app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});
```

---

## 🔐 What `jwt.verify` Does

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### It checks:
| 🔍 Validation Step   | ✅ |
|----------------------|----|
| Is the signature valid? | Yes |
| Is the token expired?   | Yes |
| Was the token tampered with? | Caught here |
| Is the email still correct? | Yes (from payload) |

---

## ✅ Visual Recap

```
Frontend                     Backend
--------                     -------
1. /forgot-password  ---->   ✔ Generate JWT
                            ✔ Return reset link

2. User clicks link
   /reset-password?token=... 

3. Frontend extracts token
   and submits new password

4. /reset-password  ----->  ✔ Verify token
                            ✔ Reset password
                            ✔ Respond "success"
```

---

## ✅ Key Points to Remember

| Feature                  | What Happens                          |
|--------------------------|----------------------------------------|
| Link structure           | `/reset-password?token=JWT_TOKEN_HERE` |
| Token contents           | `{ email, iat, exp }`                  |
| Token stored?            | ❌ No — it's **stateless**             |
| Token validation         | Done by `jwt.verify()`                 |
| Reset form security      | ✅ Token must be valid & unexpired     |