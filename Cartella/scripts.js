function getResponse(response) {
  return response.json();
}

function getResult(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

window.onload = function () {
  let posts = !!localStorage.getItem("posts")
    ? JSON.parse(localStorage.getItem("posts"))
    : null;

  if (!posts) {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(getResponse)
      .then((data) => {
        posts = data;
        getResult(posts);
        showPosts(posts);
      });
  } else {
    showPosts(posts);
  }
};

function showPosts(posts) {
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const newNode = document.createElement("div");
    newNode.setAttribute("id", `post-item-${post.id}`);
    newNode.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <button id='button-delete-${post.id}'>Elimina</button>
      <div>
        <input type="text" id="comment-input-${post.id}" placeholder="Inserisci il tuo commento">
        <button id="button-comment-${post.id}">Aggiungi commento</button>
      </div>
      <ul id="comments-${post.id}"></ul>
    `;
    document.getElementById("post-list").appendChild(newNode);

    document
      .getElementById(`button-delete-${post.id}`)
      .addEventListener("click", () => {
        const filteredPosts = posts.filter((p) => p.id !== post.id);
        localStorage.setItem("posts", JSON.stringify(filteredPosts));
        document.getElementById(`post-item-${post.id}`).remove();
      });

    showComments(posts, post.id);

    document.getElementById(`button-comment-${post.id}`).addEventListener("click", () => {
      const inputBarComments = document.getElementById(`comment-input-${post.id}`);
      const commentValue = inputBarComments.value.trim();

      if (commentValue !== "") {
        const currentPost = posts.find((p) => p.id === post.id);
        currentPost.comments = currentPost.comments || [];
        currentPost.comments.push(commentValue);
        localStorage.setItem("posts", JSON.stringify(posts));

        showComments(posts, post.id);

        inputBarComments.value = "";
      }
    });
  }
}

function showComments(posts, postId) {
  const containerComments = document.getElementById(`comments-${postId}`);
  const currentPost = posts.find((p) => p.id === postId);

  containerComments.innerHTML = ""; // Pulisce i commenti precedenti

  for (let x = 0; x < (currentPost.comments || []).length; x++) {
    const commentNode = document.createElement("li");
    commentNode.innerHTML = `
      <span>${currentPost.comments[x]}</span>
      <button class="button-delete-comment" data-comment-index="${x}">Elimina commento</button>
    `;
    containerComments.appendChild(commentNode);

    // Aggiungi un listener per gestire il click sul pulsante "Elimina commento"
    commentNode.querySelector(".button-delete-comment").addEventListener("click", (event) => {
      const commentIndex = event.target.getAttribute("data-comment-index");
      currentPost.comments.splice(commentIndex, 1);
      localStorage.setItem("posts", JSON.stringify(posts));
      showComments(posts, postId);
    });
  }
}
