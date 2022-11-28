const routes = {
    404: '/html/404.html',
    '/': '/html/home.html',
    '/login': '/html/login.html',
    '/register': '/html/register.html',
    '/logout': '/html/logout.html',
    '/edit': '/html/edit.html',
    '/add': '/html/add.html'
};

const scripts = {
    404: null,
    '/': home,
    '/login': login,
    '/register': register,
    '/logout': logout,
    '/edit': edit,
    '/add': add
};

var movies;
var update_index;
const error_message = document.getElementById('error');

function register() {
    const register = document.getElementById('register-button');
    register.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (password == '') {
            errorMessage('Password Is Empty');
            return;
        }
        const body = {
            'email': email,
            'password': password
        }
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.status == 201) {
            clearErrorMessage();
            window.history.pushState({}, '', '/login');
            handleRoute();
        }
        else {
            errorMessage(await response.text());
        }
    });
}

function login() {
    const login = document.getElementById('login-button');
    login.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const body = {
            'email': email,
            'password': password
        }
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.status == 200) {
            clearErrorMessage();
            window.history.pushState({}, '', '/');
            handleRoute();
        }
        else {
            errorMessage(await response.text());
        }
    });
}

async function logout() {
    const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
    });
    if (response.status == 200 || response.status >= 401) {
        window.history.pushState({}, '', '/login');
        handleRoute();
    }
    else {
        errorMessage('Logout Failed');
    }
}

async function home() {
    const movies_fetch = await fetch('http://localhost:8080/', {
        method: 'GET',
        credentials: 'include',
    });
    if (movies_fetch.status >= 401) {
        if (movies_fetch.status == 403) {
            errorMessage('Session Expired');
        }
        window.history.pushState({}, '', '/login');
        handleRoute();
    }
    else {
        movies = await movies_fetch.json();

        const home_page = document.getElementById('home');
        movies.forEach(element => {
            const container = document.createElement('div');
            const table = document.createElement('table');

            const movie_name = document.createElement('tr');
            const movie_name_heading = document.createElement('td');
            movie_name_heading.innerText = 'Movie Name:';
            const movie_name_value = document.createElement('td');
            movie_name_value.innerText = element['movie_name'];
            movie_name.appendChild(movie_name_heading);
            movie_name.appendChild(movie_name_value);

            const genre = document.createElement('tr');
            const genre_heading = document.createElement('td');
            genre_heading.innerText = 'Genre:';
            const genre_value = document.createElement('td');
            genre_value.innerText = element['genre'];
            genre.appendChild(genre_heading);
            genre.appendChild(genre_value);

            const release_date = document.createElement('tr');
            const release_date_heading = document.createElement('td');
            release_date_heading.innerText = 'Release Date:';
            const release_date_value = document.createElement('td');
            release_date_value.innerText = (new Date(element['release_date'])).toDateString();
            release_date.appendChild(release_date_heading);
            release_date.appendChild(release_date_value);

            const rating = document.createElement('tr');
            const rating_heading = document.createElement('td');
            rating_heading.innerText = 'Rating (1-10):';
            const rating_value = document.createElement('td');
            rating_value.innerText = element['rating'];
            rating.appendChild(rating_heading);
            rating.appendChild(rating_value);

            const cast = document.createElement('tr');
            const cast_heading = document.createElement('td');
            cast_heading.innerText = 'Cast:';
            const cast_value = document.createElement('td');
            const cast_list = document.createElement('ul');
            element['movie_cast'].forEach(element => {
                const cast_name = document.createElement('li');
                cast_name.innerText = element;
                cast_list.appendChild(cast_name);
            });
            cast_value.appendChild(cast_list);
            cast.appendChild(cast_heading);
            cast.appendChild(cast_value);

            table.appendChild(movie_name);
            table.append(genre);
            table.append(release_date);
            table.append(rating);
            table.append(cast);

            const edit_button = document.createElement('button');
            edit_button.setAttribute('id', element[['id']]);
            edit_button.addEventListener('click', (event) => {
                update_index = event.target.getAttribute('id');
                window.history.pushState({}, '', '/edit');
                handleRoute();
            });
            edit_button.innerText = 'edit';

            const del_button = document.createElement('button');
            del_button.setAttribute('id', element[['id']]);
            del_button.addEventListener('click', async (event) => {
                const response = await fetch('http://localhost:8080/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 'id': event.target.getAttribute('id') })
                });
                if (response.status == 200) {
                    clearErrorMessage();
                    window.history.pushState({}, '', '/');
                    handleRoute();
                }
                else if (response.status >= 401) {
                    errorMessage('Session Expired');
                    window.history.pushState({}, '', '/login');
                    handleRoute();
                }
                else {
                    errorMessage(await response.text());
                }
            });
            del_button.innerText = 'delete';

            container.appendChild(table);
            container.append(edit_button);
            container.append(del_button);

            home_page.appendChild(container);
        });
    }
}

