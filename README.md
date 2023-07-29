# web-clock
 Online digital clock web app built on Bootstrap 5.3 with customizability in mind!  
 Inspired by [online-clock](https://github.com/tmasri/online-clock) by tmasri  
 
 Check it out in action! ([Website](https://online-clock.pages.dev))

# Features

### Clock Mode
 Pick between 12 and 24-hour modes
### Clock Display
 Display the time in 7 different methods (Radix/Conversions)  
 Add a box/bottom border to the clock container (solid, dashed, dotted, double)  
 Toggle seconds progress bar below clock
### Date Format and Alignment
 Set 4 different date formats (or disable!)  
 Date position alignment (left, center, and right)
### Font Customization
 13 predefined font families, or system default  
 Set custom font from installed system fonts  
 Regular and _Italic_ font styles  
 Light, regular, and **bold** font weights  
 5 different font sizes  
 Text shadow customization  
 Text blur/softening filter
### Background Theme
 Color fade mode - Automatically transitions between 6 colors  
 Solid color mode - Choose from 33 different colors  
 Background image mode - Upload and set a custom image from your device  
 Text color override - Set a custom clock text color
### Menu Visibility
 Toggle displaying of the menu button
### Importing/Exporting Settings
 Download and upload generated JSON files containing all of your settings  
 - On import, JSON files and settings are verified before applying

 Try out my personal config!  
```json
{"clockConfig":{"clockMode":"cmo12","clockDisplay":"words","secondsVis":"sviN","dateFormat":"DDDD","dateAlign":"dpoL","borderMode":"btyD","borderStyle":"solid","secondsBarVis":"sbaB"},"fontConfig":{"fontFamily":"Montserrat","fontStyle":"fstR","fontWeight":"fweB","fontSize":"10vw","dropShadow":"2","blurAmount":"0"},"displaySettings":{"menuVisibility":false},"colorTheme":{"colorMode":"solidmode","solidColor":"#2B4771","textColorMode":"tcovO","textColorValue":"#85a3ff","bgImage":"","bgImageSize":""},"exportTimestamp":"Thanks for trying my personal config! -iKarTehFox","version":4}
```
### Page Duration
 Text at the bottom of the menu shows you how much time you've wasted staring at and customizing the clock...
 
# Gallery
### Preview of the page  
 ![A screenshot of the main web clock page. The time 6:19 PM and date of 7/18/2023 is shown against a white background.](/assets/images/main.png)  
### Menu options pane
 ![A screenshot of the menu options panel. The "Clock Settings" section is opened.](/assets/images/menu.png)  
### Customization example
 ![A screenshot of the main web clock page with many customizations applied, such as custom font, background color, and date format.](/assets/images/customizable.png)  
 Like this look? See [Importing/Exporting Settings](https://github.com/iKarTehFox/web-clock#importingexporting-settings) for the config!
 
# How to run
 Step 1: Start your favorite web server software and host index.html at the root directory  
 - Info: This page can run offline since all CSS and JS is included locally. Please note that Google Analytics and OpenGraph meta info is included in index.html!

 Step 2: Congratuations! You're done! :)
 
# Credits (Open Source)
 
 Bootstrap ([Link](https://getbootstrap.com/))
 - Licensed under MIT License
 
 Iconify ([Link](https://iconify.design))
 - Licensed under MIT License
 
 Material Design Icons by Pictogrammers ([GitHub](https://github.com/Templarian/MaterialDesign))
 - Licensed under Apache License 2.0
 
 Luxon ([GitHub](https://github.com/moment/luxon))
 - Licensed under MIT License
 
 number-to-words ([GitHub](https://github.com/marlun78/number-to-words))
 - Licensed under MIT License
 
 Social Buttons for Bootstrap ([GitHub](https://github.com/lipis/bootstrap-social))
 - Licensed under MIT License
 
 Each license can be found in the code's respective files or website.
 
# Credits (Fonts)
 
 Lato ([Link](https://fonts.google.com/specimen/Lato))
 - Licensed under SIL Open Font License
 
 Montserrat ([Link](https://fonts.google.com/specimen/Montserrat))
 - Licensed under SIL Open Font License
 
 Open Sans ([Link](https://fonts.google.com/specimen/Open+Sans))
 - Licensed under SIL Open Font License
 
 Oswald ([Link](https://fonts.google.com/specimen/Oswald))
 - Licensed under SIL Open Font License
 
 Poppins ([Link](https://fonts.google.com/specimen/Poppins))
 - Licensed under SIL Open Font License
 
 Roboto ([Link](https://fonts.google.com/specimen/Roboto))
 - Licensed under Apache License 2.0
 
 Ubuntu ([Link](https://fonts.google.com/specimen/Ubuntu))
 - Licensed under Ubuntu Font License 1.0
 
 Ubuntu Mono ([Link](https://fonts.google.com/specimen/Ubuntu+Mono))
 - Licensed under Ubuntu Font License 1.0
 
 Each license can be found in their respective folders in /fonts
