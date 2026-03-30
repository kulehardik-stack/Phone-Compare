// script.js - PhoneCompare Application Logic
// Handles routing, filtering, rendering, and logic for comparing phones.

const phones = [
    {
        id: 1,
        name: "Galaxy S24 Ultra",
        brand: "Samsung",
        category: "Camera Phones",
        price: 129999,
        processor: "Snapdragon 8 Gen 3",
        processorScore: 98,
        battery: 5000,
        display: "6.8\" Dynamic AMOLED 2X, 120Hz",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 2,
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        category: "Camera Phones",
        price: 159900,
        processor: "A17 Pro",
        processorScore: 99,
        battery: 4422,
        display: "6.7\" Super Retina XDR OLED, 120Hz",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 3,
        name: "ROG Phone 8 Pro",
        brand: "Asus",
        category: "Gaming Phones",
        price: 94999,
        processor: "Snapdragon 8 Gen 3",
        processorScore: 98,
        battery: 5500,
        display: "6.78\" LTPO AMOLED, 165Hz",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 4,
        name: "Redmi 12",
        brand: "Xiaomi",
        category: "Budget Phones",
        price: 9999,
        processor: "MediaTek Helio G88",
        processorScore: 45,
        battery: 5000,
        display: "6.79\" IPS LCD, 90Hz",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 5,
        name: "Moto G34 5G",
        brand: "Motorola",
        category: "Budget Phones",
        price: 10999,
        processor: "Snapdragon 695",
        processorScore: 55,
        battery: 5000,
        display: "6.5\" IPS LCD, 120Hz",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 6,
        name: "Nothing Phone (2a)",
        brand: "Nothing",
        category: "Normal Usage Phones",
        price: 23999,
        processor: "Dimensity 7200 Pro",
        processorScore: 78,
        battery: 5000,
        display: "6.7\" Flexible AMOLED, 120Hz",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 7,
        name: "OnePlus 12R",
        brand: "OnePlus",
        category: "Gaming Phones",
        price: 39999,
        processor: "Snapdragon 8 Gen 2",
        processorScore: 92,
        battery: 5500,
        display: "6.78\" AMOLED, 120Hz",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 8,
        name: "Pixel 8",
        brand: "Google",
        category: "Camera Phones",
        price: 75999,
        processor: "Tensor G3",
        processorScore: 85,
        battery: 4575,
        display: "6.2\" OLED, 120Hz",
        image: "https://pk.ign.com/google-pixel-8/217328/review/google-pixel-8-smartphone-review"
    },
    {
        id: 9,
        name: "Poco X6 Pro",
        brand: "Poco",
        category: "Gaming Phones",
        price: 26999,
        processor: "Dimensity 8300 Ultra",
        processorScore: 89,
        battery: 5000,
        display: "6.67\" AMOLED, 120Hz",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: 10,
        name: "Samsung Galaxy A55",
        brand: "Samsung",
        category: "Normal Usage Phones",
        price: 39999,
        processor: "Exynos 1480",
        processorScore: 72,
        battery: 5000,
        display: "6.6\" Super AMOLED, 120Hz",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=400"
    }
];

// App State
let compareList = JSON.parse(localStorage.getItem('phoneCompareList')) || [];
const MAX_COMPARE = 3;
let activeCategory = null;
let activePriceRange = 'all';
let searchQuery = '';

// DOM Elements
const searchInput = document.getElementById('search-input');
const phoneGrid = document.getElementById('phone-grid');
const compareCountBadge = document.getElementById('compare-count');
const mobileCompareBadge = document.getElementById('mobile-compare-badge');
const activeFiltersDisplay = document.getElementById('active-filters-display');

// Formatting utilities
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateCompareBadges();
    
    // Setup Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Search Input Listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderPhones();
    });

    // Initial render
    renderPhones();
});

