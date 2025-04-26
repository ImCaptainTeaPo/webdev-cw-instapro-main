import { getPosts, postsHost, getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => (user ? `Bearer ${user.token}` : undefined);

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const goToPage = (newPage, data) => {
  if (
    ![
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    throw new Error("Страницы не существует");
  }

  if (newPage === ADD_POSTS_PAGE) {
    page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
    return renderApp();
  }

  if (newPage === POSTS_PAGE) {
    loadPosts();
    return;
  }

  if (newPage === USER_POSTS_PAGE) {
    loadUserPosts(data.userId);
    return;
  }

  page = newPage;
  renderApp();
};

const loadPosts = () => {
  page = LOADING_PAGE;
  renderApp();
  getPosts({ token: getToken() })
    .then((newPosts) => {
      posts = newPosts;
      page = POSTS_PAGE;
      renderApp();
    })
    .catch((error) => {
      console.error(error);
      page = POSTS_PAGE;
      renderApp();
    });
};

const loadUserPosts = (userId) => {
  page = LOADING_PAGE;
  renderApp();
  getUserPosts({ userId, token: getToken() })
    .then((newPosts) => {
      posts = newPosts;
      page = USER_POSTS_PAGE;
      renderApp();
    })
    .catch((error) => {
      console.error(error);
      page = POSTS_PAGE;
      renderApp();
    });
};

const renderApp = () => {
  const appEl = document.getElementById("app");

  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({ appEl, user, goToPage });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick: ({ description, imageUrl }) => {
        const token = getToken();
        fetch(postsHost, {
          method: "POST",
          headers: { Authorization: token },
          body: JSON.stringify({ description, imageUrl }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Ошибка при добавлении поста");
            }
            return response.json();
          })
          .then(() => loadPosts())
          .catch((error) => {
            console.warn(error);
            alert("Не удалось добавить пост");
          });
      },
    });
  }

  if ([POSTS_PAGE, USER_POSTS_PAGE].includes(page)) {
    return renderPostsPageComponent({ appEl });
  }
};

goToPage(POSTS_PAGE);
