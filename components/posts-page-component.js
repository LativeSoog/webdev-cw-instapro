import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, likeUserPost, user } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api - done

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = posts
    .map((post, index) => ` 
    <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
           ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length === 0 ? `0` : `${post.likes.length >= 2 ? `${post.likes[0].name} и ещё ${post.likes.length - 1}` : `${post.likes[0].name}`}`}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
        </p>
      </li>
        </div>
        </div>`).join("")
    ;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      if (!user) {
        alert("Ставить Like могут только авторизованные пользователи")
        return;
      }
      likeUserPost({ postId: likeEl.dataset.postId })
    })
  }
}
