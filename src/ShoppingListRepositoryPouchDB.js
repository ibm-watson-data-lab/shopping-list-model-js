"use strict";

const { ShoppingListRepository } = require("./ShoppingListRepository");
const { ShoppingListFactory } = require("./ShoppingListFactory");
const { Record } = require("immutable");

class ShoppingListRepositoryPouchDB extends ShoppingListRepository {

  constructor(db) {
    super();
    this.db = db;
    this._shoppingListFactory = new ShoppingListFactory();
  }

  _guardShoppingList(shoppingList) {
    if (!Record.isRecord(shoppingList)) {
      throw new Error("Shopping List must be a Record");
    }
    if (shoppingList._id === undefined) {
      throw new Error("Shopping List _id must be set");
    }
    if (shoppingList.type != "list") {
      throw new Error("Shopping List type must be list");
    }
  }

  _guardShoppingListItem(shoppingListItem) {
    if (!Record.isRecord(shoppingListItem)) {
      throw new Error("Shopping List Item must be a Record");
    }
    if (shoppingListItem._id === undefined) {
      throw new Error("Shopping List Item _id must be set");
    }
    if (shoppingListItem.type != "item") {
      throw new Error("Shopping List Item type must be item");
    }
  }

  _guardRequest(request) {
    if (!request) {
      throw new Error("Request must be defined");
    }
    if (!request.selector) {
      throw new Error("Request must have a selector property");
    }
    if (!request.selector.type) {
      throw new Error("Request selector must have a type property");
    }
  }

  _guardShoppingListRequest(request) {
    this._guardRequest(request);
    if (request.selector.type != "list") {
      throw new Error("Request selector must have a type property with a value of 'list'");
    }
  }

  _guardShoppingListItemRequest(request) {
    this._guardRequest(request);
    if (request.selector.type != "item") {
      throw new Error("Request selector must have a type property with a value of 'item'");
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

  _ensureIndexOfType() {
    return this.db.createIndex({
      index: {
        fields: ["type"]
      }
    });
  }

  _ensureIndexOfTypeAndList() {
    return this.db.createIndex({
      index: {
        fields: ["type", "list"]
      }
    });
  }

  _ensureIndexOfTypeAndChecked() {
    return this.db.createIndex({
      index: {
        fields: ["type", "checked"]
      }
    });
  }

  _ensureIndexOfTypeAndListAndChecked() {
    return this.db.createIndex({
      index: {
        fields: ["type", "list", "checked"]
      }
    });
  }

  ensureIndexes() {
    return Promise.all([
      this._ensureIndexOfType(),
      this._ensureIndexOfTypeAndList(),
      this._ensureIndexOfTypeAndChecked(),
      this._ensureIndexOfTypeAndListAndChecked()
    ]);
  }

  post(shoppingList) {
    this._guardShoppingList(shoppingList);
    return this._post(shoppingList);
  }

  postBulk(shoppingLists) {
    let postedLists = [];
    shoppingLists.forEach(shoppingList => {
      postedLists.push(this.post(shoppingList));
    });
    return Promise.all(postedLists).then(shoppingLists => {
      return this._shoppingListFactory.newListOfShoppingLists(shoppingLists);
    });
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

  find(request = { selector: { type: "list" } }) {
    this._guardShoppingListRequest(request);
    return this.db.find(request).then(result => {
      if (result.warning) {
        console.warn(result.warning);
      }
      let listOfShoppingLists = this._shoppingListFactory.newListOfShoppingLists();
      result.docs.forEach(doc => {
        listOfShoppingLists = listOfShoppingLists.push(this._shoppingListFactory.newShoppingList(doc));
      });
      return listOfShoppingLists;
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
      return this._shoppingListFactory.newListOfShoppingListItems(shoppingListItems);
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

  findItems(request = { selector: { type: "item" } }) {
    this._guardShoppingListItemRequest(request);
    return this.db.find(request).then(result => {
      if (result.warning) {
        console.warn(result.warning);
      }
      let listOfShoppingListItems = this._shoppingListFactory.newListOfShoppingListItems();
      result.docs.forEach(doc => {
        listOfShoppingListItems = listOfShoppingListItems.push(this._shoppingListFactory.newShoppingListItem(doc));
      });
      return listOfShoppingListItems;
    });
  }

  findItemsCountByList(request = { selector: { type: "item" }, fields: [ "list" ] }) {
    if (request.fields && !request.fields.includes("list")) {
      throw new Error("Request selector must have a fields property that includes a value of 'list'");
    }
    return this.findItems(request).then(listOfShoppingListItems => {
      return listOfShoppingListItems.countBy(shoppingListItem => {
        return shoppingListItem.list;
      });
    });
  }

  deleteItem(shoppingListItem) {
    this._guardShoppingListItem(shoppingListItem);
    return this._delete(shoppingListItem);
  }

}

exports.ShoppingListRepositoryPouchDB = ShoppingListRepositoryPouchDB;
