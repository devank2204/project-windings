

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
        this.searchTimeout = null;
        this.toastTimeout = null;
        this.elements = {};
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        try {
            
            this.cacheElements();
            this.initializeTheme();
            this.attachEventListeners();
            
            // Initialize secondary features
            setTimeout(() => {
                this.populateSymbolGrid();
                this.setupAccessibility();
                this.initializeLucideIcons();
            }, 100);
            
        } catch (error) {
            console.error('Failed to initialize WingTranslate:', error);
            this.showToast('Application failed to initialize', 'error');
        }
    }

    initializeLucideIcons() {
        try {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('⚠️ Lucide icons failed to initialize:', error);
        }
    }

    cacheElements() {
        const getElementById = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Element with id '${id}' not found`);
            }
            return element;
        };

        const querySelectorAll = (selector) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`No elements found for selector '${selector}'`);
            }
            return elements;
        };

        this.elements = {
            // Theme
            themeToggle: getElementById('theme-toggle'),
            
            // Input/Output
            textInput: getElementById('text-input'),
            outputDisplay: getElementById('output-display'),
            charCount: getElementById('char-count'),
            outputStatus: getElementById('output-status'),
            
            // Controls
            modeButtons: querySelectorAll('.mode-btn'),
            clearBtn: getElementById('clear-btn'),
            copyBtn: getElementById('copy-btn'),
            downloadPngBtn: getElementById('download-png-btn'),
            downloadSvgBtn: getElementById('download-svg-btn'),
            
            // Symbol Reference
            symbolGrid: getElementById('symbol-grid'),
            symbolSearch: getElementById('symbol-search'),
            searchClear: getElementById('search-clear'),
            filterButtons: querySelectorAll('.filter-btn'),
            
            // Notifications
            toast: getElementById('toast'),
            loading: getElementById('loading')
        };

    }

    initializeTheme() {
        try {
            const savedTheme = localStorage.getItem('wingTranslate-theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            this.setTheme(initialTheme, false);
            
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('wingTranslate-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
            
        } catch (error) {
            console.error('Theme initialization failed:', error);
        }
    }

    setTheme(theme, animate = true) {
        try {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            
            if (currentTheme === theme) return;
            
            if (animate) {
                root.style.transition = 'background-color 250ms ease, color 250ms ease';
            }
            
            root.setAttribute('data-theme', theme);
            localStorage.setItem('wingTranslate-theme', theme);
            
            
            if (animate) {
                setTimeout(() => {
                    root.style.transition = '';
                }, 250);
            }
            
            setTimeout(() => this.initializeLucideIcons(), 50);
            
        } catch (error) {
            console.error('Theme setting failed:', error);
        }
    }

    attachEventListeners() {
        try {
            // Theme toggle
            if (this.elements.themeToggle) {
                this.elements.themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    this.setTheme(newTheme);
                    this.showToast(`Switched to ${newTheme} mode`, 'success');
                });
            }

            // Input handling
            if (this.elements.textInput) {
                this.elements.textInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    this.debouncedTranslate(value);
                    this.updateCharCount(value.length);
                });

                this.elements.textInput.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        const value = e.target.value;
                        this.debouncedTranslate(value);
                        this.updateCharCount(value.length);
                    }, 10);
                });
            }

            // Mode switching
            if (this.elements.modeButtons && this.elements.modeButtons.length > 0) {
                this.elements.modeButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const mode = e.currentTarget.dataset.mode;
                        if (mode) {
                            this.switchMode(mode);
                        }
                    });
                });
            }

            // Action buttons
            if (this.elements.clearBtn) {
                this.elements.clearBtn.addEventListener('click', () => this.clearInput());
            }
            if (this.elements.copyBtn) {
                this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
            }
            if (this.elements.downloadPngBtn) {
                this.elements.downloadPngBtn.addEventListener('click', () => this.downloadPNG());
            }
            if (this.elements.downloadSvgBtn) {
                this.elements.downloadSvgBtn.addEventListener('click', () => this.downloadSVG());
            }

            // Symbol search - Fixed implementation
            if (this.elements.symbolSearch) {
                this.elements.symbolSearch.addEventListener('input', (e) => {
                    const query = e.target.value;
                    this.debouncedSearch(query);
                    
                    // Show/hide clear button based on input
                    if (this.elements.searchClear) {
                        this.elements.searchClear.style.opacity = query ? '1' : '0';
                        this.elements.searchClear.style.pointerEvents = query ? 'auto' : 'none';
                    }
                });
            }

            if (this.elements.searchClear) {
                this.elements.searchClear.addEventListener('click', () => {
                    if (this.elements.symbolSearch) {
                        this.elements.symbolSearch.value = '';
                        this.searchSymbols('');
                        this.elements.searchClear.style.opacity = '0';
                        this.elements.searchClear.style.pointerEvents = 'none';
                    }
                });
            }

            // Filter buttons
            if (this.elements.filterButtons && this.elements.filterButtons.length > 0) {
                this.elements.filterButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const filter = e.currentTarget.dataset.filter;
                        if (filter) {
                            this.filterSymbols(filter);
                        }
                    });
                });
            }

            // Global keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                if (e.ctrlKey || e.metaKey) {
                    switch (e.key) {
                        case 'c':
                            e.preventDefault();
                            this.copyToClipboard();
                            break;
                        case 'd':
                            e.preventDefault();
                            this.downloadPNG();
                            break;
                        case '/':
                            e.preventDefault();
                            if (this.elements.symbolSearch) {
                                this.elements.symbolSearch.focus();
                            }
                            break;
                    }
                }
                
                if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    this.setTheme(newTheme);
                }
                
                if (e.key === 'Escape') {
                    this.hideToast();
                }
            });

            // Toast close button
            const toastClose = this.elements.toast?.querySelector('.toast-close');
            if (toastClose) {
                toastClose.addEventListener('click', () => this.hideToast());
            }

        } catch (error) {
            console.error('Failed to attach event listeners:', error);
        }
    }

    debouncedTranslate(text) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.translateText(text);
        }, 100);
    }

    translateText(inputText) {
        try {
            if (this.isProcessing) return;
            
            const outputElement = this.elements.outputDisplay;
            if (!outputElement) return;
            
            if (!inputText || inputText.trim() === '') {
                outputElement.innerHTML = `
                    <div class="output-placeholder">
                        <i data-lucide="arrow-left" class="placeholder-icon"></i>
                        <span>Your magical symbols will appear here</span>
                    </div>
                `;
                this.toggleActionButtons(false);
                this.initializeLucideIcons();
                return;
            }

            this.isProcessing = true;
            
            let result = '';
            const textToTranslate = this.currentMode === 'gaster' ? inputText.toUpperCase() : inputText;

            for (let i = 0; i < textToTranslate.length; i++) {
                const char = textToTranslate[i];
                result += this.wingdingsMapping[char] || char;
            }

            outputElement.style.opacity = '0.7';
            setTimeout(() => {
                outputElement.textContent = result;
                outputElement.style.opacity = '1';
                this.toggleActionButtons(true);
                this.isProcessing = false;
            }, 50);
            
        } catch (error) {
            console.error('Translation error:', error);
            this.showToast('Translation failed', 'error');
            this.isProcessing = false;
            this.updateOutputStatus('Error');
        }
    }

    switchMode(mode) {
        try {
            if (this.currentMode === mode) return;
            
            this.currentMode = mode;
            
            if (this.elements.modeButtons && this.elements.modeButtons.length > 0) {
                this.elements.modeButtons.forEach(btn => {
                    const isActive = btn.dataset.mode === mode;
                    if (isActive) {
                        btn.classList.add('mode-btn--active');
                        btn.setAttribute('aria-pressed', 'true');
                    } else {
                        btn.classList.remove('mode-btn--active');
                        btn.setAttribute('aria-pressed', 'false');
                    }
                });
            }

            const currentText = this.elements.textInput?.value;
            if (currentText) {
                this.translateText(currentText);
            }
            
            const helpText = document.getElementById('input-help');
            if (helpText) {
                helpText.textContent = mode === 'gaster' 
                    ? 'Gaster mode converts text to uppercase Wingdings (Undertale style)'
                    : 'Type any text to see instant Wingdings conversion';
            }
            
            this.showToast(`Switched to ${mode === 'gaster' ? 'Gaster' : 'Wingdings'} mode`, 'success');
            
        } catch (error) {
            console.error('Mode switch failed:', error);
        }
    }

    updateCharCount(count) {
        try {
            const charCountElement = this.elements.charCount;
            if (!charCountElement) return;
            
            charCountElement.style.transform = 'scale(1.1)';
            charCountElement.textContent = count.toLocaleString();
            
            if (count > 1000) {
                charCountElement.style.color = 'var(--theme-accent-secondary)';
            } else {
                charCountElement.style.color = 'var(--theme-accent-primary)';
            }
            
            setTimeout(() => {
                charCountElement.style.transform = 'scale(1)';
            }, 150);
        } catch (error) {
            console.error('Character count update failed:', error);
        }
    }

    updateOutputStatus(status) {
        try {
            const statusElement = this.elements.outputStatus;
            if (!statusElement) return;
            
            const statusText = statusElement.querySelector('span:last-child');
            if (statusText) {
                statusText.style.opacity = '0';
                setTimeout(() => {
                    statusText.textContent = status;
                    statusText.style.opacity = '1';
                }, 100);
            }
        } catch (error) {
            console.error('Status update failed:', error);
        }
    }

    toggleActionButtons(enabled) {
        try {
            const buttons = [
                this.elements.copyBtn,
                this.elements.downloadPngBtn,
                this.elements.downloadSvgBtn
            ];

            buttons.forEach(btn => {
                if (!btn) return;
                
                btn.disabled = !enabled;
                btn.style.transition = 'all 250ms ease';
                
                if (enabled) {
                    btn.style.opacity = '1';
                    btn.style.transform = 'translateY(0)';
                } else {
                    btn.style.opacity = '0.5';
                    btn.style.transform = 'translateY(2px)';
                }
            });
        } catch (error) {
            console.error('Button toggle failed:', error);
        }
    }

    clearInput() {
        try {
            if (!this.elements.textInput) return;
            
            this.elements.textInput.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.elements.textInput.value = '';
                this.elements.textInput.style.transform = 'scale(1)';
                this.elements.textInput.focus();
                this.translateText('');
                this.updateCharCount(0);
            }, 100);
            
            this.showToast('Input cleared', 'success');
        } catch (error) {
            console.error('Clear input failed:', error);
        }
    }

    async copyToClipboard() {
        try {
            const outputElement = this.elements.outputDisplay;
            const copyBtn = this.elements.copyBtn;
            
            if (!outputElement || !copyBtn) return;
            
            const text = outputElement.textContent;
            if (!text || text.includes('Your magical symbols will appear here')) {
                this.showToast('No text to copy', 'error');
                return;
            }

            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon"></i><span class="btn-text">Copying...</span>';
            copyBtn.disabled = true;
            this.initializeLucideIcons();

            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                await this.fallbackCopy(text);
            }

            copyBtn.classList.add('action-btn--success');
            copyBtn.innerHTML = '<i data-lucide="check" class="btn-icon"></i><span class="btn-text">Copied!</span>';
            this.initializeLucideIcons();

            this.showToast('Copied to clipboard!', 'success');
            
            setTimeout(() => {
                copyBtn.classList.remove('action-btn--success');
                copyBtn.innerHTML = originalHTML;
                copyBtn.disabled = false;
                this.initializeLucideIcons();
            }, 2000);
            
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Copy failed. Please try again.', 'error');
            
            if (this.elements.copyBtn) {
                this.elements.copyBtn.disabled = false;
                this.elements.copyBtn.innerHTML = '<i data-lucide="copy" class="btn-icon"></i><span class="btn-text">Copy</span>';
                this.initializeLucideIcons();
            }
        }
    }

    fallbackCopy(text) {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    resolve();
                } else {
                    reject(new Error('execCommand failed'));
                }
            } catch (error) {
                document.body.removeChild(textArea);
                reject(error);
            }
        });
    }

    async downloadPNG() {
        try {
            const text = this.elements.outputDisplay?.textContent;
            if (!text || text.includes('Your magical symbols will appear here')) {
                this.showToast('No text to download', 'error');
                return;
            }

            this.showLoading(true);
            
            await new Promise(resolve => setTimeout(resolve, 200));
            await this.generatePNGDownload(text);
            this.showToast('PNG downloaded successfully!', 'success');
        } catch (error) {
            console.error('PNG download failed:', error);
            this.showToast('PNG download failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    generatePNGDownload(text) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = 800;
                canvas.height = 300;
                
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const bgColor = isDark ? '#1e293b' : '#ffffff';
                const textColor = isDark ? '#f8fafc' : '#0f172a';
                
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = textColor;
                ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';
                
                words.forEach(word => {
                    const testLine = currentLine + word + ' ';
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > 750 && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = word + ' ';
                    } else {
                        currentLine = testLine;
                    }
                });
                lines.push(currentLine);
                
                const lineHeight = 30;
                const startY = (canvas.height - (lines.length * lineHeight)) / 2;
                
                lines.forEach((line, index) => {
                    ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
                });
                
                canvas.toBlob(blob => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }
                    
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wingdings-${this.currentMode}-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    resolve();
                }, 'image/png', 0.95);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    async downloadSVG() {
        try {
            const text = this.elements.outputDisplay?.textContent;
            if (!text || text.includes('Your magical symbols will appear here')) {
                this.showToast('No text to download', 'error');
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
            
            this.showToast('SVG downloaded successfully!', 'success');
        } catch (error) {
            console.error('SVG download failed:', error);
            this.showToast('SVG download failed', 'error');
        }
    }

    generateSVGContent(text) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const bgColor = isDark ? '#1e293b' : '#ffffff';
        const textColor = isDark ? '#f8fafc' : '#0f172a';
        
        return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <text x="400" y="150" text-anchor="middle" dominant-baseline="middle" 
                  font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" 
                  font-size="24" fill="${textColor}">
                ${this.escapeXML(text)}
            </text>
        </svg>`;
    }

    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    populateSymbolGrid() {
        try {
            const grid = this.elements.symbolGrid;
            if (!grid) return;
            
            grid.innerHTML = '';

            Object.entries(this.wingdingsMapping).forEach(([char, symbol]) => {
                if (char === ' ') return;

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

                const handleClick = async (e) => {
                    e.preventDefault();
                    await this.copySymbol(symbol, char);
                };

                item.addEventListener('click', handleClick);
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleClick(e);
                    }
                });

                grid.appendChild(item);
            });
            
        } catch (error) {
            console.error('Symbol grid population failed:', error);
        }
    }

    getCategoryForChar(char) {
        if (/[A-Za-z]/.test(char)) return 'letters';
        if (/[0-9]/.test(char)) return 'numbers';
        return 'symbols';
    }

    async copySymbol(symbol, char) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(symbol);
            } else {
                await this.fallbackCopy(symbol);
            }
            this.showToast(`Copied: ${char} → ${symbol}`, 'success');
        } catch (error) {
            console.error('Symbol copy failed:', error);
            this.showToast('Copy failed', 'error');
        }
    }

    // Fixed search with better implementation
    debouncedSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchSymbols(query);
        }, 150);
    }

    searchSymbols(query) {
        try {
            const items = this.elements.symbolGrid?.querySelectorAll('.symbol-item');
            if (!items || items.length === 0) {
                console.warn('No symbol items found to search');
                return;
            }
            
            const searchTerm = query.toLowerCase().trim();
            let visibleCount = 0;

            items.forEach((item, index) => {
                const char = item.dataset.char ? item.dataset.char.toLowerCase() : '';
                const symbol = item.dataset.symbol || '';
                
                // More comprehensive search logic
                const matches = searchTerm === '' || 
                               char === searchTerm ||
                               char.includes(searchTerm) ||
                               symbol === searchTerm ||
                               symbol.includes(searchTerm);
                
                if (matches) {
                    item.style.display = 'flex';
                    item.style.order = searchTerm && char === searchTerm ? '-1' : index.toString();
                    visibleCount++;
                    
                    // Highlight exact matches
                    if (searchTerm && char === searchTerm) {
                        item.style.background = 'var(--theme-accent-primary)';
                        item.style.color = 'white';
                        
                        // Remove highlight after a delay
                        setTimeout(() => {
                            item.style.background = '';
                            item.style.color = '';
                        }, 2000);
                    }
                } else {
                    item.style.display = 'none';
                    item.style.order = '';
                }
            });
            
            // Show feedback if no results
            if (visibleCount === 0 && searchTerm) {
                this.showToast(`No symbols found for "${query}"`, 'error');
            }
            
        } catch (error) {
            console.error('Search failed:', error);
            this.showToast('Search failed', 'error');
        }
    }

    filterSymbols(category) {
        try {
            if (this.elements.filterButtons && this.elements.filterButtons.length > 0) {
                this.elements.filterButtons.forEach(btn => {
                    const isActive = btn.dataset.filter === category;
                    if (isActive) {
                        btn.classList.add('filter-btn--active');
                    } else {
                        btn.classList.remove('filter-btn--active');
                    }
                });
            }

            const items = this.elements.symbolGrid?.querySelectorAll('.symbol-item');
            if (!items || items.length === 0) return;
            
            let visibleCount = 0;

            items.forEach(item => {
                const itemCategory = item.dataset.category;
                const showItem = category === 'all' || itemCategory === category;
                
                if (showItem) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Filter failed:', error);
        }
    }

    showToast(message, type = 'success', duration = 3000) {
        try {
            const toast = this.elements.toast;
            if (!toast) return;
            
            const toastIcon = toast.querySelector('.toast-icon');
            const toastText = toast.querySelector('.toast-text');
            
            if (toastIcon) {
                const iconName = type === 'error' ? 'alert-circle' : 'check-circle';
                toastIcon.setAttribute('data-lucide', iconName);
            }
            
            if (toastText) {
                toastText.textContent = message;
            }
            
            toast.className = `toast ${type}`;
            toast.offsetHeight; // Force reflow
            toast.classList.add('show');
            
            this.initializeLucideIcons();
            
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                this.hideToast();
            }, duration);
            
        } catch (error) {
            console.error('Toast display failed:', error);
        }
    }

    hideToast() {
        try {
            const toast = this.elements.toast;
            if (toast) {
                toast.classList.remove('show');
            }
            clearTimeout(this.toastTimeout);
        } catch (error) {
            console.error('Toast hide failed:', error);
        }
    }

    showLoading(show) {
        try {
            const loading = this.elements.loading;
            if (!loading) return;
            
            if (show) {
                loading.classList.remove('hidden');
                this.initializeLucideIcons();
            } else {
                loading.classList.add('hidden');
            }
        } catch (error) {
            console.error('Loading display failed:', error);
        }
    }

    setupAccessibility() {
        try {
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.id = 'announcer';
            document.body.appendChild(announcer);
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideToast();
                    
                    if (document.activeElement && document.activeElement.blur) {
                        document.activeElement.blur();
                    }
                }
                
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
            
        } catch (error) {
            console.error('Accessibility setup failed:', error);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    
    try {
        window.wingTranslator = new WingdingsTranslator();
        
        // Add CSS for keyboard navigation and fixed animations
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--theme-accent-primary) !important;
                outline-offset: 2px !important;
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Remove any unintended ripple effects */
            .ripple {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WingdingsTranslator;
}