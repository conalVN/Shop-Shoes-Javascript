const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiProduct = "http://localhost:8000/product";
const apiPost = "http://localhost:8001/post";

// active nav
$$(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    $$(".menu-item").forEach((itemActive) => {
      itemActive.classList.remove("active");
    });
    item.classList.add("active");
  });
});

// show input search
$(".search").addEventListener("click", toggleInput);
function toggleInput(e) {
  e.stopPropagation();
  $('label[for="search"]').classList.toggle("active");
}
document.addEventListener("click", () => {
  $('label[for="search"]').classList.remove("active");
});

// handle Search
$('label[for="search"]').addEventListener("click", (e) => {
  e.stopPropagation();
  // handleSearch();
});

// - render product
fetch(apiProduct)
  .then((res) => res.json())
  .then((data) => {
    renderProduct(data, 8);
  })
  .catch((err) => {
    console.log(err);
  });

function renderProduct(data, num) {
  let perPage = num;
  // let currentPage = 1;
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
              <button class="btn">View product</button>
          </div>
      </div>
    `;
    }
  });
  $(".product-wrapper").innerHTML = itemP.join("");
}

/*
- render post
// itemPerPage = 8
// currentPage = 1
// start = (currentPage - 1) * itemPerPage
// end = currentPerPage * itemPerPage
*/
let currentPost;
let perPost = 3;
let start = 0;
let end;
fetch(apiPost)
  .then((res) => res.json())
  .then((dataPost) => {
    renderPost(dataPost, 3, start, end);
    return dataPost;
  })
  .then((dataPost) => {
    handlePaginationPost(dataPost);
  })
  .catch((err) => {
    console.log(err);
  });

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
  $(".latestnews-post").innerHTML = htmlPost.join("");
}
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
