migrate((db) => {
  const collection = new Collection({
    "id": "z0fndtbv7sw3a4r",
    "created": "2023-05-06 21:32:30.195Z",
    "updated": "2023-05-06 21:32:30.195Z",
    "name": "posts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5z3pztjx",
        "name": "text",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 1000,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": null,
    "createRule": "",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("z0fndtbv7sw3a4r");

  return dao.deleteCollection(collection);
})
