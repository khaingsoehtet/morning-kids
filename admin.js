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
        fetch('data.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch data.');
                return res.json();
            })
            .then(data => {
                itemList.innerHTML = '';
                let available = 0;
                let unavailable = 0;

                data.forEach((item, index) => {
                    if (item.available) available++;
                    else unavailable++;

                    const card = document.createElement('div');
                    card.className = 'item-card';
                    card.innerHTML = `
                        <img src="images/${item.image}" style="width:100%; height:auto; border-radius:8px;" />
                        <h3>${item.name}</h3>
                        <p><strong>Age Group:</strong> ${item.age}</p>
                        <p>${item.description}</p>
                        <p><strong>Ingredients:</strong> ${item.ingredients}</p>
                        <p><strong>Price:</strong> $${item.price}</p>
                        <p><strong>Status:</strong> ${item.available ? 'Available' : 'Unavailable'}</p>
                        <div style="display:flex;">
                            <button class="edit" onclick="editItem(${index})">Edit</button>
                            <button onclick="deleteItem(${index})">Delete</button>
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
        const age = document.getElementById('age').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const imageFile = document.getElementById('image').files[0];
        const available = document.getElementById('availability').checked;

        if (!name || !age || !description || !ingredients || isNaN(price)) {
            showToast("Please fill all fields correctly.");
            return;
        }

        const formData = new FormData();
        if (imageFile) {
            formData.append('image', imageFile);
        }

        // Use the existing image if no new one is selected
        const uploadPromise = imageFile
            ? fetch('upload.php', {
                  method: 'POST',
                  body: formData,
              }).then((res) => {
                  if (!res.ok) throw new Error('Failed to upload image.');
                  return imageFile.name;
              })
            : Promise.resolve(form.dataset.existingImage); // Use the existing image

        uploadPromise
            .then((imageName) => {
                return fetch('data.json')
                    .then((res) => res.json())
                    .then((data) => {
                        const editIndex = form.dataset.editIndex;

                        const newItem = {
                            name,
                            age,
                            description,
                            ingredients,
                            price,
                            image: imageName, // Use the uploaded or existing image
                            available,
                        };

                        if (editIndex !== undefined) {
                            // Update the existing item
                            data[editIndex] = newItem;
                        } else {
                            // Add a new item
                            data.push(newItem);
                        }

                        return saveData(data);
                    });
            })
            .then(() => {
                showToast("Item saved successfully!");
                form.reset();
                preview.style.display = 'none';
                delete form.dataset.editIndex; // Clear the edit index
                delete form.dataset.existingImage; // Clear the existing image
                loadItems();
            })
            .catch((err) => {
                console.error(err);
                showToast("Failed to save item.");
            });
    });

    function saveData(data) {
        return fetch('save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    window.editItem = function (index) {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                const item = data[index];

                // Populate the form with the item's data
                document.getElementById('name').value = item.name;
                document.getElementById('age').value = item.age;
                document.getElementById('description').value = item.description;
                document.getElementById('ingredients').value = item.ingredients;
                document.getElementById('price').value = item.price;
                document.getElementById('availability').checked = item.available;

                // Show the existing image in the preview
                preview.src = 'images/' + item.image;
                preview.style.display = 'block';

                // Temporarily store the index and existing image name in the form's dataset
                form.dataset.editIndex = index;
                form.dataset.existingImage = item.image;
            });
    };

    window.deleteItem = function(index) {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                if (!confirm("Are you sure you want to delete this item?")) return;
                data.splice(index, 1);
                saveData(data).then(() => {
                    showToast("Item deleted.");
                    loadItems();
                });
            });
    };

    loadItems();
});
