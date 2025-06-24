
const baseURL = "http://localhost:3000/posts";
let currentPostId = null;

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("post-list");
      list.innerHTML = "";
      posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.textContent = post.title;
        postItem.style.cursor = "pointer";
        postItem.addEventListener("click", () => handlePostClick(post));
        list.appendChild(postItem);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0]);
      }
    })
    .catch(error => console.error("Error loading posts:", error));
}

function handlePostClick(post) {
  currentPostId = post.id;
  const detail = document.getElementById("post-detail");
  detail.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <p><strong>Author:</strong> ${post.author}</p>
    <button onclick="startEdit()">Edit</button>
    <button onclick="deletePost()">Delete</button>
  `;
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("new-title").value;
    const content = document.getElementById("new-content").value;
    const author = document.getElementById("new-author").value;

    const post = { title, content, author };

    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });
}

function startEdit() {
  fetch(`${baseURL}/${currentPostId}`)
    .then(res => res.json())
    .then(post => {
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;
      document.getElementById("edit-post-form").classList.remove("hidden");
    });
}

function deletePost() {
  fetch(`${baseURL}/${currentPostId}`, {
    method: "DELETE"
  }).then(() => {
    document.getElementById("post-detail").innerHTML = "";
    displayPosts();
  });
}

function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("edit-title").value;
    const content = document.getElementById("edit-content").value;

    fetch(`${baseURL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    }).then(() => {
      form.classList.add("hidden");
      displayPosts();
    });
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    form.classList.add("hidden");
  });
}

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

document.addEventListener("DOMContentLoaded", main);
