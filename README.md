# 💉 VaccineChain — Frontend

<p align="center">
  <strong>A Blockchain-Based Vaccine Management Platform</strong>
  <br />
  Improving transparency and traceability in vaccine management through a modern web interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 18" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Frontend-Web%20Application-4285F4?style=for-the-badge" alt="Web Application" />
</p>

---

## 📖 Overview

**VaccineChain-FE** is the frontend application for VaccineChain, a project focused on applying blockchain technology to vaccine management and traceability.

The application provides a web interface for interacting with the platform's vaccine-related workflows, with an emphasis on usability, transparency, and access to relevant information.

This repository contains the frontend source code built with Angular and TypeScript.

## ✨ Key Features

- **Vaccine Management Interface** — A web-based interface for vaccine-related workflows.
- **Information Visualization** — Present vaccine-related information in an organized and accessible format.
- **Traceability-Oriented Experience** — Support the platform's goal of making vaccine information easier to track and verify.
- **Modular Frontend Architecture** — Organize application functionality into reusable Angular components and services.
- **Type-Safe Development** — Use TypeScript to improve maintainability and reduce common development errors.

> The exact workflows and available features depend on the implementation and integration with the platform's backend.

## 🖥️ Application Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/8c5387c3-90ce-463b-a1b4-f95640332c1a" width="57.5%" alt="VaccineChain frontend overview" />
  &nbsp;
  <img src="https://github.com/user-attachments/assets/c5ac525f-dfcc-4d4a-a9a8-96e32de3c61a" width="32.5%" alt="VaccineChain application screen" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/fbc3d676-72a5-437a-a24e-1deb23caeb56" width="57%" alt="VaccineChain application interface" />
  &nbsp;
  <img src="https://github.com/user-attachments/assets/c1d7e569-f5bd-44ac-b1d7-0bccb80c1019" width="33%" alt="VaccineChain detailed application screen" />
</p>

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Angular 18 | Frontend framework |
| TypeScript | Application logic and type safety |
| HTML5 | Application markup |
| CSS | Interface styling |
| Angular CLI | Development server, scaffolding, and builds |
| npm | Package and dependency management |

## 🏗️ Project Structure

```text
VaccineChain-FE/
├── public/             # Public static assets
├── src/
│   ├── app/            # Angular application code
│   ├── assets/         # Application assets, if configured
│   ├── index.html      # Main HTML document
│   ├── main.ts         # Application entry point
│   └── styles.css      # Global styles, if configured
├── PlantUML/           # Architecture and design diagrams
├── angular.json        # Angular CLI configuration
├── package.json        # Scripts and dependencies
├── package-lock.json   # Dependency lockfile
├── tsconfig.json       # TypeScript configuration
└── README.md
```

*Directory contents may vary as the application evolves.*

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) — use a version compatible with Angular 18.
- npm — included with Node.js.
- [Git](https://git-scm.com/)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/).

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/VaccineChain/VaccineChain-FE.git
cd VaccineChain-FE
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm start
```

If the project does not define a `start` script, use:

```bash
npx ng serve
```

**4. Open the application**

Navigate to:

```text
http://localhost:4200/
```

The development server automatically reloads when supported source files change.

## 📦 Build

Create a production build:

```bash
npx ng build
```

Build artifacts are generated in the configured output directory, typically under `dist/`.

## 🧪 Testing

Run unit tests:

```bash
npx ng test
```

The repository's default Angular CLI setup uses Karma for unit testing.

## 🌱 Project Goals

VaccineChain explores how blockchain technology can support vaccine traceability and information transparency.

The frontend aims to provide an accessible interface through which users can interact with the platform and its vaccine-related information.

## 🔗 Repository

- **Frontend:** [VaccineChain-FE](https://github.com/VaccineChain/VaccineChain-FE)
- **Organization:** [VaccineChain](https://github.com/VaccineChain)

---

<p align="center">
  Built with ❤️ for a more transparent vaccine ecosystem.
</p>
