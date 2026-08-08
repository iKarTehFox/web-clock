import { countdown, devcon, menu, panel, stopwatch } from './dom-elements';
import { getAvailableThemes, getMenuTheme, logConsole, requestNotificationPermission, setMenuTheme } from './dom-utils';
import { debugMode, setDevConInit } from './debug';
import { match } from 'ts-pattern';
import { exportSettings, ExportType, importSettingsFromJSON, presetLocalJSON, resetSettings } from '../importExport';
import { presetList } from '../assets/presets/presets';
import { versionNumberString } from './update-notify';
import { startCountdownExternal, pauseCountdownExternal, resetCountdownExternal } from '../countdown';
import { lapStopwatchExternal, pauseStopwatchExternal, resetStopwatchExternal, startStopwatchExternal } from '../stopwatch';
import { getFontFamily, getFontSize, getFontWeight, getFontStyle, getStrokeColor, getStrokeWidth, setFontFamily, setFontSize, setFontWeight, setFontStyle, setStrokeWidth, setStrokeColor, getBorderMode, getBorderStyle, getClockConfig, getClockDisplay, getCustomNote, getCustomNoteAlign, getDateAlign, getDateFormat, getSecondsVis, getTimeBar, setBorderMode, setBorderStyle, setClockDisplay, setCustomNote, setCustomNoteAlign, setDateAlign, setDateFormat, setSecondsVis, setTimeBar, getDropShadow, setDropShadow, getFontConfig, getBGImageBlur, getBGImageSize, getColorMode, getSolidColorValue, getTextColorMode, getTextColorValue, setBackgroundImageBlur, setBackgroundImageSize, setColorMode, setSolidColor, setTextColorMode, setTextColorValue } from './clock-settings';
import { valid } from '../importValidation';
import * as luxon from 'ts-luxon';
import i18n from '../assets/locales/i18n';

// Init
let commandHistory: string[] = [];
let historyIndex = -1;

// Available commands
interface CommandArgument {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  description?: string;
  default?: any;
}

interface CommandOption {
  name: string;
  shortName?: string; // For short flags like -v instead of --verbose
  type: 'string' | 'number' | 'boolean';
  description?: string;
  default?: any;
}

interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  args?: CommandArgument[];
  options?: CommandOption[];
  execute: (args: any, options: any, rawArgs: string[]) => void;
}