function add() {
    const add_page = document.getElementById('add');

    const container = document.createElement('div');
    const table = document.createElement('table');

    const movie_name = document.createElement('tr');
    const movie_name_heading = document.createElement('td');
    movie_name_heading.innerText = 'Movie Name:';
    const movie_name_value = document.createElement('td');
    const movie_name_input = document.createElement('input');
    movie_name_value.appendChild(movie_name_input);
    movie_name.appendChild(movie_name_heading);
    movie_name.appendChild(movie_name_value);

    const genre = document.createElement('tr');
    const genre_heading = document.createElement('td');
    genre_heading.innerText = 'Genre:';
    const genre_value = document.createElement('td');
    const genre_input = document.createElement('input');
    genre_value.appendChild(genre_input);
    genre.appendChild(genre_heading);
    genre.appendChild(genre_value);

    const release_date = document.createElement('tr');
    const release_date_heading = document.createElement('td');
    release_date_heading.innerText = 'Release Date:';
    const release_date_value = document.createElement('td');
    const release_date_input = document.createElement('input');
    release_date_input.setAttribute('type', 'date');
    release_date_value.appendChild(release_date_input);
    release_date.appendChild(release_date_heading);
    release_date.appendChild(release_date_value);

    const rating = document.createElement('tr');
    const rating_heading = document.createElement('td');
    rating_heading.innerText = 'Rating (1-10):';
    const rating_value = document.createElement('td');
    const rating_input = document.createElement('input');
    rating_value.appendChild(rating_input);
    rating.appendChild(rating_heading);
    rating.appendChild(rating_value);

    const cast = document.createElement('tr');
    const cast_heading = document.createElement('td');
    cast_heading.innerText = 'Cast:';
    const cast_value = document.createElement('td');
    const cast_list = document.createElement('ul');
    const add_cast = document.createElement('button');
    add_cast.addEventListener('click', () => {
        const cast_item = document.createElement('li');
        const cast_input = document.createElement('input');
        const cast_delete = document.createElement('button');
        cast_delete.addEventListener('click', (event) => {
            cast_list.removeChild(event.target.parentNode)
        });
        cast_delete.innerText = "delete";
        cast_item.appendChild(cast_input);
        cast_item.appendChild(cast_delete);
        cast_list.appendChild(cast_item);
    });
    add_cast.innerText = "add cast";

    cast_value.appendChild(cast_list);
    cast_value.appendChild(add_cast);
    cast.appendChild(cast_heading);
    cast.appendChild(cast_value);

    table.appendChild(movie_name);
    table.append(genre);
    table.append(release_date);
    table.append(rating);
    table.append(cast);

    const save_button = document.createElement('button');
    save_button.addEventListener('click', async (event) => {
        let body = {};
        body['movie_name'] = movie_name_input.value;
        body['genre'] = genre_input.value;
        body['release_date'] = release_date_input.value;
        body['rating'] = rating_input.value;
        body['movie_cast'] = [];
        for (var i = 0; i < cast_list.children.length; i++) {
            body['movie_cast'].push(cast_list.children[i].getElementsByTagName("input")[0].value);
        }
        const response = await fetch('http://localhost:8080/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.status == 200) {
            clearErrorMessage();
            window.history.pushState({}, '', '/');
            handleRoute();
        }
        else if (response.status >= 401) {
            errorMessage('Session Expired');
            window.history.pushState({}, '', '/login');
            handleRoute();
        }
        else {
            errorMessage(await response.text());
        }
    });
    save_button.innerText = 'save';

    container.appendChild(table);
    container.append(save_button);

    add_page.appendChild(container);
}

