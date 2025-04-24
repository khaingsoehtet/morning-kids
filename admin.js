document.addEventListener('DOMContentLoaded', () => {
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
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
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
                        <img src="images/${item.image}" style="width:100%; height:auto; border-radius:8px;" />
                        <h3>${item.name}</h3>
                        <p><strong>Age Group:</strong> ${item.age_group}</p>
                        <p>${item.description}</p>
                        <p><strong>Ingredients:</strong> ${item.ingredients}</p>
                        <p><strong>Price:</strong> $${item.price}</p>
                        <p><strong>Status:</strong> ${item.available == 1 ? 'Available' : 'Unavailable'}</p>
                        <div class="button-group">
                            <button class="edit" onclick="editItem(${item.id})">Edit</button>
                            <button class="delete" onclick="deleteItem(${item.id})">Delete</button>
                            <button class="toggle" onclick="toggleAvailability(${item.id})">Toggle Availability</button>
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
                form.reset();
                preview.style.display = 'none';
                delete form.dataset.editId;
                delete form.dataset.existingImage;
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
            loadItems();
        })
        .catch(err => {
            console.error(err);
            showToast("Failed to update availability.");
        });
    };

    loadItems();
});
