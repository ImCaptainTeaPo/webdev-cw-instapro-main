const personalKey = "instapro-semen";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

const request = async (url, options) => {
  const response = await fetch(url, options);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.error || "Ошибка при запросе";
    throw new Error(errorMessage);
  }

  return data;
};

export const getPosts = ({ token }) =>
  request(postsHost, {
    method: "GET",
    headers: { Authorization: token },
  }).then((data) => data.posts);

export const getUserPosts = ({ userId, token }) =>
  request(`${baseHost}/api/v1/${personalKey}/instapro/user-posts/${userId}`, {
    method: "GET",
    headers: { Authorization: token },
  }).then((data) => data.posts);

export const registerUser = ({ login, password, name, imageUrl }) =>
  request(`${baseHost}/api/user`, {
    method: "POST",
    body: JSON.stringify({ login, password, name, imageUrl }),
  });

export const loginUser = ({ login, password }) =>
  request(`${baseHost}/api/user/login`, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });

export const uploadImage = ({ file }) => {
  const data = new FormData();
  data.append("file", file);

  return request(`${baseHost}/api/upload/image`, {
    method: "POST",
    body: data,
  });
};

export const toggleLike = ({ postId, token, isLiked }) => {
  const url = `${baseHost}/api/v1/${personalKey}/instapro/${postId}/${
    isLiked ? "dislike" : "like"
  }`;

  return request(url, {
    method: "POST",
    headers: { Authorization: token },
  });
};

export { postsHost };
