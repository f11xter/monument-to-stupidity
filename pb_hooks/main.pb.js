/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/", (c) => {
  const count = new Record;
  $app.dao()
    .recordQuery("count")
    .one(count);

  const perPage = 10;
  const maxPage = Math.floor(count.getInt("count") / perPage);

  let page = Number(c.queryParam("page"));
  page =
    Number.isNaN(page) ? 0
      : page > maxPage ? maxPage
        : page;

  let posts = arrayOf(new Record)
  $app.dao()
    .recordQuery("posts")
    .limit(10)
    .offset(page * perPage)
    .orderBy("created DESC")
    .all(posts)
  posts = posts.map((p) => ({
    created: p.created.string().split(" ")[0],
    text: p.get("text"),
  }));

  const html = $template
    .loadFiles(`${__hooks}/index.html`)
    .render({
      posts,
      page,
      maxPage,
      prev: page - 1,
      next: page + 1,
      hasError: !!c.queryParam("error"),
    });

  return c.html(200, html);
})

routerAdd("POST", "/", (c) => {
  try {
    const text = c.formValue("text");
    const posts = $app.dao().findCollectionByNameOrId("posts");
    const record = new Record(posts);
    const form = new RecordUpsertForm($app, record);
    form.loadData({ text });
    form.submit();
    c.redirect(302, "/");
  } catch {
    c.redirect(302, "/?error=true")
  }

});

routerAdd("GET", "/*", $apis.staticDirectoryHandler(`/pb_public`, false));
