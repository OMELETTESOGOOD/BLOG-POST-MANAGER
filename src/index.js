const BASE_URL = "http://localhost:3000/posts";

function fetchAndRenderPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(renderPostList)
    .catch(err => console.error("GET error:", err));
}

function renderPostList(posts) {
  const postList = document.getElementById("post-list");
  postList.innerHTML = "";

  posts.forEach(post => {
    const postItem = document.createElement("div");
    postItem.textContent = post.title;
    postItem.addEventListener("click", () => fetchAndRenderPost(post.id));
    postList.appendChild(postItem);
  });

  if (posts.length > 0) fetchAndRenderPost(posts[0].id);
}

function fetchAndRenderPost(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button data-id="${post.id}" id="delete-btn">Delete</button>
        <button data-id="${post.id}" id="edit-btn">Edit</button>
      `;

      document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
      document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));
    })
    .catch(err => console.error("GET single post error:", err));
}

function handleNewPostForm() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      author: form.author.value,
      content: form.content.value
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        fetchAndRenderPosts();
        form.reset();
      })
      .catch(err => console.error("POST error:", err));
  });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    .then(() => {
      document.getElementById("post-detail").innerHTML = "";
      fetchAndRenderPosts();
    })
    .catch(err => console.error("DELETE error:", err));
}
function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;

  form.onsubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      title: form["edit-title"].value,
      content: form["edit-content"].value
    };

    fetch(`${BASE_URL}/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(() => {
        fetchAndRenderPosts();
        form.classList.add("hidden");
      })
      .catch(err => console.error("PATCH error:", err));
  };

  document.getElementById("cancel-edit").onclick = () => {
    form.classList.add("hidden");
  };
}

function main() {
  fetchAndRenderPosts();
  handleNewPostForm();
}

document.addEventListener("DOMContentLoaded", main);
