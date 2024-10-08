function start() {
    let phone = document.getElementById("phone").value;
    regexp = /\+?39\s?\d{3}-?\d{6,7}/gmi
    let found = regexp.test(phone);

    let input = document.getElementById("data-nascita").value;

    if (!input) {
        alert("Inserisci una data di nascita valida.");
        return;
    }

    let birthdate = new Date(input);

    // Ottieni la data attuale
    let today = new Date();

    // Calcola la differenza di anni tra oggi e la data di nascita
    let age = today.getFullYear() - birthdate.getFullYear();

    // Verifica se la persona non ha ancora compiuto gli anni quest'anno
    let month = today.getMonth() - birthdate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (found && age>=18) {
        location.href = 'menu/index.html';
        alert("Login avvenuto con successo!");
    } else {
        alert("troppo piccolo");
    }
}