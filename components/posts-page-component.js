import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, page, user } from "../index.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
import { toggleLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const createPostHtml = (post) => `
    <li class="post" data-post-id="${post.id}">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button class="like-button">
          <img src="./assets/images/${
            post.isLiked ? "like-active" : "like-not-active"
          }.svg" class="like-icon">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span> ${post.description}
      </p>
      <p class="post-date">
        ${formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
          locale: ru,
        })}
      </p>
    </li>`;

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts.map(createPostHtml).join("")}
      </ul>
    </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  setupUserLinks();
  setupLikeButtons();
}

function setupUserLinks() {
  if (page === POSTS_PAGE) {
    document.querySelectorAll(".post-header").forEach((header) => {
      header.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, { userId: header.dataset.userId });
      });
    });
  }
}

function setupLikeButtons() {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!user) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return;
      }

      handleLikeClick(button);
    });
  });
}

function handleLikeClick(button) {
  const postEl = button.closest(".post");
  const postId = postEl.dataset.postId;
  const post = posts.find((p) => p.id === postId);
  const likeIcon = button.querySelector(".like-icon");

  button.disabled = true;
  likeIcon.classList.add("like-shake");

  toggleLike({ postId, token: `Bearer ${user.token}`, isLiked: post.isLiked })
    .then(() => {
      post.isLiked = !post.isLiked;
      post.isLiked ? post.likes.push({ name: user.name }) : post.likes.pop();

      likeIcon.src = `./assets/images/${
        post.isLiked ? "like-active" : "like-not-active"
      }.svg`;
      postEl.querySelector(".post-likes-text strong").textContent =
        post.likes.length;
    })
    .catch((error) => {
      console.warn(error);
      alert("Не удалось обновить лайк. Попробуйте позже.");
    })
    .finally(() => {
      setTimeout(() => {
        likeIcon.classList.remove("like-shake");
        button.disabled = false;
      }, 600);
    });
}
