if (document.URL.match( /edit/ )) {
  document.addEventListener('DOMContentLoaded', function() {

    // 選択した画像を表示する関数
    const createImageHTML = () => {
      const image_name = document.getElementById("user_active_image").value;
      const image_path = "/assets/chara/" + image_name + ".png";
      const preview_image = document.getElementById("test");
      preview_image.innerHTML = `<img src="${image_path}" class="edit-item-image">`;
    }

    document.getElementById('user_active_image').addEventListener('change', (e) => {
      createImageHTML();
    });
  });
}