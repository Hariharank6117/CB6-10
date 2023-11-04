    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAqt_xFX_ED1rrvY5ODN3txGKiDpLST7MQ",
        authDomain: "public-distribution-syst-eb08c.firebaseapp.com",
        projectId: "public-distribution-syst-eb08c",
        storageBucket: "public-distribution-syst-eb08c.appspot.com",
        messagingSenderId: "926347228347",
        appId: "1:926347228347:web:70538cb0782aa6711f259e",
        measurementId: "G-ZXWNMT2E3M"
      };
      
              firebase.initializeApp(firebaseConfig);
      
              // Initialize Firestore
              const db = firebase.firestore();
      
              // DOM elements
              const taskList = document.getElementById('task-list');
              const openTimeInput = document.getElementById('open-time');
              const workingTimeInput = document.getElementById('working-time');
              const productDeliverySelect = document.getElementById('product-delivery');
              const shopAddressInput = document.getElementById('shop-address');
              const importantMessageInput = document.getElementById('important-message');
              const submitButton = document.getElementById('submit-task');
      
              // Handle the submit button click
              submitButton.addEventListener('click', () => {
                  const openTimeText = openTimeInput.value.trim();
                  const workingTimeText = workingTimeInput.value.trim();
                  const productDeliveryText = productDeliverySelect.value;
                  const shopAddressText = shopAddressInput.value.trim();
                  const importantMessageText = importantMessageInput.value.trim();
      
                  db.collection('tasks').add({
                      openTime: openTimeText,
                      workingTime: workingTimeText,
                      productDelivery: productDeliveryText,
                      shopAddress: shopAddressText,
                      importantMessage: importantMessageText,
                      timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
      
                  // Clear input fields
                  openTimeInput.value = '';
                  workingTimeInput.value = '';
                  shopAddressInput.value = '';
                  importantMessageInput.value = '';
              });
      
              // Real-time updates from Firestore
              db.collection('tasks')
                  .orderBy('timestamp', 'desc')
                  .onSnapshot((snapshot) => {
                      taskList.innerHTML = '';
                      snapshot.forEach((doc) => {
                          const task = doc.data();
                          const taskCard = document.createElement('div');
                          taskCard.className = 'task-card';
                          taskCard.innerHTML = `
                              <div>Open Time: ${task.openTime}</div>
                              <div>Working Time: ${task.workingTime}</div>
                              <div>Product Delivery: ${task.productDelivery}</div>
                              <div>Shop Address: ${task.shopAddress}</div>
                              <div>Important Message: ${task.importantMessage}</div>
                              <div class="task-actions">
                                  <button onclick="editTask('${doc.id}', '${task.openTime}', '${task.workingTime}', '${task.productDelivery}', '${task.shopAddress}', '${task.importantMessage}')">Edit</button>
                                  <button onclick="deleteTask('${doc.id}')">Delete</button>
                              </div>
                              <form id="edit-form-${doc.id}" class="edit-task-form">
                                  <input type="text" id="edit-open-time-${doc.id}" value="${task.openTime}" placeholder="e.g., 9:00 AM - 6:00 PM">
                                  <input type="text" id="edit-working-time-${doc.id}" value="${task.workingTime}" placeholder="e.g., 8 hours work, 1-hour rest">
                                  <select id="edit-product-delivery-${doc.id}">
                                      <option value="oil" ${task.productDelivery === 'oil' ? 'selected' : ''}>Oil</option>
                                      <option value="rice" ${task.productDelivery === 'rice' ? 'selected' : ''}>Rice</option>
                                      <!-- Add more options as needed -->
                                  </select>
                                  <input type="text" id="edit-shop-address-${doc.id}" value="${task.shopAddress}" placeholder="Enter address">
                                  <textarea id="edit-important-message-${doc.id}" rows="4" placeholder="Enter your message">${task.importantMessage}</textarea>
                                  <button onclick="updateTask('${doc.id}')">Update</button>
                              </form>
                          `;
                          taskList.appendChild(taskCard);
                      });
                  });
      
              // Delete a task
              function deleteTask(taskId) {
                  db.collection('tasks').doc(taskId).delete();
              }
      
              // Edit a task
              function editTask(taskId, openTime, workingTime, productDelivery, shopAddress, importantMessage) {
                  // Hide other edit forms (if any)
                  const editForms = document.querySelectorAll('.edit-task-form');
                  editForms.forEach((form) => {
                      form.style.display = 'none';
                  });
      
                  // Show the edit form for the selected task
                  const editForm = document.getElementById(`edit-form-${taskId}`);
                  editForm.style.display = 'block';
      
                  // Set the values of the edit form inputs
                  document.getElementById(`edit-open-time-${taskId}`).value = openTime;
                  document.getElementById(`edit-working-time-${taskId}`).value = workingTime;
                  document.getElementById(`edit-product-delivery-${taskId}`).value = productDelivery;
                  document.getElementById(`edit-shop-address-${taskId}`).value = shopAddress;
                  document.getElementById(`edit-important-message-${taskId}`).value = importantMessage;
              }
      
              // Update a task
              function updateTask(taskId) {
                  const editedOpenTime = document.getElementById(`edit-open-time-${taskId}`).value.trim();
                  const editedWorkingTime = document.getElementById(`edit-working-time-${taskId}`).value.trim();
                  const editedProductDelivery = document.getElementById(`edit-product-delivery-${taskId}`).value;
                  const editedShopAddress = document.getElementById(`edit-shop-address-${taskId}`).value.trim();
                  const editedImportantMessage = document.getElementById(`edit-important-message-${taskId}`).value.trim();
      
                  db.collection('tasks').doc(taskId).update({
                      openTime: editedOpenTime,
                      workingTime: editedWorkingTime,
                      productDelivery: editedProductDelivery,
                      shopAddress: editedShopAddress,
                      importantMessage: editedImportantMessage,
                  });
      
                  // Hide the edit form
                  const editForm = document.getElementById(`edit-form-${taskId}`);
                  editForm.style.display = 'none';
              }