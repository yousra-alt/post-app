"use strict";

const endpoint = "https://post-rest-api-default-rtdb.firebaseio.com";

window.addEventListener("load", initApp);

function initApp() {
    // update the grid of posts: get and show all posts
    updatePostsGrid();
    // update the grid of users: get and show all users
    updateUsersGrid();

    // event listener for create new post button
    document.querySelector("#btn-create-post").addEventListener("click", createPostClicked);
}

// ============== events ============== //

function createPostClicked() {
    const randomNumber = Math.floor(Math.random() * 100 + 1);
    const title = `My Post Title Number ${randomNumber}`;
    const body = "Quo deleniti praesentium dicta non quod aut est molestias molestias et officia quis nihil itaque dolorem quia";
    const image =
        "https://plus.unsplash.com/premium_photo-1675330628475-b4e0e2a3c4a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60";
    // call updacreatePost with "hard coded" values - tbd: values from a form
    createPost(title, body, image);
}

// ============== posts ============== //

async function updatePostsGrid() {
    // get posts from rest endpoint and save in variable
    const posts = await getPosts();
    // show all posts (append to the DOM) with posts as argument
    showPosts(posts);
}

async function getPosts() {
    const res = await fetch(`${endpoint}/posts.json`);
    const data = await res.json();
    const posts = prepareData(data);
    return posts;
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
        deletePost(postObject.id); // calls deletePost with the id of the post as argument (parameter)
    }

    // called when update button is clicked
    function updateClicked() {
        const title = `${postObject.title} Updated 🔥`;
        const body = "Doloremque ex facilis sit sint culpa soluta assumenda eligendi non ut eius sequi ducimus vel quasi veritatis est dolores";
        const image =
            "https://images.unsplash.com/photo-1465779171454-aa85ccf23be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bG9vcHN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60";
        // call update post with "hard coded" values - tbd: values from a form
        updatePost(postObject.id, title, body, image);
    }
}

// Create a new post - HTTP Method: POST
async function createPost(title, body, image) {
    const newPost = { title, body, image };
    const json = JSON.stringify(newPost);

    const response = await fetch(`${endpoint}/posts.json`, { method: "POST", body: json });

    if (response.ok) {
        console.log("New post succesfully added to Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// Update an existing post - HTTP Method: PUT
async function deletePost(id) {
    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "DELETE" });
    if (response.ok) {
        console.log("New post succesfully deleted from Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// Delete an existing post - HTTP Method: DELETE
async function updatePost(id, title, body, image) {
    const postToUpdate = { title, body, image };
    const json = JSON.stringify(postToUpdate);
    const response = await fetch(`${endpoint}/posts/${id}.json`, { method: "PUT", body: json });
    if (response.ok) {
        console.log("Post succesfully updated in Firebase 🔥");
        updatePostsGrid(); // update the post grid to display all posts and the new post
    }
}

// ============== users ============== //

async function updateUsersGrid() {
    // get users from rest endpoint and save in variable
    const users = await getUsers();
    // show all users (append to the DOM) with users as argument
    showUsers(users);
}

async function getUsers() {
    const res = await fetch(`${endpoint}/users.json`);
    const data = await res.json();
    const users = prepareData(data);
    return users;
}

function showUsers(listOfUsers) {
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
