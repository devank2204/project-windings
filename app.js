// Enhanced Wingdings Translator - FIXED FUNCTIONALITY
// Fixed: Dark mode toggle and translation functionality

class WingdingsTranslator {
    constructor() {
        // Wingdings mapping data
        this.wingdingsMapping = {
            " ": " ", "!": "🖉", "\"": "✂", "#": "✁", "$": "👓", "%": "🕭", "&": "🕮", "'": "🕯", "(": "🕿", ")": "✆",
            "*": "🖂", "+": "🖃", ",": "📪", "-": "📫", ".": "📬", "/": "📭", "0": "📁", "1": "📂", "2": "📄",
            "3": "🗏", "4": "🗐", "5": "🗄", "6": "⌛", "7": "🖮", "8": "🖰", "9": "🖲", ":": "🖳", ";": "🖴",
            "<": "🖫", "=": "🖬", ">": "✇", "?": "✍", "@": "🖎", "A": "✌", "B": "👌", "C": "👍", "D": "👎",
            "E": "☜", "F": "☞", "G": "☝", "H": "☟", "I": "🖐", "J": "☺", "K": "😐", "L": "☹", "M": "💣",
            "N": "☠", "O": "🏳", "P": "🏱", "Q": "✈", "R": "☼", "S": "💧", "T": "❄", "U": "🕆", "V": "✞",
            "W": "🕈", "X": "✠", "Y": "✡", "Z": "☪", "[": "☯", "\\": "ॐ", "]": "☸", "^": "♈", "_": "♉",
            "`": "♊", "a": "♋", "b": "♌", "c": "♍", "d": "♎", "e": "♏", "f": "♐", "g": "♑", "h": "♒",
            "i": "♓", "j": "🙰", "k": "🙵", "l": "●", "m": "🔾", "n": "■", "o": "□", "p": "🞐", "q": "❑",
            "r": "❒", "s": "⬧", "t": "⧫", "u": "◆", "v": "❖", "w": "⬥", "x": "⌧", "y": "⮹", "z": "⌘"
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
            this.setupNavigationHandlers();
            
            // Initialize secondary features
            setTimeout(() => {
                this.populateSymbolGrid();
                this.setupAccessibility();
                this.initializeLucideIcons();
                this.setupSocialSharing();
                this.setupMobileMenu();
            }, 100);
            
        } catch (error) {
            console.error('App initialization error:', error);
            this.showToast('Application failed to initialize', 'error');
        }
    }

    initializeLucideIcons() {
        try {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        } catch (error) {
            console.warn('Icons failed to load');
        }
    }

    cacheElements() {
        const getElementById = (id) => document.getElementById(id);
        const querySelectorAll = (selector) => document.querySelectorAll(selector);

        this.elements = {
            // Theme and navigation
            themeToggle: getElementById('theme-toggle'),
            mobileMenuToggle: getElementById('mobile-menu-toggle'),
            
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
            
            // Social sharing
            shareFacebook: getElementById('share-facebook'),
            shareTwitter: getElementById('share-twitter'),
            shareLinkedin: getElementById('share-linkedin'),
            shareWhatsapp: getElementById('share-whatsapp'),
            copyLink: getElementById('copy-link'),
            
            // Symbol Reference
            symbolGrid: getElementById('symbol-grid'),
            symbolSearch: getElementById('symbol-search'),
            searchClear: getElementById('search-clear'),
            filterButtons: querySelectorAll('.filter-btn'),
            
            // Notifications
            toast: getElementById('toast'),
            loading: getElementById('loading')
        };

        console.log('Elements cached:', Object.keys(this.elements).length);
    }

