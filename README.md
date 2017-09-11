# Shopping List Domain Model

**Note:** This is a work in progress.

[Shopping List](https://github.com/ibm-watson-data-lab/shopping-list) is a series of Offline First demo apps, each built using a different stack. This is a JavaScript implementation of the domain model for the Shopping List app. This package should be used in Vanilla JS, Polymer, React, Preact, Vue.js, Ember.js, React Native, Ionic, Cordova, Electron, and any other JavaScript implementations of the Shopping List demo app.

## Installation

This package can be installed via npm:

```javascript
npm install @ibm-shopping-list/model
```

To use the Shopping List Factory and the Shopping List Repository PouchDB implementation:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("@ibm-shopping-list/model");
```

## Usage

### Shopping Lists

#### Making a New Shopping List

Use a Shopping List Factory to make a new Shopping List:

```javascript
const { ShoppingListFactory } = require("@ibm-shopping-list/model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

console.log(shoppingList._id);        // list:…
console.log(shoppingList._rev);       // undefined
console.log(shoppingList.title);      // Groceries
```

#### Creating a Shopping List in a Database

Use a Shopping List Repository to create a Shopping List in a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("@ibm-shopping-list/model");
const PouchDB = require("pouchdb");

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.post(shoppingList).then(shoppingList => {
  console.log(shoppingList._id);      // list:…
  console.log(shoppingList._rev);     // 1-…
  console.log(shoppingList.title);    // Groceries
});
```

#### Reading a Shopping List from a Database

Use a Shopping List Repository to read a Shopping List from the database when you know the `_id` value:

```javascript
const { ShoppingListRepositoryPouchDB } = require("@ibm-shopping-list/model");
const PouchDB = require("pouchdb");

const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

// Replace "list:cj6mj1zfj000001n1ugjfkj33" with the _id value for your Shopping List
shoppingListRepository.get("list:cj6mj1zfj000001n1ugjfkj33").then(shoppingList => {
  console.log(shoppingList._id);      // list:cj6mj1zfj000001n1ugjfkj33
  console.log(shoppingList._rev);     // 1-…
});
```

#### Modifying a Shopping List

Shopping Lists are [Immutable.js Record](https://facebook.github.io/immutable-js/docs/#/Record) objects. Use the `set` method or the `mergeDeep` method to make a modified copy of a Shopping List:

```javascript
const { ShoppingListFactory } = require("@ibm-shopping-list/model");

const shoppingListFactory = new ShoppingListFactory();

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

// Shopping List objects are immutable, so we assign the new object to our local shoppingList variable
shoppingList = shoppingList.set("checked", true);

console.log(shoppingList.checked);    // true

shoppingList = shoppingList.mergeDeep({
  title: "Groceries for Dinner Party",
  checked: false,
});

console.log(shoppingList.title);      // Groceries for Dinner Party
console.log(shoppingList.checked);    // false
```

#### Updating a Shopping List in a Database

Use a Shopping List Repository to update a Shopping List in a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("@ibm-shopping-list/model");
const PouchDB = require("pouchdb");

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.post(shoppingList).then(shoppingList => {
  shoppingList = shoppingList.set("checked", true);
  return shoppingListRepository.put(shoppingList);
}).then(shoppingList => {
  console.log(shoppingList._rev);     // 2-…
  console.log(shoppingList.checked);  // true
});
```

#### Deleting a Shopping List from a Database

Use a Shopping List Repository to delete a Shopping List from a database, after saving it to a database:

```javascript
const { ShoppingListFactory, ShoppingListRepositoryPouchDB } = require("@ibm-shopping-list/model");
const PouchDB = require("pouchdb");

const shoppingListFactory = new ShoppingListFactory();
const db = new PouchDB("shopping-list");
const shoppingListRepository = new ShoppingListRepositoryPouchDB(db);

let shoppingList = shoppingListFactory.newShoppingList({
  title: "Groceries"
});

shoppingListRepository.post(shoppingList).then(shoppingList => {
  console.log(shoppingList._id);      // list:…
  console.log(shoppingList._rev);     // 1-…
  console.log(shoppingList.title);    // Groceries
  return shoppingListRepository.delete(shoppingList);
}).then(shoppingList => {
  console.log(shoppingList._rev);     // 2-…
  console.log(shoppingList._deleted); // true
});
```
