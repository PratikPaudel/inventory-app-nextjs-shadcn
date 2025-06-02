# Inventory Management Template - Frontend Demo (NextJS + Shadcn)

This repository contains the open-sourced **frontend** portion of the  Inventory project. The original project was a full-stack inventory management system designed for Northwestern College to track computer equipment.

**You can see a video demonstration of the original full-stack application here:**

[![Watch the video](https://img.youtube.com/vi/jUCNPlm1cew/0.jpg)](https://youtu.be/jUCNPlm1cew)

**The backend API and database components have been removed from this repository.** This version serves as a demonstration of the frontend architecture, UI components, and features, using mock data.

---

## Original Project Overview & Demo

NWCS Inventory was a modern, web-based inventory management system developed to replace an outdated Access database at Northwestern College. The goal was to create a streamlined, efficient system empowering staff to easily track and manage computer equipment across campus. It aimed to provide multi-user access, data visualizations, and user-friendly interfaces.

### Key Features of the Original Full-Stack System:
*(This section describes the capabilities of the complete system, some of which are simulated with mock data in this frontend demo)*

* **Multi-User Access:** Real-time updates and management by authorized users.
* **Comprehensive Device Tracking:** Detailed information including asset tags, serial numbers, locations, status, and warranty details.
* **User-Friendly Web Interface:** Clean, modern design for easy navigation.
* **Data Visualizations:** Interactive dashboards with graphs and reports (simulated with mock data in this demo).
* **Device Status Management:** Tracking statuses like 'available', 'in use', 'damaged'.
* **Search & Filtering:** Robust capabilities to find devices (simulated with client-side filtering on mock data).
* **Mobile-Friendly Interface:** Responsive design for access from any device.
* **Scanner Integration:** Barcode scanning for quick device tracking (barcode scanning UI is present, backend lookup is mocked).
* **Device History & Reporting:** Audit trails for assignments, status, and location changes (audit log UI is present, data is mocked).
* **Device Disposal Management:** Workflow for retired devices.
* **Advanced Search & Granular Reporting.**

---

## About This Open-Sourced Frontend

This repository now contains **only the Next.js frontend application.** It has been modified to:

1. **Remove all backend dependencies:** All API calls have been removed.
2. **Use Mock Data:** The application is populated with sample data to showcase UI elements like tables, charts, and forms.
3. **Demonstrate UI/UX:** Focuses on the user interface, component design, and frontend logic.
4. **Preserve Core UI Functionality:** Features like navigation, theme toggling, form interactions (client-side validation), and display of data (mocked) are functional.

**Purpose of this Open-Sourced Version:**
* To showcase the frontend development work.
* To provide a template or example of a Next.js application with various UI components.
* To allow others to explore the frontend codebase.

**What's NOT Included (and has been removed):**
* The Python (FastAPI/Flask) backend.
* The PostgreSQL database and its schema.
* User authentication and session management (login is a UI demo only).
* Real-time data persistence.

---
## How to Run This Frontend Demo Locally

You can run this demo in two ways: using Docker (recommended for quick setup) or with Node.js directly.

### Option 1: Using Docker

#### Prerequisites

-   **Git:** To clone the repository.
-   **Docker and Docker Compose:** Make sure Docker is installed and running on your system.

#### Setup Steps

1.  **Clone the Repository:**
    
    ```bash
    git clone https://github.com/PratikPaudel/nwcs-inventory
    cd nwcs-inventory
    
    ```
    
2.  **Run with Docker Compose:**
    
    ```bash
    docker-compose up --build
    
    ```
    
    This will build the frontend image and start the container.
    
3.  **Accessing the Application:** Open your web browser and navigate to: `http://localhost:3000`
    
4.  **Stop the Application:** Press `Ctrl+C` in the terminal, or run:
    
    ```bash
    docker-compose down
    
    ```
    

### Option 2: Using Node.js Directly

#### Prerequisites

-   **Git:** To clone the repository.
-   **Node.js and npm (or Yarn):** To install dependencies and run the Next.js development server. (Node.js version 18.x or later recommended).

#### Setup Steps

1.  **Clone the Repository:**
    
    ```bash
    git clone https://github.com/PratikPaudel/nwcs-inventory
    cd nwcs-inventory/frontend 
    
    ```
    
2.  **Install Dependencies:**
    
    ```bash
    npm install
    # or if you use yarn:
    # yarn install
    
    ```
    
3.  **Run the Development Server:**
    
    ```bash
    npm run dev
    # or if you use yarn:
    # yarn dev
    
    ```
    
4.  **Accessing the Application:** Open your web browser and navigate to: `http://localhost:3000`
    


## Contributing

This repository is intended as a template demonstration of the frontend. Contributions are welcome.

---

## License

MIT License
