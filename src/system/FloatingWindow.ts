import { generateId, logConsole } from '../utils/dom-utils';
import { menu } from '../utils/dom-elements';

interface FloatingWindowTab {
    id: string;
    label: string;
    content: HTMLElement | string;
    active?: boolean;
}

interface FloatingWindowOptions {
    title: string;
    tabs?: FloatingWindowTab[];
    content?: HTMLElement | string;
    width?: string;
    height?: string;
    position?: { x?: number; y?: number };
    resizable?: boolean;
    closable?: boolean;
    minimizable?: boolean;
    className?: string;
    groupName?: string;
    maxWindows?: number;
    closeAction?: 'hide' | 'destroy';
}

interface WindowGroup {
    name: string;
    maxWindows: number;
    activeWindows: Set<string>;
}

export class FloatingWindow {
    private static windowGroups: Map<string, WindowGroup> = new Map();
    
    private container: HTMLDivElement;
    private card: HTMLDivElement;
    private header: HTMLDivElement;
    private titleElement: HTMLSpanElement;
    private cardBody: HTMLDivElement;
    private tabsNav: HTMLUListElement;
    private tabsContent: HTMLDivElement;
    private contentContainer: HTMLDivElement;
    private closeButton: HTMLButtonElement;
    private minimizeButton: HTMLButtonElement;
    private windowId: string;
    private groupName: string | null = null;
    private isMinimized: boolean = false;
    private originalHeight: string = '';
    private tabs: Map<string, FloatingWindowTab> = new Map();
    private activeTabId: string | null = null;
    private isValid: boolean = true;

    constructor(options: FloatingWindowOptions) {
        this.windowId = generateId('floating-window');
        
        // Handle group management
        if (options.groupName) {
            if (!this.canCreateWindow(options.groupName, options.maxWindows || 1)) {
                const group = FloatingWindow.windowGroups.get(options.groupName);
                const maxAllowed = group?.maxWindows || options.maxWindows || 1;
                const currentCount = group?.activeWindows.size || 0;
                
                logConsole(`Cannot create window: Group "${options.groupName}" has reached maximum limit (${currentCount}/${maxAllowed})`, 'warning');
                this.isValid = false;
                return; // Exit early without creating the window
            }
            
            this.groupName = options.groupName;
            this.registerWindow(options.groupName, options.maxWindows || 1);
        }
        
        this.createWindow(options);
        this.setupDragFunctionality(options.position);
        this.setupTabs(options.tabs);
        this.setContent(options.content);
        
        logConsole(`Floating window created with ID: ${this.windowId}${this.groupName ? ` (group: ${this.groupName})` : ''}`, 'debug');
    }

    public isValidWindow(): boolean {
        return this.isValid;
    }

    private canCreateWindow(groupName: string, maxWindows: number): boolean {
        const group = FloatingWindow.windowGroups.get(groupName);
        
        if (!group) {
            return true; // No group exists yet, so we can create it
        }
        
        return group.activeWindows.size < group.maxWindows;
    }

    private registerWindow(groupName: string, maxWindows: number): void {
        let group = FloatingWindow.windowGroups.get(groupName);
        
        if (!group) {
            group = {
                name: groupName,
                maxWindows: maxWindows,
                activeWindows: new Set()
            };
            FloatingWindow.windowGroups.set(groupName, group);
            logConsole(`Created new window group: ${groupName} (max: ${maxWindows})`, 'debug');
        }
        
        group.activeWindows.add(this.windowId);
        logConsole(`Registered window ${this.windowId} to group ${groupName} (${group.activeWindows.size}/${group.maxWindows})`, 'debug');
    }

    private unregisterWindow(): void {
        if (!this.groupName) return;
        
        const group = FloatingWindow.windowGroups.get(this.groupName);
        if (group) {
            group.activeWindows.delete(this.windowId);
            logConsole(`Unregistered window ${this.windowId} from group ${this.groupName} (${group.activeWindows.size}/${group.maxWindows})`, 'debug');
            
            // Clean up empty groups
            if (group.activeWindows.size === 0) {
                FloatingWindow.windowGroups.delete(this.groupName);
                logConsole(`Removed empty window group: ${this.groupName}`, 'debug');
            }
        }
    }

