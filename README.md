# pic.io — Premium Passport Photo Studio

**pic.io** (Pass-Port-Photo-Creator) is a premium, web-based application designed to streamline the creation and formatting of passport and ID photographs. This tool provides users with an intuitive, dynamic interface to edit and generate passport-compliant photos that meet international standards and specifications without requiring specialized photography skills or complex software.

---

## 🌟 Concept

The concept behind **pic.io** is to bring a professional photo studio experience directly into your web browser. By leveraging standard web technologies like HTML5 Canvas and JavaScript, it eliminates the need for expensive software or online services with paywalls. The tool automatically calculates exact photo sizes, optimal grid layouts on various print paper dimensions, margins, and cut lines. This ensures that the generated output is a high-quality, print-ready PDF that strictly adheres to the selected country's official passport guidelines.

---

## ✨ Features

- **Multiple Document Standards:** Built-in templates for US Passport (2x2 in), EU / UK (35x45 mm), India (35x45 mm), and China (33x48 mm).
- **Automated Grid Layout:** Intelligently calculates the maximum number of photos that can fit on your chosen paper size (A4, 4x6 in, Letter, A5).
- **High-Quality Export:** Generates crystal-clear, print-ready PDFs using jsPDF at Standard (300 DPI) or Ultra HD (600 DPI) resolutions.
- **Customizable Layout Spacing:** Fine-tune photo gaps and page margins with easy-to-use sliders.
- **Background Customization:** Quickly swap the background color to white, off-white, light blue, or use the custom color picker for exact shades.
- **Alignment View:** Face alignment guides (head oval, shoulders curve, center line) with zoom capabilities to ensure the subject is perfectly centered and scaled.
- **Print Guides:** Optional cut lines (trim markers) and thin photo borders to assist in cutting the physical photos post-printing.
- **Premium UI/UX:** A modern responsive interface with a dark/light theme toggle, custom scrollbars, micro-animations, and smooth transitions.
- **Privacy First:** Runs entirely in the browser using client-side technologies. No photos are uploaded to any server, ensuring complete data privacy.

---

## 🚀 Guide / How to Use

1. **Upload a Photo:** 
   Start by dragging and dropping an image (JPG or PNG) into the upload zone on the left sidebar, or click to browse your files.
2. **Select Document Standard:** 
   Choose the required passport photo size from the available international standards.
3. **Choose Paper Size:** 
   Select the size of the paper you intend to print on (e.g., A4, 4x6 photo paper).
4. **Adjust Layout & Spacing:** 
   Use the quantity stepper to define how many copies you want, or keep it on **Auto** to maximize page usage. Adjust the photo gap and page margin sliders to your preference.
5. **Set Background & Print Quality:** 
   Select an appropriate background color and choose between 300 DPI or 600 DPI for your final print resolution.
6. **Align the Photo:** 
   Switch to the "Alignment" mode using the floating toolbar. Use the on-screen template guides and zoom slider to correctly scale and position the subject's face.
7. **Preview and Generate:** 
   Switch back to the "PDF Preview" mode. Click the **Generate** button to process the layout. A print-ready grid will be created.
8. **Download:** 
   Once generation is complete, click the **Download** button to save your PDF file. You can now send this file directly to any standard printer.

---

## 🛠 Tech Stack

- **HTML5:** Semantic structure and application layout.
- **Vanilla CSS:** Custom design system, CSS variables for theming, responsive design, and modern UI aesthetics.
- **Vanilla JavaScript (ES6+):** Application logic, file handling, and dynamic layout mathematics.
- **HTML5 Canvas:** Real-time image processing, scaling, and rendering preview grids.
- **jsPDF:** Client-side JavaScript library used to compile and export the final PDF document.
- **Remix Icon:** Scalable vector icons used throughout the user interface.

---

## 📜 License

This project is open-source and available under the MIT License.