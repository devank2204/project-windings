// Wingdings Translator Application
// Optimized for Core Web Vitals and SEO best practices 2025

class WingdingsTranslator {
    constructor() {
        // Wingdings mapping data
        this.wingdingsMapping = {
            " ": " ",
            "!": "🖉",
            "\"": "✂",
            "#": "✁",
            "$": "👓",
            "%": "🕭",
            "&": "🕮",
            "'": "🕯",
            "(": "🕿",
            ")": "✆",
            "*": "🖂",
            "+": "🖃",
            ",": "📪",
            "-": "📫",
            ".": "📬",
            "/": "📭",
            "0": "📁",
            "1": "📂",
            "2": "📄",
            "3": "🗏",
            "4": "🗐",
            "5": "🗄",
            "6": "⌛",
            "7": "🖮",
            "8": "🖰",
            "9": "🖲",
            ":": "🖳",
            ";": "🖴",
            "<": "🖫",
            "=": "🖬",
            ">": "✇",
            "?": "✍",
            "@": "🖎",
            "A": "✌",
            "B": "👌",
            "C": "👍",
            "D": "👎",
            "E": "☜",
            "F": "☞",
            "G": "☝",
            "H": "☟",
            "I": "🖐",
            "J": "☺",
            "K": "😐",
            "L": "☹",
            "M": "💣",
            "N": "☠",
            "O": "🏳",
            "P": "🏱",
            "Q": "✈",
            "R": "☼",
            "S": "💧",
            "T": "❄",
            "U": "🕆",
            "V": "✞",
            "W": "🕈",
            "X": "✠",
            "Y": "✡",
            "Z": "☪",
            "[": "☯",
            "\\": "ॐ",
            "]": "☸",
            "^": "♈",
            "_": "♉",
            "`": "♊",
            "a": "♋",
            "b": "♌",
            "c": "♍",
            "d": "♎",
            "e": "♏",
            "f": "♐",
            "g": "♑",
            "h": "♒",
            "i": "♓",
            "j": "🙰",
            "k": "🙵",
            "l": "●",
            "m": "🔾",
            "n": "■",
            "o": "□",
            "p": "🞐",
            "q": "❑",
            "r": "❒",
            "s": "⬧",
            "t": "⧫",
            "u": "◆",
            "v": "❖",
            "w": "⬥",
            "x": "⌧",
            "y": "⮹",
            "z": "⌘"
        };

        this.currentMode = 'wingdings';
        this.debounceTimeout = null;
        this.elements = {};
        
        this.init();
    }

    // Initialize the application
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.populateSymbolGrid();
        this.setupAccessibility();
        
