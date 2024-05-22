document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('book-form');
    const enteredBooksList = document.getElementById('entered-books-list');
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let userCountry = '';

    // Function to get user's country
    function getUserCountry() {
        fetch('https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN')
            .then(response => response.json())
            .then(data => {
                userCountry = data.country;
                displayEnteredBooks();
            })
            .catch(error => console.error('Error fetching country data:', error));
    }

   
    function getAmazonUrl(baseLink) {
        const amazonDomains = {
            US: 'amazon.com',
            UK: 'amazon.co.uk',
            DE: 'amazon.de',
            AU: 'amazon.com.au'
        };

        const domain = amazonDomains[userCountry] || 'amazon.com';
        return baseLink.replace('amazon.com', domain);
    }

    function displayEnteredBooks() {
        enteredBooksList.innerHTML = '';
        books.forEach((book, index) => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            const bookLink = getAmazonUrl(book.link);
            bookItem.innerHTML = `
                <p><strong>Title:</strong> <a href="${bookLink}" target="_blank">${book.title}</a></p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <img src="${book.image}" alt="${book.title}">
                <button onclick="editBook(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Delete</button>
            `;
            enteredBooksList.appendChild(bookItem);
        });
    }

    function addBook(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const imageUrl = document.getElementById('image').value;
        const fileInput = document.getElementById('file');
        const description = document.getElementById('description').value;
        const link = document.getElementById('link').value;
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const image = event.target.result;
                const newBook = { title, author, image, description, link };
                books.push(newBook);
                localStorage.setItem('books', JSON.stringify(books));
                displayEnteredBooks();
                bookForm.reset();
            };
            reader.readAsDataURL(file);
        } else {
            const image = imageUrl || ''; 
            const newBook = { title, author, image, description, link };
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            displayEnteredBooks();
            bookForm.reset();
        }
    }

    function editBook(index) {
        const bookToEdit = books[index];
        const updatedTitle = prompt('Enter updated title:', bookToEdit.title);
        const updatedAuthor = prompt('Enter updated author:', bookToEdit.author);
        const updatedDescription = prompt('Enter updated description:', bookToEdit.description);
        const updatedLink = prompt('Enter updated link:', bookToEdit.link);
        
        const updatedImageInput = document.createElement('input');
        updatedImageInput.type = 'file';
        updatedImageInput.accept = 'image/*';
        updatedImageInput.onchange = function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const updatedImage = event.target.result;
                if (updatedTitle && updatedAuthor && updatedDescription && updatedLink) {
                    books[index] = {
                        title: updatedTitle,
                        author: updatedAuthor,
                        description: updatedDescription,
                        link: updatedLink,
                        image: updatedImage
                    };
                    localStorage.setItem('books', JSON.stringify(books));
                    displayEnteredBooks();
                }
            };
            reader.readAsDataURL(file);
        };

        if (updatedTitle && updatedAuthor && updatedDescription && updatedLink) {
            books[index] = {
                title: updatedTitle,
                author: updatedAuthor,
                description: updatedDescription,
                link: updatedLink,
                image: bookToEdit.image 
            };
            localStorage.setItem('books', JSON.stringify(books));
            displayEnteredBooks();
        }
    }

    function deleteBook(index) {
        const confirmDelete = confirm('Are you sure you want to delete this book?');
        if (confirmDelete) {
            books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(books));
            displayEnteredBooks();
        }
    }

    window.editBook = editBook;
    window.deleteBook = deleteBook;

    bookForm.addEventListener('submit', addBook);
    getUserCountry();
});
