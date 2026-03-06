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
            <div class="custom-select-wrapper">
                <button type="button" class="custom-select-trigger">
                    <span class="custom-select-value">${selectedOption.label}</span>
                    <i class="fas fa-chevron-down custom-select-icon"></i>
                </button>
                <div class="custom-select-dropdown hidden">
                    <div class="custom-select-options">
                        ${this.options.map((option, index) => `
                            <div class="custom-select-option ${option.value === this.selectedValue ? 'selected' : ''}" data-value="${option.value}">
                                <div class="option-label">${option.label}</div>
                                ${option.description ? `<div class="option-description">${option.description}</div>` : ''}
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
        const icon = this.container.querySelector('.custom-select-icon');

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
        const icon = this.container.querySelector('.custom-select-icon');
        
        dropdown.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        this.isOpen = true;
    }

    close() {
        const dropdown = this.container.querySelector('.custom-select-dropdown');
        const icon = this.container.querySelector('.custom-select-icon');
        
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
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });

        // Trigger change event
        this.onChange(value);
    }

    onChange(value) {
        // Este método será sobrescrito desde main.js
    }

    getValue() {
        return this.selectedValue;
    }
}
