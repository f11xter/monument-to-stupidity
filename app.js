let url = "https://monument-to-stupidity-db.fly.dev";

if (window.location.hostname === "localhost") {
  url = "http://localhost:8090";
}

const pb = new PocketBase(url);

let page = 1;
let totalPages;

const text = document.getElementById("text");
const count = document.getElementById("count");
const submit = document.getElementById("submit");
const success = document.getElementById("success");
const monument = document.getElementById("monument");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

getPosts();

text.addEventListener("input", () => {
  count.innerText = text.value.length;
  count.setAttribute(
    "data-valid",
    `${text.value.length >= 3 && text.value.length <= 1000}`
  );
  submit.disabled = text.value.length < 3 || text.value.length > 1000;
});

submit.addEventListener("click", (e) => {
  // prevent page reload
  e.preventDefault();

  if (text.value.length >= 3 && text.value.length <= 1000) {
    // post to server
    pb.collection("posts").create({ text: text.value });

    // reset form
    text.value = "";
    count.innerText = 0;
    count.setAttribute("data-valid", "false");
    submit.disabled = true;

    // show success msg
    success.setAttribute("data-visible", "true");
  }
});

prev.addEventListener("click", () => {
  if (page > 1) {
    getPosts(--page);
    monument.scrollIntoView();
  }
});

next.addEventListener("click", () => {
  if (page < totalPages) {
    getPosts(++page);
    monument.scrollIntoView();
  }
});

/**
 * Fetch paginated list of most recent posts
 *
 * Fetches 10 posts at a time
 * @param {number} page which page of results to return
 */
function getPosts(page) {
  pb.collection("posts")
    .getList(page, 10, {
      sort: "-created",
    })
    .then((response) => {
      totalPages = response.totalPages;

      clearPosts();

      for (const post of response.items) {
        displayPost(post.text, post.created);
      }

      showPaginationButtons();
    });
}

/**
 * Remove all posts from DOM
 */
function clearPosts() {
  for (const el of monument.querySelectorAll("div")) {
    el.remove();
  }
}

/**
 * Append post to DOM
 * @param {string} text content of post
 * @param {string} timestamp created time of post in ISO format
 */
function displayPost(text, timestamp) {
  const content = document.createElement("p");
  content.innerText = text;

  const date = document.createElement("p");
  date.innerText = timestamp.split(" ")[0];

  const post = document.createElement("div");
  post.append(date, content);

  monument.append(post);
}

/**
 * Set previous and next buttons to relevant visibility
 */
function showPaginationButtons() {
  prev.setAttribute("data-visible", `${page > 1}`);
  next.setAttribute("data-visible", `${page < totalPages}`);
}
