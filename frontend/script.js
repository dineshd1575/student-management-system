const API_URL = 'http://13.63.91.92:5000/api/students';

const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentsTableBody');
const emptyMsg = document.getElementById('emptyMsg');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('form-title');

let editingId = null;

// Fetch and render students
async function loadStudents(search = '') {
  try {
    const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
    const res = await fetch(url);
    const students = await res.json();
    renderTable(students);
  } catch (err) {
    console.error('Error loading students:', err);
    alert('Could not load students. Is the backend server running?');
  }
}

function renderTable(students) {
  tableBody.innerHTML = '';

  if (!students.length) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  students.forEach((s, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.roll_no)}</td>
      <td>${escapeHtml(s.department)}</td>
      <td>${escapeHtml(String(s.year))}</td>
      <td>${escapeHtml(s.email || '-')}</td>
      <td>${escapeHtml(s.phone || '-')}</td>
      <td>
        <button class="btn small edit" onclick="editStudent(${s.id})">Edit</button>
        <button class="btn small delete" onclick="deleteStudent(${s.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Handle form submit (Add or Update)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentData = {
    name: document.getElementById('name').value.trim(),
    roll_no: document.getElementById('roll_no').value.trim(),
    department: document.getElementById('department').value.trim(),
    year: document.getElementById('year').value,
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
  };

  try {
    let res;
    if (editingId) {
      res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
    }

    const result = await res.json();
    if (!res.ok) {
      alert(result.error || 'Something went wrong');
      return;
    }

    resetForm();
    loadStudents(searchInput.value);
  } catch (err) {
    console.error('Error saving student:', err);
    alert('Could not save student. Check backend server.');
  }
});

// Edit student - populate form
async function editStudent(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const s = await res.json();

    document.getElementById('studentId').value = s.id;
    document.getElementById('name').value = s.name;
    document.getElementById('roll_no').value = s.roll_no;
    document.getElementById('department').value = s.department;
    document.getElementById('year').value = s.year;
    document.getElementById('email').value = s.email || '';
    document.getElementById('phone').value = s.phone || '';

    editingId = id;
    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Error fetching student:', err);
  }
}

// Delete student
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const result = await res.json();
      alert(result.error || 'Could not delete student');
      return;
    }
    loadStudents(searchInput.value);
  } catch (err) {
    console.error('Error deleting student:', err);
  }
}

// Cancel edit mode
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  editingId = null;
  document.getElementById('studentId').value = '';
  formTitle.textContent = 'Add New Student';
  submitBtn.textContent = 'Add Student';
  cancelBtn.style.display = 'none';
}

// Live search
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadStudents(searchInput.value), 300);
});

// Initial load
loadStudents();
