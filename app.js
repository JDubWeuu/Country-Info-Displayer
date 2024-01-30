FIRST_PART_URL = "https://restcountries.com/v3.1/name/";

const nameInput = document.querySelector("#country");
const button = document.querySelector(".submit");
const form = document.querySelector('.user_input');
const screen = document.querySelector('.country_show');
const secondInput = document.querySelector('.second_input')

const backButton = document.querySelector('.back_button');
backButton.addEventListener('click', () => {
    form.classList.toggle('up');
    screen.classList.toggle('up');
    nameInput.value = '';
    const properties = document.querySelectorAll('input[type="checkbox"]');
    for (let checkbox of properties) {
        if (checkbox.checked) {
            checkbox.checked = false;
        }
    }
    const ul = document.querySelector('ul');
    while (ul.firstChild) {
        ul.firstChild.remove();
    }
})

nameInput.addEventListener('keydown', (e) => {;
    if (e.key === "Enter" && nameInput.value !== '') {
        e.preventDefault();
        let secondPage = document.querySelector('.second_input');
        checkValidCountry(nameInput.value)
            .then((valid) => {
                console.log("Valid input");
                form.classList.toggle('up');
                secondPage.classList.toggle('up');
            })
            .catch((error) => {
                console.error(error);
            })
    }
})

button.addEventListener('click', (e) => {
    e.preventDefault();
    fetchData(nameInput.value)
        .then((data) => {
            console.log(data);
            if (data && data.length > 0) {
                // add the information on new screen (from the api), and then switch screens
                screen.children[0].src = data[0].flags.png;
                screen.children[0].style.margin = "10px";
                screen.children[0].style.borderRadius = "0.6em";
                screen.children[0].style.border = "1.5px solid black";
                // console.log(Object.keys(data[0].currencies)[0]);
                const properties = document.querySelectorAll('input[type="checkbox"]');
                const ul = document.querySelector('ul');
                const h1 = document.querySelector('.name');
                h1.innerText = data[0].name['common'];
                for (const check of properties) {
                    if (check.checked) {
                        switch (check.id) {
                            case 'currency':
                                showCurrency(data, ul);
                                break;
                            case 'capital_city':
                                showCapital(data, ul);
                                break;
                            case 'population':
                                population(data, ul);
                                break;
                            case 'languages':
                                officialLanguages(data, ul);
                                break;
                            case 'region':
                                region(data, ul);
                                break;
                            default:
                                console.log("Unhandled checkbox", check.id);
                        }

                    }
                }
                secondInput.classList.toggle('up');
                screen.classList.toggle('up');
            }
            else {
                console.error("No data found for this country");
            }
        })
        .catch((error) => {
            console.error("Error fetching data", error);
        })
})



const showCurrency = (data, ul) => {
    const li = document.createElement('li');
    li.innerText = `Currency: ${Object.keys(data[0].currencies)[0]}`;
    if (ul) {
        ul.appendChild(li);
    }
}

const showCapital = (data, ul) => {
    const li = document.createElement('li');
    li.innerText = `Capital City: ${data[0].capital[0]}`;
    if (ul) {
        ul.appendChild(li);
    }
}

const population = (data, ul) => {
    const li = document.createElement('li');
    li.innerText = `Population: ${data[0].population}`;
    if (ul) {
        ul.appendChild(li);
    }
}

const officialLanguages = (data, ul) => {
    const li = document.createElement('li');
    li.innerText = `Languages: ${Object.values(data[0].languages)}`;
    if (ul) {
        ul.appendChild(li);
    }
}

const region = (data, ul) => {
    const li = document.createElement('li');
    li.innerText = `Region: ${data[0].region}`;
    if (ul) {
        ul.appendChild(li);
    }
}

async function checkValidCountry(val) {
    try {
        let response = await fetch(FIRST_PART_URL + `${val.toLowerCase()}?fullText=true`);
        if (response.ok) {
            return true;
        }
        else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        throw error;
    }
}



async function fetchData(name) {
    if (!name) {
        return;
    }
    try {
        let response = await fetch(FIRST_PART_URL + `${name.toLowerCase()}?fullText=true`);
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        throw error;
    }
}