const commands: Command[] = [
    {
        name: 'help',
        description: 'Shows a list of available commands',
        usage: 'help [command]',
        aliases: ['?', 'commands'],
        args: [
            {
                name: 'command',
                type: 'string',
                description: 'Command name to get help for',
                required: false
            }
        ],
        execute: (args) => {
            if (args.command) {
                // Show help for specific command
                const commandName = args.command.toLowerCase();
                const command = commands.find(cmd => 
                    cmd.name === commandName || 
        (cmd.aliases && cmd.aliases.includes(commandName))
                );
      
                if (command) {
                    const aliasesText = command.aliases ? `\nAliases: ${command.aliases.join(', ')}` : '';
                    let helpText = `${command.name}: ${command.description}\nUsage: ${command.usage}${aliasesText}`;
        
                    // Add arguments information
                    if (command.args && command.args.length > 0) {
                        helpText += '\n\nArguments:';
                        command.args.forEach(arg => {
                            const required = arg.required ? ' (required)' : '';
                            const defaultValue = arg.default !== undefined ? ` (default: ${arg.default})` : '';
                            helpText += `\n  ${arg.name} (${arg.type})${required}${defaultValue}: ${arg.description || 'No description'}`;
                        });
                    }
        
                    // Add options information
                    if (command.options && command.options.length > 0) {
                        helpText += '\n\nOptions:';
                        command.options.forEach(opt => {
                            const shortFlag = opt.shortName ? `-${opt.shortName}, ` : '';
                            const defaultValue = opt.default !== undefined ? ` (default: ${opt.default})` : '';
                            helpText += `\n  ${shortFlag}--${opt.name} (${opt.type})${defaultValue}: ${opt.description || 'No description'}`;
                        });
                    }
        
                    appendToConsole(helpText);
                } else {
                    appendToConsole(`Unknown command: ${commandName}`, 'error');
                }
            } else {
                // Show all commands
                const commandList = commands.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n');
                appendToConsole('Available commands:\n' + commandList + '\n\nType "help [command]" for usage information.');
            }
        }
    },
    {
        name: 'clear',
        description: 'Clears the console output',
        usage: 'clear',
        aliases: ['cls'],
        execute: (args, options) => {
            devcon.output.innerHTML = '';
        }
    },
    {
        name: 'log',
        description: 'Logs the given text to the console or manages logs',
        usage: 'log <string|clear|send> [--level <level>] [--bypass]',
        args: [
            {
                name: 'action',
                type: 'string',
                description: 'Text to log or action to perform (clear, send)',
                required: true
            },
            {
                name: 'message',
                type: 'string',
                description: 'Message to log (when using send action)',
                required: false
            }
        ],
        options: [
            {
                name: 'level',
                shortName: 'l',
                type: 'string',
                description: 'Log level (debug, info, warning, error)',
                default: 'debug'
            },
            {
                name: 'bypass',
                shortName: 'b',
                type: 'boolean',
                description: 'Bypass debug mode check',
                default: false
            }
        ],
        execute: (args, options) => {
            const validLevels = ['debug', 'info', 'warning', 'error'];
            const level = options.level.toLowerCase();

            if (!args.action) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'log')?.usage}`, 'error');
            }

            match(args.action)
                .with('clear', () => {
                    // Clear all logs
                    devcon.logs.innerHTML = '';
                    console.clear();
                    appendToConsole('Logs cleared.');
                })
                .with('send', () => {
                    if (!args.message) {
                        appendToConsole('Error: Missing message to log. Usage: log send <message> [--level <level>]', 'error');
                        return;
                    }
            
                    if (!validLevels.includes(level)) {
                        appendToConsole(`Invalid log level: ${level}. Valid levels are: ${validLevels.join(', ')}`, 'error');
                        return;
                    }
            
                    logConsole(args.message, level as 'debug' | 'error' | 'warning' | 'info', options.bypass);
                    appendToConsole(`Logged to console with level: ${level}`);
                })
                .otherwise(() => {
                    // Original logging functionality
                    if (!validLevels.includes(level)) {
                        appendToConsole(`Invalid log level: ${level}. Valid levels are: ${validLevels.join(', ')}`, 'error');
                        return;
                    }
            
                    logConsole(args.action, level as 'debug' | 'error' | 'warning' | 'info', options.bypass);
                    appendToConsole(`Logged to console with level: ${level}`);
                });
        }
    },
    {
        name: 'panel',
        description: 'Interact with the panel',
        usage: 'panel <subcommand> [options]',
        args: [
            {
                name: 'subcommand',
                type: 'string',
                description: 'Action to perform (toggle-vis, menu, countdown, stopwatch)',
                required: true
            },
            {
                name: 'action',
                type: 'string',
                description: 'Specific action for subcommand (e.g., show, toggle, start)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value for the action (e.g., seconds for countdown)',
                required: false
            }
        ],
        execute: (args, options, rawArgs) => {
            const subcommand = args.subcommand;
            const action = args.action;
            const value = args.value;
        
            match(subcommand)
                .with('toggle-vis', () => {
                    if (rawArgs.length > 1) {
                        appendToConsole('Too many arguments. Usage: panel toggle-vis', 'error');
                        return;
                    }
                    
                    menu.panelvischeckbox.click();
                    menu.panelvischeckbox.dispatchEvent(new Event('change'));
                    const newState = menu.panelvischeckbox.checked;

                    appendToConsole(`Panel visibility toggled: ${newState ? 'on' : 'off'}`);
                })
                .with('menu', () => {
                    if (!action) {
                        appendToConsole('Missing action. Usage: panel menu show', 'error');
                        return;
                    }
                    
                    if (action === 'show') {
                        if (rawArgs.length > 2) {
                            appendToConsole('Too many arguments. Usage: panel menu show', 'error');
                            return;
                        }
                        
                        panel.menubutton.click();
                    } else {
                        appendToConsole(`Unknown action: ${action}. Available actions for menu: show`, 'error');
                    }
                })
                .with('countdown', () => {
                    if (!action) {
                        appendToConsole('Missing action. Usage: panel countdown <toggle|toggle-notification|start|pause|reset>', 'error');
                        return;
                    }
                    
                    match(action)
                        .with('toggle', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel countdown toggle', 'error');
                                return;
                            }
                                
                            countdown.obutton.click();
                            appendToConsole('Countdown visibility toggled');
                        })
                        .with('start', () => {
                            if (!value) {
                                appendToConsole('Missing seconds value. Usage: panel countdown start <seconds>', 'error');
                                return;
                            }
                                
                            const seconds = parseInt(value);
                            if (isNaN(seconds)) {
                                appendToConsole('Invalid seconds value. Must be a number.', 'error');
                                return;
                            }
                                
                            startCountdownExternal(seconds)
                                .then(() => {
                                    appendToConsole(`Countdown started with ${seconds} seconds`);
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('pause', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel countdown pause', 'error');
                                return;
                            }
                                
                            pauseCountdownExternal()
                                .then(() => {
                                    appendToConsole('Countdown paused');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('reset', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel countdown reset', 'error');
                                return;
                            }
                                
                            resetCountdownExternal()
                                .then(() => {
                                    appendToConsole('Countdown reset');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('toggle-notification', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel countdown toggle-notification', 'error');
                                return;
                            }
                                
                            if (countdown.notifcheckbox.checked) {
                                countdown.notifcheckbox.checked = false;
                                countdown.notifcheckbox.dispatchEvent(new Event('change'));
                                appendToConsole('Countdown notification disabled');
                                return;
                            }
                                
                            requestNotificationPermission()
                                .then(() => {
                                    if (Notification.permission === 'granted') {
                                        countdown.notifcheckbox.checked = true;
                                        countdown.notifcheckbox.dispatchEvent(new Event('change'));
                                        appendToConsole('Countdown notification enabled');
                                    } else {
                                        appendToConsole('Notification permission not granted', 'error');
                                    }
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .otherwise(() => {
                            appendToConsole(`Unknown action: ${action}. Available actions for countdown: toggle, toggle-notification, start, pause, reset`, 'error');
                        });
                })
                .with('stopwatch', () => {
                    if (!action) {
                        appendToConsole('Missing action. Usage: panel stopwatch <toggle|start|pause|reset|lap>', 'error');
                        return;
                    }
                    
                    match(action)
                        .with('toggle', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel stopwatch toggle', 'error');
                                return;
                            }
                                
                            stopwatch.obutton.click();
                            appendToConsole('Stopwatch visibility toggled');
                        })
                        .with('start', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel stopwatch start', 'error');
                                return;
                            }
                                
                            startStopwatchExternal()
                                .then(() => {
                                    appendToConsole('Stopwatch started');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('pause', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel stopwatch pause', 'error');
                                return;
                            }
                                
                            pauseStopwatchExternal()
                                .then(() => {
                                    appendToConsole('Stopwatch paused');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('reset', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel stopwatch reset', 'error');
                                return;
                            }
                                
                            resetStopwatchExternal()
                                .then(() => {
                                    appendToConsole('Stopwatch reset');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .with('lap', () => {
                            if (rawArgs.length > 2) {
                                appendToConsole('Too many arguments. Usage: panel stopwatch lap', 'error');
                                return;
                            }
                                
                            lapStopwatchExternal()
                                .then(() => {
                                    appendToConsole('Lap recorded');
                                })
                                .catch(error => {
                                    appendToConsole(error, 'error');
                                });
                        })
                        .otherwise(() => {
                            appendToConsole(`Unknown action: ${action}. Available actions for stopwatch: toggle, start, pause, reset, lap`, 'error');
                        });
                })
                .otherwise(() => {
                    appendToConsole(`Unknown subcommand: ${subcommand}. Available subcommands: toggle-vis, menu, countdown, stopwatch`, 'error');
                });
        }
    },
    {
        name: 'importexport',
        description: 'Import and export clock settings',
        usage: 'importexport <import|export|preset> [options]',
        aliases: ['ie', 'settings'],
        args: [
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (import, export, preset)',
                required: true
            },
            {
                name: 'subaction',
                type: 'string',
                description: 'Sub-action (import: file|preset, export: download|clipboard|qr|log|card, preset: list|load)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value for the action (e.g., preset name)',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Perform operation without showing notifications',
                default: false
            }
        ],
        execute: (args, options, rawArgs) => {
            if (!args.action) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'importexport')?.usage}`, 'error');
                return;
            }

            match(args.action)
                .with('import', () => {
                    if (!args.subaction) {
                        appendToConsole('Missing sub-action. Available sub-actions: file, preset', 'error');
                        return;
                    }

                    match(args.subaction)
                        .with('file', () => {
                            appendToConsole('Importing settings from file...');
                            importSettingsFromJSON();
                        })
                        .with('preset', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing preset name. Usage: importexport import preset <preset-name>', 'error');
                                
                                // Display available presets
                                const presetInfo = presetList.map(preset => 
                                    `${preset.filename}: ${preset.displayName}`
                                ).join('\n');
                                
                                appendToConsole(`Available presets:\n${presetInfo}`);
                                return;
                            }
                            
                            const presetName = args.value;
                            
                            // Check if the preset exists
                            const presetExists = presetList.some(preset => preset.filename === presetName);
                            if (!presetExists) {
                                appendToConsole(`Error: Preset "${presetName}" not found. Use "importexport preset list" to see available presets.`, 'error');
                                return;
                            }
                            
                            presetLocalJSON(presetName, !options.quiet)
                                .then(() => {
                                    appendToConsole(`Successfully loaded preset: ${presetName}`);
                                })
                                .catch(error => {
                                    appendToConsole(`Error loading preset: ${error}`, 'error');
                                });
                        })
                        .otherwise((subaction) => {
                            appendToConsole(`Unknown sub-action: ${subaction}. Available sub-actions: file, preset`, 'error');
                        });
                })
                .with('export', () => {
                    if (!args.subaction) {
                        appendToConsole('Missing sub-action. Available sub-actions: download, clipboard, qr, log, card', 'error');
                        return;
                    }

                    const validExportTypes: ExportType[] = ['download', 'clipboard', 'qr', 'log', 'card'];
                    const exportType = args.subaction as ExportType;

                    if (!validExportTypes.includes(exportType)) {
                        appendToConsole(`Unknown export type: ${exportType}. Available types: ${validExportTypes.join(', ')}`, 'error');
                        return;
                    }

                    try {
                        appendToConsole(`Exporting settings as ${exportType}...`);
                        exportSettings(exportType);
                    } catch (error) {
                        appendToConsole(`Error exporting settings: ${error}`, 'error');
                    }
                })
                .with('preset', () => {
                    if (!args.subaction) {
                        appendToConsole('Missing sub-action. Available sub-actions: list, load', 'error');
                        return;
                    }

                    match(args.subaction)
                        .with('list', () => {
                            const presetInfo = presetList.map(preset => 
                                `${preset.filename}: ${preset.displayName}`
                            ).join('\n');
                            
                            appendToConsole(`Available presets:\n${presetInfo}`);
                        })
                        .with('load', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing preset name. Usage: importexport preset load <preset-name>', 'error');
                                return;
                            }
                            
                            const presetName = args.value;
                            
                            // Check if the preset exists
                            const presetExists = presetList.some(preset => preset.filename === presetName);
                            if (!presetExists) {
                                appendToConsole(`Error: Preset "${presetName}" not found. Use "importexport preset list" to see available presets.`, 'error');
                                return;
                            }
                            
                            presetLocalJSON(presetName, !options.quiet)
                                .then(() => {
                                    appendToConsole(`Successfully loaded preset: ${presetName}`);
                                })
                                .catch(error => {
                                    appendToConsole(`Error loading preset: ${error}`, 'error');
                                });
                        })
                        .otherwise((subaction) => {
                            appendToConsole(`Unknown sub-action: ${subaction}. Available sub-actions: list, load`, 'error');
                        });
                })
                .otherwise((action) => {
                    appendToConsole(`Unknown action: ${action}. Available actions: import, export, preset`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'importexport')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'theme',
        description: 'Change or get the current theme',
        usage: 'theme [name] [--quiet]',
        args: [
            {
                name: 'name',
                type: 'string',
                description: 'Theme name (auto, toggle, light, dark, midnight)',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Set theme without showing a notification',
                default: false
            }
        ],
        execute: (args, options) => {
            if (!args.name) {
                // Get current theme
                const currentTheme = getMenuTheme();
                appendToConsole(`Current theme: ${currentTheme}`);
      
                // Show available themes
                const availableThemes = getAvailableThemes();
                appendToConsole(`Available options: auto, toggle, ${availableThemes.join(', ')}`);
                return;
            }
    
            const themeName = args.name;
            const validThemes = ['auto', 'toggle', 'light', 'dark', 'midnight'];
    
            if (!validThemes.includes(themeName)) {
                appendToConsole(`Invalid theme: ${themeName}. Available themes: ${validThemes.join(', ')}`, 'error');
                return;
            }
    
            setMenuTheme(themeName, options.quiet);
    
            if (!options.quiet) {
                const currentTheme = getMenuTheme();
                if (themeName === 'auto') {
                    appendToConsole(`Theme auto-detected as ${currentTheme}`);
                } else if (themeName === 'toggle') {
                    appendToConsole(`Theme toggled to ${currentTheme}`);
                } else {
                    appendToConsole(`Theme set to ${currentTheme}`);
                }
            }
        }
    },
    {
        name: 'time',
        description: 'Get or set time-related information',
        usage: 'time <get|set> [options]',
        aliases: ['t', 'datetime'],
        args: [
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (get, set)',
                required: true
            },
            {
                name: 'option',
                type: 'string',
                description: 'Option for the action (get: unix|sec|local|iso, set: tz|locale)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value for set operations',
                required: false
            }
        ],
        options: [
            {
                name: 'format',
                shortName: 'f',
                type: 'string',
                description: 'Format string for datetime output (for get action)',
                default: ''
            }
        ],
        execute: (args, options) => {
            const currentTime = luxon.DateTime.now();

            if (!args.action) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'time')?.usage}`, 'error');
                appendToConsole('Available actions:');
                appendToConsole('  get [unix|sec|local|iso] - Get current time in different formats');
                appendToConsole('  set [tz|locale] <value> - Set timezone or locale for time display');
                return;
            }

            match(args.action)
                .with('get', () => {
                    if (!args.option) {
                    // Default to local time if no option specified
                        const formatted = options.format 
                            ? currentTime.toFormat(options.format)
                            : currentTime.toLocaleString(luxon.DateTime.DATETIME_FULL);
                        appendToConsole(`Current time (${options.format ? 'formatted' : 'local'}): ${formatted}`);
                        appendToConsole(`Timezone: ${luxon.Settings.defaultZone.name}`);
                        appendToConsole(`Locale: ${luxon.Settings.defaultLocale || 'system default'}`);
                        return;
                    }

                    match(args.option)
                        .with('unix', () => {
                            if (options.format) {
                                appendToConsole('Option -f is unsupported here', 'error');
                            }
                            appendToConsole(`Current Unix timestamp (milliseconds): ${currentTime.toMillis()}`);
                        })
                        .with('sec', () => {
                            if (options.format) {
                                appendToConsole('Option -f is unsupported here', 'error');
                            }
                            appendToConsole(`Current Unix timestamp (seconds): ${Math.floor(currentTime.toSeconds())}`);
                        })
                        .with('local', () => {
                            const formatted = options.format 
                                ? currentTime.toFormat(options.format)
                                : currentTime.toLocaleString(luxon.DateTime.DATETIME_FULL);
                            appendToConsole(`Current ${options.format ? 'formatted' : 'local'} time: ${formatted}`);
                            appendToConsole(`Timezone: ${currentTime.zoneName}`);
                        })
                        .with('iso', () => {
                            if (options.format) {
                                appendToConsole('Option -f is unsupported here', 'error');
                            }
                            appendToConsole(`Current time (ISO): ${currentTime.toISO()}`);
                        })
                        .otherwise((opt) => {
                            appendToConsole(`Unknown option: ${opt}. Available options: unix, sec, local, iso`, 'error');
                        });
                })
                .with('set', () => {
                    if (!args.option) {
                        appendToConsole('Missing option. Available options: tz, locale', 'error');
                        return;
                    }

                    match(args.option)
                        .with('tz', () => {
                            if (!args.value) {
                                // Display current timezone
                                appendToConsole(`Current timezone: ${luxon.Settings.defaultZone.name}`);
                                appendToConsole('To set default timezone: time set tz <timezone>');
                                appendToConsole('Example timezones: America/New_York, Europe/London, Asia/Tokyo');
                                return;
                            }

                            try {
                                // Validate the timezone by attempting to use it
                                const testTime = luxon.DateTime.now().setZone(args.value);
                                if (!testTime.isValid) {
                                    appendToConsole(`Invalid timezone: ${args.value}`, 'error');
                                    return;
                                }

                                // Set the default timezone for Luxon
                                luxon.Settings.defaultZone = luxon.IANAZone.create(args.value);
                        
                                // Update the timezone dropdown selection
                                const timezoneSelect = menu.timezoneselect;
                            
                                // First, deselect the current selection
                                const currentSelected = timezoneSelect.querySelector('option:checked') as HTMLOptionElement;
                                if (currentSelected) {
                                    currentSelected.selected = false;
                                }
                            
                                // Find and select the new timezone option
                                let found = false;
                                Array.from(timezoneSelect.querySelectorAll('optgroup')).forEach(optgroup => {
                                    const option = optgroup.querySelector(`option[value="${args.value}"]`) as HTMLOptionElement;
                                    if (option) {
                                        option.selected = true;
                                        found = true;
                                    }
                                });
                            
                                // Confirm the change
                                appendToConsole(`Default timezone set to: ${args.value}`);
                                appendToConsole(`Current time in ${args.value}: ${luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_FULL)}`);
                            
                                if (!found) {
                                    appendToConsole(`Note: Timezone "${args.value}" was not found in the dropdown menu, but the setting was applied.`, 'error');
                                }
                            
                                logConsole(`Default timezone changed to ${args.value}`, 'info');
                            } catch (error) {
                                appendToConsole(`Error setting timezone: ${error}`, 'error');
                            }
                        })
                        .with('locale', () => {
                            if (!args.value) {
                            // Display current locale
                                appendToConsole(`Current locale: ${luxon.Settings.defaultLocale || 'system default'}`);
                                appendToConsole('To set default locale: time set locale <locale>');
                                appendToConsole('Example locales: en-US, fr-FR, ja-JP, de-DE');
                                return;
                            }

                            try {
                            // Test if the locale is valid by formatting a date with it
                                const testFormat = currentTime.setLocale(args.value).toLocaleString();
                            
                                // If we get here, the locale is valid - set it as default
                                const oldLocale = luxon.Settings.defaultLocale || 'system default';
                                luxon.Settings.defaultLocale = args.value;
                            
                                // Confirm the change
                                appendToConsole(`Default locale changed from ${oldLocale} to ${args.value}`);
                                appendToConsole(`Sample time with new locale: ${luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_FULL)}`);
                                logConsole(`Default locale changed to ${args.value}`, 'info');
                            } catch (error) {
                                appendToConsole(`Invalid locale: ${args.value}`, 'error');
                            }
                        })
                        .otherwise((opt) => {
                            appendToConsole(`Unknown option: ${opt}. Available options: tz, locale`, 'error');
                        });
                })
                .otherwise((action) => {
                    appendToConsole(`Unknown action: ${action}. Available actions: get, set`, 'error');
                });
        }
    },
    {
        name: 'clock',
        description: 'View or modify clock settings',
        usage: 'clock [display|seconds|date-format|date-align|border-mode|border-style|time-bar|note|note-align] [get|set|list] [value]',
        aliases: ['c'],
        args: [
            {
                name: 'property',
                type: 'string',
                description: 'Clock property to modify (display, seconds, date-format, date-align, border-mode, border-style, time-bar, note, note-align)',
                required: false
            },
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (get, set, list)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value to set for the property',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Change clock settings without showing notifications',
                default: false
            }
        ],
        execute: (args, options) => {
            if (!args.property) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'clock')?.usage}`, 'error');
                const config = getClockConfig();
                appendToConsole('Current clock settings:');
                appendToConsole(`Display: ${config.clockDisplay}`);
                appendToConsole(`Seconds Visibility: ${config.secondsVis}`);
                appendToConsole(`Date Format: ${config.dateFormat}`);
                appendToConsole(`Date Alignment: ${config.dateAlign}`);
                appendToConsole(`Border Mode: ${config.borderMode}`);
                appendToConsole(`Border Style: ${config.borderStyle}`);
                appendToConsole(`Time Bar: ${config.timeBar}`);
                appendToConsole(`Custom Note: ${config.customNote}`);
                appendToConsole(`Custom Note Alignment: ${config.customNoteAlign}`);
                return;
            }

            const property = args.property;
            const action = args.action ? args.action : 'get';

            match(property)
                .with('display', () => {
                    match(action)
                        .with('get', () => {
                            const currentDisplay = getClockDisplay();
                            appendToConsole(`Current clock display: ${currentDisplay}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing display value. Usage: clock display set <value>', 'error');
                                return;
                            }
                            const displayValue = args.value;

                            if (valid.CD.includes(displayValue)) {
                                setClockDisplay(displayValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Clock display set to ${displayValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid display value: ${displayValue}`, 'error');
                                appendToConsole(`Valid display values: ${valid.CD.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available clock display values: ${valid.CD.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('seconds', () => {
                    match(action)
                        .with('get', () => {
                            const currentSecondsVis = getSecondsVis();
                            appendToConsole(`Current seconds visibility: ${currentSecondsVis}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing seconds visibility value. Usage: clock seconds set <value>', 'error');
                                return;
                            }
                            const secondsVisValue = args.value;

                            if (valid.SV.includes(secondsVisValue)) {
                                setSecondsVis(secondsVisValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Seconds visibility set to ${secondsVisValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid seconds visibility value: ${secondsVisValue}`, 'error');
                                appendToConsole(`Valid seconds visibility values: ${valid.SV.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available seconds visibility values: ${valid.SV.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('date-format', () => {
                    match(action)
                        .with('get', () => {
                            const currentDateFormat = getDateFormat();
                            appendToConsole(`Current date format: ${currentDateFormat}`);
                        })
                        .with('set', () => {
                            if (args.value === undefined) {
                                appendToConsole('Error: Missing date format value. Usage: clock date-format set <value>', 'error');
                                return;
                            }
                            const dateFormatValue = args.value;

                            if (valid.DF.includes(dateFormatValue)) {
                                setDateFormat(dateFormatValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Date format set to ${dateFormatValue || '(empty)'}`);
                                }
                            } else {
                                appendToConsole(`Invalid date format value: ${dateFormatValue}`, 'error');
                                appendToConsole(`Valid date format values: ${valid.DF.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available date format values: ${valid.DF.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('date-align', () => {
                    match(action)
                        .with('get', () => {
                            const currentDateAlign = getDateAlign();
                            appendToConsole(`Current date alignment: ${currentDateAlign}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing date alignment value. Usage: clock date-align set <value>', 'error');
                                return;
                            }
                            const dateAlignValue = args.value;

                            if (valid.DA.includes(dateAlignValue)) {
                                setDateAlign(dateAlignValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Date alignment set to ${dateAlignValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid date alignment value: ${dateAlignValue}`, 'error');
                                appendToConsole(`Valid date alignment values: ${valid.DA.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available date alignment values: ${valid.DA.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('border-mode', () => {
                    match(action)
                        .with('get', () => {
                            const currentBorderMode = getBorderMode();
                            appendToConsole(`Current border mode: ${currentBorderMode}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing border mode value. Usage: clock border-mode set <value>', 'error');
                                return;
                            }
                            const borderModeValue = args.value;

                            if (valid.BM.includes(borderModeValue)) {
                                setBorderMode(borderModeValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Border mode set to ${borderModeValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid border mode value: ${borderModeValue}`, 'error');
                                appendToConsole(`Valid border mode values: ${valid.BM.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available border mode values: ${valid.BM.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('border-style', () => {
                    match(action)
                        .with('get', () => {
                            const currentBorderStyle = getBorderStyle();
                            appendToConsole(`Current border style: ${currentBorderStyle}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing border style value. Usage: clock border-style set <value>', 'error');
                                return;
                            }
                            const borderStyleValue = args.value;

                            if (valid.BS.includes(borderStyleValue)) {
                                setBorderStyle(borderStyleValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Border style set to ${borderStyleValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid border style value: ${borderStyleValue}`, 'error');
                                appendToConsole(`Valid border style values: ${valid.BS.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available border style values: ${valid.BS.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('time-bar', () => {
                    match(action)
                        .with('get', () => {
                            const currentTimeBar = getTimeBar();
                            appendToConsole(`Current time bar: ${currentTimeBar}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing time bar value. Usage: clock time-bar set <value>', 'error');
                                return;
                            }
                            const timeBarValue = args.value;

                            if (valid.TB.includes(timeBarValue)) {
                                setTimeBar(timeBarValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Time bar set to ${timeBarValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid time bar value: ${timeBarValue}`, 'error');
                                appendToConsole(`Valid time bar values: ${valid.TB.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available time bar values: ${valid.TB.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('note', () => {
                    match(action)
                        .with('get', () => {
                            const currentNote = getCustomNote();
                            appendToConsole(`Current Custom Note: ${currentNote}`);
                        })
                        .with('set', () => {
                            if (args.value === undefined) {
                                appendToConsole('Error: Missing Custom Note value. Usage: clock note set <value>', 'error');
                                return;
                            }
                            const noteValue = args.value;

                            // Check max custom note length
                            if (noteValue.length > 75) {
                                appendToConsole(`Error: Custom Note is too long (${noteValue.length}/75 characters)`, 'error');
                                return;
                            }

                            setCustomNote(noteValue, true);
                            if (!options.quiet) {
                                appendToConsole(`Custom Note set to: ${noteValue || '(empty)'}`);
                            }
                        })
                        .with('clear', () => {
                            setCustomNote('', true);
                            if (!options.quiet) {
                                appendToConsole('Custom Note cleared');
                            }
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, clear`, 'error');
                        });
                })
                .with('note-align', () => {
                    match(action)
                        .with('get', () => {
                            const currentNoteAlign = getCustomNoteAlign();
                            appendToConsole(`Current Custom Note alignment: ${currentNoteAlign}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing Custom Note alignment value. Usage: clock note-align set <value>', 'error');
                                return;
                            }
                            const noteAlignValue = args.value;

                            if (valid.CNA.includes(noteAlignValue)) {
                                setCustomNoteAlign(noteAlignValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Custom Note alignment set to ${noteAlignValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid Custom Note alignment value: ${noteAlignValue}`, 'error');
                                appendToConsole(`Valid Custom Note alignment values: ${valid.CNA.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available Custom Note alignment values: ${valid.CNA.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .otherwise((prop) => {
                    appendToConsole(`Unknown property: ${prop}. Available properties: display, seconds, date-format, date-align, border-mode, border-style, time-bar, note, note-align`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'clock')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'font',
        description: 'View or modify font settings',
        usage: 'font [family|size|weight|style|stroke|dropshadow] [get|set|list] [value]',
        aliases: ['f'],
        args: [
            {
                name: 'property',
                type: 'string',
                description: 'Font property to modify (family, size, weight, style, stroke)',
                required: false
            },
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (get, set, list)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value to set for the property',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Change font without showing notifications',
                default: false
            },
            {
                name: 'color',
                shortName: 'c',
                type: 'string',
                description: 'Color value for stroke (when using stroke property)',
                default: ''
            }
        ],
        execute: (args, options) => {
            if (!args.property) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
                const config = getFontConfig();
                appendToConsole('Current font settings:');
                appendToConsole(`Family: ${config.fontFamily}`);
                appendToConsole(`Size: ${config.fontSize}`);
                appendToConsole(`Weight: ${config.fontWeight}`);
                appendToConsole(`Style: ${config.fontStyle}`);
                appendToConsole(`Stroke Width: ${config.strokeWidth}px`);
                appendToConsole(`Stroke Color: ${config.strokeColor}`);
                appendToConsole(`Drop Shadow: ${config.dropShadow}`);
                return;
            }

            const property = args.property;
            const action = args.action ? args.action : 'get';

            match(property)
                .with('family', () => {
                    match(action)
                        .with('get', () => {
                            const currentFont = getFontFamily();
                            appendToConsole(`Current font family: ${currentFont}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing font name. Usage: font family set <font-name>', 'error');
                                return;
                            }
                            const fontName = args.value;

                            if (valid.FF.includes(fontName)) {
                                setFontFamily(fontName, true);
                                if (!options.quiet) {
                                    appendToConsole(`Font family set to ${fontName}`);
                                }
                            } else {
                                appendToConsole(`Font family not found: ${fontName}`, 'error');
                                const fonts = valid.FF;
                                appendToConsole(`List of font families:${fonts.join('\n')}`);
                            }
                        })
                        .with('list', () => {
                            const fonts = valid.FF;
                            appendToConsole(`Available font families:${fonts.join('\n')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('size', () => {
                    match(action)
                        .with('get', () => {
                            const currentSize = getFontSize();
                            appendToConsole(`Current font size: ${currentSize}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing size value. Usage: font size set <size>', 'error');
                                return;
                            }
                            const fontSize = args.value;
                        
                            if (!valid.FZ.includes(fontSize)) {
                                appendToConsole(`Error: Invalid font size "${fontSize}". Valid sizes are: ${valid.FZ.join(', ')}`, 'error');
                                return;
                            }
                        
                            setFontSize(fontSize, true);
                        
                            if (!options.quiet) {
                                appendToConsole(`Font size set to ${fontSize}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available font sizes: ${valid.FZ.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('weight', () => {
                    match(action)
                        .with('get', () => {
                            const currentWeight = getFontWeight();
                            appendToConsole(`Current font weight: ${currentWeight}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing weight value. Usage: font weight set <weight>', 'error');
                                return;
                            }
                            const fontWeight = args.value;
                        
                            setFontWeight(fontWeight, true);
                        
                            if (!options.quiet) {
                                appendToConsole(`Font weight set to ${fontWeight}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole('Available font weights: normal, bold');
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('style', () => {
                    match(action)
                        .with('get', () => {
                            const currentStyle = getFontStyle();
                            appendToConsole(`Current font style: ${currentStyle}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing style value. Usage: font style set <style>', 'error');
                                return;
                            }
                            const fontStyle = args.value;
                        
                            if (!valid.FS.includes(fontStyle)) {
                                appendToConsole(`Error: Invalid font style "${fontStyle}". Valid styles are: ${valid.FS.join(', ')}`, 'error');
                                return;
                            }

                            setFontStyle(fontStyle, true);
                        
                            if (!options.quiet) {
                                appendToConsole(`Font style set to ${fontStyle}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available font styles: ${valid.FS.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('stroke', () => {
                    match(action)
                        .with('get', () => {
                            const strokeWidth = getStrokeWidth();
                            const strokeColor = getStrokeColor();
                            appendToConsole(`Current font stroke width: ${strokeWidth}`);
                            appendToConsole(`Current font stroke color: ${strokeColor}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing stroke width value. Usage: font stroke set <width> [--color <color>]', 'error');
                                return;
                            }

                            const strokeWidth = args.value;
                        
                            if (!valid.FStW.includes(strokeWidth)) {
                                appendToConsole(`Error: Invalid stroke width "${strokeWidth}". Valid widths are: ${valid.FStW.join(', ')}`, 'error');
                                return;
                            }

                            setStrokeWidth(`${strokeWidth}px`, true);
                        
                            if (!options.quiet) {
                                appendToConsole(`Font stroke width set to ${strokeWidth}px`);
                            }
                            
                            if (options.color) {
                                if (!/^#[0-9A-Fa-f]{6}$/.test(options.color)) {
                                    appendToConsole('Error: Invalid color format. Color must be in full hex format (e.g. #FF0000)', 'error');
                                    return;
                                }

                                setStrokeColor(options.color, true);
                                
                                if (!options.quiet) {
                                    appendToConsole(`Font stroke color set to ${options.color}`);
                                }
                            }
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, color`, 'error');
                        });
                })
                .with('dropshadow', () => {
                    match(action)
                        .with('get', () => {
                            const dropShadow = getDropShadow();
                            appendToConsole(`Current drop shadow: ${dropShadow}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing drop shadow value. Usage: font dropshadow set <value>', 'error');
                                return;
                            }

                            const dropShadow = args.value;

                            if (valid.DS.includes(dropShadow)) {
                                setDropShadow(dropShadow, true);
                                if (!options.quiet) {
                                    appendToConsole(`Drop shadow set to ${dropShadow}`);
                                }
                            } else {
                                appendToConsole(`Error: Invalid drop shadow value "${dropShadow}". Valid values are: ${valid.DS.join(', ')}`, 'error');
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available drop shadow values: ${valid.DS.join(', ')}`);
                        });
                })
                .otherwise((prop) => {
                    appendToConsole(`Unknown property: ${prop}. Available properties: family, size, weight, style, stroke`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'color',
        description: 'View or modify color settings',
        usage: 'color [mode|solid|text-mode|text-color|bg-size|bg-blur] [get|set|list] [value]',
        aliases: ['col', 'colors'],
        args: [
            {
                name: 'property',
                type: 'string',
                description: 'Color property to modify (mode, solid, text-mode, text-color, bg-size, bg-blur)',
                required: false
            },
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (get, set, list)',
                required: false
            },
            {
                name: 'value',
                type: 'string',
                description: 'Value to set for the property',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Change color settings without showing notifications',
                default: false
            }
        ],
        execute: (args, options) => {
            if (!args.property) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'color')?.usage}`, 'error');
                const currentColorMode = getColorMode();
                appendToConsole('Current color settings:');
                appendToConsole(`Color Mode: ${currentColorMode}`);
            
                if (currentColorMode === 'solidmode') {
                    appendToConsole(`Solid Color: ${getSolidColorValue()}`);
                }

                if (currentColorMode !== 'fademode') {
                    appendToConsole(`Text Color Mode: ${getTextColorMode()}`);
                    appendToConsole(`Text Color Value: ${getTextColorValue()}`);
                }
            
                if (currentColorMode === 'imgmode') {
                    appendToConsole(`Background Image Size: ${getBGImageSize()}`);
                    appendToConsole(`Background Image Blur: ${getBGImageBlur()}`);
                }
                return;
            }

            const property = args.property;
            const action = args.action ? args.action : 'get';

            match(property)
                .with('mode', () => {
                    match(action)
                        .with('get', () => {
                            const currentMode = getColorMode();
                            appendToConsole(`Current color mode: ${currentMode}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing color mode value. Usage: color mode set <value>', 'error');
                                return;
                            }
                            const modeValue = args.value;

                            if (valid.CMo.includes(modeValue)) {
                                setColorMode(modeValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Color mode set to ${modeValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid color mode value: ${modeValue}`, 'error');
                                appendToConsole(`Valid color mode values: ${valid.CMo.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available color mode values: ${valid.CMo.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('solid', () => {
                    match(action)
                        .with('get', () => {
                            const currentMode = getColorMode();
                            if (currentMode === 'solidmode') {
                                const currentColor = getSolidColorValue();
                                appendToConsole(`Current solid color: ${currentColor}`);
                            } else {
                                appendToConsole(`Cannot get solid color: Current mode is ${currentMode}, not solidmode`, 'error');
                            }
                        })
                        .with('set', () => {
                            const currentMode = getColorMode();
                            if (currentMode !== 'solidmode') {
                                appendToConsole(`Cannot set solid color: Current mode is ${currentMode}, not solidmode`, 'error');
                                appendToConsole('Switch to solid mode first with: color mode set solidmode');
                                return;
                            }
                        
                            if (!args.value) {
                                appendToConsole('Error: Missing solid color value. Usage: color solid set <value>', 'error');
                                return;
                            }
                            const colorValue = args.value;

                            if (valid.SC.includes(colorValue)) {
                                setSolidColor(colorValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Solid color set to ${colorValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid solid color value: ${colorValue}`, 'error');
                                appendToConsole(`Valid solid color values: ${valid.SC.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available solid color values: ${valid.SC.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('text-mode', () => {
                    match(action)
                        .with('get', () => {
                            const currentTextMode = getTextColorMode();
                            appendToConsole(`Current text color mode: ${currentTextMode}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing text color mode value. Usage: color text-mode set <value>', 'error');
                                return;
                            }
                            const textModeValue = args.value;

                            if (valid.TCM.includes(textModeValue)) {
                                setTextColorMode(textModeValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Text color mode set to ${textModeValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid text color mode value: ${textModeValue}`, 'error');
                                appendToConsole(`Valid text color mode values: ${valid.TCM.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available text color mode values: ${valid.TCM.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('text-color', () => {
                    match(action)
                        .with('get', () => {
                            const currentTextValue = getTextColorValue();
                            appendToConsole(`Current text color value: ${currentTextValue}`);
                        })
                        .with('set', () => {
                            if (!args.value) {
                                appendToConsole('Error: Missing text color value. Usage: color text-color set <value>', 'error');
                                return;
                            }
                            const textColorValue = args.value;

                            // Check if it's a valid hex color
                            if (/^#[0-9A-Fa-f]{6}$/.test(textColorValue)) {
                                setTextColorValue(textColorValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Text color value set to ${textColorValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid text color value: ${textColorValue}`, 'error');
                                appendToConsole('Text color must be in full hex format (e.g. #FF0000)');
                            }
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set`, 'error');
                        });
                })
                .with('bg-size', () => {
                    match(action)
                        .with('get', () => {
                            const currentMode = getColorMode();
                            if (currentMode === 'imgmode') {
                                const currentSize = getBGImageSize();
                                appendToConsole(`Current background image size: ${currentSize || '(empty)'}`);
                            } else {
                                appendToConsole(`Cannot get background image size: Current mode is ${currentMode}, not imgmode`, 'error');
                            }
                        })
                        .with('set', () => {
                            const currentMode = getColorMode();
                            if (currentMode !== 'imgmode') {
                                appendToConsole(`Cannot set background image size: Current mode is ${currentMode}, not imgmode`, 'error');
                                appendToConsole('Switch to image mode first with: color mode set imgmode');
                                return;
                            }
                        
                            if (args.value === undefined) {
                                appendToConsole('Error: Missing background image size value. Usage: color bg-size set <value>', 'error');
                                return;
                            }
                            const sizeValue = args.value;

                            if (valid.BIS.includes(sizeValue)) {
                                setBackgroundImageSize(sizeValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Background image size set to ${sizeValue || '(empty)'}`);
                                }
                            } else {
                                appendToConsole(`Invalid background image size value: ${sizeValue}`, 'error');
                                appendToConsole(`Valid background image size values: ${valid.BIS.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available background image size values: ${valid.BIS.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .with('bg-blur', () => {
                    match(action)
                        .with('get', () => {
                            const currentMode = getColorMode();
                            if (currentMode === 'imgmode') {
                                const currentBlur = getBGImageBlur();
                                appendToConsole(`Current background image blur: ${currentBlur}`);
                            } else {
                                appendToConsole(`Cannot get background image blur: Current mode is ${currentMode}, not imgmode`, 'error');
                            }
                        })
                        .with('set', () => {
                            const currentMode = getColorMode();
                            if (currentMode !== 'imgmode') {
                                appendToConsole(`Cannot set background image blur: Current mode is ${currentMode}, not imgmode`, 'error');
                                appendToConsole('Switch to image mode first with: color mode set imgmode');
                                return;
                            }
                        
                            if (!args.value) {
                                appendToConsole('Error: Missing background image blur value. Usage: color bg-blur set <value>', 'error');
                                return;
                            }
                            const blurValue = args.value;

                            if (valid.BIB.includes(blurValue)) {
                                setBackgroundImageBlur(blurValue, true);
                                if (!options.quiet) {
                                    appendToConsole(`Background image blur set to ${blurValue}`);
                                }
                            } else {
                                appendToConsole(`Invalid background image blur value: ${blurValue}`, 'error');
                                appendToConsole(`Valid background image blur values: ${valid.BIB.join(', ')}`);
                            }
                        })
                        .with('list', () => {
                            appendToConsole(`Available background image blur values: ${valid.BIB.join(', ')}`);
                        })
                        .otherwise((act) => {
                            appendToConsole(`Unknown action: ${act}. Available actions: get, set, list`, 'error');
                        });
                })
                .otherwise((prop) => {
                    appendToConsole(`Unknown property: ${prop}. Available properties: mode, solid, text-mode, text-color, bg-size, bg-blur`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'color')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'reset',
        description: 'Reset all Online Web Clock settings to default',
        usage: 'reset',
        aliases: ['reset-settings', 'reset-config'],
        execute: () => {
            resetSettings()
                .then(result => {
                    appendToConsole(result);
                });
        }
    },
    {
        name: 'language',
        description: 'Change or get the current language',
        usage: 'language [code] [--quiet]',
        aliases: ['lang', 'locale'],
        args: [
            {
                name: 'code',
                type: 'string',
                description: 'Language code (en, es)',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Change language without showing a notification',
                default: false
            }
        ],
        execute: (args, options) => {
            if (!args.code) {
            // Get current language
                const currentLang = i18n.getCurrentLanguage();
                appendToConsole(`Current language: ${currentLang}`);
            
                // Show available languages
                const availableLanguages = i18n.getSupportedLanguages();
                appendToConsole(`Available languages: ${availableLanguages.join(', ')}`);
                return;
            }

            const langCode = args.code.toLowerCase();

            // Change the language using the i18n interface
            i18n.changeLanguage(langCode)
                .then(() => {
                    if (!options.quiet) {
                        appendToConsole(`Language changed to ${langCode}`);
                    }
                })
                .catch(error => {
                    appendToConsole(`Error changing language: ${error.message}`, 'error');
                });
        }
    },
    {
        name: 'version',
        description: 'Display the current version of the application',
        usage: 'version',
        aliases: ['ver', 'vers'],
        options: [
            {
                name: 'verbose',
                shortName: 'v',
                type: 'boolean',
                description: 'Show additional version information',
                default: false
            }
        ],
        execute: (args, options) => {
            if (options.verbose) {
                appendToConsole(`Online Web Clock ${versionNumberString}`);
                appendToConsole(`User Agent: ${navigator.userAgent}`);
                appendToConsole(`Platform: ${navigator.platform}`);
            } else {
                appendToConsole(`Online Web Clock ${versionNumberString}`);
            }
        }
    },
    {
        name: 'exit',
        description: 'Exits the Developer Console',
        usage: 'exit',
        aliases: ['quit', 'q'],
        execute: () => {
            appendToConsole('Exiting Developer Console...');

            // Artificial delay
            setTimeout(() => {
                debugConsole.hide();
            }, 100);
        }
    }
];

function parseCommandArguments(command: Command, rawArgs: string[]): { 
  parsedArgs: any, 
  parsedOptions: any, 
  errors: string[] 
} {
    const parsedArgs: any = {};
    const parsedOptions: any = {};
    const errors: string[] = [];
  
    // Initialize default values for options
    if (command.options) {
        command.options.forEach(option => {
            if (option.default !== undefined) {
                parsedOptions[option.name] = option.default;
            }
        });
    }
  
    // Initialize default values for arguments
    if (command.args) {
        command.args.forEach(arg => {
            if (arg.default !== undefined) {
                parsedArgs[arg.name] = arg.default;
            }
        });
    }
  
    let positionalIndex = 0;
    let i = 0;
  
    while (i < rawArgs.length) {
        const arg = rawArgs[i];
    
        // Check if this is an option (starts with - or --)
        if (arg.startsWith('--') || (arg.startsWith('-') && arg.length === 2)) {
            const isLongOption = arg.startsWith('--');
            const optionName = isLongOption ? arg.slice(2) : arg.slice(1);
      
            // Find the matching option definition
            const option = command.options?.find(opt => 
                (isLongOption && opt.name === optionName) || 
        (!isLongOption && opt.shortName === optionName)
            );
      
            if (!option) {
                errors.push(`Unknown option: ${arg}`);
                i++;
                continue;
            }
      
            // Handle boolean flags (no value needed)
            if (option.type === 'boolean') {
                parsedOptions[option.name] = true;
                i++;
                continue;
            }
      
            // For non-boolean options, we need a value
            if (i + 1 >= rawArgs.length) {
                errors.push(`Option ${arg} requires a value`);
                i++;
                continue;
            }
      
            const value = rawArgs[i + 1];
      
            // Parse the value according to its type
            if (option.type === 'number') {
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    errors.push(`Option ${arg} requires a number value, got: ${value}`);
                } else {
                    parsedOptions[option.name] = numValue;
                }
            } else {
                // String type
                parsedOptions[option.name] = value;
            }
      
            // Skip the option and its value
            i += 2;
        } else {
            // This is a positional argument
            if (command.args && positionalIndex < command.args.length) {
                const argDef = command.args[positionalIndex];
        
                // Parse the value according to its type
                if (argDef.type === 'number') {
                    const numValue = Number(arg);
                    if (isNaN(numValue)) {
                        errors.push(`Argument ${argDef.name} requires a number value, got: ${arg}`);
                    } else {
                        parsedArgs[argDef.name] = numValue;
                    }
                } else if (argDef.type === 'boolean') {
                    const boolValue = arg.toLowerCase();
                    if (boolValue === 'true' || boolValue === 'false') {
                        parsedArgs[argDef.name] = boolValue === 'true';
                    } else {
                        errors.push(`Argument ${argDef.name} requires a boolean value (true/false), got: ${arg}`);
                    }
                } else {
                    // String type
                    parsedArgs[argDef.name] = arg;
                }
        
                positionalIndex++;
            } else if (command.args) {
                errors.push(`Too many arguments provided. Expected ${command.args.length} arguments.`);
            }
      
            i++;
        }
    }
  
    // Check for required arguments
    let missingRequiredArgs = false;
    if (command.args) {
        command.args.forEach((argDef, index) => {
            if (argDef.required && parsedArgs[argDef.name] === undefined) {
                errors.push(`Missing required argument: ${argDef.name}`);
                missingRequiredArgs = true;
            }
        });
    }
  
    // If there are missing required arguments, add the command usage to the errors
    if (missingRequiredArgs) {
        errors.push(`Usage: ${command.usage}`);
    }
  
    return { parsedArgs, parsedOptions, errors };
}

// Handle global options before command execution
function handleGlobalOptions(commandName: string, rawArgs: string[]): boolean {
    // Check for help flag
    const helpFlags = ['-h', '--help'];
    const hasHelpFlag = rawArgs.some(arg => helpFlags.includes(arg));
  
    if (hasHelpFlag) {
    // Find the command
        const command = commands.find(cmd => 
            cmd.name === commandName || 
      (cmd.aliases && cmd.aliases.includes(commandName))
        );
    
        if (command) {
            // Display help for the command (reuse the help command's functionality)
            const helpCommand = commands.find(cmd => cmd.name === 'help');
            if (helpCommand) {
                helpCommand.execute({ command: commandName }, {}, []);
            }
        } else {
            appendToConsole(`Unknown command: ${commandName}`, 'error');
        }
    
        return true; // Indicate that we've handled the command
    }
  
    return false; // No global options were handled
}

// Handle command execution
function executeCommand(): void {
    const input = devcon.input.value.trim();
    if (!input) return;
  
    // Add to history
    commandHistory.unshift(input);
    historyIndex = -1;
    if (commandHistory.length > 50) commandHistory.pop();
  
    // Echo the command
    appendToConsole(`> ${input}`, 'command');
  
    // Parse command and arguments with quote support
    let tokens: string[] = [];
  
    try {
        // Simple parsing approach that handles quotes
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        let match;
    
        while ((match = regex.exec(input)) !== null) {
            // If the capture group for quotes is undefined, then it's a regular word
            if (match[1] || match[2]) {
                tokens.push(match[1] || match[2]);
            } else {
                tokens.push(match[0]);
            }
        }
    } catch (e) {
        // Fallback to simple splitting if regex fails
        console.error('Error parsing command:', e);
        tokens = input.split(' ');
    }
  
    if (tokens.length === 0) {
        devcon.input.value = '';
        return;
    }
  
    const commandName = tokens[0].toLowerCase();
    const rawArgs = tokens.slice(1);
  
    // Check for global options first
    if (handleGlobalOptions(commandName, rawArgs)) {
        devcon.input.value = '';
        return;
    }
  
    // Find command by name or alias
    const command = commands.find(cmd => 
        cmd.name === commandName || 
        (cmd.aliases && cmd.aliases.includes(commandName))
    );
  
    if (command) {
        try {
            // Parse arguments and options based on command definition
            const { parsedArgs, parsedOptions, errors } = parseCommandArguments(command, rawArgs);
      
            // Check for parsing errors
            if (errors.length > 0) {
                errors.forEach(error => {
                    appendToConsole(`Error: ${error}`, 'error');
                });
                devcon.input.value = '';
                return;
            }
      
            // Execute the command with parsed arguments and options
            command.execute(parsedArgs, parsedOptions, rawArgs);
        } catch (error) {
            appendToConsole(`Error executing command: ${error}`, 'error');
        }
    } else {
        // Command not found - find similar commands to suggest
        const suggestions = findSimilarCommands(commandName);
        
        if (suggestions.length > 0) {
            if (suggestions.length === 1) {
                appendToConsole(`Unknown command: ${commandName}. Did you mean '${suggestions[0]}'? Type "help" for available commands.`, 'error');
            } else {
                appendToConsole(`Unknown command: ${commandName}. Did you mean one of these: ${suggestions.join(', ')}? Type "help" for available commands.`, 'error');
            }
        } else {
            appendToConsole(`Unknown command: ${commandName}. Type "help" for available commands.`, 'error');
        }
    }
  
    // Clear input
    devcon.input.value = '';
}

/**
 * Find commands that are similar to the input
 * @param input The user's input command name
 * @returns Array of similar command names
 */
function findSimilarCommands(input: string): string[] {
    // Calculate Levenshtein distance between two strings
    function levenshteinDistance(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        const matrix: number[][] = [];
        
        // Initialize matrix
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        // Fill in the rest of the matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }
    
    // Get all command names and aliases
    const allCommandNames: string[] = [];
    commands.forEach(cmd => {
        allCommandNames.push(cmd.name);
        if (cmd.aliases) {
            allCommandNames.push(...cmd.aliases);
        }
    });
    
    // Calculate distance for each command
    const distances: { name: string, distance: number }[] = allCommandNames.map(name => ({
        name,
        distance: levenshteinDistance(input, name)
    }));
    
    // Sort by distance (closest first)
    distances.sort((a, b) => a.distance - b.distance);
    
    // Return commands that are "close enough" (distance <= 2 or 3)
    // Adjust the threshold based on your preference
    const threshold = input.length <= 3 ? 1 : 2;
    
    // Return only unique command names (no duplicates from aliases)
    const uniqueNames = new Set<string>();
    const suggestions: string[] = [];
    
    for (const item of distances) {
        if (item.distance <= threshold && !uniqueNames.has(item.name)) {
            uniqueNames.add(item.name);
            suggestions.push(item.name);
            
            // Limit to 3 suggestions
            if (suggestions.length >= 3) break;
        }
    }
    
    return suggestions;
}

// Header drag functionality
function setupDragFunctionality(): void {
    devcon.header.addEventListener('mousedown', (e) => {
        devcon.header.style.cursor = 'grabbing';
        const startX = e.clientX - devcon.container.offsetLeft;
        const startY = e.clientY - devcon.container.offsetTop;

        function onMouseMove(e: { clientX: number; clientY: number; }) {
            const posX = e.clientX - startX;
            const posY = e.clientY - startY;

            // Get container dimensions
            const containerRect = devcon.container.getBoundingClientRect();
    
            // Constrain to viewport bounds
            const clampedX = Math.max(0, Math.min(posX, window.innerWidth - containerRect.width));
            const clampedY = Math.max(0, Math.min(posY, window.innerHeight - containerRect.height));

            devcon.container.style.left = `${clampedX}px`;
            devcon.container.style.top = `${clampedY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            devcon.header.style.cursor = 'grab';
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Double click to reset position
    devcon.header.addEventListener('dblclick', () => {
        devcon.container.style.left = '';
        devcon.container.style.top = '';
        devcon.container.style.transform = '';
        logConsole('Developer console position reset', 'info');
    });

    // Set initial cursor style
    devcon.header.style.cursor = 'grab';
}

const logFilters = {
    debug: devcon.debugfilterbtn,
    info: devcon.infofilterbtn,
    warning: devcon.warningfilterbtn,
    error: devcon.errorfilterbtn
};

// Add this function to handle log filtering
function setupLogFilters(): void {
    const filterCheckboxes = [
        { element: logFilters.debug, level: 'debug' },
        { element: logFilters.info, level: 'info' },
        { element: logFilters.warning, level: 'warning' },
        { element: logFilters.error, level: 'error' }
    ];

    filterCheckboxes.forEach(({ element, level }) => {
        if (element) {
            element.addEventListener('change', () => {
                filterLogsByLevel();
            });
        }
    });
}

function filterLogsByLevel(): void {
    const logEntries = devcon.logs.querySelectorAll('[data-logtype]');
    
    logEntries.forEach((entry) => {
        const logLevel = entry.getAttribute('data-logtype');
        const filterElement = logFilters[logLevel as keyof typeof logFilters];
        
        if (filterElement && filterElement.checked) {
            (entry as HTMLElement).style.display = '';
        } else {
            (entry as HTMLElement).style.display = 'none';
        }
    });
}

// Initialize the debug console
export function initDebugConsole(): void {
    if (!debugMode) return;
    
    // Set up drag functionality
    setupDragFunctionality();
    
    // Set up log filters
    setupLogFilters();
    
    // Set up event listeners
    devcon.submitbtn.addEventListener('click', executeCommand);
    devcon.input.addEventListener('keydown', handleInputKeydown);
    devcon.closebtn.addEventListener('click', () => {
        debugConsole.hide();
    });

    panel.devconbutton.addEventListener('click', () => {
        debugConsole.toggle();
    });
    
    // Initial message
    appendToConsole('Welcome to the console! Type "help" for available commands.');
    setDevConInit(true);
    
    logConsole('Debug console initialized', 'debug');
}

// Handle keyboard events in the input field
function handleInputKeydown(event: KeyboardEvent): void {
    match(event.key)
        .with('Enter', () => {
            executeCommand();
        })
        .with('Escape', () => {
            debugConsole.hide();
        })
        .with('ArrowUp', () => {
            navigateHistory(1);
            event.preventDefault();
        })
        .with('ArrowDown', () => {
            navigateHistory(-1);
            event.preventDefault();
        })
        .otherwise(() => {});
}

// Navigate through command history
function navigateHistory(direction: number): void {
    if (commandHistory.length === 0) return;
    
    historyIndex += direction;
    
    if (historyIndex >= commandHistory.length) {
        historyIndex = commandHistory.length - 1;
    } else if (historyIndex < -1) {
        historyIndex = -1;
    }
    
    if (historyIndex === -1) {
        devcon.input.value = '';
    } else {
        devcon.input.value = commandHistory[historyIndex];
    }
}

// Append text to the console output
function appendToConsole(text: string, type: 'normal' | 'command' | 'error' = 'normal'): void {

    const entry = document.createElement('div');
    
    match(type)
        .with('command', () => {
            entry.style.color = '#0066cc';
        })
        .with('error', () => {
            entry.style.color = '#cc0000';
        })
        .otherwise(() => {}); // Use default color
    
    entry.textContent = text;
    devcon.output.appendChild(entry);

    const logTimestamp = new Date().toLocaleTimeString();

    // Remove oldest entries if exceeding 100
    while (devcon.output.children.length > 100) {
        const firstChild = devcon.output.firstChild;
        if (firstChild) {
            logConsole(`[${logTimestamp}] Developer Console Output - Limit reached (${devcon.output.children.length}/100) Removing ${firstChild.textContent}`, 'debug');
            devcon.output.removeChild(firstChild);
        }
    }
    
    // Auto-scroll to bottom
    devcon.output.scrollTop = devcon.output.scrollHeight;
}

// Export public methods
export const debugConsole = {
    show: () => {
        if (debugMode) {
            devcon.container.classList.add('show');
            devcon.input.focus();
            panel.devconbutton.className = 'btn btn-danger';
        }
    },
    hide: () => {
        devcon.container.classList.remove('show');
        panel.devconbutton.className = 'btn btn-secondary';
    },
    toggle: () => {
        if (debugMode) {
            const isVisible = devcon.container.classList.contains('show');
            devcon.container.classList.toggle('show', !isVisible);

            if (isVisible) {
                panel.devconbutton.className = 'btn btn-secondary';
            } else {
                devcon.input.focus();
                panel.devconbutton.className = 'btn btn-danger';
            }
        }
    },
    execute: (command: string) => {
        if (debugMode) {
            devcon.input.value = command;
            executeCommand();
        }
    },
    clearLogs: () => {
        devcon.logs.innerHTML = '';
    }
};