    // Static methods for group management
    public static getGroupInfo(groupName: string): { current: number; max: number; canCreate: boolean } | null {
        const group = FloatingWindow.windowGroups.get(groupName);
        if (!group) {
            return null;
        }
        
        return {
            current: group.activeWindows.size,
            max: group.maxWindows,
            canCreate: group.activeWindows.size < group.maxWindows
        };
    }

    public static getAllGroups(): Array<{ name: string; current: number; max: number; canCreate: boolean }> {
        return Array.from(FloatingWindow.windowGroups.entries()).map(([name, group]) => ({
            name,
            current: group.activeWindows.size,
            max: group.maxWindows,
            canCreate: group.activeWindows.size < group.maxWindows
        }));
    }

    public static closeAllInGroup(groupName: string): number {
        const group = FloatingWindow.windowGroups.get(groupName);
        if (!group) {
            logConsole(`No group found with name: ${groupName}`, 'warning');
            return 0;
        }

        const windowIds = Array.from(group.activeWindows);
        let closedCount = 0;

        windowIds.forEach(windowId => {
            const windowElement = document.getElementById(windowId);
            if (windowElement) {
                // Find the FloatingWindow instance and call destroy
                // This is a bit tricky since we don't have a direct reference
                // We'll trigger a close event that the window can listen for
                const closeEvent = new CustomEvent('forceClose');
                windowElement.dispatchEvent(closeEvent);
                closedCount++;
            }
        });

        logConsole(`Closed ${closedCount} windows in group: ${groupName}`, 'info');
        return closedCount;
    }

    private setDisplayClass(element: HTMLElement, displayClass: 'd-none' | 'd-block' | 'd-flex'): void {
        // Remove all display classes
        element.classList.remove('d-none', 'd-block', 'd-flex', 'd-inline', 'd-inline-block');
        // Add the desired display class
        element.classList.add(displayClass);
    }

    private hideElement(element: HTMLElement): void {
        this.setDisplayClass(element, 'd-none');
    }

    private showElementBlock(element: HTMLElement): void {
        this.setDisplayClass(element, 'd-block');
    }

    private showElementFlex(element: HTMLElement): void {
        this.setDisplayClass(element, 'd-flex');
    }

