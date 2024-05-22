document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('book-list');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    let userCountry = '';

    
    function getUserCountry() {
        fetch('https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN')
            .then(response => response.json())
            .then(data => {
                userCountry = data.country;
                displayBooks();
            })
            .catch(error => console.error('Error fetching country data:', error));
    }

    // Function to get Amazon URL based on country
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

   
    function truncateDescription(description, maxWords) {
        const words = description.split(' ');
        if (words.length > maxWords) {
            const truncated = words.slice(0, maxWords).join(' ');
            return truncated + '... <a href="#" class="see-more">See More</a>';
        }
        return description;
    }

    function displayBooks() {
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookCategory = document.createElement('div');
            bookCategory.className = 'book-category';
            const bookLink = getAmazonUrl(book.link);
            const truncatedDescription = truncateDescription(book.description, 200);
            bookCategory.innerHTML = `
                <h3><a href="${bookLink}" target="_blank">${book.title}</a></h3>
                <p>by ${book.author}</p>
                <img src="${book.image}" alt="${book.title}">
                <p class="description">${truncatedDescription}</p>
            `;
            bookList.appendChild(bookCategory);
        });

      
        const seeMoreLinks = document.querySelectorAll('.see-more');
        seeMoreLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const fullDescription = books.find(book => book.title === link.closest('.book-category').querySelector('h3').innerText).description;
                link.parentElement.innerHTML = fullDescription;
            });
        });
    }

    getUserCountry();
});
