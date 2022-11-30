const functions = {
    404: notFound,
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
const page_container = document.getElementById('page-container');
const heading = document.getElementById('heading');

function notFound() {
    heading.innerText = 'Not Found';
}

function register() {
    heading.innerText = 'Register';

    const email_label = document.createElement('label');
    email_label.setAttribute('for', 'email');
    email_label.innerText = 'Email:';

    const email_input = document.createElement('input');
    email_input.setAttribute('type', 'text');
    email_input.setAttribute('id', 'email');
    email_input.setAttribute('name', 'email');
    email_input.setAttribute('placeholder', 'Email');

    const password_label = document.createElement('label');
    password_label.setAttribute('for', 'password');
    password_label.innerText = 'Password (Atleast 8 Characters):';

    const password_input = document.createElement('input');
    password_input.setAttribute('type', 'password');
    password_input.setAttribute('id', 'password');
    password_input.setAttribute('name', 'password');
    password_input.setAttribute('placeholder', 'Password');

    const register_button = document.createElement('button');
    register_button.setAttribute('type', 'submit');
    register_button.setAttribute('id', 'register-button');
    register_button.innerText = 'Register';

    const login_link = document.createElement('a');
    login_link.setAttribute('href', '/login');
    login_link.setAttribute('onclick', 'route()');
    login_link.innerText = 'login';

    const table_row_1 = document.createElement('tr');
    const table_col_11 = document.createElement('td');
    table_col_11.appendChild(email_label);
    const table_col_12 = document.createElement('td');
    table_col_12.appendChild(email_input);
    table_row_1.appendChild(table_col_11);
    table_row_1.appendChild(table_col_12);


    const table_row_2 = document.createElement('tr');
    const table_col_21 = document.createElement('td');
    table_col_21.appendChild(password_label);
    const table_col_22 = document.createElement('td');
    table_col_22.appendChild(password_input);
    table_row_2.appendChild(table_col_21);
    table_row_2.appendChild(table_col_22);

    const table = document.createElement('table');
    table.appendChild(table_row_1);
    table.appendChild(table_row_2);

    page_container.appendChild(table);
    page_container.appendChild(register_button);
    page_container.appendChild(document.createElement('br'));
    page_container.appendChild(login_link);

    register_button.addEventListener('click', async () => {
        const email = email_input.value;
        const password = password_input.value;
        if (password == '') {
            errorMessage('Password Is Empty');
            return;
        }
        const body = {
            'email': email,
            'password': password
        }
        var response;
        try {
            response = await fetch('http://139.59.95.247/backend/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        }
        catch (e) {
            heading.innerText = 'Server Not Reachable';
            return;
        }
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
    heading.innerText = 'Login';

    const email_label = document.createElement('label');
    email_label.setAttribute('for', 'email');
    email_label.innerText = 'Email:';

    const email_input = document.createElement('input');
    email_input.setAttribute('type', 'text');
    email_input.setAttribute('id', 'email');
    email_input.setAttribute('name', 'email');
    email_input.setAttribute('placeholder', 'Email');

    const password_label = document.createElement('label');
    password_label.setAttribute('for', 'password');
    password_label.innerText = 'Password (Atleast 8 Characters):';

    const password_input = document.createElement('input');
    password_input.setAttribute('type', 'password');
    password_input.setAttribute('id', 'password');
    password_input.setAttribute('name', 'password');
    password_input.setAttribute('placeholder', 'Password');

    const login_button = document.createElement('button');
    login_button.setAttribute('type', 'submit');
    login_button.setAttribute('id', 'login-button');
    login_button.innerText = 'Login';

    const register_link = document.createElement('a');
    register_link.setAttribute('href', '/register');
    register_link.setAttribute('onclick', 'route()');
    register_link.innerText = 'register';

    const table_row_1 = document.createElement('tr');
    const table_col_11 = document.createElement('td');
    table_col_11.appendChild(email_label);
    const table_col_12 = document.createElement('td');
    table_col_12.appendChild(email_input);
    table_row_1.appendChild(table_col_11);
    table_row_1.appendChild(table_col_12);


    const table_row_2 = document.createElement('tr');
    const table_col_21 = document.createElement('td');
    table_col_21.appendChild(password_label);
    const table_col_22 = document.createElement('td');
    table_col_22.appendChild(password_input);
    table_row_2.appendChild(table_col_21);
    table_row_2.appendChild(table_col_22);

    const table = document.createElement('table');
    table.appendChild(table_row_1);
    table.appendChild(table_row_2);

    page_container.appendChild(table);
    page_container.appendChild(login_button);
    page_container.appendChild(document.createElement('br'));
    page_container.appendChild(register_link);

    login_button.addEventListener('click', async () => {
        const email = email_input.value;
        const password = password_input.value;
        const body = {
            'email': email,
            'password': password
        }
        var response;
        try {
            response = await fetch('http://139.59.95.247/backend/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        }
        catch (e) {
            heading.innerText = 'Server Not Reachable';
            return;
        }
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
    heading.innerText = 'logout';

    var response;
    try {
        response = await fetch('http://139.59.95.247/backend/logout', {
            method: 'POST',
            credentials: 'include',
        });
    }
    catch (e) {
        heading.innerText = 'Server Not Reachable';
        return;
    }
    if (response.status == 200 || response.status == 401 || response.status == 403) {
        window.history.pushState({}, '', '/login');
        handleRoute();
    }
    else {
        errorMessage('Logout Failed');
    }
}

async function home() {
    heading.innerText = 'Movie List';

    const add_link = document.createElement('a');
    add_link.setAttribute('href', '/add');
    add_link.setAttribute('onclick', 'route()');
    add_link.innerText = 'Add movie';

    const logout_link = document.createElement('a');
    logout_link.setAttribute('href', '/logout');
    logout_link.setAttribute('onclick', 'route()');
    logout_link.innerText = 'Logout';

    page_container.appendChild(add_link);
    page_container.appendChild(document.createElement('br'));
    page_container.appendChild(logout_link);

    var movies_fetch
    try {
        movies_fetch = await fetch('http://139.59.95.247/backend/', {
            method: 'GET',
            credentials: 'include',
        });
    }
    catch (e) {
        heading.innerText = 'Server Not Reachable';
        return;
    }
    if (movies_fetch.status == 401 || movies_fetch.status == 403) {
        if (movies_fetch.status == 403) {
            errorMessage('Session Expired');
        }
        window.history.pushState({}, '', '/login');
        handleRoute();
    }
    else {
        movies = await movies_fetch.json();

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
                var response;
                try {
                    response = await fetch('http://139.59.95.247/backend/delete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ 'id': event.target.getAttribute('id') })
                    });
                }
                catch (e) {
                    heading.innerText = 'Server Not Reachable';
                    return;
                }
                if (response.status == 200) {
                    clearErrorMessage();
                    window.history.pushState({}, '', '/');
                    handleRoute();
                }
                else if (response.status == 401 || response.status == 403) {
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

            page_container.appendChild(container);
        });
        if (movies.length == 0) {
            const h3 = document.createElement('h3');
            h3.innerText = 'There are no movies to show';
            page_container.appendChild(h3);
        }
    }
}

function add() {
    heading.innerText = 'Add Movie';

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
        cast_delete.innerText = 'delete';
        cast_item.appendChild(cast_input);
        cast_item.appendChild(cast_delete);
        cast_list.appendChild(cast_item);
    });
    add_cast.innerText = 'add cast';

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
            body['movie_cast'].push(cast_list.children[i].getElementsByTagName('input')[0].value);
        }

        var response;
        try {
            response = await fetch('http://139.59.95.247/backend/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        }
        catch (e) {
            heading.innerText = 'Server Not Reachable';
            return;
        }
        if (response.status == 200) {
            clearErrorMessage();
            window.history.pushState({}, '', '/');
            handleRoute();
        }
        else if (response.status == 401 || response.status == 403) {
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

    page_container.appendChild(container);
}

function edit() {
    var element;
    movies.forEach((e) => {
        if (e['id'] == update_index) {
            element = e;
        }
    });
    if (!(element)) {
        window.history.pushState({}, '', '/');
        handleRoute();
    }

    heading.innerText = 'Edit Movie';

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
        cast_delete.innerText = 'delete';
        cast_item.appendChild(cast_input);
        cast_item.appendChild(cast_delete);
        cast_list.appendChild(cast_item);
    });
    add_cast.innerText = 'add cast';
    element['movie_cast'].forEach((e) => {
        const cast_item = document.createElement('li');
        const cast_input = document.createElement('input');
        cast_input.value = e;
        const cast_delete = document.createElement('button');
        cast_delete.addEventListener('click', (event) => {
            cast_list.removeChild(event.target.parentNode)
        });
        cast_delete.innerText = 'delete';
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
            body['movie_cast'].push(cast_list.children[i].getElementsByTagName('input')[0].value);
        }
        var response;
        try {
            response = await fetch('http://139.59.95.247/backend/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        }
        catch (e) {
            heading.innerText = 'Server Not Reachable';
            return;
        }
        if (response.status == 200) {
            clearErrorMessage();
            window.history.pushState({}, '', '/');
            handleRoute();
        }
        else if (response.status == 401 || response.status == 403) {
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

    page_container.appendChild(container);
}

function errorMessage(message) {
    error_message.innerText = message;
}

function clearErrorMessage() {
    error_message.innerText = '';
}

function route(event) {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    handleRoute();
};

async function handleRoute() {
    const route_name = window.location.pathname;
    const func = functions[route_name] || functions[404];
    page_container.innerHTML = '';
    func();
}

window.onpopstate = handleRoute;
handleRoute();
