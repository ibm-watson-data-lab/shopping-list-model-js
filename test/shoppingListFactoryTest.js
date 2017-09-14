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

  it("should make a new List of Shopping Lists that is empty", function() {
    const listOfShoppingLists = shoppingListFactory.newListOfShoppingLists();
    List.isList(listOfShoppingLists).should.be.true;
    listOfShoppingLists.isEmpty().should.be.true;
    listOfShoppingLists.size.should.equal(0);
  });

  it("should make a new List of Shopping Lists that includes one Shopping List", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const listOfShoppingLists = shoppingListFactory.newListOfShoppingLists([groceries]);
    List.isList(listOfShoppingLists).should.be.true;
    listOfShoppingLists.isEmpty().should.be.false;
    listOfShoppingLists.size.should.equal(1);
    listOfShoppingLists.includes(groceries).should.be.true;
  });

  it("should make a new List of Shopping Lists that includes two Shopping Lists", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const campingSupplies = shoppingListFactory.newShoppingList({
      title: "Camping Supplies"
    });
    const listOfShoppingLists = shoppingListFactory.newListOfShoppingLists([groceries, campingSupplies]);
    List.isList(listOfShoppingLists).should.be.true;
    listOfShoppingLists.isEmpty().should.be.false;
    listOfShoppingLists.size.should.equal(2);
    listOfShoppingLists.includes(groceries).should.be.true;
    listOfShoppingLists.includes(campingSupplies).should.be.true;
    listOfShoppingLists.first().equals(groceries).should.be.true;
    listOfShoppingLists.last().equals(campingSupplies).should.be.true;
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

  it("should make a new List of Shopping List Items that is empty", function() {
    const listOfshoppingListItems = shoppingListFactory.newListOfShoppingListItems();
    List.isList(listOfshoppingListItems).should.be.true;
    listOfshoppingListItems.isEmpty().should.be.true;
    listOfshoppingListItems.size.should.equal(0);
  });

  it("should make a new List of Shopping List Items that includes one Shopping List Item", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const mangos = shoppingListFactory.newShoppingListItem({
      title: "Mangos"
    }, groceries);
    const listOfgroceriesItems = shoppingListFactory.newListOfShoppingListItems([mangos]);
    List.isList(listOfgroceriesItems).should.be.true;
    listOfgroceriesItems.isEmpty().should.be.false;
    listOfgroceriesItems.size.should.equal(1);
    listOfgroceriesItems.includes(mangos).should.be.true;
  });

  it("should make a new List of Shopping List Items that includes two Shopping List Items", function() {
    const groceries = shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    const mangos = shoppingListFactory.newShoppingListItem({
      title: "Mangos"
    }, groceries);
    const oranges = shoppingListFactory.newShoppingListItem({
      title: "Oranges"
    }, groceries);
    const listOfGroceriesItems = shoppingListFactory.newListOfShoppingListItems([mangos, oranges]);
    List.isList(listOfGroceriesItems).should.be.true;
    listOfGroceriesItems.isEmpty().should.be.false;
    listOfGroceriesItems.size.should.equal(2);
    listOfGroceriesItems.includes(mangos).should.be.true;
    listOfGroceriesItems.includes(oranges).should.be.true;
    listOfGroceriesItems.first().equals(mangos).should.be.true;
    listOfGroceriesItems.last().equals(oranges).should.be.true;
  });

});
