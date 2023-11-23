// Array to store student data
let studentsData = [];

document.addEventListener('DOMContentLoaded', function () {
    const storedData = localStorage.getItem('studentsData');
    if (storedData) {
        studentsData = JSON.parse(storedData);
        updateTables();
    }
});

function openUploadForm() {
    // Assuming you want to prompt for a password before opening the upload form
    const password = prompt('Enter password:');

    // Check if the password is correct ("sjhs@2008")
    if (password === 'sjhs@2008') {
        // Show the upload form
        document.getElementById('uploadForm').classList.remove('d-none');
    } else {
        alert('Incorrect password. Access denied.');
    }
}

// Function to populate the select options with student names
function populateSelectOptions() {
    const selectStudent = document.getElementById('selectStudent');
    selectStudent.innerHTML = ''; // Clear previous options
    studentsData.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = student.name;
        selectStudent.appendChild(option);
    });
}

// Function to submit the update form
function submitUpdate() {
    const selectedIndex = document.getElementById('selectStudent').value;
    const hoursToAdd = parseInt(document.getElementById('hoursToAdd').value, 10);

    // Update hours for the selected student
    if (!isNaN(hoursToAdd)) {
        studentsData[selectedIndex].hoursAwarded += hoursToAdd;
        // You can also update other fields like rank, previous rank, last update date and time here if needed
        alert('Hours updated successfully!');
        // Update the tables with the latest data
        updateTables();
    } else {
        alert('Please enter a valid number of hours.');
    }
}

// Function to open the add student form
function openAddStudentForm() {
    document.getElementById('addStudentForm').classList.remove('d-none');
}

// Function to save a new student
function saveStudent() {
    const studentName = document.getElementById('studentName').value;
    const studentClass = parseInt(document.getElementById('studentClass').value, 10);
    const studentDivision = document.getElementById('studentDivision').value;

    // Validate inputs
    if (studentName && !isNaN(studentClass) && studentDivision) {
        const section = studentClass > 7 ? 'HS' : 'UP';

        const newStudent = {
            section: section,
            name: studentName,
            class: studentClass,
            division: studentDivision,
            hoursAwarded: 0,
            rank: 0, // Set initial rank
            originalRank: 0, // Store original rank
            previousRank: 0,
            lastUpdate: new Date().toLocaleString(),
            changeInRank: 0,
        };

        studentsData.push(newStudent);
        alert('Student added successfully!');
        // Hide the add student form
        document.getElementById('addStudentForm').classList.add('d-none');
        // Repopulate the select options
        populateSelectOptions();
        // Update the tables with the latest data
        updateTables();
    } else {
        alert('Please fill in all the fields with valid information.');
    }
}

// Function to close the update form
function closeUpdateForm() {
    document.getElementById('updateForm').classList.add('d-none');
}

// Function to close the add student form
function closeAddStudentForm() {
    document.getElementById('addStudentForm').classList.add('d-none');
}

function updateTables() {
    // Sort studentsData by hoursAwarded in descending order
    studentsData.sort((a, b) => b.hoursAwarded - a.hoursAwarded);

    // Update HS Section table
    updateTable('hsTable', studentsData.filter(student => student.section === 'HS'));

    // Update UP Section table
    updateTable('upTable', studentsData.filter(student => student.section === 'UP'));

    // Save data to local storage
    localStorage.setItem('studentsData', JSON.stringify(studentsData));
}

// Function to update a specific table with data and assign ranks
function updateTable(tableId, data) {
    const table = document.getElementById(tableId);
    // Clear existing table content
    table.innerHTML = '';

    // Add headers
    const headers = ['Rank', 'Name', 'Class', 'Hours Awarded', 'Change in Rank'];
    const headerRow = table.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    });

    // Add data rows and assign ranks
    data.forEach((student, index) => {
        student.rank = index + 1; // Assign rank
        const row = table.insertRow();
        const rankCell = row.insertCell();
        rankCell.innerHTML = student.originalRank || student.rank; // Display original rank if available


        const nameCell = row.insertCell();
        nameCell.innerHTML = student.name;
        // Add circle-check icon if hours awarded is greater than or equal to 20
        if (student.hoursAwarded >= 20) {
            nameCell.innerHTML += ' <i class="fas fa-check-circle"></i>';
        }
        row.insertCell().innerHTML = student.class;
        row.insertCell().innerHTML = student.hoursAwarded;
        // Calculate change in rank
        const changeInRank = student.previousRank - student.rank;
        row.insertCell().innerHTML = getChangeInRankText(changeInRank);
        // Update the student's previous rank
        student.previousRank = student.rank;

        // Highlight the background of the first 5 students with more than 20 hours
        if (index < 5 && student.hoursAwarded >= 20) {
            row.style.backgroundColor = 'lightgreen';
            row.style.color = "black"; // Change the background color to lightgreen or your preferred color
        }
        
    });

}

