(() => {
  const usersKey = 'pharmacy_users';
  const medsKey = 'pharmacy_medicines';
  const defaultUsers = [{ username: 'admin', password: 'p', role: 'admin' }];
  const defaultMeds = [
    { name: 'Paracetamol', qty: 100, price: 0.5 },
    { name: 'Amoxicillin', qty: 50, price: 1.2 },
  ];

  if (!localStorage.getItem(usersKey)) {
    localStorage.setItem(usersKey, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(medsKey)) {
    localStorage.setItem(medsKey, JSON.stringify(defaultMeds));
  }

  const redirectToLogin = () => window.location = 'PharmacyLogin.html';
  const requireAuth = () => {
    const usr = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!usr) return redirectToLogin();
    return usr;
  };
  const requireAdmin = () => {
    const usr = requireAuth();
    if (usr.role !== 'admin') {
      window.alert('Access denied — Admin only');
      return redirectToLogin();
    }
  };

  // Toast system
  window.createToast = (msg, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const style = document.createElement('style');
  style.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: #fff;
    padding: 12px 20px;
    border-radius: 5px;
    opacity: 0.95;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }
  .toast-success { background: #27ae60; }
  .toast-error { background: #e74c3c; }
  .toast-info { background: #2980b9; }
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 0.95; }
  }`;
  document.head.appendChild(style);

  const page = document.body.getAttribute('data-page');

  // Login logic
  if (page === 'login') {
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const username = e.target.username.value.trim();
      const password = e.target.password.value;

      if (!username || !password) {
        createToast('Please enter both username and password.', 'error');
        return;
      }

      const users = JSON.parse(localStorage.getItem(usersKey));
      const found = users.find(u => u.username === username && u.password === password);

      if (found) {
        localStorage.setItem('currentUser', JSON.stringify(found));
        createToast('Login successful!', 'success');
        window.location = 'PharmacyDashboard.html';
      } else {
        // document.getElementById('loginError').textContent = 'Invalid credentials.';
        createToast('Invalid credentials.', 'error');
      }
    });
  }

  // Logout logic
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      redirectToLogin();
    });
  }

  // Medicine Management
  if (page === 'medicine') {
    requireAuth();
    const medForm = document.getElementById('medicineForm');
    const medTable = document.querySelector('#medicineTable tbody');
    const medList = () => JSON.parse(localStorage.getItem(medsKey) || '[]');

    const renderMeds = () => {
      medTable.innerHTML = '';
      medList().forEach((med, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${med.name}</td>
          <td>${med.qty}</td>
          <td>$${med.price.toFixed(2)}</td>
          <td>
            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </td>`;
        row.querySelector('.edit-btn').onclick = () => {
          medForm.medName.value = med.name;
          medForm.medQty.value = med.qty;
          medForm.medPrice.value = med.price;
          medForm.editIndex.value = i;
          medForm.querySelector('button').textContent = 'Update';
        };
        row.querySelector('.delete-btn').onclick = () => {
          const arr = medList();
          arr.splice(i, 1);
          localStorage.setItem(medsKey, JSON.stringify(arr));
          renderMeds();
          createToast('Medicine deleted.', 'info');
        };
        medTable.appendChild(row);
      });
    };

    medForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = e.target.medName.value.trim();
      const qty = parseInt(e.target.medQty.value);
      const price = parseFloat(e.target.medPrice.value);

      if (!name || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
        createToast('Please enter valid medicine details.', 'error');
        return;
      }

      const arr = medList();
      const med = { name, qty, price };
      const idx = e.target.editIndex.value;
      if (idx) arr[idx] = med;
      else arr.push(med);

      localStorage.setItem(medsKey, JSON.stringify(arr));
      medForm.reset();
      medForm.editIndex.value = '';
      medForm.querySelector('button').textContent = 'Save Medicine';
      renderMeds();
      createToast('Medicine saved!', 'success');
    });

    // Export dropdown logic
const exportBtn = document.getElementById('exportDropdownBtn');
const exportOptions = document.querySelector('.export-options');

