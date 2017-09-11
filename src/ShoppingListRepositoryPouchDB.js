"use strict";

const { ShoppingListRepository } = require("./ShoppingListRepository");
const { ShoppingListFactory } = require("./ShoppingListFactory");

exports.ShoppingListRepositoryPouchDB = class extends ShoppingListRepository {

  constructor(db) {
    super();
    this.db = db;
    this._shoppingListFactory = new ShoppingListFactory();
  }

  _guardShoppingList(shoppingList) {
    if (shoppingList._id === undefined) {
      throw new Error("Shopping List _id must be set");
    }
    if (shoppingList.type != "list") {
      throw new Error("Shopping List type must be list");
    }
  }

  _guardShoppingListItem(shoppingListItem) {
    if (shoppingListItem._id === undefined) {
      throw new Error("Shopping List Item _id must be set");
    }
    if (shoppingListItem.type != "item") {
      throw new Error("Shopping List Item type must be item");
    }
  }

  _post(record) {
    const createdAt = new Date().toISOString();
    record = record.mergeDeep({
      createdAt: createdAt,
      updatedAt: createdAt
    });
    return this.db.put(record.toJSON()).then(result => {
      return record.mergeDeep({
        _id: result.id,
        _rev: result.rev
      });
    });
  }

  _put(record) {
    const updatedAt = new Date().toISOString();
    record = record.mergeDeep({
      updatedAt: updatedAt
    });
    return this.db.put(record.toJSON()).then(result => {
      return record.mergeDeep({
        _id: result.id,
        _rev: result.rev
      });
    });
  }

  _get(id) {
    return this.db.get(id);
  }

  _delete(record) {
    const updatedAt = new Date().toISOString();
    record = record.mergeDeep({
      _deleted: true,
      updatedAt: updatedAt
    });
    return this.db.put(record.toJSON()).then(result => {
      return record.mergeDeep({
        _rev: result.rev
      });
    });
  }

  post(shoppingList) {
    this._guardShoppingList(shoppingList);
    return this._post(shoppingList);
  }

  put(shoppingList) {
    this._guardShoppingList(shoppingList);
    return this._put(shoppingList);
  }

  get(shoppingListId) {
    return this._get(shoppingListId).then(doc => {
      const shoppingList = this._shoppingListFactory.newShoppingList(doc);
      this._guardShoppingList(shoppingList);
      return shoppingList;
    });
  }

  delete(shoppingList) {
    this._guardShoppingList(shoppingList);
    return this._delete(shoppingList);
  }

  postItem(shoppingListItem) {
    this._guardShoppingListItem(shoppingListItem);
    return this._post(shoppingListItem);
  }

  postItemsBulk(shoppingListItems) {
    let postedItems = [];
    shoppingListItems.forEach(shoppingListItem => {
      postedItems.push(this.postItem(shoppingListItem));
    });
    return Promise.all(postedItems).then(shoppingListItems => {
      return this._shoppingListFactory.newShoppingListItemList(shoppingListItems);
    });
  }

  putItem(shoppingListItem) {
    this._guardShoppingListItem(shoppingListItem);
    return this._put(shoppingListItem);
  }

  getItem(shoppingListItemId) {
    return this._get(shoppingListItemId).then(doc => {
      const shoppingListItem = this._shoppingListFactory.newShoppingListItem(doc);
      this._guardShoppingListItem(shoppingListItem);
      return shoppingListItem;
    });
  }

  deleteItem(shoppingListItem) {
    this._guardShoppingListItem(shoppingListItem);
    return this._delete(shoppingListItem);
  }

}
