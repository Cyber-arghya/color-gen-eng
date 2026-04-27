# Brand Color Generator

![Brand Color Generator Preview](./preview.png)

**Brand Color Generator** is a professional-grade color palette generation tool built with **TypeScript**, **Vite**, and **Tailwind CSS**. It uses modern color science (CAM16) to create visually harmonious and accessible color systems for designers and developers.

## ✨ Key Features

- **🎨 AI-Powered Palettes**: Generates complete color systems (Primary, Secondary, Neutral, Accent) based on a single seed color.
- **🌓 Dynamic Dark/Light Mode**: Seamlessly switches between Light and Dark mode with real-time preview.
- **📊 Advanced Color Science**:
  - Utilizes **CAM16** (Color Appearance Model) for perceptually uniform color generation.
  - Ensures **WCAG AA/AAA** compliance through automatic contrast checking.
- **🗂️ Visual History**:
  - Maintains a history of generated palettes.
  - "Undo" functionality to revert to previous color schemes.
- **📤 Export Ready**:
  - Copy hex codes directly to clipboard.
  - Ready to integrate into any design system.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd color-gen-eng
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Build

Build the production-ready static files:

```bash
npm run build
```
The output will be in the `dist/` folder.

## 🛠️ Tech Stack

- **Core**: TypeScript, Vite, Tailwind CSS
- **Color Engine**: Culori (CAM16 implementation)
- **Architecture**: MVC Pattern (Model-View-Controller)
- **UI**: Vanilla JavaScript, Custom Properties (CSS Variables)

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