exportBtn.onclick = (e) => {
  e.stopPropagation();
  exportOptions.parentElement.classList.toggle('show');
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('.export-dropdown')) {
    document.querySelector('.export-dropdown')?.classList.remove('show');
  }
});

exportOptions.querySelectorAll('div').forEach(option => {
  option.onclick = () => {
    const type = option.getAttribute('data-type');
    const data = medList();

    if (type === 'csv') {
      const csv = ['Name,Qty,Price', ...data.map(m => `${m.name},${m.qty},${m.price.toFixed(2)}`)].join('\n');
      downloadFile(csv, 'medicines.csv', 'text/csv');
    } else if (type === 'json') {
      downloadFile(JSON.stringify(data, null, 2), 'medicines.json', 'application/json');
    } else if (type === 'xml') {
      const xml = `<medicines>\n${data.map(m => `  <medicine><name>${m.name}</name><qty>${m.qty}</qty><price>${m.price.toFixed(2)}</price></medicine>`).join('\n')}\n</medicines>`;
      downloadFile(xml, 'medicines.xml', 'application/xml');
    } else if (type === 'pdf') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.autoTable({ html: '#medicineTable' }); // Converts HTML table into a formatted PDF table
      doc.save('medicines.pdf');  // Initiates download
    }

    exportOptions.parentElement.classList.remove('show');
  };
});


    renderMeds();
  }

  // User Management
  if (page === 'users') {
    requireAdmin();
    const userForm = document.getElementById('userForm');
    const userTable = document.querySelector('#userTable tbody');
    const usersArr = () => JSON.parse(localStorage.getItem(usersKey) || '[]');

    const renderUsers = () => {
      userTable.innerHTML = '';
      usersArr().forEach((u, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${u.username}</td>
          <td>${u.role}</td>
          <td>
            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
          </td>`;
        row.querySelector('.edit-btn').onclick = () => {
          userForm.newUsername.value = u.username;
          userForm.newPassword.value = u.password;
          userForm.newRole.value = u.role;
          userForm.editUserIndex.value = i;
          userForm.querySelector('button').textContent = 'Update User';
        };
        row.querySelector('.delete-btn').onclick = () => {
          const arr = usersArr();
          arr.splice(i, 1);
          localStorage.setItem(usersKey, JSON.stringify(arr));
          renderUsers();
          createToast('User deleted.', 'info');
        };
        userTable.appendChild(row);
      });
    };

    userForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = e.target.newUsername.value.trim();
      const password = e.target.newPassword.value;
      const role = e.target.newRole.value;

      if (!username || !password || !role) {
        createToast('All user fields are required.', 'error');
        return;
      }

      const arr = usersArr();
      const usr = { username, password, role };
      const idx = e.target.editUserIndex.value;
      if (idx) arr[idx] = usr;
      else arr.push(usr);

      localStorage.setItem(usersKey, JSON.stringify(arr));
      userForm.reset();
      userForm.editUserIndex.value = '';
      userForm.querySelector('button').textContent = 'Save User';
      renderUsers();
      createToast('User saved successfully!', 'success');
    });

    renderUsers();
  }

  // File download helper
  window.downloadFile = (content, filename, mime) => {
    const a = document.createElement('a'), blob = new Blob([content], { type: mime });
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

// Dark Mode Toggle Switch
const toggleContainer = document.createElement('div');
toggleContainer.className = 'theme-switch-container';

const toggleLabel = document.createElement('label');

const labelText = document.createElement('span');
labelText.textContent = 'Dark Mode';
labelText.className = 'toggle-label-text';

toggleLabel.className = 'theme-switch';

const toggleInput = document.createElement('input');
toggleInput.type = 'checkbox';

const toggleSlider = document.createElement('span');
toggleSlider.className = 'slider round';

// Append all together
toggleLabel.appendChild(toggleInput);
toggleLabel.appendChild(toggleSlider);
toggleContainer.appendChild(toggleLabel);
toggleContainer.appendChild(labelText); // label first

if (document.querySelector('header')) {
  document.querySelector('header').appendChild(toggleContainer);

  // Apply stored theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    toggleInput.checked = true;
  }

  // Toggle logic
  toggleInput.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
}
})();
