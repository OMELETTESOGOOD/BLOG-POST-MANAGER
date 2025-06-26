const BASE_URL = "http://localhost:3000/posts";

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.textContent = post.title;
        postItem.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postItem);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id); // Optional advanced deliverable
      }
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button id="delete-btn">Delete</button>
        <button id="edit-btn">Edit</button>
      `;

      document.getElementById("delete-btn").onclick = () => {
        fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
          .then(() => displayPosts());
        detail.innerHTML = "";
      };

      document.getElementById("edit-btn").onclick = () => {
        document.getElementById("edit-post-form").classList.remove("hidden");
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.content;

        const form = document.getElementById("edit-post-form");
        form.onsubmit = (e) => {
          e.preventDefault();
          const updatedPost = {
            title: document.getElementById("edit-title").value,
            content: document.getElementById("edit-content").value
          };
          fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPost)
          }).then(() => {
            displayPosts();
            form.classList.add("hidden");
          });
        };

        document.getElementById("cancel-edit").onclick = () => {
          form.classList.add("hidden");
        };
      };
    });
}

function addNewPostListener() {
  document.getElementById("new-post-form").addEventListener("submit", e => {
    e.preventDefault();
    const newPost = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      content: document.getElementById("content").value
    };
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        e.target.reset();
      });
  });
}

function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);
