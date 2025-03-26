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

//vue administrateur

//selection des éléments
const loginLink = document.getElementById("login-link");
const modalBackground = document.getElementById("modal-background");
const modalGallery = document.getElementById("modal-gallery");
const filters = document.querySelector(".filters");
const edit = document.getElementById("edit-button");
const modalNext = document.getElementById("modal-next")
const close = document.getElementById("modal-close");
const modalSend = document.getElementById("modal-send")
const back = document.getElementById("modal-back");

// s'affiche si l'utilisateur possède un token en localStorage
if (window.localStorage.getItem("token")) {

  //gestion du lien de déconnexion
  loginLink.innerHTML = "<li>logout</li>"
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.localStorage.removeItem("token");
    alert("Vous avez bien été déconnecté")
    location.reload();
  })
  //effacement des filtres pour cette vue
  filters.style.display = "none";
  //affichage du bouton d'édition
  edit.style.display = "inline";
  edit.addEventListener("click", function (e) {
    e.preventDefault();
    modalBackground.style.display = "block";
    showWorksInModal()
  })
  //bouton de fermeture de la modale
  close.addEventListener("click", function () {
    modalBackground.style.display = "none";
    hideModalForm();
  })
  //bouton permettant de passer au formulaire d'ajout dans la modale
  modalNext.addEventListener("click", function (e) {
    e.preventDefault();
    showModalForm();
    categoriesForModal();
  })
  //bouton de retour en arrière dans la modale
  back.addEventListener("click", function () {
    hideModalForm();
  })
}
async function showWorksInModal() {
  const works = await getWorks();
  modalGallery.innerHTML = "";
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
      headers: {"Authorization": `Bearer ${token}`},
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
  document.getElementById("modal-inputs").style.display = "flex";
  modalNext.style.display ="none";
  modalSend.style.display = "block";
}
function hideModalForm(){
  modalGallery.style.display = "grid";
  back.style.display = "none";
  document.getElementById("modal-title").innerHTML = "Gallerie photo";
  document.getElementById("modal-inputs").style.display ="none";
  modalNext.style.display ="block";
  modalSend.style.display ="none";
}

const form = document.getElementById("modal-form");
const sendButton = document.getElementById("modal-send");
sendButton.disabled = true;
const datalist = document.getElementById("categorySelect");
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("imageInput");
const uploadContent = document.getElementById("upload-content");
const uploaded = document.getElementById("uploaded")
async function categoriesForModal(){
  datalist.innerHTML = "";
  const categories = await getCategories();
  for (const i in categories) {
    datalist.insertAdjacentHTML("beforeend",`<option value="${categories[i].id}">${categories[i].name}</option>`)
  }
}
sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    sendWork(formData);
})
const reader = new FileReader();
reader.addEventListener("load",  () => {
  uploaded.src = reader.result;
  uploadContent.style.display="none"
  uploaded.style.display="block"},
  false,
);
function checkFormFilled() {
  const isTitleFilled = titleInput.value.trim() !== "";
  const isImageSelected = imageInput.files.length > 0;
  sendButton.disabled = !(isTitleFilled && isImageSelected);
  
  if(isImageSelected){
    const file = document.querySelector("input[type=file]").files[0];
    reader.readAsDataURL(file);
  }
}
titleInput.addEventListener("input", checkFormFilled);
imageInput.addEventListener("change", checkFormFilled);
function clearForm(){
  titleInput.value = "";
  imageInput.value = "";
  uploadContent.style.display="flex";
  uploaded.style.display="none";
  sendButton.disabled = true;
}

async function sendWork(formData) {
  const url = "http://localhost:5678/api/works";
  try {
      const token = window.localStorage.getItem("token");
      const response = await fetch(url, {
          method: "POST",
          headers: {"Authorization": `Bearer ${token}`},
          body: formData,
      });
      if (response.status === 201) {
          alert("Travail ajouté avec succès");
          hideModalForm();
          showAllWorks();
          showWorksInModal();
          clearForm();
      }
      if (response.status === 400) {
        alert("Erreur dans la saisie");
        location.reload();
      }
      else if (response.status === 401) {
          alert("Veuillez vous reconnecter");
          location.reload();
      }
      else {
      }
  } catch (error) {
      console.error(error.message);
      alert("Erreur de notre côté, veuillez réitérer ultérieurement");
  }
}