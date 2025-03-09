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
 
async function showWorks() {
    const works = await getWorks()
    const gallery = document.querySelector(".gallery")
    for (const i in works) {     
      gallery.innerHTML += `<figure><img src="${works[i].imageUrl}" alt="${works[i].title}"><figcaption>${works[i].title}</figcaption></figure>`   
    }
}
showWorks()

