import { countdown, devcon, menu, panel, stopwatch } from './dom-elements';
import { getAvailableThemes, getMenuTheme, logConsole, requestNotificationPermission, setMenuTheme } from './dom-utils';
import { debugMode } from './debug';
import { match } from 'ts-pattern';
import { presetLocalJSON } from '../importExport';
import { presetList } from '../assets/presets/presets';
import { versionNumberString } from './update-notify';
import { getFont, getFontList, modifyFontStyle } from '../global';
import { startCountdownExternal, pauseCountdownExternal, resetCountdownExternal } from '../countdown';
import { lapStopwatchExternal, pauseStopwatchExternal, resetStopwatchExternal, startStopwatchExternal } from '../stopwatch';

// Command history
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
        name: 'echo',
        description: 'Outputs the given text',
        usage: 'echo <text>',
        args: [
            {
                name: 'text',
                type: 'string',
                description: 'Text to output to the console',
                required: true
            }
        ],
        options: [
            {
                name: 'color',
                shortName: 'c',
                type: 'string',
                description: 'Color of the text (e.g., red, blue, green)',
                default: ''
            }
        ],
        execute: (args, options) => {
            if (options.color) {
                const entry = document.createElement('div');
                entry.style.color = options.color;
                entry.textContent = args.text;
                devcon.output.appendChild(entry);
            
                // Auto-scroll to bottom
                devcon.output.scrollTop = devcon.output.scrollHeight;
            } else {
                appendToConsole(args.text);
            }
        }
    },
    {
        name: 'log',
        description: 'Logs the given text to the console',
        usage: 'log <text> [--level <level>]',
        args: [
            {
                name: 'text',
                type: 'string',
                description: 'Text to log to the browser console',
                required: true
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
        
            if (!validLevels.includes(level)) {
                appendToConsole(`Invalid log level: ${level}. Valid levels are: ${validLevels.join(', ')}`, 'error');
                return;
            }
        
            logConsole(args.text, level as 'debug' | 'error' | 'warning' | 'info', options.bypass);
            appendToConsole(`Logged to console with level: ${level}`);
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
        name: 'preset',
        description: 'Load a preset configuration or list available presets',
        usage: 'preset [list|load <preset-filename>]',
        aliases: ['pre'],
        args: [
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (list, load)',
                required: false
            },
            {
                name: 'preset',
                type: 'string',
                description: 'Preset filename to load',
                required: false
            }
        ],
        options: [
            {
                name: 'quiet',
                shortName: 'q',
                type: 'boolean',
                description: 'Load preset without showing notifications',
                default: false
            }
        ],
        execute: (args, options) => {
        // If no action is provided, show usage and list presets
            if (!args.action) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'preset')?.usage}`, 'error');
            
                // Display available presets
                const presetInfo = presetList.map(preset => 
                    `${preset.filename}: ${preset.displayName}`
                ).join('\n');
            
                appendToConsole(`Available presets:\n${presetInfo}`);
                return;
            }
        
            match(args.action.toLowerCase())
                .with('list', () => {
                    let presetInfo = presetList.map(preset => 
                        `${preset.filename}: ${preset.displayName}`
                    ).join('\n');
                    
                    appendToConsole(`Available presets:\n${presetInfo}`);
                })
                .with('load', () => {
                    if (!args.preset) {
                        appendToConsole('Error: Missing preset name. Usage: preset load <preset-filename>', 'error');
                        return;
                    }
                    
                    let presetName = args.preset;
                    
                    // Check if the preset exists
                    let presetExists = presetList.some(preset => preset.filename === presetName);
                    if (!presetExists) {
                        appendToConsole(`Error: Preset "${presetName}" not found. Use "preset list" to see available presets.`, 'error');
                        return;
                    }
                    
                    presetLocalJSON(presetName)
                        .then(() => {
                            appendToConsole(`Successfully loaded preset: ${presetName}`);
                        })
                        .catch(error => {
                            appendToConsole(`Error loading preset: ${error}`, 'error');
                        });
                })
                .otherwise(() => {
                    appendToConsole(`Unknown action: ${args.action}. Available actions: list, load`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'preset')?.usage}`, 'error');
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
    
            const themeName = args.name.toLowerCase();
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
        name: 'font',
        description: 'Change or get the current font',
        usage: 'font [get|set <font-name>|list]',
        args: [
            {
                name: 'action',
                type: 'string',
                description: 'Action to perform (get, set, list)',
                required: false
            },
            {
                name: 'fontName',
                type: 'string',
                description: 'Font name to set (required for "set" action)',
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
            }
        ],
        execute: (args, options) => {
            if (!args.action) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
                // Print current font
                const currentFont = getFont();
                appendToConsole(`Current font: ${currentFont}`);
                return;
            }

            match(args.action.toLowerCase())
                .with('get', () => {
                    const currentFont = getFont();
                    appendToConsole(`Current font: ${currentFont}`);
                })
                .with('set', () => {
                    if (!args.fontName) {
                        appendToConsole('Error: Missing font name. Usage: font set <font-name>', 'error');
                        return;
                    }
                    const fontName = args.fontName;
                    
                    modifyFontStyle('family', fontName);
                    
                    if (!options.quiet) {
                        appendToConsole(`Font set to ${fontName}`);
                    }
                })
                .with('list', () => {
                    const fonts = getFontList();
                    appendToConsole(`Available fonts:\n${fonts.join('\n')}`);
                })
                .otherwise((action) => {
                    appendToConsole(`Unknown action: ${action}. Available actions: get, set, list`, 'error');
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
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

// Initialize the console
export function initDebugConsole(): void {
    if (!debugMode) return;
    
    // Set up event listeners
    devcon.submitbtn.addEventListener('click', executeCommand);
    devcon.input.addEventListener('keydown', handleInputKeydown);
    devcon.closebtn.addEventListener('click', () => {
        devcon.container.classList.remove('show');
    });
    
    // Initial message
    appendToConsole('Welcome to the console! Type "help" for available commands.');
    
    logConsole('Debug console initialized', 'debug');
}

// Handle keyboard events in the input field
function handleInputKeydown(event: KeyboardEvent): void {
    match(event.key)
        .with('Enter', () => {
            executeCommand();
        })
        .with('Escape', () => {
            devcon.container.classList.remove('show');
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
    
    // Auto-scroll to bottom
    devcon.output.scrollTop = devcon.output.scrollHeight;
}

// Export public methods
export const debugConsole = {
    show: () => {
        if (debugMode) {
            devcon.container.classList.add('show');
            devcon.input.focus();
        }
    },
    hide: () => {
        devcon.container.classList.remove('show');
    },
    toggle: () => {
        if (debugMode) {
            const isVisible = devcon.container.classList.contains('show');
            if (isVisible) {
                devcon.container.classList.remove('show');
            } else {
                devcon.container.classList.add('show');
                devcon.input.focus();
            }
        }
    },
    execute: (command: string) => {
        if (debugMode) {
            devcon.input.value = command;
            executeCommand();
        }
    }
};
