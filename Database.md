## 📋 Database Structure

### **menu_items**

| Column      | Type         | Description                |
|-------------|--------------|----------------------------|
| id          | INT, PK, AI  | Menu item ID               |
| name        | VARCHAR      | Item name                  |
| age_group   | VARCHAR      | Age group (e.g. 6-12 mo)   |
| description | TEXT         | Short description          |
| ingredients | TEXT         | Ingredients list           |
| price       | DECIMAL      | Price                      |
| image       | VARCHAR      | Image filename             |
| available   | TINYINT(1)   | 1 = available, 0 = not     |

---

### **orders**

| Column         | Type         | Description                |
|----------------|--------------|----------------------------|
| id             | INT, PK, AI  | Order ID                   |
| customer_name  | VARCHAR(255) | Customer name              |
| customer_phone | VARCHAR(50)  | Customer phone             |
| status         | VARCHAR(32)  | Order status               |
| created_at     | DATETIME     | Order creation timestamp   |

---

### **order_status_history**

| Column     | Type         | Description                |
|------------|--------------|----------------------------|
| id         | INT, PK, AI  | Status history ID          |
| order_id   | INT          | Related order ID           |
| status     | VARCHAR(32)  | Status at this step        |
| changed_at | DATETIME     | When status was set        |

---

### **restaurant_info**

| Column   | Type         | Description                |
|----------|--------------|----------------------------|
| id       | INT, PK, AI  | Restaurant ID              |
| name     | VARCHAR      | Restaurant name            |
| address  | VARCHAR      | Address                    |
| lat      | DECIMAL      | Latitude                   |
| lng      | DECIMAL      | Longitude                  |

---

## Example SQL

```sql
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    description TEXT,
    ingredients TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    available TINYINT(1) DEFAULT 1
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    status VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(32) NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE restaurant_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    lat DECIMAL(10,6),
    lng DECIMAL(10,6)
);
```

---

**Add this to your README.md or a new `DATABASE.md` file.**  
This will keep your GitHub documentation up to date for Phase 2.1!