const usernameElement = document.querySelector("#username");
const passwordElement = document.querySelector("#password");
const confirmpasswordElement = document.querySelector("#confirmpassword");
const form = document.querySelector("#form");
const goodpassword = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
let pwd2 = document.getElementById("confirmpassword");
let pwd = document.getElementById("password");
const togglePassword = document.querySelector('#togglePassword');
const togglePassword2 = document.querySelector('#togglePassword2');


//Funktion zum Togglen des Passwort-Visibility
togglePassword.addEventListener('click', function(e) {
    const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

togglePassword2.addEventListener('click', function(e) {
    const type = pwd2.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd2.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

/*function showPassword() {
    if (pwd.type === "password") {
        pwd.type = "text";
    } else {
        pwd.type = "password";
    }
}

function showPassword2() {
    if (pwd2.type === "password") {
        pwd2.type = "text";
    } else {
        pwd2.type = "password";
    }
}*/

const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.remove('success');
    formField.classList.add('error');
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');
    const error = formField.querySelector('small');
    error.textContent = '';
};

const checkUsername = () => {
    let valid = false;
    const min = 3,
        max = 10;
    const username = usernameElement.value.trim();

    if (!isRequired(username)) {
        showError(usernameElement, 'Feld darf nicht leer sein.');
    } else if (!isBetween(username.length, min, max)) {
        showError(usernameElement, `Benutzername muss mind. ${min} und max. ${max} Zeichen lang sein.`);
    } else {
        showSuccess(usernameElement);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordElement.value.trim();

    if (!isRequired(password)) {
        showError(passwordElement, 'Feld darf nicht leer sein.');
    } else if (!goodpassword(password)) {
        showError(passwordElement, `Passwort muss mind. 8 Zeichen lang sein: mind. 1 Kleinbuchstaben, 1 Großbuchstaben, 1 Ziffern & 1 Sonderzeichen(!@#\$%\^&\*).`);
    } else {
        showSuccess(passwordElement);
        document.getElementById("btn").disabled = false;
        valid = true;
    }
    return valid;
};

const checkConfirmPassword = () => {
    let valid = false;
    const confirmPassword = confirmpasswordElement.value.trim();
    const password = passwordElement.value.trim();

    if (!isRequired(confirmPassword)) {
        showError(confirmpasswordElement, 'Passwort bitte wiederholen.');
    } else if (password !== confirmPassword) {
        showError(confirmpasswordElement, 'Passwörter stimmen nicht überein.');
    } else {
        showSuccess(confirmpasswordElement);
        valid = true;
    }
    return valid;
};

//https://codeforgeek.com/debounce-function-javascript/
const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

form.addEventListener("input", debounce(function(e) {
    switch (e.target.id) {
        case "username":
            checkUsername();
            break;
        case "password":
            checkPassword();
            break;
        case "confirmpassword":
            checkConfirmPassword();
            break;
    }
}));