const personalKey = "instapro-semen";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function getUserPosts({ userId, token }) {
  return fetch(
    `${baseHost}/api/v1/${personalKey}/instapro/user-posts/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  )
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(`${baseHost}/api/user`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(`${baseHost}/api/user/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(`${baseHost}/api/upload/image`, {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function toggleLike({ postId, token, isLiked }) {
  const url = isLiked
    ? `${baseHost}/api/v1/${personalKey}/instapro/${postId}/dislike`
    : `${baseHost}/api/v1/${personalKey}/instapro/${postId}/like`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при обновлении лайка");
    }
    return response.json();
  });
}

export { postsHost };