    private createWindow(options: FloatingWindowOptions): void {
        // Create main container
        this.container = document.createElement('div');
        this.container.id = this.windowId;
        this.container.className = `floating-window d-none ${options.className || ''}`;
        this.container.dataset.bsTheme = menu.container.dataset.bsTheme;
        
        // Add group name as data attribute for easier identification
        if (this.groupName) {
            this.container.dataset.groupName = this.groupName;
        }
        
        // Apply positioning and sizing
        Object.assign(this.container.style, {
            position: 'fixed',
            width: options.width || '400px',
            height: options.height || '300px',
            zIndex: '10' // Same as dev console
        });

        // Set initial position
        if (options.position) {
            if (options.position.x !== undefined) {
                this.container.style.left = `${options.position.x}px`;
            }
            if (options.position.y !== undefined) {
                this.container.style.top = `${options.position.y}px`;
            }
        } else {
            // Center the window
            this.container.style.left = '50%';
            this.container.style.top = '50%';
            this.container.style.transform = 'translate(-50%, -50%)';
        }

        // Create Bootstrap card
        this.card = document.createElement('div');
        this.card.className = 'card h-100';

        // Create card header (draggable)
        this.header = document.createElement('div');
        this.header.className = 'card-header d-flex justify-content-between align-items-center';
        this.header.style.cursor = 'grab';
        this.header.style.userSelect = 'none';

        // Create title
        this.titleElement = document.createElement('span');
        this.titleElement.textContent = options.title;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex gap-1';

        // Create minimize button
        if (options.minimizable !== false) {
            this.minimizeButton = document.createElement('button');
            this.minimizeButton.type = 'button';
            this.minimizeButton.className = 'btn btn-sm btn-outline-secondary';
            this.minimizeButton.innerHTML = '−';
            this.minimizeButton.style.lineHeight = '1';
            this.minimizeButton.addEventListener('click', () => this.toggleMinimize());
            buttonContainer.appendChild(this.minimizeButton);
        }

        // Create close button (Bootstrap style)
        if (options.closable !== false) {
            this.closeButton = document.createElement('button');
            this.closeButton.type = 'button';
            this.closeButton.className = 'btn-close';
            this.closeButton.setAttribute('aria-label', 'Close');
            this.closeButton.addEventListener('click', () => {
                const closeAction = options.closeAction || 'hide';
                if (closeAction === 'destroy') {
                    this.destroy();
                } else {
                    this.hide();
                }
            });
            buttonContainer.appendChild(this.closeButton);
        }

        // Assemble header
        this.header.appendChild(this.titleElement);
        this.header.appendChild(buttonContainer);

        // Create card body
        this.cardBody = document.createElement('div');
        this.cardBody.className = 'card-body d-flex flex-column';
        this.cardBody.style.overflow = 'hidden';

        // Create tabs navigation (initially hidden)
        this.tabsNav = document.createElement('ul');
        this.tabsNav.className = 'nav nav-tabs mb-3 d-none';
        this.tabsNav.setAttribute('role', 'tablist');

        // Create tabs content container
        this.tabsContent = document.createElement('div');
        this.tabsContent.className = 'tab-content flex-grow-1 d-none';
        this.tabsContent.style.overflow = 'auto';

        // Create simple content container (for non-tabbed content)
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'flex-grow-1 d-block';
        this.contentContainer.style.overflow = 'auto';

        // Assemble card body
        this.cardBody.appendChild(this.tabsNav);
        this.cardBody.appendChild(this.tabsContent);
        this.cardBody.appendChild(this.contentContainer);

        // Assemble card
        this.card.appendChild(this.header);
        this.card.appendChild(this.cardBody);

        // Assemble container
        this.container.appendChild(this.card);

        // Add to document
        document.body.appendChild(this.container);

        // Listen for force close events
        this.container.addEventListener('forceClose', () => {
            this.destroy();
        });

        // Make resizable if requested
        if (options.resizable) {
            this.makeResizable();
        }
    }

