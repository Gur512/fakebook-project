'use strict';

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
} 

const name = select('#name');
const userName = select('#user-name');
const userEmail = select('#user-email');
const userInfo = select('#user-info');
const userPages = select('#user-pages');
const userGroups = select('#user-groups');
const canMonetize = select('#can-monetize');
const userModal = select('#user-modal');
const postImageInput = select('#postImage');
const profileIcon = select('.profile-icon');
const fileInfo = select('.file-info');
const postForm = select('.post-form form');
const closeModalButton = select('.modal .close');

class User {
    #id;
    #name;
    #username;
    #email;

    constructor(name, username, email) {
        this.#name = name;
        this.#username = username;
        this.#email = email;
        this.#id = User.generateId();
    }

    static generateId() {
        return `user-${Math.floor(Math.random() * 1000)}`;
    }

    getInfo() {
        name.innerText = this.#name;
        userName.innerText = this.#username;
        userEmail.innerText = this.#email;
        userInfo.innerText = this.#id;
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize;

    constructor(name, username, email, pages = [], groups = [], canMonetize = false) {
        super(name, username, email);
        this.#pages = pages;
        this.#groups = groups;
        this.#canMonetize = canMonetize;
    }

    getInfo() {
        super.getInfo();
        userPages.innerText = this.#pages.join(', ') || 'None';
        userGroups.innerText = this.#groups.join(', ') || 'None';
        canMonetize.innerText = this.#canMonetize ? 'true' : 'false';
    }
}

const user = new User('Gurpreet Kaur', 'gurpreet_kaur', 'gurpreet.kaur@example.com');
const subscriber = new Subscriber('Rahaf', 'rahaf_aein', 'rahaf.aein@example.com', ['Pages1'], ['Group1'], true);

listen('submit', postForm, function (e) {
    e.preventDefault();
    
    const content = select('.postContent').value;
    const imageFile = postImageInput.files[0];
    const postContainer = select('.posts');

    if (!content && !imageFile) {
        select('.postContent').focus();
        return; 
    }
    
    if (content || imageFile) {
        const postElement = createPostTemplate(content, imageFile);
        postContainer.insertBefore(postElement, postContainer.firstChild);
        
        select('.postContent').value = ''; 
        postImageInput.value = ''; 
        fileInfo.innerText = '';
    }
});

function createPostTemplate(content, imageFile) {
    // Clone the post template
    const template = select('#post-template');
    const postClone = template.content.cloneNode(true);
    
    const name = select('.name', postClone);
    const date = select('.date', postClone);
    const postContent = select('.post-content', postClone);

    name.innerText = 'Gurpreet Kaur'; 
    date.innerText = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    postContent.innerText = content;

    if (imageFile) {
        const postImage = select('.post-image', postClone);
        postImage.src = URL.createObjectURL(imageFile);
        postImage.style.display = 'block'; // Make the image visible
    }

    return postClone;
}

listen('click', profileIcon, () => {
    user.getInfo();  
    userModal.classList.add('show');
});

listen('click', closeModalButton, () => {
    userModal.classList.remove('show');
});

listen('change', postImageInput, function () {
    const file = postImageInput.files[0];
    if (file) {
        const fileName = file.name;
        const fileParts = fileName.split('.'); 
        const extension = fileParts.pop(); 
        const firstWord = fileParts[0].split(' ')[0]; 
        const displayedName = `${firstWord}.${extension}`;
        
        fileInfo.innerText = displayedName;
    } else {
        fileInfo.innerText = '';
    }
});

