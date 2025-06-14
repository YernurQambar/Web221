const themeToggle = document.getElementById("theme-toggle")
const body = document.body
const carousel = document.querySelector(".carousel-container")
const prevButton = document.querySelector(".carousel-button.prev")
const nextButton = document.querySelector(".carousel-button.next")
const searchInput = document.getElementById("search-input")
const categoryFilter = document.getElementById("category-filter")
const productsGrid = document.getElementById("products-grid")

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzheA0Er2r1J50GYzkO8UpIk_r17EYW0XBkyUHBeyjRKQAUHp_k0jlnXnqxZlFQqK9piw/exec';

let products = [];
let isProductsLoaded = false;

async function loadProducts() {
    try {
        const response = await fetch(WEB_APP_URL);
        const data = await response.json();

        if (data.success && data.data) {

            products = data.data.map(product => ({
                ...product,
                id: parseInt(product.id) || 0,
                price: parseFloat(product.price) || 0,
                quantity: parseInt(product.quantity) || 0,
                name: String(product.name || ''),
                category: String(product.category || ''),
                image: String(product.image || '')
            }));

            isProductsLoaded = true;
            console.log('Products loaded:', products);
            console.log('Total products:', products.length);

            populateCategories();
            displayProducts();

        } else {
            console.error('Error or no data:', data.error || 'No data returned');
            products = [];
            isProductsLoaded = false;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        products = [];
        isProductsLoaded = false;


        if (productsGrid) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>Unable to load products. Please check your internet connection and try again.</p>
                    <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}



let cart = []
let currentSlide = 0
let filteredProducts = []
let carouselInterval = null


const themeToggleMobile = document.getElementById("theme-toggle-mobile")
const burgerMenu = document.getElementById("burger-menu")
const navMobile = document.getElementById("nav-mobile")
const cartCount = document.getElementById("cart-count")
const cartCountMobile = document.querySelector(".cart-count-mobile")
const cartItems = document.getElementById("cart-items")
const cartSummary = document.getElementById("cart-summary")
const totalPrice = document.getElementById("total-price")
const checkoutBtn = document.getElementById("checkout-btn")
const checkoutModal = document.getElementById("checkout-modal")
const closeModal = document.getElementById("close-modal")
const checkoutForm = document.getElementById("checkout-form")
const customerName = document.getElementById("customer-name")


document.addEventListener("DOMContentLoaded", async () => {
    loadTheme()
    initializeCarousel()
    setupEventListeners()


    await loadProducts()
})


function toggleTheme() {
    const isDarkMode = document.body.classList.toggle("dark-mode")
    document.body.classList.toggle("light-mode", !isDarkMode)

    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? "☀️" : "🌙"
    }
    if (themeToggleMobile) {
        themeToggleMobile.textContent = isDarkMode ? "☀️" : "🌙"
    }


    window.darkModePreference = isDarkMode
}


function loadTheme() {

    const isDarkMode = window.darkModePreference || false

    if (isDarkMode) {
        document.body.classList.add("dark-mode")
        document.body.classList.remove("light-mode")
    } else {
        document.body.classList.add("light-mode")
        document.body.classList.remove("dark-mode")
    }

    if (themeToggle) {
        themeToggle.textContent = isDarkMode ? "☀️" : "🌙"
    }
    if (themeToggleMobile) {
        themeToggleMobile.textContent = isDarkMode ? "☀️" : "🌙"
    }
}


function toggleMobileMenu() {
    if (burgerMenu && navMobile) {
        burgerMenu.classList.toggle("active")
        navMobile.classList.toggle("active")
    }
}

function initializeCarousel() {
    const carouselSlides = document.getElementById("carousel-slides")
    const carouselDots = document.getElementById("carousel-dots")

    if (!carouselSlides || !carouselDots) return


    carouselImages.forEach((image, index) => {
        const slide = document.createElement("div")
        slide.className = "carousel-slide"
        slide.innerHTML = `<img src="${image.src}" alt="${image.alt}" onerror="this.src='https://imgs.search.brave.com/foNuM2CUVRFl-O1lGOUuBTYADXQWuQurIpGeo76RXFc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE2/NTA5OTg2NC9waG90/by9wbGFzdGljLWZy/ZWUtc2V0LXdpdGgt/ZWNvLWNvdHRvbi1i/YWctZ2xhc3MtamFy/LWdyZWVuLWxlYXZl/cy1hbmQtcmVjeWNs/ZWQtdGFibGV3YXJl/LXRvcC12aWV3Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1y/VUFDeDA0eDN6Vkk2/dVhYVlloN3ZmQkMw/NWJLX29DUEZaMmVw/a1VyQ18wPQ'">`
        carouselSlides.appendChild(slide)


        const dot = document.createElement("div")
        dot.className = `dot ${index === 0 ? "active" : ""}`
        dot.addEventListener("click", () => goToSlide(index))
        carouselDots.appendChild(dot)
    })


    startCarousel()


    if (carousel) {
        carousel.addEventListener("mouseenter", () => {
            clearInterval(carouselInterval)
        })

        carousel.addEventListener("mouseleave", () => {
            startCarousel()
        })
    }
}

function startCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval)
    }
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselImages.length
        updateCarousel()
    }, 5000)
}

