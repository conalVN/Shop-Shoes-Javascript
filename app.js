const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiProduct = "http://localhost:8000/product";
const apiPost = "http://localhost:8001/post";

let num = 8;

fetch(apiProduct)
  .then((res) => res.json())
  .then((data) => {
    renderProduct(data, num);
    productCount(data);
    return data;
  })
  .then((currentData) => {
    // click show more product
    $(".showMore").addEventListener("click", () => {
      num += 8;
      if (num > currentData.length) {
        $(".showMore").innerText = "End";
      }
      renderProduct(currentData, num);
      handleDetail(currentData);
    });
    return currentData;
  })
  .then((currentData) => {
    // show detail item when select
    handleDetail(currentData);
    return currentData;
  })
  .then((currentData) => {
    // handle Search
    $('label[for="search"]').addEventListener("click", (e) => {
      e.stopPropagation();
      $(".inputSearch").addEventListener("input", () => {
        const newData = handleSearch(currentData);
        renderProduct(newData, (num = newData.length));
        handleDetail(newData);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

function productCount(data) {
  let countMan = 0,
    countWomen = 0,
    countKid = 0;
  data.forEach((item) => {
    if (item.gender == "man") {
      countMan += 1;
    }
    if (item.gender == "women") {
      countWomen += 1;
    }
    if (item.gender == "kid") {
      countKid += 1;
    }
  });
  $(".man").innerText = `${countMan} product`;
  $(".women").innerText = `${countWomen} product`;
  $(".kid").innerText = `${countKid} product`;
}
/* render */
function renderProduct(data, num) {
  let perPage = num;
  let start = 0;
  let end = perPage;
  const itemP = data.map((item, index) => {
    if (index >= start && index < end) {
      return `
      <div class="product-item">
          <div class="product-image">
              <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="product-body">
              <h6 class="product-brand">${item.brand}</h6>
              <h4 class="product-name">${item.name}</h4>
              <p class="product-price">$${item.price}</p>
              <button class="button view-item" data-index="${item.id}">View product</button>
          </div>
      </div>
    `;
    }
  });
  $(".productShow").innerHTML = itemP.join("");
}
/* Search */
// show input search
$(".search").addEventListener("click", toggleInput);
function toggleInput(e) {
  e.stopPropagation();
  $('label[for="search"]').classList.toggle("active");
}
document.addEventListener("click", () => {
  $('label[for="search"]').classList.remove("active");
});
function handleSearch(data) {
  const keyword = $(".inputSearch").value.toLowerCase();
  const resultItem = data.filter((item) => {
    const isCheck =
      item.name.toLowerCase().includes(keyword.trim()) ||
      item.brand.toLowerCase().includes(keyword.trim());
    if (isCheck) {
      return item;
    }
  });
  return resultItem;
}

/* detail product item */
function handleDetail(currentData) {
  $$(".view-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-index");
      showDetailItem(currentData, id);
      $(".modal").style.display = "flex";
    });
  });
}
function showDetailItem(data, i) {
  const htmlDetail = data.map((item) => {
    if (item.id == i) {
      return `
      <div class="modal-detail">
          <div class="modal-item-image">
              <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="modal-item-body">
              <h2 class="modal-item-name">${item.name}</h2>
              <p class="modal-item-price">$${item.price}</p>
              <ul class="modal-item-size">
                  <li class="select">1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                  <li>6</li>
              </ul>
              <p class="modal-item-desc">${item.description ?? ""}</p>
              <div class="modal-item-options">
                  <button class="button addCart">Add to cart</button>
                  <button class="button addWish">Add to wishlist</button>
              </div>
          </div>
      </div>
      `;
    }
  });
  $(".modal-detail").innerHTML = htmlDetail.join("");
}
/* close modal */
$(".modal").addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// itemPerPage = 8
// currentPage = 1
// start = (currentPage - 1) * itemPerPage
// end = currentPerPage * itemPerPage
let currentPost;
let perPost = 3;
let start = 0;
let end;
fetch(apiPost)
  .then((res) => res.json())
  .then((data) => {
    renderPost(data, 3, start, end);
    return data;
  })
  .then((currentData) => {
    handlePaginationPost(currentData);
  })
  .catch((err) => {
    console.log(err);
  });
// render post
function renderPost(dataPost, perPost, start, end) {
  end = perPost;
  if (currentPost > 1) {
    end = currentPost * perPost;
  } else {
    end = perPost;
  }
  const htmlPost = dataPost.map((post, index) => {
    if (index >= start && index < end) {
      return `
      <div class="post">
          <div class="post-image" style="background-image:url(${post.image})"></div>
          <div class="post-body">
              <div class="post-time">${post.time}</div>
              <h4 class="post-name">${post.name}</h4>
              <a href="#" class="post-link">
                  Read more
                  <span class="material-symbols-outlined">arrow_forward</span>
              </a>
          </div>
      </div>
      `;
    }
  });
  $(".newsShow").innerHTML = htmlPost.join("");
}
// pagination post
function handlePaginationPost(dataPost) {
  $$(".pagination-circle span").forEach((circle, index) => {
    circle.addEventListener("click", () => {
      $$(".pagination-circle span").forEach((item) =>
        item.classList.remove("active")
      );
      circle.classList = "active";
      currentPost = index + 1;
      start = (currentPost - 1) * perPost;
      renderPost(dataPost, 3, start, end);
    });
  });
}

// slider feedback
const listSlide = $$(".about-feedback-item");
let itemSlide = 0;
setInterval(() => {
  itemSlide++;
  if (itemSlide >= 3) {
    itemSlide = 0;
  }
  listSlide.forEach((slide) => {
    slide.classList.remove("active");
  });
  listSlide[itemSlide].classList.add("active");
}, 5000);

// back to top
document.addEventListener("scroll", () => {
  backTop();
});
function backTop() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    $(".backTop").classList.add("active");
  } else {
    $(".backTop").classList.remove("active");
  }
}
$(".backTop").addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
