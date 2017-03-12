var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  // Fetch a collection to insert document into
  var collection = db.collection("simple_document_insert_with_function_safe");

  var o = {w:1};
  o.serializeFunctions = true;
  // Insert a single document
  collection.insertOne({hello:'world'
    , func:function() {}}, o, function(err, result) {
    test.equal(null, err);

    // Fetch the document
    collection.findOne({hello:'world'}, function(err, item) {
      test.equal(null, err);
      test.ok("function() {}", item.code);
      db.close();
    })
  });
});