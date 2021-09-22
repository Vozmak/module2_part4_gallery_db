// import { getPage } from './moduls/getPage';

if (!localStorage.token) window.location.href = '../index.html';

if (localStorage.timestamp < Date.now()) {
  localStorage.removeItem('token');
  localStorage.removeItem('timestamp');

  window.location.href = '../index.html';
}

const previous = document.querySelector('#previous') as HTMLButtonElement;
const next = document.querySelector('#next') as HTMLButtonElement;

// displayImgList()
//   .then( result => {
//   if (result) alert(result);
// }).catch(e => {
//   console.log(e);
// });

(async () => {
  try {
    await displayImgList();
  } catch (e) {
    console.log(e);
  }
})();

previous.onclick = function() {
  window.location.href = `gallery.html?page=${localStorage.page - 1}`
};

next.onclick = function() {
  window.location.href = `gallery.html?page=${Number(localStorage.page) + 1}`
};

async function displayImgList(): Promise<void> {
  const gallery = document.querySelector(".gallery") as HTMLBodyElement

  const page = getPage();

  const imgList: Response = await fetch(`http://127.0.0.1:2000/gallery/${page}`, {
    method: 'GET',
    headers: {
      "Authorization": localStorage.token
    }
  });

  if (imgList.status !== 200) {
    let error = await imgList.json();

    if (imgList.status === 401) {
      window.stop();
    } else {
      window.location.href = `gallery.html?page=${localStorage.page}`;
    }

    return alert(error.errorMessage);
  }

  const jsonImgList = await imgList.json();
  for (let img of jsonImgList.objects) {
    let newImg = document.createElement("img") as HTMLImageElement;
    newImg.src = img;
    gallery.insertAdjacentElement("beforeend", newImg);
  }

  const div = document.querySelector(".page") as HTMLBodyElement;
  const p = div.querySelector("p") as HTMLElement;
  p.textContent = `Страница ${page} из ${jsonImgList.total}`;

  localStorage.setItem("page", page);
}

function getPage(): string {
  const searchParams = new URL(window.location.href).searchParams;
  let page: string = searchParams.get('page') || localStorage.page || '1';

  if (page === "1") previous.disabled = true
  else if (page === "3") next.disabled = true

  return page;
}
