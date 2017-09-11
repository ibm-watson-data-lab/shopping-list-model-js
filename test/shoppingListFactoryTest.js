"use strict";

const chai = require("chai");
chai.use(require("chai-string"));
const should = chai.should();

const { ShoppingListFactory } = require("../src/ShoppingListFactory");
const { List } = require("immutable");

describe("a Shopping List Factory", function() {

  let shoppingListFactory;

  beforeEach(function() {
    shoppingListFactory = new ShoppingListFactory();
  });

  it("should make a new Shopping List with properties", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    groceries._id.should.be.a("string")
      .with.length(30)
      .that.is.a.singleLine()
      .and.startsWith("list:");
    should.not.exist(groceries._rev);
    groceries._deleted.should.equal(false);
    groceries.type.should.equal("list");
    groceries.version.should.equal(1);
    groceries.title.should.equal("Groceries");
    groceries.checked.should.equal(false);
    should.not.exist(groceries.place);
    should.not.exist(groceries.createdAt);
    should.not.exist(groceries.updatedAt);
  });

  it("should make a new Shopping List without properties", function() {
    const shoppingList = shoppingListFactory.newShoppingList();
    shoppingList._id.should.be.a("string")
      .with.length(30)
      .that.is.a.singleLine()
      .and.startsWith("list:");
    should.not.exist(shoppingList._rev);
    shoppingList._deleted.should.equal(false);
    shoppingList.type.should.equal("list");
    shoppingList.version.should.equal(1);
    should.not.exist(shoppingList.title);
    shoppingList.checked.should.equal(false);
    should.not.exist(shoppingList.place);
    should.not.exist(shoppingList.createdAt);
    should.not.exist(shoppingList.updatedAt);
  });

  it("should make a new Shopping List Item with properties", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const mangos = shoppingListFactory.newShoppingListItem({
      title: "Mangos"
    }, groceries);
    mangos._id.should.be.a("string")
      .with.length(30)
      .that.is.a.singleLine()
      .and.startsWith("item:");
    should.not.exist(mangos._rev);
    mangos._deleted.should.equal(false);
    mangos.type.should.equal("item");
    mangos.version.should.equal(1);
    mangos.list.should.equal(groceries._id);
    mangos.title.should.equal("Mangos");
    mangos.checked.should.equal(false);
    should.not.exist(mangos.createdAt);
    should.not.exist(mangos.updatedAt);
  });

  it("should make a new Shopping List Item without properties", function() {
    const shoppingList = shoppingListFactory.newShoppingList();
    const shoppingListItem = shoppingListFactory.newShoppingListItem({}, shoppingList);
    shoppingListItem._id.should.be.a("string")
      .with.length(30)
      .that.is.a.singleLine()
      .and.startsWith("item:");
    should.not.exist(shoppingListItem._rev);
    shoppingListItem._deleted.should.equal(false);
    shoppingListItem.type.should.equal("item");
    shoppingListItem.version.should.equal(1);
    shoppingListItem.list.should.equal(shoppingList._id);
    should.not.exist(shoppingListItem.title);
    shoppingListItem.checked.should.equal(false);
    should.not.exist(shoppingListItem.createdAt);
    should.not.exist(shoppingListItem.updatedAt);
  });

  it("should make a new Shopping List Item List that is empty", function() {
    const shoppingListItemList = shoppingListFactory.newShoppingListItemList();
    List.isList(shoppingListItemList).should.be.true;
    shoppingListItemList.isEmpty().should.be.true;
    shoppingListItemList.size.should.equal(0);
  });

  it("should make a new Shopping List Item List that includes one Shopping List Item", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const mangos = shoppingListFactory.newShoppingListItem({
      title: "Mangos"
    }, groceries);
    const groceriesItemList = shoppingListFactory.newShoppingListItemList([mangos]);
    List.isList(groceriesItemList).should.be.true;
    groceriesItemList.isEmpty().should.be.false;
    groceriesItemList.size.should.equal(1);
    groceriesItemList.includes(mangos).should.be.true;
  });

  it("should make a new Shopping List Item List that includes two Shopping List Items", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const mangos = shoppingListFactory.newShoppingListItem({
      title: "Mangos"
    }, groceries);
    const oranges = shoppingListFactory.newShoppingListItem({
      title: "Oranges"
    }, groceries);
    const groceriesItemList = shoppingListFactory.newShoppingListItemList([mangos, oranges]);
    List.isList(groceriesItemList).should.be.true;
    groceriesItemList.isEmpty().should.be.false;
    groceriesItemList.size.should.equal(2);
    groceriesItemList.includes(mangos).should.be.true;
    groceriesItemList.includes(oranges).should.be.true;
    groceriesItemList.first().equals(mangos).should.be.true;
    groceriesItemList.last().equals(oranges).should.be.true;
  });

});