    private setupDragFunctionality(position?: { x?: number; y?: number }): void {
        this.header.addEventListener('mousedown', (e) => {
            if (e.target === this.closeButton || e.target === this.minimizeButton) return;
            
            this.header.style.cursor = 'grabbing';
            
            // Use getBoundingClientRect to get the actual visual position
            // This handles cases where the window is positioned with transforms
            const containerRect = this.container.getBoundingClientRect();
            const startX = e.clientX - containerRect.left;
            const startY = e.clientY - containerRect.top;

            const onMouseMove = (e: MouseEvent) => {
                const posX = e.clientX - startX;
                const posY = e.clientY - startY;

                // Get container dimensions for bounds checking
                const containerRect = this.container.getBoundingClientRect();
        
                // Constrain to viewport bounds
                const clampedX = Math.max(0, Math.min(posX, window.innerWidth - containerRect.width));
                const clampedY = Math.max(0, Math.min(posY, window.innerHeight - containerRect.height));

                // Clear any transform and set absolute position
                this.container.style.left = `${clampedX}px`;
                this.container.style.top = `${clampedY}px`;
                this.container.style.transform = 'none';
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                this.header.style.cursor = 'grab';
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Double click to reset position
        this.header.addEventListener('dblclick', () => {
            this.resetPosition(position);
        });
    }

    private setupTabs(tabs?: FloatingWindowTab[]): void {
        if (!tabs || tabs.length === 0) return;

        // Show tabs navigation and content
        this.showElementFlex(this.tabsNav);
        this.showElementBlock(this.tabsContent);
        this.hideElement(this.contentContainer);

        // Clear existing tabs
        this.tabsNav.innerHTML = '';
        this.tabsContent.innerHTML = '';
        this.tabs.clear();

        tabs.forEach((tab, index) => {
            // Store tab
            this.tabs.set(tab.id, tab);
            
            // Create tab navigation item
            const tabItem = document.createElement('li');
            tabItem.className = 'nav-item';
            tabItem.setAttribute('role', 'presentation');

            const tabButton = document.createElement('button');
            tabButton.className = `nav-link ${tab.active || index === 0 ? 'active' : ''}`;
            tabButton.id = `${tab.id}-tab`;
            tabButton.setAttribute('data-bs-toggle', 'tab');
            tabButton.setAttribute('data-bs-target', `#${tab.id}-tab-pane`);
            tabButton.setAttribute('type', 'button');
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', `${tab.id}-tab-pane`);
            tabButton.setAttribute('aria-selected', (tab.active || index === 0) ? 'true' : 'false');
            tabButton.textContent = tab.label;

            tabItem.appendChild(tabButton);
            this.tabsNav.appendChild(tabItem);

            // Create tab content pane
            const tabPane = document.createElement('div');
            tabPane.className = `tab-pane fade ${tab.active || index === 0 ? 'show active' : ''}`;
            tabPane.id = `${tab.id}-tab-pane`;
            tabPane.setAttribute('role', 'tabpanel');
            tabPane.setAttribute('aria-labelledby', `${tab.id}-tab`);
            tabPane.setAttribute('tabindex', '0');
            tabPane.style.height = '100%';
            tabPane.style.overflow = 'auto';

            // Set tab content
            if (typeof tab.content === 'string') {
                tabPane.innerHTML = tab.content;
            } else {
                tabPane.appendChild(tab.content);
            }

            this.tabsContent.appendChild(tabPane);

            // Set active tab
            if (tab.active || (index === 0 && !this.activeTabId)) {
                this.activeTabId = tab.id;
            }
        });

        // Initialize Bootstrap tabs
        this.initializeBootstrapTabs();
    }

    private initializeBootstrapTabs(): void {
        // Initialize Bootstrap tab functionality
        const tabButtons = this.tabsNav.querySelectorAll('[data-bs-toggle="tab"]');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.getAttribute('data-bs-target');
                if (target) {
                    this.activateTab(target.substring(1).replace('-tab-pane', ''));
                }
            });
        });
    }

    private activateTab(tabId: string): void {
        // Update active tab
        this.activeTabId = tabId;

        // Update tab buttons
        const tabButtons = this.tabsNav.querySelectorAll('.nav-link');
        tabButtons.forEach(button => {
            if (button.id === `${tabId}-tab`) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        });

        // Update tab panes
        const tabPanes = this.tabsContent.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            if (pane.id === `${tabId}-tab-pane`) {
                pane.classList.add('show', 'active');
            } else {
                pane.classList.remove('show', 'active');
            }
        });

        logConsole(`Switched to tab: ${tabId} in window ${this.windowId}`, 'debug');
    }

    private makeResizable(): void {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'floating-window-resize-handle';
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '20px',
            height: '20px',
            cursor: 'se-resize',
            background: 'linear-gradient(-45deg, transparent 0%, transparent 40%, var(--bs-border-color) 40%, var(--bs-border-color) 60%, transparent 60%)',
            zIndex: '1'
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(getComputedStyle(this.container).width, 10);
            const startHeight = parseInt(getComputedStyle(this.container).height, 10);

            const onMouseMove = (e: MouseEvent) => {
                const newWidth = startWidth + e.clientX - startX;
                const newHeight = startHeight + e.clientY - startY;
                
                this.container.style.width = `${Math.max(200, newWidth)}px`;
                this.container.style.height = `${Math.max(150, newHeight)}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        this.container.appendChild(resizeHandle);
    }

    public switchTab(tabId: string): void {
        if (!this.isValid || !this.tabs.has(tabId)) return;
        this.activateTab(tabId);
    }

    public setContent(content?: HTMLElement | string): void {
        if (!this.isValid || !content) return;

        // If we have tabs, don't use the simple content container
        if (this.tabs.size > 0) return;

        this.contentContainer.innerHTML = '';
        
        if (typeof content === 'string') {
            this.contentContainer.innerHTML = content;
        } else {
            this.contentContainer.appendChild(content);
        }
    }

    public addTab(tab: FloatingWindowTab): void {
        if (!this.isValid) return;
        
        this.tabs.set(tab.id, tab);
        
        // Rebuild tabs to include the new one
        const tabsArray = Array.from(this.tabs.values());
        this.setupTabs(tabsArray);
    }

    public removeTab(tabId: string): void {
        if (!this.isValid) return;
        
        this.tabs.delete(tabId);
        
        // If no tabs left, show simple content container
        if (this.tabs.size === 0) {
            this.hideElement(this.tabsNav);
            this.hideElement(this.tabsContent);
            this.showElementBlock(this.contentContainer);
            return;
        }

        // If active tab was removed, switch to first available
        if (this.activeTabId === tabId) {
            const firstTab = this.tabs.values().next().value;
            this.activeTabId = firstTab?.id || null;
        }

        // Rebuild tabs
        const tabsArray = Array.from(this.tabs.values());
        this.setupTabs(tabsArray);
    }

    public setTitle(title: string): void {
        if (!this.isValid) return;
        this.titleElement.textContent = title;
    }

    public show(): void {
        if (!this.isValid) return;
        this.showElementBlock(this.container);
        logConsole(`Floating window ${this.windowId} shown`, 'debug');
    }

    public hide(): void {
        if (!this.isValid) return;
        this.hideElement(this.container);
        logConsole(`Floating window ${this.windowId} hidden`, 'debug');
    }

    public toggle(): void {
        if (!this.isValid) return;
        if (this.container.classList.contains('d-none')) {
            this.show();
        } else {
            this.hide();
        }
    }

    public toggleMinimize(): void {
        if (!this.isValid) return;
        
        if (this.isMinimized) {
            // Restore
            this.container.style.height = this.originalHeight;
            this.showElementFlex(this.cardBody);
            
            // Restore tabs visibility based on whether we have tabs
            if (this.tabs.size > 0) {
                this.showElementFlex(this.tabsNav);
                this.showElementBlock(this.tabsContent);
                this.hideElement(this.contentContainer);
            } else {
                this.hideElement(this.tabsNav);
                this.hideElement(this.tabsContent);
                this.showElementBlock(this.contentContainer);
            }
            
            this.minimizeButton.innerHTML = '−';
            this.isMinimized = false;
            logConsole(`Floating window ${this.windowId} restored`, 'debug');
        } else {
            // Minimize
            this.originalHeight = this.container.style.height;
            this.container.style.height = 'auto';
            this.hideElement(this.cardBody);
            
            this.minimizeButton.innerHTML = '□';
            this.isMinimized = true;
            logConsole(`Floating window ${this.windowId} minimized`, 'debug');
        }
    }

    public resetPosition(position?: { x?: number; y?: number }): void {
        if (!this.isValid) return;
        if (position) {
            if (position.x !== undefined) {
                this.container.style.left = `${position.x}px`;
            }
            if (position.y !== undefined) {
                this.container.style.top = `${position.y}px`;
            }
        } else {
            // Center the window
            this.container.style.left = '50%';
            this.container.style.top = '50%';
            this.container.style.transform = 'translate(-50%, -50%)';
        }
        
        logConsole(`Floating window ${this.windowId} position reset`, 'debug');
    }

    public destroy(): void {
        if (!this.isValid) return;
        this.unregisterWindow();
        this.container.remove();
        logConsole(`Floating window ${this.windowId} destroyed${this.groupName ? ` (group: ${this.groupName})` : ''}`, 'debug');
    }

    public getElement(): HTMLDivElement | null {
        return this.isValid ? this.container : null;
    }

    public getId(): string {
        return this.windowId;
    }

    public getGroupName(): string | null {
        return this.groupName;
    }
}

// Utility function for quick window creation
export function createFloatingWindow(options: FloatingWindowOptions): FloatingWindow {
    return new FloatingWindow(options);
}

// Utility function to safely create a window with group limits
export function tryCreateFloatingWindow(options: FloatingWindowOptions): FloatingWindow | null {
    const window = new FloatingWindow(options);
    return window.isValidWindow() ? window : null;
}