
### 📘 `uuid` Cheatsheet  
*GitHub: [uuidjs/uuid](https://github.com/uuidjs/uuid)*  
A simple, zero-dependency library for generating RFC4122 UUIDs (v1, v3, v4, v5).

---

## 📦 Installation

```bash
npm install uuid
```

---

## 🛠️ Importing

```js
// ES6
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, NIL as NIL_UUID } from 'uuid';

// CommonJS
const { v1, v3, v4, v5, NIL } = require('uuid');
```

---

## 🧪 UUID Versions

### ✅ `v1()` – Time-based UUID

```js
const id = uuidv1();
console.log(id); // Example: '6f9c1ab0-d3c3-11ec-9d64-0242ac120002'
```

- Includes timestamp and MAC address (or random if not available).
- Useful when order matters.

---

### 🎲 `v4()` – Random UUID

```js
const id = uuidv4();
console.log(id); // Example: '7c9e6679-7425-40de-944b-e07fc1f90ae7'
```

- Completely random.
- Most commonly used UUID type.

---

### 📛 `v3()` – Deterministic (Name + Namespace, MD5)

```js
const uuidv3 = require('uuid').v3;

// DNS Namespace
const DNS_NAMESPACE = uuidv3.DNS;

const id = uuidv3('example.com', DNS_NAMESPACE);
console.log(id); // Always the same for 'example.com'
```

- Uses MD5 hashing.
- Same input returns the same UUID.

---

### 🌐 `v5()` – Deterministic (Name + Namespace, SHA-1)

```js
const uuidv5 = require('uuid').v5;

// URL Namespace
const URL_NAMESPACE = uuidv5.URL;

const id = uuidv5('https://example.com', URL_NAMESPACE);
console.log(id); // Always the same for 'https://example.com'
```

- Similar to v3 but uses SHA-1.
- More secure hashing than v3.

---

## 🆔 NIL UUID (All-zero UUID)

```js
import { NIL as NIL_UUID } from 'uuid';

console.log(NIL_UUID); // '00000000-0000-0000-0000-000000000000'
```

- Useful as a placeholder or default UUID.

---

## 🔍 Validate & Parse (v9.0+)

> For `validate()` and `version()` functions:
```bash
npm install uuid
```

```js
import { validate, version } from 'uuid';

validate('7c9e6679-7425-40de-944b-e07fc1f90ae7'); // true
version('7c9e6679-7425-40de-944b-e07fc1f90ae7'); // 4
```

---

## 🗃️ Predefined Namespaces

```js
import { v3, v5 } from 'uuid';

v3.DNS       // '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
v3.URL       // '6ba7b811-9dad-11d1-80b4-00c04fd430c8'

v5.DNS       // same as above
v5.URL       // same as above
```

---

## 🧪 Test Output Format

All UUIDs are in format:

```
xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
```

- `M` = Version (1, 3, 4, or 5)
- `N` = Variant (usually 8, 9, a, or b)

---

## 📌 Tips

- Use `v4()` for general-purpose unique IDs.
- Use `v1()` if you need ordered IDs (like in databases).
- Use `v3()` / `v5()` when same input should produce same output (like for UUID-based cache keys).
- Do **not** use `v1()` for privacy-sensitive data (includes MAC address/timestamp).
