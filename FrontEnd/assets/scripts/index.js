showAllWorks();
showFilters();
//déclaration des constantes
const loginLink = document.getElementById("login-link");
const modalBackground = document.getElementById("modal-background");
const modalGallery = document.getElementById("modal-gallery");
const filters = document.querySelector(".filters");
const edit = document.getElementById("edit-button");
const modalNext = document.getElementById("modal-next");
const close = document.getElementById("modal-close");
const modalSend = document.getElementById("modal-send");
const back = document.getElementById("modal-back");
const token = window.localStorage.getItem("token");
const form = document.getElementById("modal-form");
const sendButton = document.getElementById("modal-send");
sendButton.disabled = true;
const datalist = document.getElementById("categorySelect");
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("imageInput");
const uploadContent = document.getElementById("upload-content");
const uploaded = document.getElementById("uploaded");
const reader = new FileReader();
//récupération des travaux depuis le backend
async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const works = await response.json();
    return works;
  } catch (error) {
    console.error(error.message);
  }
}
//récupération des catégories depuis le backend
async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error(error.message);
  }
}
//affichage de tous les travaux (comportement par défaut et sur appel par le filtre "tous")
async function showAllWorks() {
  const works = await getWorks();
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (const i in works) {
    gallery.insertAdjacentHTML(
      "beforeend",
      `<figure><img src="${works[i].imageUrl}" alt="${works[i].title}"><figcaption>${works[i].title}</figcaption></figure>`
    );
  }
}

//affichage des filtres selon les catégories du backend
async function showFilters() {
  const categories = await getCategories();
  const filters = document.querySelector(".filters");
  for (const i in categories) {
    filters.insertAdjacentHTML(
      "beforeend",
      `<button id="categorie${categories[i].id}">${categories[i].name}</button>`
    );
    const button = document.getElementById(`categorie${categories[i].id}`);
    button.addEventListener("click", function () {
      const previousActive = document.querySelector(".active");
      previousActive.classList.remove("active");
      button.classList.add("active");
      showFilteredWorks(categories[i].id);
    });
  }
  const showAllBtn = document.getElementById("allcategories");
  showAllBtn.addEventListener("click", function () {
    const previousActive = document.querySelector(".active");
    previousActive.classList.remove("active");
    this.classList.add("active");
    showAllWorks();
  });
}
//affichage des travaux selon le filtre sélectionné
async function showFilteredWorks(categoryIdFilter) {
  const works = await getWorks();
  const filteredWorks = works.filter(function worksByCategory(el) {
    return el.categoryId == categoryIdFilter;
  });
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (const i in filteredWorks) {
    gallery.insertAdjacentHTML(
      "beforeend",
      `<figure><img src="${filteredWorks[i].imageUrl}" alt="${filteredWorks[i].title}"><figcaption>${filteredWorks[i].title}</figcaption></figure>`
    );
  }
}

//vue administrateur