function updateCarousel() {
    const carouselSlides = document.getElementById("carousel-slides")
    const dots = document.querySelectorAll(".dot")

    if (carouselSlides) {
        carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`
    }


    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide)
    })
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length
    updateCarousel()
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length
    updateCarousel()
}

function goToSlide(index) {
    currentSlide = index
    updateCarousel()
}


function populateCategories() {
    if (!categoryFilter || !isProductsLoaded) return


    const allOption = categoryFilter.querySelector('option[value="all"]')
    categoryFilter.innerHTML = ''
    if (allOption) {
        categoryFilter.appendChild(allOption)
    } else {
        const defaultOption = document.createElement("option")
        defaultOption.value = "all"
        defaultOption.textContent = "All Categories"
        categoryFilter.appendChild(defaultOption)
    }


    const availableProducts = products.filter((product) => product.quantity > 0)
    const categories = [...new Set(availableProducts.map((product) => product.category))]


    categories.forEach((category) => {
        const option = document.createElement("option")
        option.value = category
        option.textContent = category
        categoryFilter.appendChild(option)
    })
}

function displayProducts() {
    if (!productsGrid || !isProductsLoaded) return


    let productsToShow = products.filter((product) => product.quantity > 0)


    const searchTerm = searchInput ? searchInput.value.toLowerCase() : ''
    if (searchTerm) {
        productsToShow = productsToShow.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
        )
    }


    const selectedCategory = categoryFilter ? categoryFilter.value : 'all'
    if (selectedCategory !== "all") {
        productsToShow = productsToShow.filter((product) => product.category === selectedCategory)
    }


    filteredProducts = productsToShow


    productsGrid.innerHTML = ""

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No products found.</p>'
        return
    }

    productsToShow.forEach((product) => {
        const productCard = createProductCard(product)
        productsGrid.appendChild(productCard)
    })
}

function createProductCard(product) {
    const card = document.createElement("div")
    card.className = "product-card"


    const price = parseFloat(product.price) || 0;
    const productName = product.name || 'Unnamed Product';
    const productCategory = product.category || 'Uncategorized';
    const productImage = product.image || '';

    card.innerHTML = `
        <img src="${productImage}" alt="${productName}" class="product-image" 
             onerror="this.src=''">
        <h3 class="product-name">${productName}</h3>
        <p class="product-category">${productCategory}</p>
        <p class="product-price">$${price.toFixed(2)}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `

    return card
}




function suggestByMood() {
    const mood = document.getElementById("mood-select").value.toLowerCase();
    let suggestions = [];

    if (!mood) return;

    switch (mood) {
        case "сонный":
            suggestions = products.filter(p => /напитки/i.test(p.name));
            break;
        case "голодный":
            suggestions = products.filter(p => /еда/i.test(p.name));
            break;
        case "энергия":
            suggestions = products.filter(p => /мороженое/i.test(p.name));
            break;
        case "сладкое":
            suggestions = products.filter(p => /снеки/i.test(p.name));
            break;
        default:
            suggestions = [];
    }

    if (suggestions.length === 0) {
        alert("😢 Ничего не нашли под настроение.");
        return;
    }

    filteredProducts = suggestions;
    displayProducts();
}




function calculateCombo() {
    const budget = parseFloat(document.getElementById("combo-budget").value);
    if (!budget || budget <= 0) {
        alert("Введите корректную сумму");
        return;
    }

    // Сортируем по цене
    const available = products
        .filter(p => p.price <= budget && p.quantity > 0)
        .sort((a, b) => a.price - b.price);

    const result = [];
    let total = 0;

    for (let product of available) {
        if (total + product.price <= budget) {
            result.push(product);
            total += product.price;
        }
    }

    const resultBox = document.getElementById("combo-result");
    if (result.length === 0) {
        resultBox.innerHTML = "Ничего не найдено в пределах бюджета.";
    } else {
        resultBox.innerHTML = `<strong>Комбо на ${total.toFixed(2)}тг:</strong><br>` +
            result.map(p => `${p.name} — ${p.price.toFixed(2)}тг`).join("<br>");
    }
}


function sendFeedback(type) {
    console.log("Feedback received:", type);
    alert("Спасибо за вашу реакцию!");
}


function updateWeeklyTop() {
    const sorted = [...products]
        .filter(p => p.quantity > 0)
        .sort((a, b) => (b.timesBought || 0) - (a.timesBought || 0))
        .slice(0, 5);

    const ul = document.getElementById("weekly-top");
    ul.innerHTML = sorted.map(p => `<li>⭐ ${p.name} (${p.timesBought || 0})</li>`).join("");
}





function cancelOrder() {
    if (confirm("Вы уверены, что хотите отменить заказ?")) {
        cart = [];
        updateCartDisplay();
        updateCartCount();
        alert("Заказ отменён.");
    }
}



document.getElementById("private-order-toggle").addEventListener("change", function () {
    const isPrivate = this.checked;
    localStorage.setItem("privateOrder", isPrivate);
});




fetch("https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.61&current_weather=true")
    .then(res => res.json())
    .then(data => {
        const temp = data.current_weather.temperature;
        const box = document.getElementById("weather-recommendation");
        if (temp >= 25) {
            box.innerHTML = "☀️ Сегодня жарко! Освежись холодным чаем или лимонадом.";
        } else if (temp <= 5) {
            box.innerHTML = "❄️ На улице холодно. Горячая лапша — то что надо!";
        } else {
            box.innerHTML = "🌤 Отличная погода для любого перекуса.";
        }
    })
    .catch(() => {
        document.getElementById("weather-recommendation").innerText = "Не удалось загрузить погоду";
    });





function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
    if (!product || product.quantity === 0) return


    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {

        if (existingItem.quantity < product.quantity) {
            existingItem.quantity++
        } else {
            alert("Sorry, not enough stock available!")
            return
        }
    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            image: product.image || '',
            quantity: 1,
            maxQuantity: product.quantity,
        })
    }

    updateCartDisplay()
    updateCartCount()


    showNotification("Product added to cart!")
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId)
    updateCartDisplay()
    updateCartCount()
}

function updateQuantity(productId, change) {
    const item = cart.find((item) => item.id === productId)
    if (!item) return

    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
        removeFromCart(productId)
    } else if (newQuantity <= item.maxQuantity) {
        item.quantity = newQuantity
        updateCartDisplay()
        updateCartCount()
    } else {
        alert("Sorry, not enough stock available!")
    }
}

function updateCartDisplay() {
    if (!cartItems) return

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
        if (cartSummary) {
            cartSummary.style.display = "none"
        }
        return
    }

    cartItems.innerHTML = ""
    let total = 0

    cart.forEach((item) => {
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"

        const itemPrice = parseFloat(item.price) || 0;

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" 
                 onerror="this.src=''">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${itemPrice.toFixed(2)} each</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background-color: #dc2626;">×</button>
        `

        cartItems.appendChild(cartItem)
        total += itemPrice * item.quantity
    })

    if (totalPrice) {
        totalPrice.textContent = total.toFixed(2)
    }
    if (cartSummary) {
        cartSummary.style.display = "block"
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    if (cartCount) {
        cartCount.textContent = count
    }
    if (cartCountMobile) {
        cartCountMobile.textContent = count
    }
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your cart is empty!")
        return
    }
    if (checkoutModal) {
        checkoutModal.style.display = "block"
    }
}

