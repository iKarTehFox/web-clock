export default {
    'panel': {
        'countdown': {
            'tooltip': 'Countdown'
        },
        'stopwatch': {
            'tooltip': 'Stopwatch'
        },
        'menu': {
            'label': 'Menu'
        }
    },
    'countdown': {
        'title': 'Countdown',
        'placeholderhours': 'Hours',
        'placeholderminutes': 'Minutes',
        'placeholderseconds': 'Seconds',
        'action': {
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'notificationlabel': 'Enable notification on finish'
        }
    },
    'stopwatch': {
        'title': 'Stopwatch',
        'action': {
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'lap': 'Lap',
        }
    },
    'weather': {
        'fahrenheit': 'F',
        'celsius': 'C',
        'temperature': 'Temperature',
        'feelslike': 'Feels like',
        'max': 'Max',
        'min': 'Min',
        'wind': 'Wind',
        'mph': 'mph',
        'ms': 'm/s',
        'N': 'N',
        'NNE': 'NNE',
        'NE': 'NE',
        'ENE': 'ENE',
        'E': 'E',
        'ESE': 'ESE',
        'SE': 'SE',
        'SSE': 'SSE',
        'S': 'S',
        'SSW': 'SSW',
        'SW': 'SW',
        'WSW': 'WSW',
        'W': 'W',
        'WNW': 'WNW',
        'NW': 'NW',
        'NNW': 'NNW'
    },
    'menu': {
        'title': 'Menu',
        'section': {
            'datetime': {
                'header': 'Date and Time',
                'setting': {
                    'clockmode': {
                        'title': 'Clock Mode',
                        'option': {
                            '12': '12-hour',
                            '24': '24-hour'
                        }
                    },
                    'timezone': {
                        'title': 'Time Zone'
                    },
                    'displaysystem': {
                        'title': 'Display System',
                        'option': {
                            'radix': {
                                'title': 'Radix Systems',
                                'binary': 'Binary (Base 2)',
                                'octal': 'Octal (Base 8)',
                                'decimal': 'Decimal (Base 10)',
                                'hexadecimal': 'Hexadecimal (Base 16)',
                                'hexatrigesimal': 'Hexatrigesimal (Base 36)'
                            },
                            'conversions': {
                                'title': 'Conversions',
                                'emoji': 'Emoji (1️⃣2️⃣:0️⃣0️⃣)',
                                'romannumeral': 'Roman Numeral (XII:00)',
                                'words': 'Words (twelve:o\'clock)'
                            },
                            'technical': {
                                'title': 'Technical',
                                'unixms': 'Unix timestamp (ms)',
                                'unixsec': 'Unix timestamp (sec)',
                                'y2k38': 'Time to Y2K38 problem'
                            },
                            'specialevents': {
                                'title': 'Special Events',
                                'valentines': 'Time to Valentine\'s Day',
                                'christmas': 'Time to Christmas',
                                'newyear': 'Time to New Year\'s Day'
                            },
                            'isit': {
                                'title': 'Is it...',
                                'christmas': '...Christmas?',
                                'weekend': '...the weekend?',
                                'leapyear': '...a leap year?'
                            }
                        }
                    },
                    'secondsdisplay': {
                        'title': 'Seconds Display',
                        'option': {
                            'show': 'Show',
                            'hide': 'Hide'
                        }
                    },
                    'timebar': {
                        'title': 'Time Bar',
                        'option': {
                            'week': 'Week progress (Mon-Sun)',
                            'month': 'Month progress',
                            'day': 'Day progress',
                            'hour': 'Hour progress',
                            'seconds': 'Seconds',
                            'off': 'Off'
                        }
                    },
                    'datedisplay': {
                        'title': 'Date Display',
                        'option': {
                            'localized': {
                                'title': 'Localized'
                            },
                            'standard': {
                                'title': 'Standard'
                            },
                            'off': 'Off'
                        }
                    },
                    'datealignment': {
                        'title': 'Date Alignment',
                        'option': {
                            'left': 'Left',
                            'center': 'Center',
                            'right': 'Right'
                        }
                    },
                    'borderstyle': {
                        'title': 'Border Style',
                        'option': {
                            'none': 'None',
                            'box': 'Box',
                            'bottom': 'Bottom',
                            'solid': 'Solid',
                            'dashed': 'Dashed',
                            'dotted': 'Dotted',
                            'double': 'Double'
                        }
                    },
                    'customnote': {
                        'title': 'Custom Note',
                        'placeholder': 'Enter text here...'
                    },
                    'notealignment': {
                        'title': 'Note Alignment',
                        'option': {
                            'top': 'Top',
                            'bottom': 'Bottom'
                        }
                    },
                    'timerefreshmethod': {
                        'title': 'Time Refresh Method',
                        'label': 'Use legacy refresh method',
                        'description': 'Enable if you encounter clock instability on Firefox or non-Chromium-based browsers (refreshes clock every 100ms).'
                    }
                }
            },
            'fontcustomization': {
                'header': 'Font Customization',
                'setting': {
                    'fontfamily': {
                        'title': 'Font Family',
                        'option': {
                            'default': 'System default',
                            'sansserif': {
                                'title': 'Sans-serif'
                            },
                            'serif': {
                                'title': 'Serif'
                            },
                            'handwritten': {
                                'title': 'Handwritten'
                            }
                        }
                    },
                    'customfont': {
                        'title': 'Custom Font',
                        'tooltip': 'Enter the name of a font installed on your system',
                        'placeholder': 'Enter font name...',
                        'submit': 'Submit'
                    },
                    'fontstyle': {
                        'title': 'Font Style',
                        'option': {
                            'regular': 'Regular',
                            'italic': 'Italic'
                        }
                    },
                    'fontweight': {
                        'title': 'Font Weight',
                        'option': {
                            'light': 'Light',
                            'normal': 'Normal',
                            'bold': 'Bold'
                        }
                    },
                    'fontsize': {
                        'title': 'Font Size',
                        'option': {
                            'smaller': 'Smaller (6vw)',
                            'small': 'Small (8vw)',
                            'default': 'Default (10vw)',
                            'large': 'Large (12vw)',
                            'larger': 'Larger (14vw)',
                            'huge': 'Huge (18vw)',
                        }
                    },
                    'texteffects': {
                        'title': 'Text Effects',
                        'option': {
                            'dropshadow': 'Drop shadow',
                            'strokewidth': 'Stroke width',
                            'strokecolor': 'Stroke color'
                        }
                    },
                }
            },
            'backgroundtheme': {
                'header': 'Background Theme',
                'setting': {
                    'backgroundcolormode': {
                        'title': 'Background Color Mode',
                        'option': {
                            'colorfade': 'Color Fade',
                            'solid': 'Solid',
                            'image': 'Image',
                            'currentcolor': 'Current color:'
                        }
                    },
                    'colortransition': {
                        'title': 'Color Transition',
                        'option': {
                            'length': 'Length',
                            'reset': 'Reset',
                            'tooltip': 'Reset length to default.'
                        }
                    },
                    'basiccolors': {
                        'title': 'Basic colors',
                        'tooltip': {
                            'basicred': 'Basic red',
                            'basicorange': 'Basic orange',
                            'basicyellow': 'Basic yellow',
                            'basicgreen': 'Basic green',
                            'basicblue': 'Basic blue',
                            'basicmagenta': 'Basic magenta',
                            'basicwhite': 'Basic white',
                            'basicgray': 'Basic gray',
                            'basicblack': 'Basic black'
                        }
                    },
                    'brightcolors': {
                        'title': 'Bright colors',
                        'tooltip': {
                            'palepink': 'Pale pink',
                            'paleblue': 'Pale blue',
                            'lavender': 'Lavender',
                            'powderblue': 'Powder blue',
                            'palepeach': 'Pale peach',
                            'mintgreen': 'Mint green',
                            'periwinkleblue': 'Periwinkle blue',
                            'apricot': 'Apricot',
                            'dustyrose': 'Dusty rose',
                            'seafoamgreen': 'Seafoam green',
                            'mauve': 'Mauve',
                            'lilac': 'Lilac'
                        }
                    },
                    'deepcolors': {
                        'title': 'Deep colors',
                        'tooltip': {
                            'deeppink': 'Deep pink',
                            'deepblue': 'Deep blue',
                            'deeplavender': 'Deep lavender',
                            'deeppowderblue': 'Deep powder blue',
                            'deeppeach': 'Deep peach',
                            'darkmintgreen': 'Dark mint green',
                            'deepperiwinkleblue': 'Deep periwinkle blue',
                            'deepapricot': 'Deep apricot',
                            'deepdustyrose': 'Deep dusty rose',
                            'deepseafoamgreen': 'Deep seafoam green',
                            'deepmauve': 'Deep mauve',
                            'darklilac': 'Dark lilac'
                        }
                    },
                    'backgroundimage': {
                        'title': 'Background Image',
                        'option': {
                            'uploadimage': 'Upload image'
                        }
                    },
                    'imageeffects': {
                        'title': 'Image Effects',
                        'option': {
                            'sizing': 'Sizing:',
                            'automatic': 'Automatic',
                            'cover': 'Cover',
                            'stretch': 'Stretch',
                            'imageblur': 'Image Blur',
                            'imageblurdescription': 'Note: May use more power when active',
                        }
                    },
                    'textcoloroverride': {
                        'title': 'Text Color Override',
                        'option': {
                            'disabled': 'Disabled',
                            'enabled': 'Enabled',
                            'textcolor': 'Text color'
                        }
                    }
                }
            },
            'weather': {
                'header': 'Weather',
                'setting': {
                    'appid': {
                        'title': 'OpenWeatherMap AppID',
                        'option': {
                            'placeholder': 'API key',
                            'link': 'Find your API key'
                        }
                    },
                    'location': {
                        'title': 'Location',
                        'option': {
                            'latitude': 'Latitude',
                            'longitude': 'Longitude',
                            'getlocation': 'Get location',
                        }
                    },
                    'units': {
                        'title': 'Units',
                        'option': {
                            'imperial': 'Imperial',
                            'metric': 'Metric'
                        }
                    },
                    'action': {
                        'disable': 'Disable',
                        'enable': 'Enable'
                    },
                    'widgetpos': {
                        'title': 'Widget Position',
                        'option': {
                            'toggle': 'Toggle drag-to-move',
                            'reset': 'Reset position...',
                            'description': 'Note: After toggling, drag the weather widget with your cursor!'
                        }
                    },
                    'privacy': 'Review the Privacy Policy'
                },
            },
            'displayoptions': {
                'header': 'Display Options',
                'setting': {
                    'language': {
                        'title': 'Language'
                    },
                    'menutheme': {
                        'title': 'Menu Theme',
                        'option': {
                            'light': 'Light',
                            'dark': 'Dark',
                            'midnight': 'Midnight'
                        }
                    },
                    'panelvisibility': {
                        'title': 'Panel Visibility',
                        'option': {
                            'label': 'Show panel buttons',
                            'description': 'Double click the screen to make buttons visible again'
                        }
                    },
                    'tabtitle': {
                        'title': 'Tab Title',
                        'option': {
                            'label': 'Display current time in tab title'
                        }
                    },
                    'fullscreen': {
                        'title': 'Fullscreen mode',
                        'option': {
                            'toggle': 'Toggle View'
                        }
                    }
                }
            },
            'debugging': {
                'header': 'Debugging',
                'setting': {
                    'debuginfo': {
                        'title': 'Debug Info',
                        'option': {
                            'useragent': 'User Agent',
                            'locale': 'Locale',
                            'timezone': 'System Timezone',
                            'loadtime': 'Load Time',
                            'resolution': 'Screen Resolution',
                            'colordepth': 'Color Depth',
                            'onlinestatus': 'Online Status'
                        }
                    },
                    'devcolors': {
                        'title': 'Dev Colors',
                        'option': {
                            'jekylldark': 'Jekyll Dark',
                            'firefoxdark': 'Firefox Dark',
                            'chromedark': 'Chrome Dark',
                            'githubdark': 'GitHub Dark',
                            'vscodedark': 'VS Code Dark',
                            'windowsdark': 'Windows Dark',
                            'bootstrapdark1': 'Bootstrap Dark 1',
                            'bootstrapdark2': 'Bootstrap Dark 2',
                            'description': 'Note: These colors should not be exported. If imported, verification will fail.'
                        }
                    },
                    'settings': {
                        'title': 'Settings',
                        'option': {
                            'logjson': {
                                'title': 'Log JSON',
                                'tooltip': 'Log JSON settings to console'
                            },
                            'viewrawjson': {
                                'title': 'View Raw JSON',
                                'tooltip': 'View current JSON settings in modal'
                            },
                            'extractbgimg': {
                                'title': 'Extract BG Image',
                                'tooltip': 'Extract and view current background image'
                            },
                        }
                    },
                    'toasts': {
                        'title': 'Toasts',
                        'option': {
                            'dark': 'Dark',
                            'light': 'Light',
                            'danger': 'Danger',
                            'success': 'Success',
                            'warning': 'Warning'
                        }
                    },
                    'ui': {
                        'title': 'UI',
                        'option': {
                            'removeclock': 'Remove clock container'
                        }
                    },
                    'localstorage': {
                        'title': 'localStorage',
                        'option': {
                            'clear': 'Clear localStorage'
                        }
                    }
                }
            },
            'importexport': {
                'header': 'Import/Export Settings',
                'setting': {
                    'importsettings': {
                        'title': 'Import Settings',
                        'option': {
                            'uploadjson': 'Upload from JSON',
                            'scanqrcode': 'Scan QR Code',
                            'manualtext': 'Or manually paste JSON settings instead:',
                            'placeholder': 'Paste JSON in here',
                            'load': 'Load settings'
                        }
                    },
                    'presets': {
                        'title': 'Built-in presets',
                        'description': 'Note: Press <kbd>h</kbd> to view keyboard shortcuts.'
                    },
                    'exportsettings': {
                        'title': 'Export Settings',
                        'option': {
                            'downloadjson': 'Download JSON file',
                            'copyjson': 'Copy to clipboard',
                            'genqrcode': 'Generate QR Code',
                            'description': 'Note: Display Options and custom font settings will not be exported.'
                        }
                    }
                }
            }
        },
        'misc': {
            'pageduration': {
                'label': 'You\'ve been here for:',
                'negativetime': 'Negative time?? 🤔',
                'daycount': '{{0}}d, {{1}}h, and {{2}}m',
                'hourcount': '{{0}}h, {{1}}m, and {{2}}s',
                'minutecount': '{{0}} min, and {{1}} sec',
                'secondcount': '{{0}} seconds'
            },
            'autorestart': {
                'label': 'Auto restart'
            },
            'docs': {
                'label': 'Read the Docs',
                'tooltip': 'View the Online Web Clock documentation'
            },
            'github': {
                'tooltip': 'View source on GitHub'
            },
            'versionlabel': 'Version',
        },
    },
    'toasts': {
        'countdown': {
            'finished': 'Countdown finished!',
            'finishednotification': 'Your timer has elapsed. It is now {{0}}',
            'toolong': 'Time set too long! Make sure it is less than 100 hours.',
            'notificationdenied': 'Notification permission denied.',
        },
        'global': {
            'themelight': 'Theme set to light mode ☀️',
            'themedark': 'Theme set to dark mode 🌙',
            'thememidnight': 'Theme set to midnight 🌃',
            'fullscreen': 'Toggled fullscreen mode',
        },
        'importexport': {
            'exportsuccess': 'Settings exported! Took {{0}}ms',
            'exportcopysuccess': 'Settings copied to clipboard! Took {{0}}ms',
            'exportrawsuccess': 'Exported raw JSON. Took {{0}}ms',
            'exportqrtoolarge': 'Settings too large for QR code. See console for details.',
            'exportqrsuccess': 'Exported settings to QR code! Took {{0}}ms',
            'exporting': 'Exporting settings...',
            'exporterror': 'Error exporting settings! Check console for details.',
            'importsuccess': 'Settings successfully imported!<hr><b>File timestamp:</b> {{0}}',
            'importerror': 'Invalid settings file. Please make sure the file contains valid JSON.',
            'fetcherror': 'Could not fetch local settings file. Please check the filename and ensure the file exists.',
            'nobgimg': 'No background image to extract.',
        },
        'debugui': {
            'testtoast': 'Test toast. Theme "{{0}}"',
            'clearls': 'Cleared local storage.',
        },
        'domutils': {
            'textcopied': 'Text copied to clipboard!',
            'notificationunsupported': 'Notifications are not supported in this browser.',
            'qrscannerfailed': 'QR scanner failed: {{0}}',
        },
        'urlparams': {
            'debugmode': 'Debug mode enabled. DevTools memory will increase over time.',
            'autorestart': 'Auto restart set to {{0}} seconds.'
        },
        'weatherutils': {
            'gpserror': 'Error getting location: {{0}}',
            'gpsunsupported': 'Geolocation is not supported by this browser.',
            'weathererror': 'Error fetching weather data: {{0}}',
        }
    },
    'bsmodal': {
        'action': {
            'close': 'Close',
            'copy': 'Copy',
            'download': 'Download',
            'countdownel': 'Closing in {{0}}s',
            'gethelp': 'Get help',
            'releasenotes': 'Release Notes',
            'dontshowagain': 'Don\'t show again'
        },
        'rawsettingsjson': 'Raw Settings JSON',
        'backgroundimage': 'Background Image',
        'importerror': 'Error importing settings!',
        'newversion': 'New Version! ({{0}})',
        'releasenote': 'Online Web Clock was just updated to {{0}}! Check the release notes for more information.',
        'releasenotebypass': 'Click the button below to review the release notes for version {{0}}!'
    },
    'scanneroverlay': {
        'action': {
            'close': 'Close'
        }
    },
    'arialabel': {
        'menuclose': 'Close',
        'clockmodebuttongroup': 'Clock mode button group',
        'secondsvisibilitybuttongroup': 'Seconds visibility button group',
        'datepositionbuttongroup': 'Date position button group',
        'clockborderradiobuttongroup': 'Clock border radio button group',
        'notealignmentbuttongroup': 'Note alignment button group',
        'customfontinputform': 'Custom font input form',
        'fontstylebuttongroup': 'Font style button group',
        'fontweightbuttongroup': 'Font weight button group',
        'colormodebuttongroup': 'Color mode button group',
        'solidcolorbuttongroup': 'Solid color button group',
        'textcoloroverridebuttongroup': 'Text color override button group',
        'weatherunitbuttongroup': 'Weather unit button group',
        'languagebuttongroup': 'Language button group',
        'menuthemebuttongroup': 'Menu theme button group',
        'manualjsonsettingsentryform': 'Manual JSON settings entry form',
        'stopwatchcontrols': 'Stopwatch controls',
        'countdowncontrols': 'Countdown controls'
    },
    'time': {
        'isit': {
            'christmas_y': 'It\'s Christmas!',
            'christmas_n': 'It\'s not Christmas.',
            'weekend_y': 'It\'s the weekend!',
            'weekend_n': 'Not the weekend.',
            'leapyear_y': 'It\'s a leap year!',
            'leapyear_n': 'Not a leap year.'
        },
        'countdown': {
            'term': {
                'since': 'since',
                'until': 'until'
            },
            'event': {
                'christmas': 'Christmas',
                'newyear': 'New Year\'s',
                'valentines': 'Valentine\'s Day',
                '32bit': '32-bit limit'
            }
        }
    }
};