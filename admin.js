document.addEventListener('DOMContentLoaded', () => {
  // --- Auth & UI ---
  function showAdminUI(loggedIn) {
    document.getElementById('logout-section').style.display = loggedIn ? 'block' : 'none';
    document.getElementById('toast').style.display = loggedIn ? 'block' : 'none';
    // Do not touch dashboard-section, items-section, restaurant-admin here!
    if (loggedIn) {
      loadRestaurants();
      showRestaurantMap(13.7563, 100.5018);
      setActiveSection('dashboard-section');
      setActiveNav(document.getElementById('nav-dashboard'));
    }
  }

  function checkAuth() {
    return fetch('auth_check.php').then(res => {
      if (res.status === 401) throw new Error('Unauthorized');
      return res.json();
    });
  }

  // Logout button logic (top right)
  document.getElementById('logout-btn').onclick = function() {
    fetch('logout.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showAdminUI(false);
          window.location.href = "login.html";
        } else {
          alert('Logout failed. Please try again.');
        }
      });
  };

  showAdminUI(false);
  checkAuth().then(() => showAdminUI(true)).catch(() => showAdminUI(false));

  // --- Restaurant Management ---
  let restaurantMap, restaurantMarker;

  window.loadRestaurants = function() {
    fetch('get_restaurants.php')
      .then(res => res.json())
      .then(restaurants => {
        const list = document.getElementById('restaurant-list');
        list.innerHTML = restaurants.map(r => `
          <div>
            <span><b>${r.name}</b> - ${r.address}</span>
            <span>
              <button onclick="editRestaurant(${r.id})">Edit</button>
              <button onclick="deleteRestaurant(${r.id})">Delete</button>
            </span>
          </div>
        `).join('');
      });
  };

  window.editRestaurant = function(id) {
    fetch('get_restaurants.php')
      .then(res => res.json())
      .then(restaurants => {
        const r = restaurants.find(r => r.id == id);
        document.getElementById('restaurant-id').value = r.id;
        document.getElementById('restaurant-name').value = r.name;
        document.getElementById('restaurant-address').value = r.address;
        document.getElementById('restaurant-lat').value = r.lat;
        document.getElementById('restaurant-lng').value = r.lng;
        document.getElementById('restaurant-cancel').style.display = 'inline-block';
        showRestaurantMap(r.lat, r.lng);
      });
  };

  window.deleteRestaurant = function(id) {
    if (!confirm('Delete this restaurant?')) return;
    fetch('delete_restaurant.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'id=' + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(() => loadRestaurants());
  };

  function showRestaurantMap(lat, lng) {
    lat = parseFloat(lat) || 13.7563;
    lng = parseFloat(lng) || 100.5018;
    if (!restaurantMap) {
      restaurantMap = L.map('restaurant-map').setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(restaurantMap);
      restaurantMarker = L.marker([lat, lng], {draggable:true}).addTo(restaurantMap);
      restaurantMarker.on('dragend', function() {
        const pos = restaurantMarker.getLatLng();
        document.getElementById('restaurant-lat').value = pos.lat.toFixed(6);
        document.getElementById('restaurant-lng').value = pos.lng.toFixed(6);
      });
    } else {
      restaurantMap.setView([lat, lng]);
      restaurantMarker.setLatLng([lat, lng]);
    }
  }

  document.getElementById('restaurant-form').onsubmit = function(e) {
    e.preventDefault();
    const data = {
      id: document.getElementById('restaurant-id').value,
      name: document.getElementById('restaurant-name').value,
      address: document.getElementById('restaurant-address').value,
      lat: parseFloat(document.getElementById('restaurant-lat').value),
      lng: parseFloat(document.getElementById('restaurant-lng').value)
    };
    fetch('save_restaurant.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
      loadRestaurants();
      document.getElementById('restaurant-form').reset();
      document.getElementById('restaurant-id').value = '';
      document.getElementById('restaurant-cancel').style.display = 'none';
      showRestaurantMap(13.7563, 100.5018);
    });
  };

  document.getElementById('restaurant-cancel').onclick = function() {
    document.getElementById('restaurant-form').reset();
    document.getElementById('restaurant-id').value = '';
    this.style.display = 'none';
    showRestaurantMap(13.7563, 100.5018);
  };

  // --- Menu Items Management ---
  const form = document.getElementById('menu-form');
  const preview = document.getElementById('preview');
  const toast = document.getElementById('toast');
  const itemList = document.getElementById('item-list');
  const totalCount = document.getElementById('total-count');
  const availableCount = document.getElementById('available-count');
  const unavailableCount = document.getElementById('unavailable-count');

  document.getElementById('image').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
          preview.src = URL.createObjectURL(file);
          preview.style.display = 'block';
      }
  });

  function showToast(message) {
      toast.textContent = message;
      toast.style.display = 'block';
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        toast.style.display = 'none';
      }, 3000);
  }

  function clearMenuForm() {
    form.reset();
    preview.style.display = 'none';
    delete form.dataset.editId;
    delete form.dataset.existingImage;
    // Always reset the upload button label and style
    const uploadBtn = document.getElementById('upload-btn');
    uploadBtn.textContent = 'Upload Item';
    uploadBtn.disabled = false;
  }

  function loadItems() {
    fetch('get_all.php')
      .then(res => res.json())
      .then(data => {
        itemList.innerHTML = '';
        let available = 0;
        let unavailable = 0;

        data.forEach((item) => {
          if (item.available == 1 || item.available === true) available++;
          else unavailable++;

          const card = document.createElement('div');
          card.className = 'item-card';
          card.innerHTML = `
            <img src="images/${item.image}" alt="${item.name}" />
            <div class="details">
              <h3>${item.name}</h3>
              <p><strong>Age Group:</strong> ${item.age_group}</p>
              <p>${item.description}</p>
              <p><strong>Ingredients:</strong> ${item.ingredients}</p>
              <p><strong>Price:</strong> $${item.price}</p>
              <p><strong>Status:</strong> ${item.available == 1 ? 'Available' : 'Unavailable'}</p>
              <div class="button-group">
                <button class="edit" type="button" onclick="editItem(${item.id})">Edit</button>
                <button class="delete" type="button" onclick="deleteItem(${item.id})">Delete</button>
                <button class="toggle" type="button" onclick="toggleAvailability(${item.id})">Toggle Availability</button>
              </div>
            </div>
          `;
          itemList.appendChild(card);
        });

        totalCount.textContent = data.length;
        availableCount.textContent = available;
        unavailableCount.textContent = unavailable;
      })
      .catch(err => {
        console.error(err);
        showToast("Error loading items.");
      });
  }

  form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const age_group = document.getElementById('age_group').value.trim();
      const description = document.getElementById('description').value.trim();
      const ingredients = document.getElementById('ingredients').value.trim();
      const price = parseFloat(document.getElementById('price').value);
      const imageFile = document.getElementById('image').files[0];
      const available = document.getElementById('availability').checked ? 1 : 0;
      const editId = form.dataset.editId;

      // Basic field validation
      if (!name || !age_group || !description || !ingredients || isNaN(price)) {
          showToast("Please fill all fields correctly.");
          return;
      }
      if (price < 0) {
          showToast("Price must be a positive number.");
          return;
      }

      // Image validation (if a new image is selected)
      if (imageFile) {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(imageFile.type)) {
              showToast("Only JPG, PNG, and GIF images are allowed.");
              return;
          }
          if (imageFile.size > 2 * 1024 * 1024) {
              showToast("Image size must be less than 2MB.");
              return;
          }
      }

      const uploadImage = imageFile
          ? (() => {
              const formData = new FormData();
              formData.append('image', imageFile);
              return fetch('upload.php', {
                  method: 'POST',
                  body: formData,
              })
              .then(res => res.text())
              .then(text => {
                  if (!text.includes('successfully')) throw new Error('Failed to upload image.');
                  return imageFile.name;
              });
          })()
          : Promise.resolve(form.dataset.existingImage || '');

      uploadImage
          .then((imageName) => {
              const itemData = {
                  name,
                  age_group,
                  description,
                  ingredients,
                  price,
                  image: imageName,
                  available,
              };
              if (editId) itemData.id = editId;

              return fetch('save_item.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(itemData)
              });
          })
          .then(res => res.json())
          .then(result => {
              if (!result.success) throw new Error(result.error || 'Failed to save item.');
              showToast("Item saved successfully!");
              clearMenuForm();
              loadItems();
          })
          .catch((err) => {
              console.error(err);
              showToast("Failed to save item.");
          });
  });

  window.editItem = function (id) {
    fetch('get_item.php?id=' + id)
      .then(res => res.json())
      .then(item => {
        document.getElementById('name').value = item.name;
        document.getElementById('age_group').value = item.age_group;
        document.getElementById('description').value = item.description;
        document.getElementById('ingredients').value = item.ingredients;
        document.getElementById('price').value = item.price;
        document.getElementById('availability').checked = item.available == 1;

        if (item.image && item.image.trim() !== "") {
          preview.src = 'images/' + item.image;
          preview.style.display = 'block';
        } else {
          preview.style.display = 'none';
        }

        form.dataset.editId = item.id;
        form.dataset.existingImage = item.image;
        // Always keep the upload button consistent
        const uploadBtn = document.getElementById('upload-btn');
        uploadBtn.textContent = 'Upload Item';
        uploadBtn.disabled = false;
      });
  };

  window.deleteItem = function(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    fetch('delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(result => {
      if (!result.success) throw new Error(result.error || 'Failed to delete item.');
      showToast("Item deleted.");
      clearMenuForm(); // <-- Clear the form and exit edit mode after delete
      loadItems();
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to delete item.");
    });
  };

  window.toggleAvailability = function(id) {
    fetch('toggle_availability.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'id=' + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(result => {
      if (!result.success) throw new Error('Failed to toggle availability.');
      showToast("Availability updated.");
      clearMenuForm(); // <-- Also clear form if toggling while editing
      loadItems();
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to update availability.");
    });
  };

  loadItems();

  // Sidebar navigation logic
  document.getElementById('nav-dashboard').onclick = function(e) {
    e.preventDefault();
    setActiveSection('dashboard-section');
    setActiveNav(this);
    clearMenuForm();
  };
  document.getElementById('nav-items').onclick = function(e) {
    e.preventDefault();
    setActiveSection('items-section');
    setActiveNav(this);
    clearMenuForm();
  };
  document.getElementById('nav-restaurants').onclick = function(e) {
    e.preventDefault();
    setActiveSection('restaurant-admin');
    setActiveNav(this);
    clearMenuForm();
  };

  function setActiveSection(sectionId) {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('items-section').style.display = 'none';
    document.getElementById('restaurant-admin').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
  }
  function setActiveNav(activeLink) {
    document.querySelectorAll('.admin-sidebar a').forEach(a => a.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // Show dashboard by default
  setActiveSection('dashboard-section');
  setActiveNav(document.getElementById('nav-dashboard'));
});
