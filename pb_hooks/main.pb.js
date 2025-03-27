/// <reference path="../pb_data/types.d.ts" />

function requireAdminCookie(next) {
  return (c) => {
    try {
      const auth = c.cookie('pb_auth');
      const record = $app
        .dao()
        .findAdminByToken(
          auth.value,
          $app.settings().adminAuthToken.secret,
        );

      c.setCookie(
        new Cookie({
          name: 'pb_auth',
          value: $tokens.adminAuthToken($app, record),
          path: '/',
        }),
      );
    } catch {
      return c.redirect(302, '/login');
    }

    return next(c);
  };
}

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
    .andWhere($dbx.hashExp({ visible: true }))
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
      isSuccess: c.queryString().includes("success"),
      hasError: c.queryString().includes("error"),
    });

  return c.html(200, html);
})

routerAdd("POST", "/", (c) => {
  try {
    const text = c.formValue('text');
    const post = new Record($app.dao().findCollectionByNameOrId('posts'));
    const form = new RecordUpsertForm($app, post);
    form.loadData({ text });
    form.submit();

    const settings = $app.dao().findRecordsByExpr('settings')[0];
    $http.send({
      url: settings.get('notify_url'),
      body: text,
      method: 'post',
      headers: {
        Actions: `http, Approve, ${settings.get('approve_url')}; http, Reject, ${settings.get('reject_url')}`.replaceAll('{id}', post.id),
      },
    });

    c.redirect(302, "/?success");
  } catch {
    c.redirect(302, "/?error")
  }

});

routerAdd('GET', '/login', (c) => {
  const html = $template.loadFiles(`${__hooks}/log-in.html`).render();
  return c.html(200, html);
});

routerAdd('POST', '/login', (c) => {
  const email = c.formValue('email');
  const password = c.formValue('password');

  try {
    const record = $app.dao().findAdminByEmail(email);

    if (!record.validatePassword(password)) {
      throw Error('Invalid credentials');
    }

    c.setCookie(
      new Cookie({
        name: 'pb_auth',
        value: $tokens.adminAuthToken($app, record),
        path: '/',
      }),
    );

    c.redirect(302, '/moderate');
  } catch {
    c.redirect(302, '/login');
  }
});

routerAdd('GET', '/moderate', (c) => {
  const posts = $app.dao().findRecordsByExpr('posts', $dbx.hashExp({ visible: false }));
  const html = $template.loadFiles(`${__hooks}/moderate.html`).render({ posts });
  c.html(200, html);
}, requireAdminCookie);

routerAdd('POST', '/moderate', (c) => {
  try {
    const id = c.formValue('id');
    const action = c.formValue('action');

    if (action === 'accept') {
      const post = $app.dao().findRecordById('posts', id);
      post.set('visible', true);
      $app.dao().saveRecord(post);
    }
    else if (action === 'reject') {
      const post = $app.dao().findRecordById('posts', id);
      $app.dao().deleteRecord(post);
    }
  } catch {}

  c.redirect(302, '/moderate')
}, requireAdminCookie);

routerAdd('POST', '/:id/approve', (c) => {
  const id = c.pathParam('id');
  const post = $app.dao().findRecordById('posts', id);
  post.set('visible', true);
  $app.dao().saveRecord(post);
});

routerAdd('POST', '/:id/reject', (c) => {
  const id = c.pathParam('id');
  const post = $app.dao().findRecordById('posts', id);
  $app.dao().deleteRecord(post);
});

routerAdd("GET", "/*", $apis.staticDirectoryHandler(`/pb_public`, false));
