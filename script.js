let currentPage = 1;
let recordsPerPage = 10; // Default value
const maxPageButtons = 5; // Maximum number of page buttons to display
let allData = []; // Store all fetched data

// Fetch and display data
async function fetchAndDisplayData() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        allData = await response.json(); // Store all data for pagination
        displayPage(currentPage); // Display the first page
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display the records for the current page
function displayPage(page) {
    const start = (page - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageData = allData.slice(start, end);

    populateTable(pageData);
    setupPagination(page);
}

// Populate the table with data
function populateTable(data) {
    const tbody = document.querySelector('#vulnTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.sourceIdentifier}</td>
            <td>${new Date(item.published).toLocaleDateString()}</td>
            <td>${new Date(item.lastModified).toLocaleDateString()}</td>
            <td>${item.vulnStatus}</td>
        `;
        row.addEventListener('click', () => {
            window.location.href = `details.html?cveId=${item.id}`;
        });
        tbody.appendChild(row);
    });
}

// Display total records
function displayTotalRecords(total) {
    const totalRecordsElement = document.getElementById('totalRecords');
    totalRecordsElement.textContent = `Total Records: ${total}`;
}

// Set up pagination controls
function setupPagination(currentPage) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(allData.length / recordsPerPage);

    pagination.innerHTML = ''; // Clear existing controls

    // Calculate the range of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        displayPage(currentPage);
    });
    pagination.appendChild(prevButton);

    // Page Numbers
    displayTotalRecords(totalPages * recordsPerPage);
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        pagination.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        displayPage(currentPage);
    });
    pagination.appendChild(nextButton);
}

// Handle changes in the records-per-page dropdown
document.getElementById('recordsPerPageSelect').addEventListener('change', (event) => {
    recordsPerPage = parseInt(event.target.value, 10); // Update recordsPerPage
    currentPage = 1; // Reset to the first page
    displayPage(currentPage); // Recalculate and display the first page
});

// Load data on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