// Function to get change in rank text
function getChangeInRankText(changeInRank) {
    if (changeInRank > 0) {
        return `<i class="fas fa-caret-up"></i> ${Math.abs(changeInRank)} `;
    } else if (changeInRank < 0) {
        return `<i class="fas fa-caret-down"></i> ${Math.abs(changeInRank)} `;
    } else {
        return 'No change in rank';
    }
}

// Function to handle search for HS Section
function searchHS() {
    const searchTerm = document.getElementById('hsSearch').value.toLowerCase();
    const filteredData = studentsData
        .filter(student => student.section === 'HS' && student.name.toLowerCase().includes(searchTerm))
        .map(student => ({ ...student, originalRank: student.rank })); // Preserve original rank
    updateTable('hsTable', filteredData);
}

// Function to handle search for UP Section
function searchUP() {
    const searchTerm = document.getElementById('upSearch').value.toLowerCase();
    const filteredData = studentsData
        .filter(student => student.section === 'UP' && student.name.toLowerCase().includes(searchTerm))
        .map(student => ({ ...student, originalRank: student.rank })); // Preserve original rank
    updateTable('upTable', filteredData);
}

// Event listeners for search boxes
document.getElementById('hsSearch').addEventListener('input', searchHS);
document.getElementById('upSearch').addEventListener('input', searchUP);

function openUpdateForm() {
    const password = prompt('Enter password:');
    // Check if the password is correct ("sjhs@2008")
    if (password === 'sjhs@2008') {
        // Show the update form
        document.getElementById('updateForm').classList.remove('d-none');
        // Populate the select options dynamically
        populateSelectOptions();
    } else {
        alert('Incorrect password. Access denied.');
    }
}

// Function to close the upload form
function closeUploadForm() {
    document.getElementById('uploadForm').classList.add('d-none');
    // Clear the file input value when closing the form
    document.getElementById('fileInput').value = '';
}

function handleFileSelect() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                // Reset the studentsData array
                studentsData = [];

                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const [header, ...dataRows] = excelData;

                const nameIndex = header.indexOf('Name');
                const classIndex = header.indexOf('Class');
                const divisionIndex = header.indexOf('Division');
                const hoursAwardedIndex = header.indexOf('Hours Awarded');
                const previousRankIndex = header.indexOf('Previous Rank');

                dataRows.forEach(row => {
                    const newStudent = {
                        section: row[classIndex] > 7 ? 'HS' : 'UP',
                        name: row[nameIndex],
                        class: parseInt(row[classIndex]),
                        division: row[divisionIndex],
                        hoursAwarded: parseInt(row[hoursAwardedIndex]),
                        rank: 0,
                        originalRank: 0,
                        previousRank: parseInt(row[previousRankIndex]),
                        lastUpdate: new Date().toLocaleString(),
                        changeInRank: 0, // Initialize change in rank
                    };

                    studentsData.push(newStudent);
                });

                // Calculate change in rank
                studentsData.forEach(student => {
                    student.changeInRank = student.previousRank - student.rank;
                });

                // Update lastUpdated element
const lastUpdatedElement = document.getElementById('lastUpdated');
lastUpdatedElement.textContent = new Date().toLocaleString();

                // Clear local storage
                localStorage.clear();

                alert('File loaded successfully!');
                updateTables();
                closeUploadForm();
            } catch (error) {
                alert('Error processing Excel file. Please make sure the file format is correct.');
                console.error(error);
            }
        };

        reader.readAsBinaryString(file);
    }
}
