// let inventory = JSON.parse(localStorage.getItem("inventoryData")) || [];

// Sample Items Below
let inventory = JSON.parse(localStorage.getItem("inventoryData")) || [
    
  { name: "Laptop", qty: 12, category: "Electronics" },
  { name: "Printer Ink", qty: 4, category: "Supplies" },
  { name: "Office Chair", qty: 8, category: "Furniture" },
  { name: "HDMI Cable", qty: 25, category: "Electronics" },
  { name: "Notebook", qty: 100, category: "Stationery" },
  { name: "Coffee Cups", qty: 50, category: "Pantry" },
  { name: "Router", qty: 3, category: "Networking" },
  { name: "Whiteboard Marker", qty: 15, category: "Stationery" }
];

document.getElementById("exportBtn").addEventListener("click", () => {
  const options = document.getElementById("exportOptions");
  options.style.display = options.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".export-dropdown")) {
    document.getElementById("exportOptions").style.display = "none";
  }
});

let history = JSON.parse(localStorage.getItem("inventoryHistory")) || [];
let editingIndex = null;



function renderInventory() {
  const tbody = document.getElementById("inventoryBody");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("categoryFilter").value.toLowerCase();

  tbody.innerHTML = "";
  const categories = new Set();

  inventory.forEach((item, index) => {
    if (
      (!search || item.name.toLowerCase().includes(search)) &&
      (!filter || item.category.toLowerCase() === filter)
    ) {
      const tr = document.createElement("tr");
      const status = item.qty <= 5 ? `<span class="low-stock">Low ⚠️</span>` : "OK";
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.category}</td>
        <td>${status}</td>
        <td>
        
        <button class="btn btn--small" onclick="openEditModal(${index})">Edit</button>
          <button class="btn btn--red" onclick="deleteItem(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
    categories.add(item.category);
  });

  renderHistory();
  updateCategoryFilter(Array.from(categories));
}

function updateCategoryFilter(categories) {
  const select = document.getElementById("categoryFilter");
  const currentValue = select.value; // 💡 Store selected value

  select.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  // 💡 Reapply the previous selection
  select.value = currentValue;
}



// The showDeleteConfirm function (from previous message):
function showDeleteConfirm(message, onConfirm) {
  const modal = document.getElementById("deleteConfirmModal");
  const msg = document.getElementById("deleteConfirmMessage");
  const yesBtn = document.getElementById("deleteConfirmYes");
  const noBtn = document.getElementById("deleteConfirmNo");

  msg.textContent = message;
  modal.style.display = "flex";

  yesBtn.onclick = () => {
    modal.style.display = "none";
    onConfirm();
  };

  noBtn.onclick = () => {
    modal.style.display = "none";
  };
}


function deleteItem(index) {
  const itemName = inventory[index].name;
  // Show reusable confirmModal for delete
  showDeleteConfirm(`Are you sure you want to delete "${itemName}"?`, () => {
    const row = document.querySelector(`tr[data-index="${index}"]`);
    if (row) {
      row.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      row.style.opacity = 0;
      row.style.transform = "translateX(-100%)";
    }

    setTimeout(() => {
      const removed = inventory.splice(index, 1)[0];
      history.push(`Deleted "${removed.name}".`);
      updateStorage();
      renderInventory();
    }, 500);
  });
}

// Clear all button function

function clearInventory() {
  const modal = document.getElementById("clearAllModal");
  const yesBtn = document.getElementById("clearAllYes");
  const noBtn = document.getElementById("clearAllNo");

  modal.style.display = "flex";

  yesBtn.onclick = () => {
    inventory = [];
    history.push("Cleared all inventory.");
    updateStorage();
    renderInventory();
    modal.style.display = "none";
  };

  noBtn.onclick = () => {
    modal.style.display = "none";
  };
}



function getFilteredInventory() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("categoryFilter").value.toLowerCase();

  return inventory.filter(item => 
    (!search || item.name.toLowerCase().includes(search)) &&
    (!filter || item.category.toLowerCase() === filter)
  );
}


