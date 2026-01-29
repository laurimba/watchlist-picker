
// --- VARIABLES ---
// inputs
const titleInput = document.getElementById('movieTitle');
const posterInput = document.getElementById('moviePoster');

// buttons
const addBtn = document.getElementById('addBtn');
const randomBtn = document.getElementById('randomBtn');
const editBtn = document.getElementById('editBtn');

// watchlist container
const listContainer = document.getElementById('watchlist');

// modal elements
const modal = document.getElementById('movieModal');
const closeBtn = document.getElementById('closeModal');
const randomResultContainer = document.getElementById('randomResult');

let isEditMode = false; // tracks if we are in edit mode
let myMovies = JSON.parse(localStorage.getItem('myMovies')) || []; // initializes the movie list from localStorage or as an empty array if nothing is saved


// --- CORE FUNCTIONS ---
// displays the movies on the screen
function displayMovies() {
    // clears the current list
    const existingCards = listContainer.querySelectorAll('.movie-card');
    existingCards.forEach(card => card.remove());
    
    myMovies.forEach((movie) => {
        // creates the card container
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // creates the checkbox for edit mode
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('movie-checkbox');

        // listener to change edit button text only when selecting movies in edit mode
        checkbox.addEventListener('change', () => {
            if (isEditMode) {
                const checkedCount = document.querySelectorAll('.movie-checkbox:checked').length;
                editBtn.textContent = checkedCount > 0 ? 'delete' : 'cancel';
            }
        });

        // creates and sets the image
        const imageElement = document.createElement('img');
        imageElement.src = movie.poster;

        // creates and sets the title
        const titleElement = document.createElement('p');
        titleElement.textContent = movie.title;

        // builds the card and adds it to the list
        movieCard.appendChild(checkbox);
        movieCard.appendChild(imageElement);
        movieCard.appendChild(titleElement);
        listContainer.appendChild(movieCard);
    });
}


// --- EVENT LISTENERS ---
// logic to toggle edit mode and delete selected movies
editBtn.addEventListener('click', function() {
    if (isEditMode) {
        // WE ARE EXITING EDIT MODE: deletes selected items
        const checkboxes = document.querySelectorAll('.movie-checkbox');
        const moviesToKeep = [];

        // we check each movie: if NOT checked, we keep it
        checkboxes.forEach((cb, index) => {
            if (!cb.checked) {
                moviesToKeep.push(myMovies[index]);
            }
        });

        myMovies = moviesToKeep; // updates main array
        localStorage.setItem('myMovies', JSON.stringify(myMovies)); // saves to localStorage
        
        listContainer.classList.remove('edit-mode');
        editBtn.textContent = 'edit'; // resets edit button text
        displayMovies(); // refreshes the list without deleted items
    } else {
        // WE ARE ENTERING EDIT MODE
        if (myMovies.length > 0) {
            listContainer.classList.add('edit-mode');
            editBtn.textContent = 'cancel'; // initial text of the edit button before selecting anything
        }
        else {
            alert("there are no movies to edit in the watchlist :(");
        }
    }
    
    isEditMode = !isEditMode; // we toggle the mode
});

// add movie logic
addBtn.addEventListener('click', function() {
    const title = titleInput.value.trim(); // .trim() removes extra spaces
    const poster = posterInput.value.trim();

    if (title && poster) {
        // avoids adding duplicate movies (case insensitive)
        const isDuplicate = myMovies.some(m => m.title.toLowerCase() === title.toLowerCase());

        if (isDuplicate) {
            alert("this movie is already in your watchlist :p");
            return;
        }

        // adds the new movie object to our array
        myMovies.push({ title: title, poster: poster });

        // saves the updated list to localStorage
        localStorage.setItem('myMovies', JSON.stringify(myMovies));

        // updates the display
        displayMovies();

        // resets inputs
        titleInput.value = "";
        posterInput.value = "";
    }
    else {
        alert("a movie needs both a title & a poster to be added to the watchlist !!");
    }
});

// random movie picker logic
randomBtn.addEventListener('click', function() {
    if (myMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * myMovies.length);
        const selected = myMovies[randomIndex];
        
        randomResultContainer.innerHTML = `
            <img src="${selected.poster}">
            <h3>${selected.title}</h3>
        `;
        
        modal.style.display = "flex"; // shows the modal
    }
    else {
        alert("your watchlist is empty !! add some movies first :)");
    }
});

// modal close logic 1: close button
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// modal close logic 2: clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// --- INITIALIZATION ---
displayMovies();