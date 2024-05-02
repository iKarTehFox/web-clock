[![forthebadge](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMjguMDkzNzcyODg4MTgzNiIgaGVpZ2h0PSIzNSIgdmlld0JveD0iMCAwIDIyOC4wOTM3NzI4ODgxODM2IDM1Ij48cmVjdCB3aWR0aD0iMTAzLjQ4NDM4MjYyOTM5NDUzIiBoZWlnaHQ9IjM1IiBmaWxsPSIjMmY3NGMwIi8+PHJlY3QgeD0iMTAzLjQ4NDM4MjYyOTM5NDUzIiB3aWR0aD0iMTI0LjYwOTM5MDI1ODc4OTA2IiBoZWlnaHQ9IjM1IiBmaWxsPSIjMzg5QUQ1Ii8+PHRleHQgeD0iNTEuNzQyMTkxMzE0Njk3MjY2IiB5PSIyMS41IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iJ1JvYm90bycsIHNhbnMtc2VyaWYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyIj5NQURFIFdJVEg8L3RleHQ+PHRleHQgeD0iMTY1Ljc4OTA3Nzc1ODc4OTA2IiB5PSIyMS41IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iOTAwIiBsZXR0ZXItc3BhY2luZz0iMiI+VFlQRVNDUklQVDwvdGV4dD48L3N2Zz4=)](https://forthebadge.com)
[![forthebadge](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMzAuMjM0Mzk3ODg4MTgzNiIgaGVpZ2h0PSIzNSIgdmlld0JveD0iMCAwIDIzMC4yMzQzOTc4ODgxODM2IDM1Ij48cmVjdCB3aWR0aD0iMTI5LjE4NzUxNTI1ODc4OTA2IiBoZWlnaHQ9IjM1IiBmaWxsPSIjMjM3Y2MyIi8+PHJlY3QgeD0iMTI5LjE4NzUxNTI1ODc4OTA2IiB3aWR0aD0iMTAxLjA0Njg4MjYyOTM5NDUzIiBoZWlnaHQ9IjM1IiBmaWxsPSIjOGVkNWZhIi8+PHRleHQgeD0iNjQuNTkzNzU3NjI5Mzk0NTMiIHk9IjIxLjUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSInUm9ib3RvJywgc2Fucy1zZXJpZiIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIiPkJVTkRMRUQgV0lUSDwvdGV4dD48dGV4dCB4PSIxNzkuNzEwOTU2NTczNDg2MzMiIHk9IjIxLjUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSInTW9udHNlcnJhdCcsIHNhbnMtc2VyaWYiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI5MDAiIGxldHRlci1zcGFjaW5nPSIyIj5XRUJQQUNLPC90ZXh0Pjwvc3ZnPg==)](https://forthebadge.com)

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
This project is now bundled with Webpack. Electron support has been removed, but may return in the future.

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

 Try out my [personal config](/src/assets/usdonlineclock-preset.json)!
### Page Duration
 Page duration indicator on the menu shows time spent staring at and customizing the clock...
 
# Gallery
### Preview of the page  
 ![A screenshot of the main web clock page. The time 6:19 PM and date of 7/18/2023 is shown against a white background.](/src/assets/images/main.png)  
### Menu options pane
 ![A screenshot of the menu options panel. The "Clock Settings" section is opened.](/src/assets/images/menu.png)  
### Customization example
 ![A screenshot of the main web clock page with many customizations applied, such as custom font, background color, and date format.](/src/assets/images/customizable.png)  
 > Like this look? See [Importing/Exporting Settings](#importingexporting-settings) for the config!
 
# Credits (Open Source)
- **Bootstrap** ([Link](https://getbootstrap.com/)): Licensed under MIT License
 
- **Iconify** ([Link](https://iconify.design)): Licensed under MIT License
 
- **Material Design Icons by Pictogrammers** ([GitHub](https://github.com/Templarian/MaterialDesign)): Licensed under Apache License 2.0
 
- **Luxon** ([GitHub](https://github.com/moment/luxon)): Licensed under MIT License
 
- **number-to-words** ([GitHub](https://github.com/marlun78/number-to-words)): Licensed under MIT License
 
- **Social Buttons for Bootstrap** ([GitHub](https://github.com/lipis/bootstrap-social)): Licensed under MIT License

- **ts-luxon** ([Link](https://www.npmjs.com/package/ts-luxon)): Licensed under MIT

- **Webpack** ([Link](https://webpack.js.org/)): Licensed under MIT License

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
 
 Each license can be found in their respective folders in /src/fonts
