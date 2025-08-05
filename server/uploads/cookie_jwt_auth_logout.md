# 🍪 JWT with Cookies: Auth & Logout Explained

## ✅ Why Use Cookies for JWT?

- HttpOnly cookies are secure — JavaScript cannot access them
- Perfect for session-like authentication with stateless JWTs
- Backend auto-reads the cookie from `req.cookies`

---

## 🔐 1. Setting the Cookie (on Login or OTP Verification)

```js
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: true,           // Use 'true' in production (HTTPS)
  sameSite: 'Strict',     // or 'Lax' based on frontend/backend domains
  maxAge: 15 * 60 * 1000  // 15 minutes
});
```

---

## 🚪 2. Logging Out (Clearing the Cookie)

```js
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  });

  res.json({ message: 'Logged out successfully' });
});
```

---

## ✅ Frontend Logout Flow (React/JS)

```js
axios.post('http://localhost:3000/logout', {
  withCredentials: true // REQUIRED for cookies
}).then(() => {
  window.location.href = '/login'; // or use navigate()
});
```

---

## 🧠 Summary

| Action        | Backend (Express)                         | Frontend (React/JS)                                    |
|---------------|--------------------------------------------|--------------------------------------------------------|
| Set cookie    | `res.cookie('token', jwt, { ... })`        | Handled automatically by browser                      |
| Send request  | Read with `req.cookies` on server          | Use `withCredentials: true` in `axios`                |
| Logout        | `res.clearCookie('token')`                 | Call `/logout` then redirect                          |

---

## 🧪 Bonus: CORS Config for Credentials

```js
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true
}));
```

---

## 🔧 Useful Middleware (cookie-parser)

```bash
npm install cookie-parser
```

```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

---

## 🛡️ Pro Tip

For production:
- Always use `secure: true` (HTTPS only)
- Consider refresh tokens with rotation