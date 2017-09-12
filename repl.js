"use strict";

const repl = require("repl");
const PouchDB = require("pouchdb-memory");
PouchDB.plugin(require("pouchdb-find"));
const { ShoppingListFactory } = require("./src/ShoppingListFactory");
const { ShoppingListRepositoryPouchDB } = require("./src/ShoppingListRepositoryPouchDB");

const replServer = repl.start({
  prompt: "shopping-list > ",
});

replServer.context.PouchDB = PouchDB;
replServer.context.ShoppingListFactory = ShoppingListFactory;
replServer.context.ShoppingListRepositoryPouchDB = ShoppingListRepositoryPouchDB;