function exportCSV() {
  let csv = "Name,Quantity,Category\n";
  const filteredItems = getFilteredInventory();

  filteredItems.forEach(item => {
    csv += `${item.name},${item.qty},${item.category}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.csv";
  link.click();
}

const { jsPDF } = window.jspdf;

function exportPDF() {
  const doc = new jsPDF();
  const filteredItems = getFilteredInventory();

  doc.autoTable({
    head: [['Name', 'Quantity', 'Category']],
    body: filteredItems.map(item => [item.name, item.qty, item.category])
  });

  doc.save("inventory.pdf");
}



function updateStorage() {
  localStorage.setItem("inventoryData", JSON.stringify(inventory));
  localStorage.setItem("inventoryHistory", JSON.stringify(history));
}

function renderHistory() {
  const log = document.getElementById("historyLog");
  log.innerHTML = history.slice(-10).reverse().map(h => `<li>${h}</li>`).join("");
}


document.getElementById("searchInput").addEventListener("input", renderInventory);
document.getElementById("categoryFilter").addEventListener("change", renderInventory);

// Initial render
renderInventory();

function showConfirmation(message, onYes) {
  const modal = document.getElementById("confirmModal");
  const confirmMessage = document.getElementById("confirmMessage");
  const itemInputs = document.getElementById("itemInputs");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const saveMessage = document.getElementById("saveMessage");

  // Hide inputs, show message for confirmation
  itemInputs.style.display = "none";
  confirmMessage.style.display = "block";

  confirmMessage.textContent = message;
  saveMessage.textContent = "";
  modal.style.display = "flex";

  confirmYes.onclick = () => {
    modal.style.display = "none";
    onYes();
  };

  confirmNo.onclick = () => {
    modal.style.display = "none";
  };
}

//Add Item Function

function openAddModal() {
  editingIndex = null;

  const modal = document.getElementById("addItemModal");
  const nameInput = document.getElementById("addItemName");
  const qtyInput = document.getElementById("addItemQty");
  const categoryInput = document.getElementById("addItemCategory");
  const messageBox = document.getElementById("addSaveMessage");

  nameInput.value = "";
  qtyInput.value = "";
  categoryInput.value = "";
  messageBox.textContent = "";

  modal.style.display = "flex";

  document.getElementById("addSaveBtn").onclick = () => {
    const name = nameInput.value.trim();
    const qty = parseInt(qtyInput.value, 10);
    const category = categoryInput.value.trim();

    if (!name || isNaN(qty) || qty < 0 || !category) {
      messageBox.style.color = "red";
      messageBox.textContent = "Please fill in all fields correctly.";
      return;
    }

    const item = { name, qty, category };
    inventory.push(item);
    history.push(`Added "${name}" with qty ${qty}.`);

    updateStorage();
    renderInventory();

    
    messageBox.style.color = "green";
    messageBox.textContent = "Item added successfully!";

    // Hide the message after 2000ms
  setTimeout(() => {
  messageBox.textContent = "";
    }, 2000);

   //to hide the modal immediately after save button is pressed
    // setTimeout(() => {
    //   modal.style.display = "none";
    // }, 2000);
  };

  document.getElementById("addCancelBtn").onclick = () => {
    modal.style.display = "none";
  };
}


//Edit Item Function

function openEditModal(index) {
  editingIndex = index;

  const modal = document.getElementById("editItemModal");
  const nameInput = document.getElementById("editItemName");
  const qtyInput = document.getElementById("editItemQty");
  const categoryInput = document.getElementById("editItemCategory");
  const messageBox = document.getElementById("editSaveMessage");

  const item = inventory[index];

  nameInput.value = item.name;
  qtyInput.value = item.qty;
  categoryInput.value = item.category;
  messageBox.textContent = "";

  modal.style.display = "flex";

  document.getElementById("editSaveBtn").onclick = () => {
    const name = nameInput.value.trim();
    const qty = parseInt(qtyInput.value, 10);
    const category = categoryInput.value.trim();

    if (!name || isNaN(qty) || qty < 0 || !category) {
      messageBox.textContent = "Please fill in all fields correctly.";
      return;
    }

    inventory[index] = { name, qty, category };
    history.push(`Edited "${name}" to qty ${qty}.`);

    updateStorage();
    renderInventory();

    messageBox.style.color = "green";
    messageBox.textContent = "Changes saved!";

    setTimeout(() => {
      modal.style.display = "none";
    }, 1000);
  };

  document.getElementById("editCancelBtn").onclick = () => {
    modal.style.display = "none";
  };
}

// Showmessage function
function showMessageAuto(msg) {
  const modal = document.getElementById('messageModal');
  const messageText = document.getElementById('messageText');

  messageText.textContent = msg;
  modal.style.display = 'flex';
}

// Logout Function
function logout() {
  // Show "Logging out..." message
  showMessageAuto('🔒 Logging out...');

  // After 2 seconds, redirect to login page
  setTimeout(() => {
    window.location.href = 'StockLogin.html';
  }, 1000);
}
