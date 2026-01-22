🛡️ Cyber-IDE Portfolio v4.1
============================

> "Where Full Stack Engineering meets Cyber Security."

An immersive **Web Operating System** portfolio that transforms the traditional resume into an interactive desktop environment. Built to demonstrate proficiency in MERN stack development, system architecture, and UI/UX design.

🚀 Features
-----------

### 🖥️ The WebOS Environment

-   **Window Manager**: Fully functional windowing system with dragging, minimizing, maximizing, and z-index management.

-   **Hybrid Interface**:

    -   **Desktop Mode**: Taskbar, start menu, and draggable windows.

    -   **Mobile Mode**: Transforms into a touch-optimized mobile OS with status bar, navigation gestures, and app grid.

-   **Apps Ecosystem**:

    -   **Terminal**: Interactive shell with command history and "hacking" simulations.

    -   **File Explorer**: Nested file system navigation for projects.

    -   **Code Editor**: Syntax-highlighted viewer for project source code.

    -   **Quest Log**: Gamified skills matrix and achievement tracking.

    -   **Secure Link**: Encrypted-style contact form.

🛠️ Tech Stack
--------------

-   **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS

-   **Animation**: Framer Motion (Window transitions, UI interactions)

-   **Backend**: Next.js API Routes (Serverless)

-   **Database**: MongoDB (Mongoose ODM)

-   **Icons**: Lucide React

⚡ Getting Started
-----------------

### Prerequisites

-   Node.js (v18+)

-   MongoDB Atlas Account

### Installation

1.  **Clone the repository**

    ```
    git clone [https://github.com/yourusername/cyber-portfolio.git](https://github.com/yourusername/cyber-portfolio.git)
    cd cyber-portfolio

    ```

2.  **Install dependencies**

    ```
    npm install

    ```

3.  **Configure Environment**

    Create a `.env.local` file in the root directory:

    ```
    # Connection string to your MongoDB Atlas Cluster
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio

    ```

4.  **Run Development Server**

    ```
    npm run dev

    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000 "null") in your browser.

🕹️ System Usage
----------------

-   **Navigation**: Double-click icons to open apps. Use the Start Menu (CPU Icon) to navigate.

-   **Konami Code**: Enter `↑ ↑ ↓ ↓ ← → ← → b a` to unlock God Mode.

-   **Command Palette**: Press `Ctrl + K` (or `Cmd + K`) to quick-launch apps.

📂 Project Structure
--------------------

```
/app
├── (public)         # Main WebOS Interface
│   └── page.tsx
├── components       # Shared UI Components
└── lib              # Database & Utils
    ├── db.ts        # MongoDB Connection
    └── models.ts    # Mongoose Schemas

```

🤝 Contributing
---------------

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/yourusername/cyber-portfolio/issues "null").

📝 License
----------

This project is [MIT](https://www.google.com/search?q=LICENSE "null") licensed.

<p align="center">

<i>System Status: 🟢 Online | Latency: 10ms | Security: Active</i>

</p>