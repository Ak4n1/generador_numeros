export class CustomSelect {
    constructor(containerId, options, defaultValue) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.selectedValue = defaultValue || options[0].value;
        this.isOpen = false;
        this.render();
        this.attachEvents();
    }

    render() {
        const selectedOption = this.options.find(opt => opt.value === this.selectedValue);
        
        this.container.innerHTML = `
            <div class="custom-select-wrapper relative">
                <button type="button" class="custom-select-trigger w-full rounded-lg border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 p-3 text-sm text-left flex items-center justify-between hover:border-primary/40 transition-colors">
                    <span class="custom-select-value">${selectedOption.label}</span>
                    <i class="fas fa-chevron-down text-xs transition-transform duration-200"></i>
                </button>
                <div class="custom-select-dropdown custom-scrollbar absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-primary/20 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden hidden">
                    <div class="overflow-y-auto max-h-80 custom-scrollbar">
                        ${this.options.map((option, index) => `
                            <div class="custom-select-option px-4 py-3 text-sm cursor-pointer hover:bg-primary/10 transition-colors ${option.value === this.selectedValue ? 'bg-primary/20 text-primary font-semibold' : 'text-slate-700 dark:text-slate-300'}" data-value="${option.value}">
                                <div class="font-medium">${option.label}</div>
                                ${option.description ? `<div class="text-xs opacity-70 mt-1">${option.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const trigger = this.container.querySelector('.custom-select-trigger');
        const dropdown = this.container.querySelector('.custom-select-dropdown');
        const options = this.container.querySelectorAll('.custom-select-option');
        const icon = this.container.querySelector('.fa-chevron-down');

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Select option
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                this.selectOption(value);
                this.close();
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const dropdown = this.container.querySelector('.custom-select-dropdown');
        const icon = this.container.querySelector('.fa-chevron-down');
        
        dropdown.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        this.isOpen = true;
    }

    close() {
        const dropdown = this.container.querySelector('.custom-select-dropdown');
        const icon = this.container.querySelector('.fa-chevron-down');
        
        dropdown.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
        this.isOpen = false;
    }

    selectOption(value) {
        this.selectedValue = value;
        const selectedOption = this.options.find(opt => opt.value === value);
        
        // Update trigger text
        const valueSpan = this.container.querySelector('.custom-select-value');
        valueSpan.textContent = selectedOption.label;

        // Update selected state in options
        const options = this.container.querySelectorAll('.custom-select-option');
        options.forEach(option => {
            if (option.dataset.value === value) {
                option.classList.add('bg-primary/20', 'text-primary', 'font-semibold');
                option.classList.remove('text-slate-700', 'dark:text-slate-300');
            } else {
                option.classList.remove('bg-primary/20', 'text-primary', 'font-semibold');
                option.classList.add('text-slate-700', 'dark:text-slate-300');
            }
        });

        // Trigger change event
        this.onChange(value);
    }

    onChange(value) {
        // Este método será sobrescrito desde main.js
        console.log('Selected:', value);
    }

    getValue() {
        return this.selectedValue;
    }
}
