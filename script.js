$(document).ready(function() {
  // Array to store student details
  var studentDetails = [];

  // Function to update the table
  function updateTable(data) {
      var tableBody = $('#studentTableBody');
      tableBody.empty();

      data.forEach(function(student, index) {
          var row = `<tr>
              <td>${index + 1}</td>
              <td>${student.name}</td>
              <td>${student.class}</td>
              <td>${student.hoursAwarded}</td>
              <td>
                  <button class="btn btn-primary addHoursBtn" data-bs-toggle="modal" data-bs-target="#addHoursModal" data-student-index="${index}">
                      <i class="fas fa-plus"></i> Add Hours
                  </button>
              </td>
          </tr>`;
          tableBody.append(row);
      });
  }

  // Load studentDetails array from localStorage on page load
  var storedStudentDetails = localStorage.getItem('studentDetails');
  if (storedStudentDetails) {
      studentDetails = JSON.parse(storedStudentDetails);
      updateTable(studentDetails);
  }

  // Function to handle form submission for adding a new student
  $('#addStudentForm').submit(function(event) {
      event.preventDefault();

      var name = $('#studentName').val();
      var studentClass = $('#studentClass').val();
      var hoursAwarded = parseInt($('#hoursAwarded').val());

      studentDetails.push({ name: name, class: studentClass, hoursAwarded: hoursAwarded });
      updateTable(studentDetails);

      $('#addStudentModal').modal('hide');
      $('#studentName, #studentClass, #hoursAwarded').val('');

      localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
  });

  // Function to handle click on add hours button
  $(document).on('click', '.addHoursBtn', function() {
      var studentIndex = $(this).data('student-index');
      var student = studentDetails[studentIndex];

      $('#studentNameAddHours').text(student.name);
      $('#currentHours').text(student.hoursAwarded);
      $('#addHoursForm').data('student-index', studentIndex);
  });

  // Function to handle form submission for adding additional hours
  $('#addHoursForm').submit(function(event) {
      event.preventDefault();

      var studentIndex = $(this).data('student-index');
      var additionalHours = parseInt($('#additionalHours').val());

      studentDetails[studentIndex].hoursAwarded += additionalHours;
      updateTable(studentDetails);

      $('#addHoursModal').modal('hide');
      $('#additionalHours').val('');

      localStorage.setItem('studentDetails', JSON.stringify(studentDetails));
  });

  // Function to search for a student
  $('#searchInput').on('keyup', function() {
      var searchText = $(this).val().toLowerCase();

      var filteredStudents = studentDetails.filter(function(student) {
          return student.name.toLowerCase().includes(searchText) || student.class.toLowerCase().includes(searchText);
      });

      updateTable(filteredStudents);
  });
});