function edit() {
    var element;
    movies.forEach((e) => {
        if (e['id'] == update_index) {
            element = e;
        }
    });

    const edit_page = document.getElementById('edit');

    const container = document.createElement('div');
    const table = document.createElement('table');

    const movie_name = document.createElement('tr');
    const movie_name_heading = document.createElement('td');
    movie_name_heading.innerText = 'Movie Name:';
    const movie_name_value = document.createElement('td');
    const movie_name_input = document.createElement('input');
    movie_name_input.value = element['movie_name'];
    movie_name_value.appendChild(movie_name_input);
    movie_name.appendChild(movie_name_heading);
    movie_name.appendChild(movie_name_value);

    const genre = document.createElement('tr');
    const genre_heading = document.createElement('td');
    genre_heading.innerText = 'Genre:';
    const genre_value = document.createElement('td');
    const genre_input = document.createElement('input');
    genre_input.value = element['genre'];
    genre_value.appendChild(genre_input);
    genre.appendChild(genre_heading);
    genre.appendChild(genre_value);

    const release_date = document.createElement('tr');
    const release_date_heading = document.createElement('td');
    release_date_heading.innerText = 'Release Date:';
    const release_date_value = document.createElement('td');
    const release_date_input = document.createElement('input');
    release_date_input.setAttribute('type', 'date');
    const automatic_timezone_detection_sucks_date = new Date(element['release_date']);
    const automatic_timezone_detection_sucks = automatic_timezone_detection_sucks_date.getTime();
    const time_offset = automatic_timezone_detection_sucks_date.getTimezoneOffset() * 60 * 1000;
    release_date_input.valueAsDate = new Date(automatic_timezone_detection_sucks - time_offset);
    release_date_value.appendChild(release_date_input);
    release_date.appendChild(release_date_heading);
    release_date.appendChild(release_date_value);

    const rating = document.createElement('tr');
    const rating_heading = document.createElement('td');
    rating_heading.innerText = 'Rating (1-10):';
    const rating_value = document.createElement('td');
    const rating_input = document.createElement('input');
    rating_input.value = element['rating'];
    rating_value.appendChild(rating_input);
    rating.appendChild(rating_heading);
    rating.appendChild(rating_value);

    const cast = document.createElement('tr');
    const cast_heading = document.createElement('td');
    cast_heading.innerText = 'Cast:';
    const cast_value = document.createElement('td');
    const cast_list = document.createElement('ul');
    const add_cast = document.createElement('button');
    add_cast.addEventListener('click', () => {
        const cast_item = document.createElement('li');
        const cast_input = document.createElement('input');
        const cast_delete = document.createElement('button');
        cast_delete.addEventListener('click', (event) => {
            cast_list.removeChild(event.target.parentNode)
        });
        cast_delete.innerText = "delete";
        cast_item.appendChild(cast_input);
        cast_item.appendChild(cast_delete);
        cast_list.appendChild(cast_item);
    });
    add_cast.innerText = "add cast";
    element['movie_cast'].forEach((e) => {
        const cast_item = document.createElement('li');
        const cast_input = document.createElement('input');
        cast_input.value = e;
        const cast_delete = document.createElement('button');
        cast_delete.addEventListener('click', (event) => {
            cast_list.removeChild(event.target.parentNode)
        });
        cast_delete.innerText = "delete";
        cast_item.appendChild(cast_input);
        cast_item.appendChild(cast_delete);
        cast_list.appendChild(cast_item);
    })


    cast_value.appendChild(cast_list);
    cast_value.appendChild(add_cast);
    cast.appendChild(cast_heading);
    cast.appendChild(cast_value);

    table.appendChild(movie_name);
    table.append(genre);
    table.append(release_date);
    table.append(rating);
    table.append(cast);

    const save_button = document.createElement('button');
    save_button.addEventListener('click', async () => {
        let body = {};
        body['id'] = update_index;
        body['movie_name'] = movie_name_input.value;
        body['genre'] = genre_input.value;
        body['release_date'] = release_date_input.value;
        body['rating'] = rating_input.value;
        body['movie_cast'] = [];
        for (var i = 0; i < cast_list.children.length; i++) {
            body['movie_cast'].push(cast_list.children[i].getElementsByTagName("input")[0].value);
        }
        const response = await fetch('http://localhost:8080/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.status == 200) {
            clearErrorMessage();
            window.history.pushState({}, '', '/');
            handleRoute();
        }
        else if (response.status >= 401) {
            errorMessage('Session Expired');
            window.history.pushState({}, '', '/login');
            handleRoute();
        }
        else {
            errorMessage(await response.text());
        }
    });
    save_button.innerText = 'save';

    container.appendChild(table);
    container.append(save_button);

    edit_page.appendChild(container);
}

function errorMessage(message) {
    error_message.innerText = message;
}

function clearErrorMessage() {
    error_message.innerText = "";
}

function route(event) {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    handleRoute();
};

async function handleRoute() {
    const route_name = window.location.pathname;
    const route = routes[route_name] || routes[404];
    const html = await fetch(route).then(res => res.text());
    document.getElementById('page').innerHTML = html;
    scripts[route_name]();
}

window.onpopstate = handleRoute;
window.history.pushState({}, '', '/');
handleRoute();
