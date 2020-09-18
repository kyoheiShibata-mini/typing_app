if (document.URL.match( /edit/ )) {
  document.addEventListener('DOMContentLoaded', function() {
    const ImageList = document.getElementById('image-list')

    // 選択した画像を表示する関数
    const createImageHTML = (blob) => {
      // 画像を表示するためのdiv要素を生成
      const imageElement = document.createElement('div')
      imageElement.setAttribute('class', "item-image")
      
      // 表示する画像を生成
      const blobImage = document.createElement('img')
      blobImage.setAttribute('src', blob)

      // 生成したHTMLの要素をブラウザに表示させる
      imageElement.appendChild(blobImage)
    }

    document.getElementById('icon_menu').addEventListener('change', (e) => {
      let file = '../../assets/chara/asigaru.png';

      createImageHTML(file);

    });
  });
}