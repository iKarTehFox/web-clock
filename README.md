[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/works-on-my-machine-1.svg)](https://forthebadge.com)

# Online Web Clock
> **An online digital clock web app built with Bootstrap 5.3.3, focused on customizability.  
Inspired by [online-clock](https://github.com/tmasri/online-clock) by tmasri**

**Live Demo:** [View in your browser!](https://online-clock.pages.dev)

**Need compatibility with older browsers?** [Check out the compatibility branch](https://github.com/iKarTehFox/web-clock/tree/compatibility)!

## Table of Contents
- [Run/build Instructions](#instructions-to-run)
- [Features](#features)
- [Gallery](#gallery)
- [Credits (Open Source)](#credits-open-source)
- [Credits (Fonts)](#credits-fonts)

## Instructions to Run
### Run in browser
1. Serve `index.html` at the root directory with your favorite web server.
   - You can also open `index.html` directly.

### Build for Electron
Electron files are temporary, and will change/evolve in the future.

#### Prerequisites
 - [Node.js](https://nodejs.org/)

#### Instructions
1. Clone this repository.
```bash
git clone https://github.com/iKarTehFox/web-clock.git
cd web-clock
```
2. Install dependencies: `npm install`

3. Run `npm run make` to build the app.
   - Artifacts will be located in `./out/make` directory.
   - You can instead run `npm start` to build and run the app for development.

## Features

### Clock Mode
 - Pick between 12 or 24-hour clock modes
### Clock Display
 - Display the time in 7 different methods (Radix/Conversions)  
 - Add a box/bottom border to the clock container (solid, dashed, dotted, double)  
 - Toggle seconds progress bar below clock
### Date Format and Alignment
 - Set 4 different date formats (or disable!)  
 - Date position alignment (left, center, and right)
### Font Customization
 - 13 predefined font families, or system default  
 - Set custom font from installed system fonts  
 - Regular and _Italicized_ font styles  
 - Light, regular, and **bold** font weights  
 - 5 different font sizes  
 - Text shadow customization  
### Background Theme
 - Color fade mode - Automatically transitions between 6 colors  
 - Solid color mode - Choose from 33 different colors  
 - Background image mode - Upload and set a custom image from your device + change sizing and blurring  
 - Text color override - Set a custom clock text color
### Menu Visibility
 - Toggle displaying of the menu button
### Importing/Exporting Settings
 - Download and upload generated JSON files containing all of your settings  
   - Imported JSON files and settings are verified before applying.

 Try out my [personal config](/assets/usdonlineclock-preset.json)!  

 Using an AMOLED screen? Use [this AMOLED preset](/assets/usdonlineclock-amoled-preset.json) to prevent burn-in!  
### Page Duration
 Page duration indicator on the menu shows time spent staring at and customizing the clock...
 
# Gallery
### Preview of the page  
 ![A screenshot of the main web clock page. The time 6:19 PM and date of 7/18/2023 is shown against a white background.](/assets/images/main.png)  
### Menu options pane
 ![A screenshot of the menu options panel. The "Clock Settings" section is opened.](/assets/images/menu.png)  
### Customization example
 ![A screenshot of the main web clock page with many customizations applied, such as custom font, background color, and date format.](/assets/images/customizable.png)  
 > Like this look? See [Importing/Exporting Settings](#importingexporting-settings) for the config!
 
# Credits (Open Source)
 
- **Bootstrap** ([Link](https://getbootstrap.com/)): Licensed under MIT License
 
- **Iconify** ([Link](https://iconify.design)): Licensed under MIT License
 
- **Material Design Icons by Pictogrammers** ([GitHub](https://github.com/Templarian/MaterialDesign)): Licensed under Apache License 2.0
 
- **Luxon** ([GitHub](https://github.com/moment/luxon)): Licensed under MIT License
 
- **number-to-words** ([GitHub](https://github.com/marlun78/number-to-words)): Licensed under MIT License
 
- **Social Buttons for Bootstrap** ([GitHub](https://github.com/lipis/bootstrap-social)): Licensed under MIT License

Each license can be found in the code's respective files or website.
 
# Credits (Fonts)
 
- **Dancing Script** ([Link](https://fonts.google.com/specimen/Dancing+Script)): Licensed under SIL Open Font License 1.1

- **Merriweather** ([Link](https://fonts.google.com/specimen/Merriweather)): Licensed under SIL Open Font License 1.1

- **Nanum Brush Script** ([Link](https://fonts.google.com/specimen/Nanum+Brush+Script)): Licensed under SIL Open Font License 1.1
 
- **Lato** ([Link](https://fonts.google.com/specimen/Lato)): Licensed under SIL Open Font License 1.1
 
- **Montserrat** ([Link](https://fonts.google.com/specimen/Montserrat)): Licensed under SIL Open Font License 1.1
 
- **Open Sans** ([Link](https://fonts.google.com/specimen/Open+Sans)): Licensed under SIL Open Font License 1.1
 
- **Oswald** ([Link](https://fonts.google.com/specimen/Oswald)): Licensed under SIL Open Font License 1.1

- **Pangolin** ([Link](https://fonts.google.com/specimen/Pangolin)): Licensed under SIL Open Font License 1.1
 
- **Poppins** ([Link](https://fonts.google.com/specimen/Poppins)): Licensed under SIL Open Font License 1.1
 
- **Roboto** ([Link](https://fonts.google.com/specimen/Roboto)): Licensed under Apache License 2.0

- **Tektur** ([Link](https://fonts.google.com/specimen/Tektur)): Licensed under SIL Open Font License 1.1
 
- **Ubuntu** ([Link](https://fonts.google.com/specimen/Ubuntu)): Licensed under Ubuntu Font License 1.0
 
- **Ubuntu Mono** ([Link](https://fonts.google.com/specimen/Ubuntu+Mono)): Licensed under Ubuntu Font License 1.0
 
 Each license can be found in their respective folders in /fonts
