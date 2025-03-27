/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "rmtahs3ye4vrhkh",
    "created": "2025-03-27 21:22:30.739Z",
    "updated": "2025-03-27 21:22:30.739Z",
    "name": "count",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ju193cdu",
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
      "query": "SELECT (ROW_NUMBER() OVER()) AS id, COUNT(*) AS count FROM \"posts\" WHERE \"visible\" = TRUE"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rmtahs3ye4vrhkh");

  return dao.deleteCollection(collection);
})