function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.style.display = "none"
    }
}


async function sendToGoogleSheets(orderData) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbywzoTF3-4MyH4EWU52eSrpL4I8-1ABVP4NP4XDwLGVtt_02KnhSWkyq9Ph7pD6UTo0/exec'

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                data: JSON.stringify(orderData)
            })
        });



        console.log('Order sent to Google Sheets');
        return true;

    } catch (error) {
        console.error('Network error:', error);
        return false;
    }
}


async function processCheckout(event) {
    event.preventDefault();
    console.log('Processing checkout...');

    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }


    const customerNameInput = document.getElementById('customer-name');
    const customerName = customerNameInput ? customerNameInput.value.trim() : '';

    if (!customerName) {
        alert("Please enter your name");
        return;
    }


    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;


    const orderData = {
        cart: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            customer_name: customerName
        }))
    };

    console.log('Order data prepared:', orderData);

    try {

        const success = await sendToGoogleSheets(orderData);

        if (success) {

            cart = [];
            updateCartDisplay();
            updateCartCount();
            closeCheckoutModal();


            event.target.reset();

            alert("Order submitted successfully! We'll contact you soon.");
        } else {
            alert("There was an issue submitting your order. Please try again or contact us directly.");
        }
    } catch (error) {
        console.error('Checkout process error:', error);
        alert("There was an issue submitting your order. Please try again or contact us directly.");
    }


    submitButton.textContent = originalText;
    submitButton.disabled = false;
}




