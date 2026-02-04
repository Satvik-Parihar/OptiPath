# OptiPath

<div align="center">
  <img src="frontend/public/optipath-logo.png" alt="Logo" width="100" height="100">

  <h3 align="center">OptiPath</h3>

  <p align="center">
    A premium, interactive algorithm visualizer designed to simplify the understanding of complex shortest-path algorithms like Dijkstra's and Floyd-Warshall.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://13.127.89.209:5000">View Live Demo</a>
    ·
    <a href="https://github.com/Satvik-Parihar/OptiPath/issues">Report Bug</a>
    ·
    <a href="https://github.com/Satvik-Parihar/OptiPath/pulls">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#key-features">Key Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

**OptiPath** is an advanced educational tool capable of visualizing graph algorithms in real-time. Built mainly for students and developers, it bridges the gap between theoretical concepts and practical execution.

The challenge with learning algorithms like **Dijkstra's** or **Floyd-Warshall** is often visualizing the intermediate states—how the distance matrix updates or how the priority queue processes nodes. OptiPath solves this by offering a clean, step-by-step playback of the entire process.

### Built With

*   [![React][React.js]][React-url]
*   [![Node][Node.js]][Node-url]
*   [![Vite][Vite]][Vite-url]
*   **Cytoscape.js** (Graph Visualization)
*   **Framer Motion** (Animations)

## Key Features

*   ✨ **Interactive Graph Editor**: deeply customizable graph creation—add nodes, draw edges, and adjust weights with a simple drag-and-drop interface.
*   🤖 **AI Image-to-Graph**: Upload a screenshot or photo of a graph diagram, and OptiPath's backend will attempt to reconstruct the graph automatically.
*   📺 **Step-by-Step Simulation**: Play, pause, and step through algorithms to see exactly how variables change at each iteration.
*   📊 **Theory & Comparison**: Detailed breakdowns of algorithm time complexity and specific use-cases (e.g., when to use Floyd-Warshall over Dijkstra).
*   🎨 **Premium UI/UX**: A modern, scroll-free interface designed with user experience in mind.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm
    ```sh
    npm install npm@latest -g
    ```
*   Node.js (v18 or higher recommended)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/Satvik-Parihar/OptiPath.git
    cd OptiPath
    ```

2.  **Install Frontend Dependencies**
    ```sh
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies**
    ```sh
    cd ../backend
    npm install
    ```

4.  **Start the Development Servers**
    *   **Backend**: `npm run dev` (Runs on port 5000)
    *   **Frontend**: `npm run dev` (Runs on port 5173)

## Usage

1.  **Select Graph Input Method**: Use the interactive editor to draw nodes or upload an image.
2.  **Configure Algorithm**: Choose a starting node and select either **Dijkstra** (SSSP) or **Floyd-Warshall** (APSP).
3.  **Run Simulation**: Click "Run" and use the playback controls to navigate through the algorithm's execution steps.
4.  **Analyze**: View the distance table or matrix updates in real-time.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Satvik Parihar - harishparihar663@gmail.com

Project Link: [https://github.com/Satvik-Parihar/OptiPath](https://github.com/Satvik-Parihar/OptiPath)

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
