/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gus7yr77zrw8utp")

  collection.options = {
    "query": "SELECT id, COUNT(*) as count from \"posts\";"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ads9pjuz",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gus7yr77zrw8utp")

  collection.options = {
    "query": "SELECT id from \"posts\";"
  }

  // remove
  collection.schema.removeField("ads9pjuz")

  return dao.saveCollection(collection)
})
