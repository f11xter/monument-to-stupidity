/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7zta91bdofrl4ol",
    "created": "2024-04-09 08:24:54.962Z",
    "updated": "2024-04-09 08:24:54.962Z",
    "name": "count",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6bkepgbs",
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
      "query": "SELECT (ROW_NUMBER() OVER()) AS id, COUNT(*) AS count from \"posts\""
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7zta91bdofrl4ol");

  return dao.deleteCollection(collection);
})
