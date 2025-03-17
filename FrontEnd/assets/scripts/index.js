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
    showAllWorks()
  })
}
async function showAllWorks() {
  const works = await getWorks()
  const gallery = document.querySelector(".gallery")
  gallery.innerHTML = ""
  for (const i in works) {
    gallery.insertAdjacentHTML("beforeend", `<figure><img src="${works[i].imageUrl}" alt="${works[i].title}"><figcaption>${works[i].title}</figcaption></figure>`)
  }
}
async function showFilteredWorks(categoryIdFilter) {
  gallery.innerHTML = ""
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
  const modalBackground = document.getElementById("modal-background");
  const modalGallery = document.getElementById("modal-gallery")
  //effacement des filtres pour cette vue
  const filters = document.querySelector(".filters");
  filters.style.display = "none";
  //affichage du bouton d'édition
  const edit = document.getElementById("edit-button");
  edit.style.display = "inline"
  edit.addEventListener("click", function (e) {
    e.preventDefault();
    const modalBackground = document.getElementById("modal-background");
    modalBackground.style.display = "block";
    showWorksInModal()
  })
  const close = document.getElementById("modal-close");
  close.addEventListener("click", function () {
    modalBackground.style.display = "none";
    hideModalForm();
  })
  
  const modalSubmit = document.getElementById("modal-submit")
  modalSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    showModalForm();
    categoriesForModal();
  })

  const back = document.getElementById("modal-back");
  back.addEventListener("click", function () {
    hideModalForm();
  })
  async function showWorksInModal() {
    modalGallery.innerHTML = "";
    const works = await getWorks();
    for (const i in works) {
      modalGallery.insertAdjacentHTML("beforeend", `
        <div class="modal-work">
          <img class="work-img" src="${works[i].imageUrl}" alt="${works[i].title}">
          <img class="delete-btn" id="delete-${works[i].id}" src="assets/icons/delete.png">
        </div>`)
      const deleteBtn = document.getElementById(`delete-${works[i].id}`)
      deleteBtn.addEventListener("click", function () {
        deleteWork(works[i].id);
        showWorksInModal();
        showAllWorks();
      });
    }
  }
  async function deleteWork(id) {
    const url = `http://localhost:5678/api/works/${id}`;
    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "accept": "accept: */*",
          "Authorization": `Bearer ${token}`
        },
      });
      if (response.status === 401) {
        alert("Veuillez vous connecter");
        location.reload();
      }
      else {
        alert(`Vous avez bien supprimé la photo n°${id}`)
      }
    } catch (error) {
      console.error(error.message);
      alert("Erreur de notre côté, veuillez réitérer ultérieurement");
    }
  }
  function showModalForm(){
    modalGallery.style.display = "none";
    back.style.display = "block";
    document.getElementById("modal-title").innerHTML = "Ajout photo";
    document.getElementById("modal-form").style.display = "flex";
    modalSubmit.value="Valider";
    modalSubmit.style.background = "#A7A7A7";
  }
  function hideModalForm(){
    modalGallery.style.display = "grid";
    back.style.display = "none";
    document.getElementById("modal-title").innerHTML = "Gallerie photo";
    document.getElementById("modal-form").style.display = "none";
    modalSubmit.value="Ajouter une photo";
    modalSubmit.style.removeProperty("background");
  }
}
async function categoriesForModal(){
  const datalist = document.getElementById("categorieSelect");
  datalist.innerHTML = "";
  const categories = await getCategories();
  for (const i in categories) {
    datalist.insertAdjacentHTML("beforeend",`<option value="${categories[i].id}">${categories[i].name}</option>`)
  }
}