// s'affiche si l'utilisateur possède un token en localStorage
if (window.localStorage.getItem("token")) {
  //gestion du lien de déconnexion
  loginLink.innerHTML = "<li>logout</li>";
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.localStorage.removeItem("token");
    alert("Vous avez bien été déconnecté");
    location.reload();
  });
  //effacement des filtres pour cette vue
  filters.style.display = "none";
  //affichage du bouton d'édition
  edit.style.display = "inline";
  edit.addEventListener("click", function (e) {
    e.preventDefault();
    modalBackground.style.display = "block";
    showWorksInModal();
  });
  //bouton de fermeture de la modale
  close.addEventListener("click", function () {
    modalBackground.style.display = "none";
    hideModalForm();
  });
  //bouton permettant de passer au formulaire d'ajout dans la modale
  modalNext.addEventListener("click", function (e) {
    e.preventDefault();
    showModalForm();
    categoriesForModal();
  });
  //bouton de retour en arrière dans la modale
  back.addEventListener("click", function () {
    hideModalForm();
  });
}
//permet l'affichage des travaux dans la modale, en ajoutant le bouton de suppression
async function showWorksInModal() {
  const works = await getWorks();
  modalGallery.innerHTML = "";
  for (const i in works) {
    modalGallery.insertAdjacentHTML(
      "beforeend",
      `
      <div class="modal-work">
        <img class="work-img" src="${works[i].imageUrl}" alt="${works[i].title}">
        <img class="delete-btn" id="delete-${works[i].id}" src="assets/icons/delete.png">
      </div>`
    );
    const deleteBtn = document.getElementById(`delete-${works[i].id}`);
    deleteBtn.addEventListener("click", function () {
      deleteWork(works[i].id);
      showWorksInModal();
      showAllWorks();
    });
  }
}
//appel API permettant la suppression des travaux dans le backend
async function deleteWork(id) {
  const url = `http://localhost:5678/api/works/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      alert("Veuillez vous connecter");
      location.reload();
    } else {
      alert(`Vous avez bien supprimé la photo n°${id}`);
    }
  } catch (error) {
    console.error(error.message);
    alert("Erreur de notre côté, veuillez réitérer ultérieurement");
  }
}
//affichage de la fonction de soumission d'une nouvelle image, en cachant la galerie
function showModalForm() {
  modalGallery.style.display = "none";
  back.style.display = "block";
  document.getElementById("modal-title").innerHTML = "Ajout photo";
  document.getElementById("modal-inputs").style.display = "flex";
  modalNext.style.display = "none";
  modalSend.style.display = "block";
}
//masquage du formulaire de soumission pour afficher à nouveau la galerie
function hideModalForm() {
  modalGallery.style.display = "grid";
  back.style.display = "none";
  document.getElementById("modal-title").innerHTML = "Galerie photo";
  document.getElementById("modal-inputs").style.display = "none";
  modalNext.style.display = "block";
  modalSend.style.display = "none";
}

//ajout des options de catégorie pour le formulaire d'ajout
async function categoriesForModal() {
  datalist.innerHTML = "";
  const categories = await getCategories();
  for (const i in categories) {
    datalist.insertAdjacentHTML(
      "beforeend",
      `<option value="${categories[i].id}">${categories[i].name}</option>`
    );
  }
}
//gestion du bouton de soumission du formulaire d'ajout
sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  sendWork(formData);
});
//affichage de l'aperçu de l'image mise en ligne
reader.addEventListener(
  "load",
  () => {
    uploaded.src = reader.result;
    uploadContent.style.display = "none";
    uploaded.style.display = "block";
  },
  false
);
//vérification du remplissage du formulaire pour débloquer le bouton de soumission
function checkFormFilled() {
  const isTitleFilled = titleInput.value.trim() !== "";
  const isImageSelected = imageInput.files.length > 0;
  sendButton.disabled = !(isTitleFilled && isImageSelected);
  //déclenchement de l'aperçu de l'image
  if (isImageSelected) {
    const file = document.querySelector("input[type=file]").files[0];
    //n'afficher l'aperçu et ne prendre en compte l'image que si elle fait moins de 4 Mo et est bien un jpg ou png
    const allowedFileTypes = ["image/png", "image/jpeg"];
    if (Math.round((file.size / 1024)) >= 4096) {
      alert("Fichier trop volumineux, veuillez sélectionner un fichier de moins de 4 Mo");
      imageInput.value = "";
    }
    else if(!allowedFileTypes.includes(file.type)){
      alert("Merci de ne mettre en ligne que des fichier en .jpg ou .png");
      imageInput.value = "";
    }
    else{reader.readAsDataURL(file);} 
  }
}
//vérification du remplissage des champs lorsqu'une image est choisie ou qu'un titre est tapé
titleInput.addEventListener("input", checkFormFilled);
imageInput.addEventListener("change", checkFormFilled);
//vidage du formulaire et suppression de l'aperçu de l'image
function clearForm() {
  titleInput.value = "";
  imageInput.value = "";
  uploadContent.style.display = "flex";
  uploaded.style.display = "none";
  sendButton.disabled = true;
}
//envoi du nouvel ajout dans le backend
async function sendWork(formData) {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
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
    } else if (response.status === 401) {
      alert("Veuillez vous reconnecter");
      location.reload();
    } else {
    }
  } catch (error) {
    console.error(error.message);
    alert("Erreur de notre côté, veuillez réitérer ultérieurement");
  }
}
