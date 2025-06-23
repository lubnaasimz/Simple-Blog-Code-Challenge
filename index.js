
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