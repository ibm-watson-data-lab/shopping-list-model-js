"use strict";

const cuid = require("cuid");

const { Record, List } = require("immutable");

exports.ShoppingListFactory = class {

  constructor() {
    this._ShoppingList = Record({
      _id: undefined,
      _rev: undefined,
      _deleted: false,
      type: "list",
      version: 1,
      title: undefined,
      checked: false,
      place: undefined,
      createdAt: undefined,
      updatedAt: undefined
    });
    this._ShoppingListItem = Record({
      _id: undefined,
      _rev: undefined,
      _deleted: false,
      type: "item",
      version: 1,
      title: undefined,
      checked: false,
      createdAt: undefined,
      updatedAt: undefined
    });
  }

  _guardShoppingListItem(shoppingListItem) {
    if (shoppingListItem.type != "item") {
      throw new Error("Shopping List Item type must be item");
    }
  }

  _guardShoppingListItemList(shoppingListItemList) {
    shoppingListItemList.forEach(shoppingListItem => this._guardShoppingListItem(shoppingListItem));
  }

  newShoppingList(values) {
    let shoppingList = new this._ShoppingList(values);
    if (shoppingList._id === undefined) {
      shoppingList = shoppingList.set("_id", "list:" + cuid());
    }
    return shoppingList;
  }

  newShoppingListItem(shoppingList, values) {
    let shoppingListItem = new this._ShoppingListItem(values);
    if (shoppingListItem._id === undefined) {
      shoppingListItem = shoppingListItem.set("_id", shoppingList._id + ":item:" + cuid());
    }
    return shoppingListItem;
  }

  newShoppingListItemList(shoppingListItems) {
    let shoppingListItemList = new List(shoppingListItems);
    this._guardShoppingListItemList(shoppingListItemList);
    return shoppingListItemList;
  }

}
