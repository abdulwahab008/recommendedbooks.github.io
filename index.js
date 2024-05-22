
document.addEventListener('DOMContentLoaded', function() {
    const bookCategories = document.querySelectorAll('.book-category');

    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        
        bookCategories.forEach(category => {
            category.innerHTML = ''; // Clear the existing book images
            books.forEach(book => {
                const bookLink = document.createElement('a');
                bookLink.href = book.link;
                bookLink.target = "_blank";
                
                const bookImage = document.createElement('img');
                bookImage.src = book.image;
                bookImage.alt = book.title;
                bookImage.style.width = '100px'; // Adjust size as needed
                bookImage.style.height = '150px'; // Adjust size as needed
                
                bookLink.appendChild(bookImage);
                category.appendChild(bookLink);
            });
        });
    }

    loadBooks();
});

