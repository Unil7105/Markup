
# Mongoose Cheat Sheet

Mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js that simplifies schema definitions, data validation, and CRUD operations. This cheat sheet covers the most common commands and additional best practices to help you work more effectively with Mongoose.

---

## 1. Schema Definition

Define your data structure by creating a schema. Schemas allow you to specify field types, default values, and validations.

```js
const { Schema } = require('mongoose');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

**Explanation:**
- **Type and Required:** Specify types and enforce required fields.
- **Unique:** Enforces unique values in the collection.
- **Defaults and Validation:** Provide defaults and simple validations (e.g., `min` for age).

---

## 2. Model Definition

Compile the schema into a model to interact with the corresponding MongoDB collection.

```js
const mongoose = require('mongoose');
const User = mongoose.model('User', userSchema);
```

**Explanation:**
- **Model Creation:** This binds the schema to the MongoDB collection, allowing you to perform CRUD operations.

---

## 3. Creating Documents

You can create new documents using the model. There are multiple ways, including instance creation and bulk inserts.

### Creating a Single Document

```js
const user = new User({
  name: 'John Doe',
  email: 'johndoe@example.com',
  age: 30
});

user.save()
  .then(savedUser => console.log(savedUser))
  .catch(err => console.error(err));
```

### Creating Multiple Documents

```js
User.insertMany([
  { name: 'Alice', email: 'alice@example.com', age: 25 },
  { name: 'Bob', email: 'bob@example.com', age: 28 }
])
.then(users => console.log(users))
.catch(err => console.error(err));
```

---

## 4. Querying Documents

Mongoose provides several query methods to retrieve documents.

### Basic Queries

- **Find All:**

  ```js
  User.find()
    .then(users => console.log(users))
    .catch(err => console.error(err));
  ```

- **Find by Query:**

  ```js
  User.find({ isAdmin: true })
    .then(admins => console.log(admins))
    .catch(err => console.error(err));
  ```

- **Find by ID:**

  ```js
  User.findById(userId)
    .then(user => console.log(user))
    .catch(err => console.error(err));
  ```

### Advanced Query Options

- **Query Modifiers:**

  ```js
  User.find({ age: { $gte: 18 } })
    .limit(10)
    .sort({ createdAt: -1 })
    .then(users => console.log(users))
    .catch(err => console.error(err));
  ```

- **Lean Query:** (for faster queries by returning plain JavaScript objects)
  
  ```js
  User.find().lean()
    .then(users => console.log(users))
    .catch(err => console.error(err));
  ```

**Explanation:**
- **Modifiers:** `.limit()`, `.sort()`, and operators like `$gte` help refine your queries.
- **Lean:** Use `.lean()` when you do not need full Mongoose documents with methods.

---

## 5. Updating Documents

Mongoose offers several methods to update documents.

- **Update Single Document by ID:**

  ```js
  User.findByIdAndUpdate(userId, { name: 'Jane Doe' }, { new: true })
    .then(updatedUser => console.log(updatedUser))
    .catch(err => console.error(err));
  ```

- **Update Multiple Documents:**

  ```js
  User.updateMany({ isAdmin: true }, { isAdmin: false })
    .then(result => console.log(result))
    .catch(err => console.error(err));
  ```

**Explanation:**
- The `{ new: true }` option returns the updated document.
- `updateMany` is useful when applying changes to multiple documents matching the query.

---

## 6. Deleting Documents

There are a few methods to remove documents from your collection.

- **Delete Single Document by ID:**

  ```js
  User.findByIdAndDelete(userId)
    .then(deletedUser => console.log(deletedUser))
    .catch(err => console.error(err));
  ```

- **Delete Multiple Documents:**

  ```js
  User.deleteMany({ isAdmin: false })
    .then(result => console.log(result))
    .catch(err => console.error(err));
  ```

**Explanation:**
- Use these methods to efficiently remove one or many documents, depending on your needs.

---

## 7. Validation and Custom Validators

Enhance your schema with validations and custom error messages.

```js
const productSchema = new Schema({
  name: { type: String, required: [true, 'Product name is required'] },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  category: String
});
```

**Explanation:**
- **Custom Messages:** Providing an array lets you define custom error messages.
- **Built-in Validators:** `min`, `max`, and `required` help enforce data integrity.

---

## 8. Relationships & Population

Mongoose allows you to create relationships between models using references.

### Defining Relationships

```js
// In User model
const userSchema = new Schema({
  name: String,
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

// In Post model
const postSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

### Populating References

```js
User.findById(userId)
  .populate('posts') // replaces ObjectId with the actual Post documents
  .then(user => console.log(user))
  .catch(err => console.error(err));
```

**Explanation:**
- **References:** Use the `ref` property to define relationships.
- **Populate:** Automatically fetches the related documents for a more enriched dataset.

---

## 9. Additional Features and Best Practices

### 9.1. Aggregation

For complex queries that involve grouping, sorting, and transforming data:

```js
User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$isAdmin', total: { $sum: 1 } } }
])
.then(results => console.log(results))
.catch(err => console.error(err));
```

**Explanation:**
- **Aggregation Pipeline:** Use stages like `$match` and `$group` to process data directly in MongoDB.

### 9.2. Virtual Properties

Define virtual properties on your schema that aren’t persisted to MongoDB but can be computed from existing data.

```js
userSchema.virtual('isAdult').get(function() {
  return this.age >= 18;
});
```

**Explanation:**
- **Virtuals:** Useful for computed values, such as full names or status flags.

### 9.3. Middleware (Hooks)

Mongoose supports middleware (pre and post hooks) to run code before or after certain operations.

```js
userSchema.pre('save', function(next) {
  console.log('A user is about to be saved.');
  next();
});

userSchema.post('save', function(doc) {
  console.log('User has been saved:', doc);
});
```

**Explanation:**
- **Hooks:** Use pre and post middleware to implement actions such as logging, validations, or triggering side effects.

### 9.4. Error Handling

Always handle errors in asynchronous operations to prevent unhandled promise rejections.

```js
User.findById(userId)
  .then(user => {
    if (!user) throw new Error('User not found');
    console.log(user);
  })
  .catch(err => console.error('Error:', err.message));
```

**Explanation:**
- **Robust Error Handling:** Helps maintain reliability and debugging efficiency in production applications.

---

## Summary

- **Schema & Model:** Define data structure and compile schemas.
- **CRUD Operations:** Use built-in methods to create, read, update, and delete documents.
- **Validation:** Enforce data integrity with built-in and custom validators.
- **Relationships:** Link models with references and use `populate()` to fetch related data.
- **Advanced Features:** Aggregation, virtual properties, middleware, and robust error handling further enhance Mongoose's capabilities.

This cheat sheet should help you quickly recall and apply the key features of Mongoose in your projects. Happy coding!