        // Use requestIdleCallback for non-critical initialization
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                this.preloadFeatures();
            });
        }
    }

    // Cache DOM elements for performance
    cacheElements() {
        this.elements = {
            textInput: document.getElementById('text-input'),
            outputDisplay: document.getElementById('output-display'),
            copyBtn: document.getElementById('copy-btn'),
            downloadPngBtn: document.getElementById('download-png-btn'),
            downloadSvgBtn: document.getElementById('download-svg-btn'),
            charCount: document.getElementById('char-count'),
            modeButtons: document.querySelectorAll('.mode-btn'),
            symbolGrid: document.getElementById('symbol-grid'),
            symbolSearch: document.getElementById('symbol-search'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            notification: document.getElementById('notification')
        };
    }

    // Attach event listeners with proper debouncing for INP
    attachEventListeners() {
        // Input handling with debouncing to meet INP < 200ms target
        this.elements.textInput.addEventListener('input', (e) => {
            this.debouncedTranslate(e.target.value);
            this.updateCharCount(e.target.value.length);
        });

        // Mode switching
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });

        // Action buttons
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.downloadPngBtn.addEventListener('click', () => this.downloadPNG());
        this.elements.downloadSvgBtn.addEventListener('click', () => this.downloadSVG());

        // Symbol grid interactions
        this.elements.symbolSearch.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });

        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterSymbols(e.target.dataset.filter);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c' && document.activeElement === this.elements.outputDisplay) {
                    e.preventDefault();
                    this.copyToClipboard();
                }
                if (e.key === 'd' && !e.shiftKey) {
                    e.preventDefault();
                    this.downloadPNG();
                }
            }
        });

        // Notification close
        const notificationClose = document.querySelector('.notification-close');
        if (notificationClose) {
            notificationClose.addEventListener('click', () => {
                this.hideNotification();
            });
        }
    }

    // Debounced translation to optimize for INP
    debouncedTranslate(text) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.translateText(text);
        }, 100); // 100ms debounce for optimal INP performance
    }

    // Main translation function
    translateText(inputText) {
        if (!inputText.trim()) {
            this.elements.outputDisplay.innerHTML = '<span class="placeholder-text">Your converted text will appear here...</span>';
            this.toggleActionButtons(false);
            return;
        }

        let result = '';
        const textToTranslate = this.currentMode === 'gaster' ? inputText.toUpperCase() : inputText;

        for (const char of textToTranslate) {
            result += this.wingdingsMapping[char] || char;
        }

        this.elements.outputDisplay.textContent = result;
        this.toggleActionButtons(true);
        
        // Update ARIA live region for screen readers
        this.elements.outputDisplay.setAttribute('aria-label', `Converted text: ${result}`);
    }

    // Switch between Wingdings and Gaster modes
    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        this.elements.modeButtons.forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });

        // Re-translate current text
        const currentText = this.elements.textInput.value;
        if (currentText) {
            this.translateText(currentText);
        }

        // Update helper text
        const helperText = document.getElementById('input-help');
        if (helperText) {
            helperText.textContent = mode === 'gaster' 
                ? 'Gaster mode converts text to uppercase Wingdings (Undertale style)'
                : 'Type any text to see instant Wingdings conversion';
        }
    }

    // Update character count
    updateCharCount(count) {
        this.elements.charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    // Toggle action buttons based on content
    toggleActionButtons(enabled) {
        [this.elements.copyBtn, this.elements.downloadPngBtn, this.elements.downloadSvgBtn].forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    // Copy to clipboard with fallback
    async copyToClipboard() {
        const text = this.elements.outputDisplay.textContent;
        if (!text || text.includes('Your converted text will appear here')) {
            this.showNotification('No text to copy', 'error');
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                this.showNotification('Copied to clipboard!');
            } else {
                // Fallback for older browsers or non-secure contexts
                this.fallbackCopy(text);
                this.showNotification('Copied to clipboard!');
            }
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Copy failed. Please select and copy manually.', 'error');
        }
    }

    // Fallback copy method
    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Download as PNG
    downloadPNG() {
        const text = this.elements.outputDisplay.textContent;
        if (!text || text.includes('Your converted text will appear here')) {
            this.showNotification('No text to download', 'error');
            return;
        }

        // Use requestIdleCallback for non-blocking download generation
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                this.generatePNGDownload(text);
            });
        } else {
            setTimeout(() => this.generatePNGDownload(text), 0);
        }
    }

    // Generate PNG download
    generatePNGDownload(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size and styling
        canvas.width = 800;
        canvas.height = 200;
        
        // Background
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface') || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text styling
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#000000';
        ctx.font = '24px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw text with word wrapping
        this.drawWrappedText(ctx, text, canvas.width / 2, canvas.height / 2, canvas.width - 40, 30);
        
        // Create download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wingdings-${this.currentMode}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('PNG downloaded successfully!');
        });
    }

    // Download as SVG
    downloadSVG() {
        const text = this.elements.outputDisplay.textContent;
        if (!text || text.includes('Your converted text will appear here')) {
            this.showNotification('No text to download', 'error');
            return;
        }

        const svgContent = this.generateSVGContent(text);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `wingdings-${this.currentMode}-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('SVG downloaded successfully!');
    }

    // Generate SVG content
    generateSVGContent(text) {
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#000000';
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-surface') || '#ffffff';
        
        return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <text x="400" y="100" text-anchor="middle" dominant-baseline="middle" 
                  font-family="Arial, sans-serif" font-size="24" fill="${textColor}">
                ${this.escapeXML(text)}
            </text>
        </svg>`;
    }

    // Escape XML characters
    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Draw wrapped text on canvas
    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testY = y - (Math.ceil(words.length / 10) * lineHeight / 2);

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, testY);
                line = words[n] + ' ';
                testY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, testY);
    }

    // Populate symbol reference grid
    populateSymbolGrid() {
        const grid = this.elements.symbolGrid;
        grid.innerHTML = '';

        Object.entries(this.wingdingsMapping).forEach(([char, symbol]) => {
            if (char === ' ') return; // Skip space character

            const item = document.createElement('div');
            item.className = 'symbol-item';
            item.tabIndex = 0;
            item.role = 'button';
            item.setAttribute('aria-label', `Copy ${char} to ${symbol}`);
            item.dataset.char = char;
            item.dataset.symbol = symbol;
            item.dataset.category = this.getCategoryForChar(char);

            item.innerHTML = `
                <div class="symbol-char">${symbol}</div>
                <div class="symbol-code">${char}</div>
            `;

            // Click to copy individual symbol
            item.addEventListener('click', () => this.copySymbol(symbol, char));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.copySymbol(symbol, char);
                }
            });

            grid.appendChild(item);
        });
    }

    // Get category for character filtering
    getCategoryForChar(char) {
        if (/[A-Za-z]/.test(char)) return 'letters';
        if (/[0-9]/.test(char)) return 'numbers';
        return 'symbols';
    }

    // Copy individual symbol
    async copySymbol(symbol, char) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(symbol);
            } else {
                this.fallbackCopy(symbol);
            }
            this.showNotification(`Copied ${char} → ${symbol}`);
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Copy failed', 'error');
        }
    }

    // Debounced search for symbol grid
    debounceSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchSymbols(query);
        }, 150);
    }

    // Search symbols
    searchSymbols(query) {
        const items = this.elements.symbolGrid.querySelectorAll('.symbol-item');
        const searchTerm = query.toLowerCase().trim();

        items.forEach(item => {
            const char = item.dataset.char.toLowerCase();
            const symbol = item.dataset.symbol;
            const matches = char.includes(searchTerm) || 
                           symbol.includes(searchTerm) || 
                           searchTerm === '';
            
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    // Filter symbols by category
    filterSymbols(category) {
        // Update filter button states
        this.elements.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });

        const items = this.elements.symbolGrid.querySelectorAll('.symbol-item');
        items.forEach(item => {
            const showItem = category === 'all' || item.dataset.category === category;
            item.style.display = showItem ? 'flex' : 'none';
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = this.elements.notification;
        const textElement = notification.querySelector('.notification-text');
        
        textElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 3000);
    }

    // Hide notification
    hideNotification() {
        this.elements.notification.classList.remove('show');
    }

    // Setup accessibility features
    setupAccessibility() {
        // Make output focusable for screen readers
        this.elements.outputDisplay.tabIndex = 0;
        
        // Add live region announcements
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'visually-hidden';
        announcer.id = 'announcer';
        document.body.appendChild(announcer);
        
        // Focus management for modals/notifications
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideNotification();
            }
        });
    }

    // Preload features for better performance
    preloadFeatures() {
        // Preload canvas for faster PNG generation
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Cache computed styles
        this.cachedStyles = {
            textColor: getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
            surfaceColor: getComputedStyle(document.documentElement).getPropertyValue('--color-surface')
        };
    }

    // Public API methods for external use
    translateString(text, mode = 'wingdings') {
        const oldMode = this.currentMode;
        this.currentMode = mode;
        
        let result = '';
        const textToTranslate = mode === 'gaster' ? text.toUpperCase() : text;
        
        for (const char of textToTranslate) {
            result += this.wingdingsMapping[char] || char;
        }
        
        this.currentMode = oldMode;
        return result;
    }

    // Get reverse mapping for translation back
    getReverseMapping() {
        const reverse = {};
        Object.entries(this.wingdingsMapping).forEach(([char, symbol]) => {
            reverse[symbol] = char;
        });
        return reverse;
    }
}

// Performance monitoring for Core Web Vitals
class PerformanceMonitor {
    constructor() {
        this.initializeObservers();
    }

    initializeObservers() {
        // LCP Observer
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // INP Observer (when available)
                const inpObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.log('INP candidate:', entry.processingStart - entry.startTime);
                    }
                });
                
                if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
                    inpObserver.observe({ entryTypes: ['first-input'] });
                }
            } catch (error) {
                console.log('Performance observers not fully supported');
            }
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    window.wingdingsTranslator = new WingdingsTranslator();
    
    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Service worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WingdingsTranslator;
}