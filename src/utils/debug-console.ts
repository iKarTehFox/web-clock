import { countdown, devcon, menu, panel, stopwatch } from './dom-elements';
import { getMenuTheme, logConsole, requestNotificationPermission, setMenuTheme } from './dom-utils';
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
interface Command {
    name: string;
    description: string;
    usage: string;
    aliases?: string[];
    minArgs?: number;  // Minimum number of arguments
    maxArgs?: number;  // Maximum number of arguments
    execute: (args: string[]) => void;
}

const commands: Command[] = [
    {
        name: 'help',
        description: 'Shows a list of available commands',
        usage: 'help [command]',
        aliases: ['?', 'commands'],
        maxArgs: 1,
        execute: (args) => {
            if (args.length > 0) {
                // Show help for specific command
                const commandName = args[0].toLowerCase();
                const command = commands.find(cmd => 
                    cmd.name === commandName || 
                    (cmd.aliases && cmd.aliases.includes(commandName))
                );
                
                if (command) {
                    const aliasesText = command.aliases ? `\nAliases: ${command.aliases.join(', ')}` : '';
                    appendToConsole(`${command.name}: ${command.description}\nUsage: ${command.usage}${aliasesText}`);
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
        maxArgs: 0,
        aliases: ['cls'],
        execute: (args) => {
            devcon.output.innerHTML = '';
        }
    },
    {
        name: 'echo',
        description: 'Outputs the given text',
        usage: 'echo <text>',
        minArgs: 1,
        execute: (args) => {
            appendToConsole(args.join(' '));
        }
    },
    {
        name: 'log',
        description: 'Logs the given text to the console',
        usage: 'log <text>',
        minArgs: 1,
        execute: (args) => {
            logConsole(args.join(' '), 'debug');
        }
    },
    {
        name: 'panel',
        description: 'Interact with the panel',
        usage: 'panel <toggle-vis|menu show|countdown <toggle|toggle-notification|start <seconds>|stop|reset>|stopwatch <toggle|start|stop|reset>',
        maxArgs: 3,
        execute: (args) => {
            if (args.length  === 0) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                return;
            }

            match(args[0])
                .with('toggle-vis', () => {
                    if (args.length > 1) {
                        appendToConsole('Too many arguments. Usage: panel toggle-vis', 'error');
                        return;
                    }

                    menu.panelvischeckbox.click();
                    menu.panelvischeckbox.dispatchEvent(new Event('change'));
                })
                .with('menu', () => {
                    if (args.length !== 2) {
                        appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        return;
                    }

                    match(args[1])
                        .with('show', () => {
                            panel.menubutton.click();
                        })
                        .otherwise(() => {
                            appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        });
                })
                .with('countdown', () => {
                    if (args.length < 2) {
                        appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        return;
                    }

                    match(args[1])
                        .with('toggle', () => {
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                                return;
                            }

                            countdown.obutton.click();
                            appendToConsole('Countdown visibility toggled');
                        })
                        .with('start', () => {
                            if (args.length > 3) {
                                appendToConsole('Missing length argument. Usage: panel countdown start <seconds>', 'error');
                            }

                            const seconds = parseInt(args[2]);
                            if (isNaN(seconds)) {
                                appendToConsole('Invalid length argument. Usage: panel countdown start <seconds>', 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        });
                })
                .with('stopwatch', () => {
                    if (args.length !== 2) {
                        appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        return;
                    }

                    match(args[1])
                        .with('toggle', () => {
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                                return;
                            }

                            stopwatch.obutton.click();
                            appendToConsole('Stopwatch visibility toggled');
                        })
                        .with('start', () => {
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            if (args.length !== 2) {
                                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
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
                            appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'panel')?.usage}`, 'error');
                        });
                })
                .otherwise(() => {
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'menu')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'preset',
        description: 'Load a preset configuration or list available presets',
        usage: 'preset [list|load <preset-filename>]',
        aliases: ['pre'],
        maxArgs: null,  // Special case - handled in the execute function
        execute: (args) => {
            if (!args.length) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'preset')?.usage}`, 'error');
                
                // Display available presets
                const presetInfo = presetList.map(preset => 
                    `${preset.filename}: ${preset.displayName}`
                ).join('\n');
                
                appendToConsole(`Available presets:\n${presetInfo}`);
                return;
            }
        
            match(args[0])
                .with('list', () => {
                    if (args.length > 1) {
                        appendToConsole('Error: Too many arguments. Usage: preset list', 'error');
                        return;
                    }
                    
                    // Display available presets
                    const presetInfo = presetList.map(preset => 
                        `${preset.filename}: ${preset.displayName}`
                    ).join('\n');
                    
                    appendToConsole(`Available presets:\n${presetInfo}`);
                })
                .with('load', () => {
                    if (args.length < 2) {
                        appendToConsole('Error: Missing preset name. Usage: preset load <preset-filename>', 'error');
                        return;
                    }
                    
                    const presetName = args[1];
                    presetLocalJSON(presetName)
                        .then(() => {
                            appendToConsole(`Successfully loaded preset: ${presetName}`);
                        })
                        .catch(error => {
                            appendToConsole(`Error loading preset: ${error}`, 'error');
                        });
                })
                .otherwise(() => {
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'preset')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'theme',
        description: 'Change or get the current theme',
        usage: 'theme [auto|toggle|light|dark|midnight]',
        execute: (args) => {
            if (!args.length) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'theme')?.usage}`, 'error');
                
                // Get current theme
                const currentTheme = getMenuTheme();
                appendToConsole(`Current theme: ${currentTheme}`);
                return;
            }
        
            match(args[0])
                .with('auto', () => {
                    setMenuTheme('auto');
                    const currentTheme = getMenuTheme();
                    appendToConsole(`Theme auto-detected as ${currentTheme}`);
                })
                .with('toggle', () => {
                    setMenuTheme('toggle');
                    const currentTheme = getMenuTheme();
                    appendToConsole(`Theme toggled to ${currentTheme}`);
                })
                .with('light', () => {
                    setMenuTheme('light');
                    appendToConsole('Theme set to light');
                })
                .with('dark', () => {
                    setMenuTheme('dark');
                    appendToConsole('Theme set to dark');
                })
                .with('midnight', () => {
                    setMenuTheme('midnight');
                    appendToConsole('Theme set to midnight');
                })
                .otherwise(() => {
                    appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'theme')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'font',
        description: 'Change or get the current font',
        usage: 'font [get|set <font-name>|list]',
        maxArgs: null,  // Special case - handled in the execute function
        execute: (args) => {
            if (!args.length) {
                appendToConsole(`Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
                // Print current font
                const currentFont = getFont();
                appendToConsole(`Current font: ${currentFont}`);
                return;
            }

            match(args[0])
                .with('get', () => {
                    if (args.length > 1) {
                        appendToConsole('Error: Too many arguments. Usage: font get', 'error');
                        return;
                    }
                    const currentFont = getFont();
                    appendToConsole(`Current font: ${currentFont}`);
                })
                .with('set', () => {
                    if (args.length < 2) {
                        appendToConsole('Error: Missing font name. Usage: font set <font-name>', 'error');
                        return;
                    }
                    const fontName = args.slice(1).join(' ');
                    modifyFontStyle('family', fontName);
                    appendToConsole(`Font set to ${fontName}`);
                })
                .with('list', () => {
                    if (args.length > 1) {
                        appendToConsole('Error: Too many arguments. Usage: font list', 'error');
                        return;
                    }
                    const fontList = getFontList();
                    appendToConsole(`Available fonts:\n${fontList.join('\n')}`);
                })
                .otherwise(() => {
                    appendToConsole(`Unknown subcommand: ${args[0]}. Usage: ${commands.find(cmd => cmd.name === 'font')?.usage}`, 'error');
                });
        }
    },
    {
        name: 'version',
        description: 'Display the current version of the application',
        usage: 'version',
        maxArgs: 0,
        aliases: ['ver', 'vers'],
        execute: () => {
            appendToConsole(`Version: ${versionNumberString}`);
        }
    }
];

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
    let args: string[] = [];
    
    try {
        // Simple parsing approach that handles quotes
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        let match;
        
        while ((match = regex.exec(input)) !== null) {
            // If the capture group for quotes is undefined, then it's a regular word
            if (match[1] || match[2]) {
                args.push(match[1] || match[2]);
            } else {
                args.push(match[0]);
            }
        }
    } catch (e) {
        // Fallback to simple splitting if regex fails
        console.error('Error parsing command:', e);
        args = input.split(' ');
    }
    
    if (args.length === 0) {
        devcon.input.value = '';
        return;
    }
    
    const commandName = args[0].toLowerCase();
    const commandArgs = args.slice(1);
    
    // Find command by name or alias
    const command = commands.find(cmd => 
        cmd.name === commandName || 
        (cmd.aliases && cmd.aliases.includes(commandName))
    );
    
    if (command) {
        try {
            // Validate argument count
            if (command.minArgs !== undefined && commandArgs.length < command.minArgs) {
                appendToConsole(`Error: Too few arguments. Usage: ${command.usage}`, 'error');
                devcon.input.value = '';
                return;
            }
            
            if (command.maxArgs !== undefined && command.maxArgs !== null && commandArgs.length > command.maxArgs) {
                appendToConsole(`Error: Too many arguments. Usage: ${command.usage}`, 'error');
                devcon.input.value = '';
                return;
            }
            
            // Execute the command if validation passes
            command.execute(commandArgs);
        } catch (error) {
            appendToConsole(`Error executing command: ${error}`, 'error');
        }
    } else {
        appendToConsole(`Unknown command: ${commandName}. Type "help" for available commands.`, 'error');
    }
    
    // Clear input
    devcon.input.value = '';
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
    
    switch (type) {
    case 'command':
        entry.style.color = '#0066cc';
        break;
    case 'error':
        entry.style.color = '#cc0000';
        break;
    default:
        // Use default text color
        break;
    }
    
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
