
# Fixing Cookie Issues in Cross-Origin Requests

When you make an API request from your frontend (running on `http://localhost:3000`) to your backend, the browser enforces security restrictions that prevent cookies from being automatically set from cross-origin responses unless properly configured.

## Why Your Cookies Aren't Being Set

Your frontend is making a request to the backend using Axios and the backend is setting a cookie with `res.cookie("uid", token)`. However, the browser is blocking this cookie due to:

- Different origins/ports between frontend and backend
- The request not being configured to include credentials
- The backend not setting the appropriate CORS headers

## How to Fix It

### 1. Update Axios Request in the Frontend

```js
await axios.post("http://localhost:3000/user/login", {
  email: formData.email,
  password: formData.password,
}, {
  withCredentials: true  // Critical for cookies to be set
});
```

### 2. Configure Backend CORS Settings

```js
// In your Express app setup
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL (assuming you're using Vite)
  credentials: true  // Allows cookies to be sent and received
}));
```

### 3. Set Correct Cookie Options in the Backend

```js
res.cookie("uid", token, {
  httpOnly: true,
  sameSite: 'lax', // or 'none' if using HTTPS
  secure: process.env.NODE_ENV === 'production', // true in production
  maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
});
```

**Note:** If your frontend and backend are on different domains or ports, be especially careful with `SameSite` and `Secure` attributes. For development, the above settings should work.

## Additional Note

Make sure you're not calling both `res.status(404).json()` and `res.redirect()` in your backend login handler, as only one response can be sent per request.
