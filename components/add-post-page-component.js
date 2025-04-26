import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let description = "";
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <h2>Добавить пост</h2>
        <div class="form">
          <input id="description-input" class="input" placeholder="Введите описание">
          <div class="upload-image-container"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      description = document.getElementById("description-input").value.trim();

      if (!description) {
        alert("Введите описание");
        return;
      }

      if (!imageUrl) {
        alert("Загрузите изображение");
        return;
      }

      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}
