"use strict";

const chai = require("chai");
const should = chai.should();
chai.use(require("chai-immutable"));
chai.use(require("chai-as-promised"));
const sinon = require("sinon");
const PouchDB = require("pouchdb-memory");

const { ShoppingListFactory } = require("../src/ShoppingListFactory");
const { ShoppingListRepositoryPouchDB } = require("../src/ShoppingListRepositoryPouchDB");
const { Record } = require("immutable");

describe("a Shopping List Repository for PouchDB", function() {

  let db;
  let shoppingListRepository;

  before(function() {
    this.clock = sinon.useFakeTimers(1504060808000);
  });

  beforeEach(function() {
    this.shoppingListFactory = new ShoppingListFactory();
    db = new PouchDB("test");
    shoppingListRepository = new ShoppingListRepositoryPouchDB(db);
  });

  afterEach(function() {
    db.destroy();
  });

  after(function() {
    this.clock.restore();
  });

  it("should create a Shopping List", function(done) {
    const groceries = this.shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    shoppingListRepository.post(groceries).should.be.fulfilled.then(groceriesAfterPost => {
      groceriesAfterPost.should.be.an.instanceof(Record);
      groceriesAfterPost._id.should.be.a("string")
        .with.length(30)
        .that.is.a.singleLine()
        .and.startsWith("list:");
      groceriesAfterPost.should.have.deep.property("_rev").that.is.a("string");
      groceriesAfterPost.should.have.deep.property("type", "list");
      groceriesAfterPost.should.have.deep.property("version", 1);
      groceriesAfterPost.should.have.deep.property("title", "Groceries");
      groceriesAfterPost.should.have.deep.property("checked", false);
      groceriesAfterPost.should.have.deep.property("place", undefined);
      groceriesAfterPost.should.have.deep.property("createdAt", "2017-08-30T02:40:08.000Z");
      groceriesAfterPost.should.have.deep.property("updatedAt", "2017-08-30T02:40:08.000Z");
    }).should.notify(done);
  });

  it("should read a Shopping List", function(done) {
    const groceries = this.shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    let revAfterPost;
    let groceriesAfterPost;
    shoppingListRepository.post(groceries).should.be.fulfilled.then(groceriesAfterPost => {
      revAfterPost = groceriesAfterPost._rev;
      return shoppingListRepository.get(groceriesAfterPost._id);
    }).should.be.fulfilled.then(groceriesAfterGet => {
      groceriesAfterGet.should.be.an.instanceof(Record);
      groceriesAfterGet._id.should.be.a("string")
        .with.length(30)
        .that.is.a.singleLine()
        .and.startsWith("list:");
      groceriesAfterGet.should.have.deep.property("_rev").that.is.a("string").and.does.equal(revAfterPost);
      groceriesAfterGet.should.have.deep.property("type", "list");
      groceriesAfterGet.should.have.deep.property("version", 1);
      groceriesAfterGet.should.have.deep.property("title", "Groceries");
      groceriesAfterGet.should.have.deep.property("checked", false);
      groceriesAfterGet.should.have.deep.property("place", undefined);
      groceriesAfterGet.should.have.deep.property("createdAt", "2017-08-30T02:40:08.000Z");
      groceriesAfterGet.should.have.deep.property("updatedAt", "2017-08-30T02:40:08.000Z");
    }).should.notify(done);
  });

  it("should update a Shopping List", function(done) {
    const groceries = this.shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    let revAfterPost;
    let clock;
    shoppingListRepository.post(groceries).should.be.fulfilled.then(groceriesAfterPost => {
      revAfterPost = groceriesAfterPost._rev;
      const groceriesAfterPostUpdated = groceriesAfterPost.set("checked", true);
      clock = sinon.useFakeTimers(1504060809314);
      return shoppingListRepository.put(groceriesAfterPostUpdated);
    }).should.be.fulfilled.then(groceriesAfterPut => {
      groceriesAfterPut.should.be.an.instanceof(Record);
      groceriesAfterPut._id.should.be.a("string")
        .with.length(30)
        .that.is.a.singleLine()
        .and.startsWith("list:");
      groceriesAfterPut.should.have.deep.property("_rev").that.is.a("string").and.does.not.equal(revAfterPost);
      groceriesAfterPut.should.have.deep.property("type", "list");
      groceriesAfterPut.should.have.deep.property("version", 1);
      groceriesAfterPut.should.have.deep.property("title", "Groceries");
      groceriesAfterPut.should.have.deep.property("checked", true);
      groceriesAfterPut.should.have.deep.property("place", undefined);
      groceriesAfterPut.should.have.deep.property("createdAt", "2017-08-30T02:40:08.000Z");
      groceriesAfterPut.should.have.deep.property("updatedAt", "2017-08-30T02:40:09.314Z");
      clock.restore();
    }).should.notify(done);
  });

  it("should delete a Shopping List", function(done) {
    const groceries = this.shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    let idAfterPost;
    let revAfterPost;
    let clock;
    shoppingListRepository.post(groceries).should.be.fulfilled.then(groceriesAfterPost => {
      idAfterPost = groceriesAfterPost._id;
      revAfterPost = groceriesAfterPost._rev;
      clock = sinon.useFakeTimers(1504060809314);
      return shoppingListRepository.delete(groceriesAfterPost);
    }).should.be.fulfilled.then(groceriesAfterDelete => {
      groceriesAfterDelete.should.be.an.instanceof(Record);
      groceriesAfterDelete._id.should.be.a("string")
        .with.length(30)
        .that.is.a.singleLine()
        .and.startsWith("list:");
      groceriesAfterDelete.should.have.deep.property("_rev").that.is.a("string").and.does.not.equal(revAfterPost);
      groceriesAfterDelete.should.have.deep.property("_deleted", true);
      groceriesAfterDelete.should.have.deep.property("type", "list");
      groceriesAfterDelete.should.have.deep.property("version", 1);
      groceriesAfterDelete.should.have.deep.property("title", "Groceries");
      groceriesAfterDelete.should.have.deep.property("checked", false);
      groceriesAfterDelete.should.have.deep.property("place", undefined);
      groceriesAfterDelete.should.have.deep.property("createdAt", "2017-08-30T02:40:08.000Z");
      groceriesAfterDelete.should.have.deep.property("updatedAt", "2017-08-30T02:40:09.314Z");
      clock.restore();
      return shoppingListRepository.get(idAfterPost).should.be.rejectedWith(Error);
    }).should.notify(done);
  });

  it("should create a Shopping List Item", function(done) {
    const groceries = this.shoppingListFactory.newShoppingList({
      title: "Groceries"
    });
    shoppingListRepository.post(groceries).should.be.fulfilled.then(groceriesAfterPost => {
      const mangos = this.shoppingListFactory.newShoppingListItem(groceries, {
        title: "Mangos"
      });
      return shoppingListRepository.postItem(mangos);
    }).should.be.fulfilled.then(mangosAfterPost => {
      mangosAfterPost.should.be.an.instanceof(Record);
      mangosAfterPost._id.should.be.a("string")
        .with.length(61)
        .that.is.a.singleLine()
        .and.startsWith(groceries._id)
        .and.has.indexOf(":item:", 30);
      mangosAfterPost.should.have.deep.property("_rev").that.is.a("string");
      mangosAfterPost.should.have.deep.property("type", "item");
      mangosAfterPost.should.have.deep.property("version", 1);
      mangosAfterPost.should.have.deep.property("title", "Mangos");
      mangosAfterPost.should.have.deep.property("checked", false);
      mangosAfterPost.should.have.deep.property("createdAt", "2017-08-30T02:40:08.000Z");
      mangosAfterPost.should.have.deep.property("updatedAt", "2017-08-30T02:40:08.000Z");
    }).should.notify(done);
  });

  it("should read a Shopping List Item", function(done) {
    this.skip();
  });

  it("should update a Shopping List Item", function(done) {
    this.skip();
  });

  it("should delete a Shopping List Item", function(done) {
    this.skip();
  });

  it("should read a Shopping List Item List", function(done) {
    this.skip();
  });

});
