// Frontend Interactive Script for 24/7 Cloud Server Control Hub

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const statusStateText = document.getElementById('statusStateText');
  const uptimeValue = document.getElementById('uptimeValue');
  const requestsValue = document.getElementById('requestsValue');
  const reqRateText = document.getElementById('reqRateText');
  const memoryValue = document.getElementById('memoryValue');
  const memoryProgressBar = document.getElementById('memoryProgressBar');
  const memorySubText = document.getElementById('memorySubText');
  const platformValue = document.getElementById('platformValue');
  const nodeVerText = document.getElementById('nodeVerText');

  const btnFetchItems = document.getElementById('btnFetchItems');
  const btnOpenCreateModal = document.getElementById('btnOpenCreateModal');
  const btnTestHealth = document.getElementById('btnTestHealth');
  const btnClearConsole = document.getElementById('btnClearConsole');

  const addItemForm = document.getElementById('addItemForm');
  const btnSubmitItem = document.getElementById('btnSubmitItem');
  const btnCancelItem = document.getElementById('btnCancelItem');
  const inputName = document.getElementById('inputName');
  const inputCategory = document.getElementById('inputCategory');

  const itemsTableBody = document.getElementById('itemsTableBody');
  const responseConsole = document.getElementById('responseConsole');

  let lastReqCount = 0;

  // Logging Helper
  function logConsole(msg, type = 'info') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    const timestamp = new Date().toLocaleTimeString();

    if (type === 'json') {
      line.textContent = `[${timestamp}] \n` + JSON.stringify(msg, null, 2);
    } else {
      line.textContent = `[${timestamp}] ${msg}`;
    }

    responseConsole.appendChild(line);
    responseConsole.scrollTop = responseConsole.scrollHeight;
  }

  // Format Seconds to HH:MM:SS
  function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }

  // Fetch Server Metrics
  async function fetchServerStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();

      statusStateText.textContent = `${data.status} • ONLINE`;
      uptimeValue.textContent = formatUptime(data.uptimeSeconds);
      requestsValue.textContent = data.totalRequestsHandled.toLocaleString();

      const diffReqs = data.totalRequestsHandled - lastReqCount;
      reqRateText.textContent = `${diffReqs > 0 ? diffReqs : 0} reqs / update`;
      lastReqCount = data.totalRequestsHandled;

      const memory = data.system.memory;
      memoryValue.textContent = `${memory.usedMB} MB`;
      const memPercent = Math.min(100, Math.round((memory.usedMB / memory.totalMB) * 100));
      memoryProgressBar.style.width = `${memPercent}%`;
      memorySubText.textContent = `Process Heap: ${memory.processHeapUsedMB} MB / Total: ${memory.totalMB} MB`;

      platformValue.textContent = `${data.system.platform} (${data.system.architecture})`;
      nodeVerText.textContent = `Node: ${data.system.nodeVersion} • CPUs: ${data.system.cpuCount}`;
    } catch (err) {
      statusStateText.textContent = 'OFFLINE / DISCONNECTED';
      logConsole(`⚠️ Error connecting to status API: ${err.message}`, 'error');
    }
  }

  // Fetch CRUD Items
  async function fetchItems() {
    logConsole('🌐 Fetching items from /api/items...', 'info');
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      logConsole(data, 'json');

      if (data.success && data.data) {
        renderTable(data.data);
      }
    } catch (err) {
      logConsole(`❌ Failed to fetch items: ${err.message}`, 'error');
    }
  }

  // Render Items Table
  function renderTable(items) {
    if (!items || items.length === 0) {
      itemsTableBody.innerHTML = `<tr><td colspan="6" class="empty-cell">ยังไม่มีข้อมูลในเซิฟเวอร์</td></tr>`;
      return;
    }

    itemsTableBody.innerHTML = items.map(item => `
      <tr>
        <td>#${item.id}</td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.category)}</td>
        <td><span class="tag-status ${item.status.toLowerCase()}">${escapeHtml(item.status)}</span></td>
        <td>${new Date(item.createdAt).toLocaleTimeString()}</td>
        <td>
          <button class="btn btn-danger-sm btn-delete" data-id="${item.id}">ลบ</button>
        </td>
      </tr>
    `).join('');

    // Attach delete listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        await deleteItem(id);
      });
    });
  }

  // Create Item
  async function createItem(name, category) {
    logConsole(`🚀 Sending POST /api/items (Name: ${name})...`, 'info');
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, status: 'Active' })
      });
      const data = await res.json();
      logConsole(data, 'json');

      if (data.success) {
        addItemForm.classList.add('hidden');
        inputName.value = '';
        inputCategory.value = '';
        fetchItems();
      }
    } catch (err) {
      logConsole(`❌ Failed to create item: ${err.message}`, 'error');
    }
  }

  // Delete Item
  async function deleteItem(id) {
    logConsole(`🗑️ Sending DELETE /api/items/${id}...`, 'info');
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      const data = await res.json();
      logConsole(data, 'json');
      fetchItems();
    } catch (err) {
      logConsole(`❌ Failed to delete item: ${err.message}`, 'error');
    }
  }

  // Test Health Endpoint
  async function testHealth() {
    logConsole('🩺 Testing Health Endpoint /api/health...', 'info');
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      logConsole(data, 'json');
    } catch (err) {
      logConsole(`❌ Health check failed: ${err.message}`, 'error');
    }
  }

  // Utility HTML Escape
  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Event Listeners
  btnFetchItems.addEventListener('click', fetchItems);
  btnTestHealth.addEventListener('click', testHealth);
  btnClearConsole.addEventListener('click', () => { responseConsole.innerHTML = ''; });

  btnOpenCreateModal.addEventListener('click', () => {
    addItemForm.classList.remove('hidden');
    inputName.focus();
  });

  btnCancelItem.addEventListener('click', () => {
    addItemForm.classList.add('hidden');
  });

  btnSubmitItem.addEventListener('click', () => {
    const name = inputName.value.trim();
    const category = inputCategory.value.trim();
    if (!name) {
      alert('กรุณากรอกชื่อบริการหรือรายการ');
      return;
    }
    createItem(name, category);
  });

  // Initial Boot
  fetchServerStatus();
  fetchItems();
  setInterval(fetchServerStatus, 3000);
});
