if (window.localStorage.getItem("token")) {
    alert("Vous êtes déjà connecté");
    location.replace("index.html")
}
async function login(email, password) {
    const url = "http://localhost:5678/api/users/login";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ "email": email, "password": password }),
        });
        if (response.status === 404) {
            alert("Utilisateur inconnu");
            location.reload();
        }
        else if (response.status === 401) {
            alert("Mot de passe incorrect");
            location.reload();
        }
        else {
            const result = await response.json();
            token = result.token;
            console.log(token)
            window.localStorage.setItem("token", token);
            window.location.replace("index.html")
        }
    } catch (error) {
        console.error(error.message);
        alert("Erreur de notre côté, veuillez réitérer ultérieurement");
    }
}
//login("sophie.bluel@test.tld", "S0phie")

const form = document.getElementById("login-form");
const loginButton = document.getElementById("login-submit");
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    login(email, password);
})