function showNotification(message) {
    const notification = document.createElement("div")
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--primary-color, #3b82f6);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
    `
    notification.textContent = message

    document.body.appendChild(notification)


    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove()
        }
    }, 4000)
}




function setupEventListeners() {
    console.log('Setting up event listeners...');


    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme)
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener("click", toggleTheme)
    }


    if (burgerMenu) {
        burgerMenu.addEventListener("click", toggleMobileMenu)
    }


    if (nextButton) {
        nextButton.addEventListener("click", nextSlide)
    }
    if (prevButton) {
        prevButton.addEventListener("click", prevSlide)
    }


    if (searchInput) {
        searchInput.addEventListener("input", displayProducts)
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", displayProducts)
    }


    if (checkoutBtn) {
        console.log('Checkout button found, adding event listener');
        checkoutBtn.addEventListener("click", (e) => {
            console.log('Checkout button clicked');
            openCheckoutModal();
        });
    } else {
        console.warn('Checkout button not found');
    }

    if (closeModal) {
        closeModal.addEventListener("click", closeCheckoutModal)
    }

    if (checkoutForm) {
        console.log('Checkout form found, adding submit listener');
        checkoutForm.addEventListener("submit", processCheckout);
    } else {
        console.warn('Checkout form not found');
    }


    window.addEventListener("click", (event) => {
        if (event.target === checkoutModal) {
            closeCheckoutModal()
        }
    })


    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute("href"))
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })


                if (navMobile && navMobile.classList.contains("active")) {
                    toggleMobileMenu()
                }
            }
        })
    })
}


window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.updateQuantity = updateQuantity
window.loadProducts = loadProducts
window.openCheckoutModal = openCheckoutModal
window.closeCheckoutModal = closeCheckoutModal