/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gus7yr77zrw8utp");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "gus7yr77zrw8utp",
    "created": "2024-04-09 08:21:19.465Z",
    "updated": "2024-04-09 08:22:24.621Z",
    "name": "view",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ns0oihfc",
        "name": "count",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT (ROW_NUMBER() OVER()) AS id, count(*) as count from \"posts\";"
    }
  });

  return Dao(db).saveCollection(collection);
})
