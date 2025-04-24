# Morning Kids

A web app for managing and displaying healthy kids' menu items, with an admin portal, MySQL backend, and Docker support.

## Features

- Admin portal for adding, editing, deleting, and toggling menu items
- Image upload support
- Responsive dashboard with item stats
- MySQL database (no more data.json)
- Dockerized for easy deployment

## Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### Quick Start

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/morning-kids.git
    cd morning-kids
    ```

2. Build and run with Docker Compose:

    ```sh
    docker-compose up --build
    ```

3. Visit [http://localhost:8000](http://localhost:8000) for the client and [http://localhost:8000/admin.html](http://localhost:8000/admin.html) for the admin portal.

### Database

- The app uses MySQL. Make sure your `menu_items` table has these columns:

    | Column      | Type         |
    |-------------|--------------|
    | id          | INT, PK, AI  |
    | name        | VARCHAR      |
    | age_group   | VARCHAR      |
    | description | TEXT         |
    | ingredients | TEXT         |
    | price       | DECIMAL      |
    | image       | VARCHAR      |
    | available   | TINYINT(1)   |

### Folder Structure

```
/Morning Kid/
├── admin.html
├── admin.js
├── db.php
├── delete.php
├── docker-compose.yml
├── Dockerfile
├── get_all.php
├── get_item.php
├── images/
│   └── ...images...
├── index.html
├── README.md
├── save_item.php
├── style.css
├── toggle_availability.php
├── upload.php
```

### Recent Changes

- Switched from `data.json` to MySQL for all data storage
- Permanent delete now removes items from DB, admin, and client
- All code uses `age_group` (not `age`)
- Improved button alignment and admin UI
- Cleaned up unused files

## Notes

- The `images/` folder is git-ignored except for a placeholder `.gitkeep` file, so you can keep the folder structure in your repo without uploading all images.

---

## License

MIT