    // FIXED: Theme initialization and switching
    initializeTheme() {
        try {
            // Check for saved theme preference or default to light
            const savedTheme = this.getStorageItem('wingdings-theme');
            const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            this.setTheme(initialTheme, false);
            
            // Listen for system theme changes
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (!this.getStorageItem('wingdings-theme')) {
                        this.setTheme(e.matches ? 'dark' : 'light', false);
                    }
                });
            }
            
            console.log('Theme initialized:', initialTheme);
            
        } catch (error) {
            console.error('Theme initialization failed:', error);
            this.setTheme('light', false);
        }
    }

    // FIXED: Proper theme switching with animation
    setTheme(theme, animate = true) {
        try {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            
            if (currentTheme === theme) return;
            
            console.log('Setting theme:', theme);
            
            if (animate) {
                root.style.transition = 'background-color 250ms ease, color 250ms ease';
            }
            
            root.setAttribute('data-theme', theme);
            
            // Safe localStorage access
            this.setStorageItem('wingdings-theme', theme);
            
            // Update status
            this.updateOutputStatus('Ready');
            
            if (animate) {
                setTimeout(() => {
                    root.style.transition = '';
                }, 250);
            }
            
            // Reinitialize icons after theme change
            setTimeout(() => this.initializeLucideIcons(), 50);
            
        } catch (error) {
            console.error('Theme setting failed:', error);
        }
    }

    // Safe localStorage wrapper functions
    getStorageItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    setStorageItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }

    attachEventListeners() {
        try {
            // FIXED: Theme toggle with better event handling
            if (this.elements.themeToggle) {
                this.elements.themeToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    console.log('Theme toggle clicked, switching from', currentTheme, 'to', newTheme);
                    this.setTheme(newTheme, true);
                    this.showToast(`Switched to ${newTheme} mode`, 'success');
                });
                console.log('Theme toggle listener attached');
            } else {
                console.warn('Theme toggle element not found');
            }

            // FIXED: Input handling with immediate translation
            if (this.elements.textInput) {
                // Input event for real-time translation
                this.elements.textInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    console.log('Input event:', value.substring(0, 20) + (value.length > 20 ? '...' : ''));
                    this.debouncedTranslate(value);
                    this.updateCharCount(value.length);
                });

                // Paste event
                this.elements.textInput.addEventListener('paste', (e) => {
                    setTimeout(() => {
                        const value = e.target.value;
                        console.log('Paste event:', value.substring(0, 20) + (value.length > 20 ? '...' : ''));
                        this.debouncedTranslate(value);
                        this.updateCharCount(value.length);
                    }, 10);
                });

                // Add some initial demo text
                this.elements.textInput.placeholder = "Try typing 'Hello World' to see the magic happen!";
                
                console.log('Input listeners attached');
            } else {
                console.warn('Text input element not found');
            }

            // Mode switching
            if (this.elements.modeButtons && this.elements.modeButtons.length > 0) {
                this.elements.modeButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const mode = e.currentTarget.dataset.mode;
                        console.log('Mode switch clicked:', mode);
                        if (mode) {
                            this.switchMode(mode);
                        }
                    });
                });
                console.log('Mode buttons listeners attached:', this.elements.modeButtons.length);
            }

            // Action buttons
            if (this.elements.clearBtn) {
                this.elements.clearBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.clearInput();
                });
            }
            if (this.elements.copyBtn) {
                this.elements.copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.copyToClipboard();
                });
            }
            if (this.elements.downloadPngBtn) {
                this.elements.downloadPngBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadPNG();
                });
            }
            if (this.elements.downloadSvgBtn) {
                this.elements.downloadSvgBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadSVG();
                });
            }

            // Enhanced symbol search
            if (this.elements.symbolSearch) {
                this.elements.symbolSearch.addEventListener('input', (e) => {
                    const query = e.target.value;
                    this.debouncedSearch(query);
                });
            }

            if (this.elements.searchClear) {
                this.elements.searchClear.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.elements.symbolSearch) {
                        this.elements.symbolSearch.value = '';
                        this.searchSymbols('');
                    }
                });
            }

            // Filter buttons
            if (this.elements.filterButtons && this.elements.filterButtons.length > 0) {
                this.elements.filterButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const filter = e.currentTarget.dataset.filter;
                        if (filter) {
                            this.filterSymbols(filter);
                        }
                    });
                });
            }

            // Keyboard shortcuts
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
                
                // Quick theme toggle with 't' key
                if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    this.setTheme(newTheme, true);
                    this.showToast(`Quick toggle: ${newTheme} mode`, 'success');
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

            console.log('All event listeners attached successfully');

        } catch (error) {
            console.error('Event listener attachment failed:', error);
        }
    }

    // FIXED: Navigation handlers for button-based navigation
    setupNavigationHandlers() {
        try {
            // Handle navigation buttons in header
            const navButtons = document.querySelectorAll('[data-nav]');
            navButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const navTarget = button.getAttribute('data-nav');
                    this.handleNavigation(navTarget, button.textContent);
                });
            });

            // Handle blog link buttons
            const blogButtons = document.querySelectorAll('[data-blog]');
            blogButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const blogTarget = button.getAttribute('data-blog');
                    this.handleBlogNavigation(blogTarget, button.textContent);
                });
            });

            // Handle social link buttons
            const socialButtons = document.querySelectorAll('[data-social]');
            socialButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const social = button.getAttribute('data-social');
                    this.handleSocialNavigation(social);
                });
            });

            console.log('Navigation handlers setup complete');
        } catch (error) {
            console.error('Navigation setup failed:', error);
        }
    }

    // Handle navigation to different sections
    handleNavigation(target, linkText) {
        try {
            switch (target) {
                case 'home':
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.showToast('Welcome to Wingdings Translator!', 'success');
                    break;
                case 'about':
                    this.showToast('About: Professional Wingdings translator with modern features', 'success');
                    break;
                case 'contact':
                    this.showToast('Contact: Send us feedback to improve the translator', 'success');
                    break;
                case 'privacy':
                    this.showToast('Privacy: We respect your privacy and don\'t store personal data', 'success');
                    break;
                case 'terms':
                    this.showToast('Terms: Free to use for personal and educational purposes', 'success');
                    break;
                case 'author':
                    this.showToast('Author: Created by web developers passionate about typography', 'success');
                    break;
                case 'blog':
                    const blogSection = document.querySelector('.blog-section');
                    if (blogSection) {
                        blogSection.scrollIntoView({ behavior: 'smooth' });
                        this.showToast('Explore our latest articles and tutorials', 'success');
                    }
                    break;
                case 'sitemap':
                    this.showToast('Sitemap: All pages and resources are available here', 'success');
                    break;
                default:
                    this.showToast(`Navigation: ${linkText}`, 'success');
                    break;
            }
        } catch (error) {
            this.showToast('Navigation failed', 'error');
        }
    }

    // Handle blog post navigation
    handleBlogNavigation(blogPost, linkText) {
        try {
            const blogTitles = {
                'complete-wingdings-guide-2025': 'Complete Wingdings Guide 2025',
                'undertale-gaster-translation-secrets': 'Undertale Gaster Translation Secrets',
                'unicode-symbols-web-compatibility': 'Unicode Symbols vs Wingdings Guide'
            };

            const title = blogTitles[blogPost] || linkText;
            this.showToast(`Blog Post: ${title} - Coming soon!`, 'success');
        } catch (error) {
            this.showToast('Blog navigation failed', 'error');
        }
    }

    // Handle social media navigation
    handleSocialNavigation(platform) {
        try {
            const messages = {
                'twitter': 'Follow us on Twitter for updates and tips!',
                'facebook': 'Like our Facebook page for the latest news!',
                'linkedin': 'Connect with us on LinkedIn for professional updates!'
            };
            
            this.showToast(messages[platform] || 'Social media coming soon!', 'success');
        } catch (error) {
            this.showToast('Social navigation failed', 'error');
        }
    }

    // FIXED: Translation with proper debouncing
    debouncedTranslate(text) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.translateText(text);
        }, 150);
    }

    // FIXED: Translation logic with better error handling and immediate execution
    translateText(inputText) {
        try {
            console.log('Translating text:', inputText.substring(0, 20) + (inputText.length > 20 ? '...' : ''));
            
            if (this.isProcessing) {
                console.log('Translation already in progress, skipping');
                return;
            }
            
            const outputElement = this.elements.outputDisplay;
            if (!outputElement) {
                console.error('Output element not found');
                return;
            }
            
            // Handle empty input
            if (!inputText || inputText.trim() === '') {
                outputElement.innerHTML = `
                    <div class="output-placeholder">
                        <i data-lucide="arrow-left" class="placeholder-icon"></i>
                        <span>Your magical symbols will appear here</span>
                    </div>
                `;
                this.toggleActionButtons(false);
                this.updateOutputStatus('Ready');
                this.initializeLucideIcons();
                console.log('Cleared output for empty input');
                return;
            }

            this.isProcessing = true;
            this.updateOutputStatus('Translating...');
            
            // Process text based on mode
            let result = '';
            const textToTranslate = this.currentMode === 'gaster' ? inputText.toUpperCase() : inputText;

            console.log('Processing in mode:', this.currentMode);

            // Character-by-character translation
            for (let i = 0; i < textToTranslate.length; i++) {
                const char = textToTranslate[i];
                const mapped = this.wingdingsMapping[char];
                result += mapped || char;
            }

            console.log('Translation result:', result.substring(0, 20) + (result.length > 20 ? '...' : ''));

            // Animate the output change
            outputElement.style.opacity = '0.7';
            outputElement.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                // Clear any existing content and set the translated text
                outputElement.innerHTML = '';
                outputElement.textContent = result;
                outputElement.style.opacity = '1';
                outputElement.style.transform = 'scale(1)';
                this.toggleActionButtons(true);
                this.updateOutputStatus(`Converted • ${result.length} symbols`);
                this.isProcessing = false;
                console.log('Translation completed successfully');
            }, 100);
            
        } catch (error) {
            console.error('Translation failed:', error);
            this.showToast('Translation failed', 'error');
            this.isProcessing = false;
            this.updateOutputStatus('Error');
        }
    }

    switchMode(mode) {
        try {
            if (this.currentMode === mode) return;
            
            console.log('Switching mode from', this.currentMode, 'to', mode);
            this.currentMode = mode;
            
            // Update mode button states
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

            // Re-translate if there's existing text
            const currentText = this.elements.textInput?.value;
            if (currentText) {
                this.translateText(currentText);
            }
            
            // Update help text
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
            
            // Color coding based on length
            if (count > 1000) {
                charCountElement.style.color = 'var(--color-warning)';
            } else {
                charCountElement.style.color = 'var(--color-primary)';
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
            
            const statusSpan = statusElement.querySelector('span:last-child');
            if (statusSpan) {
                statusSpan.style.opacity = '0';
                setTimeout(() => {
                    statusSpan.textContent = status;
                    statusSpan.style.opacity = '1';
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
            
            console.log('Action buttons toggled:', enabled);
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

            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                await this.fallbackCopy(text);
            }

            // Success animation
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
                
                // Background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Text
                ctx.fillStyle = textColor;
                ctx.font = '24px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Word wrapping
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
                  font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" 
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
            
            console.log('Symbol grid populated with', grid.children.length, 'items');
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
            this.showToast('Copy failed', 'error');
        }
    }

    debouncedSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchSymbols(query);
        }, 150);
    }

    searchSymbols(query) {
        try {
            const items = this.elements.symbolGrid?.querySelectorAll('.symbol-item');
            if (!items || items.length === 0) return;
            
            const searchTerm = query.toLowerCase().trim();
            let visibleCount = 0;

            items.forEach((item, index) => {
                const char = item.dataset.char ? item.dataset.char.toLowerCase() : '';
                const symbol = item.dataset.symbol || '';
                
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
                        item.style.background = 'var(--color-primary)';
                        item.style.color = 'var(--color-btn-primary-text)';
                        
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
            
            if (visibleCount === 0 && searchTerm) {
                this.showToast(`No symbols found for "${query}"`, 'error');
            }
            
        } catch (error) {
            this.showToast('Search failed', 'error');
        }
    }

    filterSymbols(category) {
        try {
            // Update filter button states
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

    // PERFORMANCE OPTIMIZED SOCIAL SHARING
    setupSocialSharing() {
        try {
            const shareUrl = encodeURIComponent(window.location.href);
            const shareTitle = encodeURIComponent('Wingdings Translator - Convert Text to Wingdings Online');
            const shareText = encodeURIComponent('Check out this amazing Wingdings translator with dark mode and Gaster support!');

            // Facebook sharing
            if (this.elements.shareFacebook) {
                this.elements.shareFacebook.addEventListener('click', (e) => {
                    e.preventDefault();
                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                    this.openShareWindow(facebookUrl, 'Facebook');
                });
            }

            // Twitter sharing
            if (this.elements.shareTwitter) {
                this.elements.shareTwitter.addEventListener('click', (e) => {
                    e.preventDefault();
                    const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
                    this.openShareWindow(twitterUrl, 'Twitter');
                });
            }

            // LinkedIn sharing
            if (this.elements.shareLinkedin) {
                this.elements.shareLinkedin.addEventListener('click', (e) => {
                    e.preventDefault();
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                    this.openShareWindow(linkedinUrl, 'LinkedIn');
                });
            }

            // WhatsApp sharing
            if (this.elements.shareWhatsapp) {
                this.elements.shareWhatsapp.addEventListener('click', (e) => {
                    e.preventDefault();
                    const whatsappUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`;
                    this.openShareWindow(whatsappUrl, 'WhatsApp');
                });
            }

            // Copy link functionality
            if (this.elements.copyLink) {
                this.elements.copyLink.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const url = window.location.href;
                        if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(url);
                        } else {
                            await this.fallbackCopy(url);
                        }
                        this.showToast('Link copied to clipboard!', 'success');
                    } catch (error) {
                        this.showToast('Failed to copy link', 'error');
                    }
                });
            }
            
            console.log('Social sharing setup complete');
        } catch (error) {
            console.error('Social sharing setup failed:', error);
        }
    }

    openShareWindow(url, platform) {
        try {
            const width = 600;
            const height = 400;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            
            window.open(
                url,
                `share-${platform.toLowerCase()}`,
                `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
            );
            
            this.showToast(`Opening ${platform} share dialog...`, 'success');
        } catch (error) {
            // Fallback to direct navigation
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    setupMobileMenu() {
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.showToast('Mobile menu - Navigation optimized for touch', 'success');
            });
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
            // Screen reader announcements
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.id = 'announcer';
            document.body.appendChild(announcer);
            
            // Keyboard navigation
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
            
            console.log('Accessibility setup complete');
        } catch (error) {
            console.error('Accessibility setup failed:', error);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, initializing Wingdings Translator...');
        
        // Initialize the main application
        window.wingTranslator = new WingdingsTranslator();
        
        // Add performance optimization styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--color-primary) !important;
                outline-offset: 2px !important;
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Performance: GPU acceleration for animations */
            .theme-toggle,
            .toggle-thumb,
            .action-btn,
            .social-btn,
            .symbol-item {
                will-change: transform;
            }
            
            /* Performance: Reduce motion for users who prefer it */
            @media (prefers-reduced-motion: reduce) {
                .theme-toggle,
                .toggle-thumb,
                .action-btn,
                .social-btn,
                .symbol-item {
                    will-change: auto;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log('Wingdings Translator initialized successfully!');
        
    } catch (error) {
        console.error('Application initialization failed:', error);
        // Fallback error handling
        document.body.innerHTML = `
            <div style="text-align: center; padding: 2rem; font-family: system-ui; background: var(--color-background); min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <h1 style="color: var(--color-text); margin-bottom: 1rem;">Wingdings Translator</h1>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Sorry, the application failed to load. Please refresh the page.</p>
                <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: var(--color-btn-primary-text); border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
                    Refresh Page
                </button>
            </div>
        `;
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WingdingsTranslator;
}