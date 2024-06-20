[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/works-on-my-machine-1.svg)](https://forthebadge.com)

# Online Web Clock
> **An online, digital clock web app built with Bootstrap 5.3.3, focused on customizability.  
Inspired by [online-clock](https://github.com/tmasri/online-clock) by tmasri**

**Website:** [View in your browser!](https://online-clock.pages.dev)

**Need compatibility with older browsers?** [Check out the compatibility repository](https://github.com/iKarTehFox/web-clock-compatibility)!

## Table of Contents
- [Build Instructions](#build-instructions)
- [Features](#features)
  - [URL Parameters](#url-parameters)
- [Gallery](#gallery)
- [Acknowledgements (OSS)](#acknowledgements-oss)
- [Acknowledgements (Fonts)](#acknowledgements-fonts)

## Build Instructions
Online Web Clock is bundled with Webpack. You can follow the steps below to build the project.

#### Prerequisites
 - [Node.js](https://nodejs.org/)

#### Instructions
1. Clone the repository and `cd` into it.
```bash
git clone https://github.com/iKarTehFox/web-clock.git && cd web-clock
```
2. Install dependencies: `npm install`

3. Run `npm run build` or `npm run build:prod` to bundle with Webpack in production mode.
   - Bundled files will be located in the `./dist` directory.
   - You can instead run `npm run build:dev` to bundle for development.

4. Serve the files in the `./dist` directory with your favorite http server.

## Features
### Clock Mode
 - Pick between 12 or 24-hour clock modes
### Date and Time
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
### Weather
 - Enable a weather widget to show the current weather (updates every 15 min!)
 - Enter an OpenWeatherMap API key
 - Manually set coordinates or use GPS
 - Choose between Imperial and Metric units
### Display Options
 - Toggle Dark Mode for the menu and weather widget
 - Toggle displaying of the menu button
 - Toggle showing the current time in the tab title
 - Enter fullscreen mode
### Importing/Exporting Settings
 - Download and upload generated JSON files containing all of your settings  
   - Imported JSON files and settings are verified before applying.
 - Or, choose from a selection of preset settings files!

 Try out my [personal config](/src/assets/usdonlineclock-preset.json)!
### URL Parameters
In the URL bar, you can pass the following parameters:  
 1. **debug=true**: Enables debug logging after the page has loaded
 2. **darkMode=true**: Sets the menu theme to Dark
 3. **menuVis=false**: Hides the menu button
 4. **tabTitle=false**: Disables showing the current time in the tab title
 5. **preset=\<filename\>**: Loads a JSON preset with the filename \<filename\> from the `/src/assets` directory.

 For instance, you can [visit](https://online-clock.pages.dev/?darkMode=true&menuVis=false&tabTitle=false&preset=usdonlineclock-amoled-preset) the following URL, `https://online-clock.pages.dev/?darkMode=true&menuVis=false&tabTitle=false&preset=usdonlineclock-amoled-preset` to load with the dark mode menu theme **enabled**, the menu button **hidden**, the tab title **disabled**, and the preset `usdonlineclock-amoled-preset` applied.

 With this in mind, you can bookmark the URL with the parameters you want, and it will load the page with those settings every time!
 
# Gallery
### Preview of the page  
 ![A screenshot of the main web clock page. The time 12:00 PM and date of June 1st, 2024 is shown against a white background.](/src/assets/images/main.png)  
### Menu options pane
 ![A screenshot of the menu options panel. The "Date and Time" section is opened.](/src/assets/images/menu.png)  
### Customization example
 ![A screenshot of the main web clock page with many customizations applied, such as custom font, background image, date format, and weather widget.](/src/assets/images/customizable.png)  
 > Like this look? See [Importing/Exporting Settings](#importingexporting-settings) for the config!
 
# Acknowledgements (OSS)
- **Bootstrap** ([Link](https://getbootstrap.com/)): Licensed under MIT License
 
- **Iconify** ([Link](https://iconify.design)): Licensed under MIT License
 
- **Material Design Icons by Pictogrammers** ([GitHub](https://github.com/Templarian/MaterialDesign)): Licensed under Apache License 2.0
 
- **Luxon** ([GitHub](https://github.com/moment/luxon)): Licensed under MIT License
 
- **number-to-words** ([GitHub](https://github.com/marlun78/number-to-words)): Licensed under MIT License
 
- **Social Buttons for Bootstrap** ([GitHub](https://github.com/lipis/bootstrap-social)): Licensed under MIT License

- **ts-luxon** ([Link](https://www.npmjs.com/package/ts-luxon)): Licensed under MIT

- **Webpack** ([Link](https://webpack.js.org/)): Licensed under MIT License

Each license can be found in the code's respective files or website.
 
# Acknowledgements (Fonts)
 
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
 
 Each license can be found in their respective folders in /src/fonts
