async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const works = await response.json();
    return works
  } catch (error) {
    console.error(error.message);
  }
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categories = await response.json();
    return categories
  } catch (error) {
    console.error(error.message);
  }
}
async function showFilters() {
  const categories = await getCategories()
  const filters = document.querySelector(".filters")
  for (const i in categories) {
    filters.insertAdjacentHTML("beforeend", `<button id="categorie${categories[i].id}">${categories[i].name}</button>`)
    const button = document.getElementById(`categorie${categories[i].id}`)
    button.addEventListener("click", function () {
      const previousActive = document.querySelector(".active")
      previousActive.classList.remove("active")
      button.classList.add("active")
      showFilteredWorks(categories[i].id)
    })
  }
  const showAllBtn = document.getElementById("allcategories")
  showAllBtn.addEventListener("click", function () {
    const previousActive = document.querySelector(".active")
    previousActive.classList.remove("active")
    this.classList.add("active")
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
    showAllWorks()
  })
}
async function showAllWorks() {
  const works = await getWorks()
  const gallery = document.querySelector(".gallery")
  for (const i in works) {
    gallery.insertAdjacentHTML("beforeend", `<figure><img src="${works[i].imageUrl}" alt="${works[i].title}"><figcaption>${works[i].title}</figcaption></figure>`)
  }
}
async function showFilteredWorks(categoryIdFilter) {
  const works = await getWorks()
  const filteredWorks = works.filter(function worksByCategory(el) { return el.categoryId == categoryIdFilter })
  const gallery = document.querySelector(".gallery")
  gallery.innerHTML = ""
  for (const i in filteredWorks) {
    gallery.insertAdjacentHTML("beforeend", `<figure><img src="${filteredWorks[i].imageUrl}" alt="${filteredWorks[i].title}"><figcaption>${filteredWorks[i].title}</figcaption></figure>`)
  }
}
showAllWorks()
showFilters()

//admin view

if (window.localStorage.getItem("token")) {
  //gestion du lien de déconnexion
  const loginLink = document.getElementById("login-link");
  loginLink.innerHTML = "<li>logout</li>"
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.localStorage.removeItem("token");
    alert("Vous avez bien été déconnecté")
    location.reload();
  })
  
  //effacement des filtres pour cette vue
  const filters = document.querySelector(".filters")
  filters.style.display="none"
}

