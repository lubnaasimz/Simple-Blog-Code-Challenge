const baseURL = "http://localhost:3000/posts";
let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
}
document.addEventListener("DOMContentLoaded", main);

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.style.cursor = "pointer";
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}

function handlePostClick(id) {
  fetch(`${baseURL}/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = id;
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small><em>by ${post.author}</em></small><br><br>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;

      document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("edit-post-form").classList.remove("hidden");
      });

      document.getElementById("delete-btn").addEventListener("click", () => {
        deletePost(post.id);
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-title").value;
    const content = document.getElementById("new-content").value;
    const author = document.getElementById("new-author").value;

    const newPost = { title, content, author };

    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });
}

const editForm = document.getElementById("edit-post-form");
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const updatedTitle = document.getElementById("edit-title").value;
  const updatedContent = document.getElementById("edit-content").value;

  fetch(`${baseURL}/${currentPostId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: updatedTitle,
      content: updatedContent
    })
  })
    .then(res => res.json())
    .then(() => {
      displayPosts();
      handlePostClick(currentPostId);
      editForm.classList.add("hidden");
    });
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  editForm.classList.add("hidden");
});

function deletePost(id) {
  fetch(`${baseURL}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      displayPosts();
      document.getElementById("post-detail").innerHTML = "<p>Post deleted.</p>";
      document.getElementById("edit-post-form").classList.add("hidden");
    });
}
