"use strict";

const endpoint = "https://post-rest-api-default-rtdb.firebaseio.com";

window.addEventListener("load", initApp);

function initApp() {
    updatePostsGrid(); // update the grid of posts: get and show all posts
    updateUsersGrid(); // update the grid of users: get and show all users

    // event listener
    document.querySelector("#btn-create-post").addEventListener("click", showCreatePostDialog);
    document.querySelector("#form-create-post").addEventListener("submit", createPostClicked);
    document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked);
    document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
    document.querySelector("#form-delete-post .btn-cancel").addEventListener("click", deleteCancelClicked);
}

// ============== events ============== //

function showCreatePostDialog() {
    document.querySelector("#dialog-create-post").showModal();
}

function createPostClicked(event) {
    event.preventDefault();
    const form = event.target; // or "this"

    // extract the values from inputs in the form
    const title = form.title.value;
    const body = form.body.value;
    const image = form.image.value;

    createPost(title, body, image); // use value to create a newpost
    form.reset(); // reset the form (resetting input fields)
    document.querySelector("#dialog-create-post").close(); // close dialog
}

function updatePostClicked(event) {
    event.preventDefault();
    const form = event.target; // or "this"
    // extract the values from inputs in the form
    const title = form.title.value;
    const body = form.body.value;
    const image = form.image.value;
    // get id of the post to update - saved in data-id
    const id = form.getAttribute("data-id");
    updatePost(id, title, body, image); // call updatePost with arguments
    document.querySelector("#dialog-update-post").close(); // close dialog
}

function deletePostClicked(event) {
    const id = event.target.getAttribute("data-id"); // event.target is the delete form
    deletePost(id);
}

function deleteCancelClicked() {
    document.querySelector("#dialog-delete-post").close();
}

// ============== posts ============== //

async function updatePostsGrid() {
    const posts = await getPosts(); // get posts from rest endpoint and save in variable
    showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
async function getPosts() {
    const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
    const data = await response.json(); // parse JSON to JavaScript
    const posts = prepareData(data); // convert object of object to array of objects
    return posts; // return posts
}

function showPosts(listOfPosts) {
    document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

    for (const post of listOfPosts) {
        showPost(post); // for every post object in listOfPosts, call showPost
    }
}

function showPost(postObject) {
    const html = /*html*/ `
        <article class="grid-item">
            <img src="${postObject.image}" />
            <h3>${postObject.title}</h3>
            <p>${postObject.body}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
    document.querySelector("#posts").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

    // add event listeners to .btn-delete and .btn-update
    document.querySelector("#posts article:last-child .btn-delete").addEventListener("click", deleteClicked);
    document.querySelector("#posts article:last-child .btn-update").addEventListener("click", updateClicked);

    // called when delete button is clicked
    function deleteClicked() {
        document.querySelector("#dialog-delete-post-title").textContent = postObject.title;
        document.querySelector("#form-delete-post").setAttribute("data-id", postObject.id);
        document.querySelector("#dialog-delete-post").showModal();
    }

    // called when update button is clicked
    function updateClicked() {
        const updateForm = document.querySelector("#form-update-post");
        updateForm.title.value = postObject.title;
        updateForm.body.value = postObject.body;
        updateForm.image.value = postObject.image;
        updateForm.setAttribute("data-id", postObject.id);
        document.querySelector("#dialog-update-post").showModal();
    }
}

// Create a new post - HTTP Method: POST
async function createPost(title, body, image) {
    const newPost = { title, body, image }; // create new post object
    const json = JSON.stringify(newPost); // convert the JS object to JSON string
    // POST fetch request with JSON in the body
    const response = await fetch(`${endpoint}/posts.json`, { method: "POST", body: json });
    // check if response is ok - if the response is successful
    if (response.ok) {
        console.log("New post succesfully added to Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// Update an existing post - HTTP Method: DELETE
async function deletePost(id) {
    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });
    if (response.ok) {
        console.log("New post succesfully deleted from Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// Delete an existing post - HTTP Method: PUT
async function updatePost(id, title, body, image) {
    const postToUpdate = { title, body, image }; // post update to update
    const json = JSON.stringify(postToUpdate); // convert the JS object to JSON string
    // PUT fetch request with JSON in the body. Calls the specific element in resource
    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "PUT", body: json });
    // check if response is ok - if the response is successful

    if (response.ok) {
        console.log("Post succesfully updated in Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// ============== users ============== //

async function updateUsersGrid() {
    const users = await getUsers(); // get users from rest endpoint and save in variable
    showUsers(users); // show all users (append to the DOM) with users as argument
}

async function getUsers() {
    const response = await fetch(`${endpoint}/users.json`); // fetch request, (GET)
    const data = await response.json(); // parse JSON to JavaScript
    const users = prepareData(data); // convert object of object to array of objects
    return users;
}

function showUsers(listOfUsers) {
    // for every user in listOfUsers, showUser
    for (const user of listOfUsers) {
        showUser(user);
    }
}

function showUser(userObject) {
    const html = /*html*/ `
        <article class="grid-item">
            <img src="${userObject.image}" />
            <h3>${userObject.name}</h3>
            <p>${userObject.title}</p>
        </article>
    `;
    document.querySelector("#users").insertAdjacentHTML("beforeend", html);
}

// ============== helper function ============== //

// convert object of objects til an array of objects
function prepareData(dataObject) {
    const array = []; // define empty array
    // loop through every key in dataObject
    // the value of every key is an object
    for (const key in dataObject) {
        const object = dataObject[key]; // define object
        object.id = key; // add the key in the prop id
        array.push(object); // add the object to array
    }
    return array; // return array back to "the caller"
}
