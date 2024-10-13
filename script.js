const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const specialChars = `!@#$%^&*()_+-=[]{}|;':",.<>?/\\~\``;

let password = "";
let passwordlength = 10;
let checkcount = 0;
handleslider();
setIndicator("#ccc");

function handleslider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 10); // Changed 9 to 10 to include the number 9
}

function generatelowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateuppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generatesymbol() {
    const random = getRandomInteger(0, specialChars.length);
    return specialChars.charAt(random);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumber = numbercheck.checked;
    let hasSpecial = symbolcheck.checked;

    if (hasLower && hasUpper && (hasNumber || hasSpecial) && passwordlength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSpecial) && passwordlength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    // span visible 
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

function shufflepassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange() {
    checkcount = 0;
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkcount++;
        }
    });

    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleslider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    if (checkcount <= 0) {
        return;
    }
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        handleslider();
    }
    password = "";

    let passarr = [];
    if (uppercaseCheck.checked) {
        passarr.push(generateuppercase);
    }
    if (lowercaseCheck.checked) {
        passarr.push(generatelowercase);
    }
    if (numbercheck.checked) {
        passarr.push(generateRandomNumber);
    }
    if (symbolcheck.checked) {
        passarr.push(generatesymbol);
    }

    for (let i = 0; i < passarr.length; i++) {
        password += passarr[i]();
    }

    for (let i = 0; i < passwordlength - passarr.length; i++) {
        let randindex = getRandomInteger(0, passarr.length);
        password += passarr[randindex]();
    }

    password = shufflepassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