// Routing / Navigation Logic
function navigate(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // Update nav links styling
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.dataset.target === pageId) {
            item.classList.add('active');
        }
    });

    // Show selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }

    // Page Specific Logic
    if (pageId === 'comparison') {
        renderComparison();
    } else if (pageId === 'listing') {
        renderPhones();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Home Page Filtering
function applyHomeFilters() {
    activePriceRange = document.getElementById('price-filter-home').value;
    activeCategory = null; 
    searchQuery = '';
    searchInput.value = '';
    navigate('listing');
}

function browseCategory(category) {
    activeCategory = category;
    activePriceRange = 'all';
    document.getElementById('price-filter-home').value = 'all';
    searchQuery = '';
    searchInput.value = '';
    navigate('listing');
}

function clearFilters() {
    activeCategory = null;
    activePriceRange = 'all';
    searchQuery = '';
    searchInput.value = '';
    document.getElementById('price-filter-home').value = 'all';
    renderPhones();
}

// Rendering Phones on Listing Page
function renderPhones() {
    if (!phoneGrid) return;
    
    // Apply filters
    let filteredPhones = phones.filter(phone => {
        // Search filter matching brand or name
        const matchesSearch = phone.name.toLowerCase().includes(searchQuery) || phone.brand.toLowerCase().includes(searchQuery);
        
        // Category filter
        const matchesCategory = activeCategory ? phone.category === activeCategory : true;
        
        // Price filter
        let matchesPrice = true;
        if (activePriceRange === 'under10k') matchesPrice = phone.price < 10000;
        else if (activePriceRange === '10k-15k') matchesPrice = phone.price >= 10000 && phone.price <= 15000;
        else if (activePriceRange === '15k-20k') matchesPrice = phone.price > 15000 && phone.price <= 20000;
        else if (activePriceRange === 'above20k') matchesPrice = phone.price > 20000;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Update filter badges UI
    updateActiveFiltersUI();

    // Render HTML
    if (filteredPhones.length === 0) {
        phoneGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="color: var(--text-muted);">No phones found matching your criteria.</h3>
                <button class="btn btn-outline" style="margin-top: 1rem;" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    phoneGrid.innerHTML = filteredPhones.map(phone => {
        const isAdded = compareList.includes(phone.id);
        const btnClass = isAdded ? 'btn-added active' : 'btn-added';
        const iconClass = isAdded ? 'fas fa-check' : 'fas fa-plus';
        const btnText = isAdded ? 'Added to Compare' : 'Add to Compare';
        
        return `
            <div class="phone-card">
                <span class="card-category">${phone.category}</span>
                <div class="card-image-wrap">
                    <img src="${phone.image}" alt="${phone.name}" class="card-image">
                </div>
                <div class="card-brand">${phone.brand}</div>
                <h3 class="card-title">${phone.name}</h3>
                <div class="card-price">${formatCurrency(phone.price)}</div>
                <div class="card-actions">
                    <button class="btn ${btnClass}" onclick="toggleCompare(${phone.id}, event)">
                        <i class="${iconClass}"></i> ${btnText}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateActiveFiltersUI() {
    let badgesHtml = '';
    
    if (activeCategory) {
        badgesHtml += `<span class="filter-badge">${activeCategory} <i class="fas fa-times" onclick="activeCategory=null; renderPhones();"></i></span>`;
    }
    
    if (activePriceRange !== 'all') {
        const rangeText = {
            'under10k': 'Under ₹10,000',
            '10k-15k': '₹10k - ₹15k',
            '15k-20k': '₹15k - ₹20k',
            'above20k': 'Above ₹20k'
        }[activePriceRange];
        
        badgesHtml += `<span class="filter-badge">${rangeText} <i class="fas fa-times" onclick="activePriceRange='all'; renderPhones();"></i></span>`;
    }

    if (searchQuery) {
         badgesHtml += `<span class="filter-badge">Search: "${searchQuery}" <i class="fas fa-times" onclick="searchQuery=''; document.getElementById('search-input').value=''; renderPhones();"></i></span>`;
    }

    activeFiltersDisplay.innerHTML = badgesHtml;
}

// Comparison Logic
function toggleCompare(phoneId, event) {
    const isAdded = compareList.includes(phoneId);
    
    if (isAdded) {
        compareList = compareList.filter(id => id !== phoneId);
    } else {
        if (compareList.length >= MAX_COMPARE) {
            alert(`You can only compare up to ${MAX_COMPARE} phones at a time.`);
            return;
        }
        compareList.push(phoneId);
    }
    
    localStorage.setItem('phoneCompareList', JSON.stringify(compareList));
    updateCompareBadges();
    
    // Re-render button state if on listing page without re-rendering everything
    if (event && event.currentTarget) {
        const btn = event.currentTarget;
        if (!isAdded) {
            btn.className = 'btn btn-added active';
            btn.innerHTML = `<i class="fas fa-check"></i> Added to Compare`;
        } else {
            btn.className = 'btn btn-added';
            btn.innerHTML = `<i class="fas fa-plus"></i> Add to Compare`;
        }
    } else {
        renderPhones();
    }
}

function updateCompareBadges() {
    const count = compareList.length;
    if(compareCountBadge) compareCountBadge.textContent = count;
    if(mobileCompareBadge) {
        mobileCompareBadge.textContent = count;
        // Pulse animation for feedback
        mobileCompareBadge.style.transform = 'scale(1.5)';
        setTimeout(() => mobileCompareBadge.style.transform = 'scale(1)', 200);
    }
}

function clearComparison() {
    compareList = [];
    localStorage.removeItem('phoneCompareList');
    updateCompareBadges();
    renderComparison();
    // Update listing page buttons silently
    renderPhones();
}

function removeFromCompare(phoneId) {
    compareList = compareList.filter(id => id !== phoneId);
    localStorage.setItem('phoneCompareList', JSON.stringify(compareList));
    updateCompareBadges();
    renderComparison();
    // Update listing page buttons silently
    renderPhones();
}

function renderComparison() {
    const emptyState = document.getElementById('comparison-empty');
    const contentState = document.getElementById('comparison-content');
    const table = document.getElementById('compare-table');
    const recommendationContainer = document.getElementById('recommendation-text');
    
    if (compareList.length === 0) {
        emptyState.classList.remove('hidden');
        contentState.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    contentState.classList.remove('hidden');

    // Get phone objects
    const comparedPhones = compareList.map(id => phones.find(p => p.id === id));
    
    // Find best specs for highlighting
    const bestBattery = Math.max(...comparedPhones.map(p => p.battery));
    const bestProcessor = Math.max(...comparedPhones.map(p => p.processorScore));
    const lowestPrice = Math.min(...comparedPhones.map(p => p.price));

    // Build Table Headers
    let theadHtml = `
        <thead>
            <tr>
                <th>Features</th>
                ${comparedPhones.map(p => `
                    <th>
                        <img src="${p.image}" alt="${p.name}" class="compare-product-image">
                        <div class="compare-product-title">${p.brand} <br> ${p.name}</div>
                        <button class="remove-btn" onclick="removeFromCompare(${p.id})">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </th>
                `).join('')}
            </tr>
        </thead>
    `;

    // Build Table Body
    let tbodyHtml = `
        <tbody>
            <tr>
                <td>Price</td>
                ${comparedPhones.map(p => `
                    <td class="${p.price === lowestPrice ? 'best-value' : ''}">
                        ${formatCurrency(p.price)}
                        ${p.price === lowestPrice ? '<span class="best-badge">Most Affordable</span>' : ''}
                    </td>
                `).join('')}
            </tr>
            <tr>
                <td>Processor (Performance)</td>
                ${comparedPhones.map(p => `
                    <td class="${p.processorScore === bestProcessor ? 'best-value' : ''}">
                        ${p.processor}
                        ${p.processorScore === bestProcessor ? '<span class="best-badge">Best Performance</span>' : ''}
                    </td>
                `).join('')}
            </tr>
            <tr>
                <td>Battery</td>
                ${comparedPhones.map(p => `
                    <td class="${p.battery === bestBattery ? 'best-value' : ''}">
                        ${p.battery} mAh
                        ${p.battery === bestBattery ? '<span class="best-badge">Largest Battery</span>' : ''}
                    </td>
                `).join('')}
            </tr>
            <tr>
                <td>Display</td>
                ${comparedPhones.map(p => `
                    <td>${p.display}</td>
                `).join('')}
            </tr>
        </tbody>
    `;

    table.innerHTML = theadHtml + tbodyHtml;

    // Generate Recommendations based on best values found
    let recommendationHTML = '';
    
    const budgetPick = comparedPhones.find(p => p.price === lowestPrice);
    const performancePick = comparedPhones.find(p => p.processorScore === bestProcessor);
    const batteryPick = comparedPhones.find(p => p.battery === bestBattery);

    if (budgetPick) {
        recommendationHTML += `
            <div class="rec-item">
                <div class="rec-icon"><i class="fas fa-piggy-bank"></i></div>
                <div>For the <strong>Best Value/Budget</strong>, we recommend the <span class="rec-highlight">${budgetPick.name}</span> at ${formatCurrency(budgetPick.price)}.</div>
            </div>
        `;
    }
    
    if (performancePick && performancePick.id !== budgetPick?.id) {
         recommendationHTML += `
            <div class="rec-item">
                <div class="rec-icon"><i class="fas fa-bolt"></i></div>
                <div>For <strong>Gaming & Heavy Usage</strong>, the <span class="rec-highlight">${performancePick.name}</span> is the winner with its ${performancePick.processor}.</div>
            </div>
        `;
    }

    if (batteryPick && batteryPick.id !== budgetPick?.id && batteryPick.id !== performancePick?.id) {
        recommendationHTML += `
            <div class="rec-item">
                <div class="rec-icon"><i class="fas fa-battery-full"></i></div>
                <div>For <strong>Endurance</strong>, go with the <span class="rec-highlight">${batteryPick.name}</span> offering ${batteryPick.battery}mAh.</div>
            </div>
        `;
    }

    recommendationContainer.innerHTML = recommendationHTML;
}
