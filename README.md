# Digital Warranty Tracker

A full-stack mobile application developed using **React Native** and **Django REST Framework** to manage and track product warranties efficiently.

---

## Features

* Add and manage product details
* Track warranty expiry dates
* Categorization of products:

  * Expiring Soon
  * Expired
* Backend API for handling product data

---

## Tech Stack

**Frontend:**

* React Native
* Axios

**Backend:**

* Django
* Django REST Framework

**Database:**

* SQLite

---

## Project Structure

```
digital-warranty-tracker/
│
├── frontend/   # React Native App
├── backend/    # Django Backend (APIs)
├── README.md
```

---

## ⚙️ Setup Instructions

### Backend

```
cd backend/config
python manage.py runserver 0.0.0.0:8000
```

---

### Frontend

```
cd frontend
npm install
npx expo start
```

---

## Important Note

* This project runs on a **private network**
* You may need to update the **API base URL (IP address)** in the frontend code to match your system

Example:

```
http://192.168.x.x:8000/api/
```

---

##  Key Highlights

* Built RESTful APIs using Django REST Framework
* Implemented CRUD operations using Django ORM
* Integrated frontend and backend using API calls
* Focused on clean UI and structured data flow

---

## Author

**Harsh Vishwakarma**
BSc IT Student 

---
