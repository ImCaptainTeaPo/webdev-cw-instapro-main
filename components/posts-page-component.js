import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, page, user } from "../index.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
import { toggleLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const postsHtml = posts
    .map((post) => {
      return `
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
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ru,
          })}
        </p>
      </li>
    `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Переход на страницу пользователя
  if (page === POSTS_PAGE) {
    document.querySelectorAll(".post-header").forEach((userEl) => {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    });
  }

  document.querySelectorAll(".like-button").forEach((likeButton) => {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!user) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return;
      }

      const postEl = likeButton.closest(".post");
      const postId = postEl.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      const likeImage = likeButton.querySelector(".like-icon");

      likeImage.classList.add("like-shake");

      toggleLike({
        postId,
        token: `Bearer ${user.token}`,
        isLiked: post.isLiked,
      })
        .then(() => {
          post.isLiked = !post.isLiked;
          if (post.isLiked) {
            post.likes.push({ name: user.name });
          } else {
            post.likes.pop();
          }

          likeImage.src = `./assets/images/${
            post.isLiked ? "like-active" : "like-not-active"
          }.svg`;

          const likesText = postEl.querySelector(".post-likes-text strong");
          likesText.textContent = post.likes.length;
        })
        .catch((error) => {
          console.warn(error);
          alert("Не удалось обновить лайк. Попробуйте позже.");
        })
        .finally(() => {
          setTimeout(() => {
            likeImage.classList.remove("like-shake");
          }, 600);
        });
    });
  });
}
