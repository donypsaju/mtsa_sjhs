$(document).ready(function() {
  // Load studentDetails array from localStorage on page load
  let studentDetails = JSON.parse(localStorage.getItem('studentDetails')) || [];

  // Define the correct password
  const correctPassword = 'sjhs@2008';

  // Function to prompt for password
  function promptForPassword(callback) {
      const password = prompt('Enter password:');
      callback(password === correctPassword);
  }

  // Function to update the table with sorted student details
  function updateTable(studentDetails) {
      // Sort the studentDetails array
      studentDetails.sort(function(a, b) {
          // First, sort by hours awarded in descending order
          if (b.hoursAwarded !== a.hoursAwarded) {
              return b.hoursAwarded - a.hoursAwarded;
          }
          // If hours awarded are equal, sort by class
          if (a.class !== b.class) {
              return a.class.localeCompare(b.class);
          }
          // If class is equal, sort by name
          return a.name.localeCompare(b.name);
      });

      // Clear existing table rows
      $('#studentTableBody').empty();

      // Append rows with sorted student details
      studentDetails.forEach(function(student, index) {
          const row = `<tr>
                          <td>${index + 1}</td>
                          <td>${student.name}</td>
                          <td>${student.class}</td>
                          <td>${student.hoursAwarded}</td>
                          <td><button class="btn btn-primary addHoursBtn" data-bs-toggle="modal" data-bs-target="#addHoursModal" data-student-index="${index}"><i class="fas fa-plus"></i> Add Hours</button></td>
                      </tr>`;
          $('#studentTableBody').append(row);
      });
  }

  // Call updateTable function on page load
  updateTable(studentDetails);

  // Function to handle form submission for adding additional hours
  $('#addHoursForm').submit(function(event) {
      event.preventDefault(); // Prevent default form submission behavior
      promptForPassword(function(authenticated) {
          if (authenticated) {
              // Retrieve student index from form data
              const studentIndex = $('#addHoursForm').data('student-index');
              // Retrieve additional hours from form
              const additionalHours = parseInt($('#additionalHours').val());
              // Update the hoursAwarded for the student in studentDetails array
              studentDetails[studentIndex].hoursAwarded += additionalHours;
              // Update the table
              updateTable(studentDetails);
              // Save updated studentDetails to localStorage
              localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
              // Close the modal
              $('#addHoursModal').modal('hide');
              // Clear the form field
              $('#additionalHours').val('');
          } else {
              alert('Incorrect password. Access denied.');
          }
      });
  });

  // Function to handle form submission for adding a new student
  $('#addStudentForm').submit(function(event) {
      event.preventDefault();
      promptForPassword(function(authenticated) {
          if (authenticated) {
              // Retrieve input values
              const name = $('#studentName').val();
              const studentClass = $('#studentClass').val();
              const hoursAwarded = parseInt($('#hoursAwarded').val());
              // Create a new student object
              const newStudent = {
                  name: name,
                  class: studentClass,
                  hoursAwarded: hoursAwarded
              };
              // Add the new student to studentDetails array
              studentDetails.push(newStudent);
              // Update the table
              updateTable(studentDetails);
              // Save updated studentDetails to localStorage
              localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
              // Close the modal
              $('#addStudentModal').modal('hide');
              // Clear the form fields
              $('#studentName, #studentClass, #hoursAwarded').val('');
          } else {
              alert('Incorrect password. Access denied.');
          }
      });
  });

  // Function to handle click on add hours button
  $(document).on('click', '.addHoursBtn', function() {
      const studentIndex = $(this).data('student-index');
      const student = studentDetails[studentIndex];
      $('#studentNameAddHours').text(student.name);
      $('#currentHours').text(student.hoursAwarded);
      $('#addHoursForm').data('student-index', studentIndex);
  });

  // Function to search for a student
  $('#searchInput').on('keyup', function() {
      const searchText = $(this).val().toLowerCase();
      const filteredStudents = studentDetails.filter(function(student) {
          return student.name.toLowerCase().includes(searchText) || student.class.toLowerCase().includes(searchText);
      });
      updateTable(filteredStudents);
  });
});
