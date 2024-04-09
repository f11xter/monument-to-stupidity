/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "gus7yr77zrw8utp",
    "created": "2024-04-09 08:21:19.465Z",
    "updated": "2024-04-09 08:21:19.465Z",
    "name": "view",
    "type": "view",
    "system": false,
    "schema": [],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT id from \"posts\";"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gus7yr77zrw8utp");

  return dao.deleteCollection(collection);
})
