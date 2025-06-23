
function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  const postList = document.getElementById('post-list');
  
  fetch('http://localhost:3000/posts')
    .then(response => response.json())
    .then(posts => {
    
      postList.innerHTML = '<h2>Posts</h2>';
      
      posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        postItem.textContent = post.title;
        postItem.dataset.id = post.id;
        
        postItem.addEventListener('click', () => handlePostClick(post.id));
        
        postList.appendChild(postItem);
      });
      
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    })
    .catch(error => console.error('Error fetching posts:', error));
}

function handlePostClick(postId) {
  fetch(`http://localhost:3000/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      const postDetail = document.getElementById('post-detail');
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Content:</strong></p>
        <p>${post.content}</p>
      `;
    })
    .catch(error => console.error('Error fetching post details:', error));
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  
  form.addEventListener('submit', event => {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    
    const newPost = {
      title,
      content,
      author
    };
    
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
    .then(response => response.json())
    .then(() => {
      displayPosts();
      form.reset();
    })
    .catch(error => console.error('Error adding new post:', error));
  });
}

document.addEventListener('DOMContentLoaded', main);

function handlePostClick(postId) {
  fetch(`http://localhost:3000/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      const postDetailContent = document.getElementById('post-detail-content');
      postDetailContent.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Content:</strong></p>
        <p>${post.content}</p>
      `;
      
      postDetailContent.dataset.id = post.id;
      
      document.getElementById('edit-button').style.display = 'inline-block';
      document.getElementById('delete-button').style.display = 'inline-block';
      
      document.getElementById('edit-button').onclick = () => showEditForm(post);
      
      document.getElementById('delete-button').onclick = () => deletePost(post.id);
    })
    .catch(error => console.error('Error fetching post details:', error));
}

function showEditForm(post) {
  const editForm = document.getElementById('edit-post-form');
  const postDetailContent = document.getElementById('post-detail-content');


  document.getElementById('edit-title').value = post.title;
  document.getElementById('edit-content').value = post.content;
  document.getElementById('edit-author').value = post.author;

  editForm.classList.remove('hidden');
  postDetailContent.classList.add('hidden');
  
  editForm.onsubmit = (event) => {
    event.preventDefault();
    updatePost(post.id);
  };
  
  document.getElementById('cancel-edit').onclick = () => {
    editForm.classList.add('hidden');
    postDetailContent.classList.remove('hidden');
  };
}

function updatePost(postId) {
  const title = document.getElementById('edit-title').value;
  const content = document.getElementById('edit-content').value;
  const author = document.getElementById('edit-author').value;
  
  const updatedPost = {
    title,
    content,
    author
  };
  
  fetch(`http://localhost:3000/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  })
  .then(response => response.json())
  .then(() => {
    displayPosts();
    handlePostClick(postId);
    
    document.getElementById('edit-post-form').classList.add('hidden');
    document.getElementById('post-detail-content').classList.remove('hidden');
  })
  .catch(error => console.error('Error updating post:', error));
}

function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    fetch(`http://localhost:3000/posts/${postId}`, {
      method: 'DELETE',
    })
    .then(() => {
      displayPosts();
      document.getElementById('post-detail-content').innerHTML = '';
      document.getElementById('edit-post-form').classList.add('hidden');
      document.getElementById('edit-button').style.display = 'none';
      document.getElementById('delete-button').style.display = 'none';
    })
    .catch(error => console.error('Error deleting post:', error));
  }
}
