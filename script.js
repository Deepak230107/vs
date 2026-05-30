// Vetrivel Steel Furniture - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);

    // 2. Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 3. Sticky Navbar & Scroll Spy
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '15px 0';
        }

        // Scroll Spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Dark/Light Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 5. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Initial call

    // 6. Number Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            
            // Check if element is in view to start animation
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && counter.innerText == '0') {
                updateCount();
            }
        });
    };

    window.addEventListener('scroll', startCounters);

    // 7. Products Data & Filtering
    const products = [
        {
            id: 1,
            name: "Steel Cot",
            category: "home",
            description: "Strong double steel cot with good paint.",
            price: "₹12,500",
            image: "assets/images/product_cot_1779976217480.png"
        },
        {
            id: 2,
            name: "Steel Wardrobe",
            category: "home",
            description: "Big 3-door steel almirah with safe lock.",
            price: "₹15,000",
            image: "assets/images/product_wardrobe_1779976231262.png"
        },
        {
            id: 3,
            name: "Office Table",
            category: "office",
            description: "Nice office desk with drawers for your things.",
            price: "₹8,500",
            image: "assets/images/product_table_1779976252061.png"
        },
        {
            id: 4,
            name: "Office Furniture Set",
            category: "office",
            description: "Full set of office furniture with desks and chairs.",
            price: "₹45,000",
            image: "assets/images/product_office_1779976267938.png"
        },
        {
            id: 5,
            name: "Steel Bunk Bed",
            category: "home",
            description: "Strong bed for two people, good for kids.",
            price: "₹18,000",
            image: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop"
        },
        {
            id: 6,
            name: "Storage Rack",
            category: "custom",
            description: "Strong steel racks made to fit your shop or godown.",
            price: "Custom",
            image: "https://images.unsplash.com/photo-1580130095842-1e9d1dc9d8dd?auto=format&fit=crop"
        }
    ];

    const productsGrid = document.getElementById('products-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('product-search');

    // --- Carousel Logic ---
    const carouselTrack = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Featured products for carousel
    const featuredProducts = products.slice(0, 4); // First 4 items
    let currentSlide = 0;

    function setupCarousel() {
        if (!carouselTrack) return;
        featuredProducts.forEach((p, index) => {
            // Track item
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.style.backgroundImage = `url('${p.image}')`;
            item.innerHTML = `
                <div class="carousel-content reveal active">
                    <h3>${p.name}</h3>
                </div>
            `;
            carouselTrack.appendChild(item);

            // Dot
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + featuredProducts.length) % featuredProducts.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % featuredProducts.length;
            updateCarousel();
        });
    }

    // Auto Advance
    setInterval(() => {
        if (featuredProducts.length > 0) {
            currentSlide = (currentSlide + 1) % featuredProducts.length;
            updateCarousel();
        }
    }, 5000);

    setupCarousel();
    // --- End Carousel Logic ---

    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No products found.</p>';
            return;
        }

        productsToRender.forEach((product, index) => {
            const delay = index * 100; // Staggered animation
            const card = document.createElement('div');
            card.className = 'product-card reveal active';
            card.style.animationDelay = `${delay}ms`;
            
            // For external links or fallback images if local not found, handle gracefully
            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop'">
                    <span class="product-category">${product.category.toUpperCase()}</span>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-bottom">
                        <a href="#contact" class="btn btn-primary btn-sm">Enquire</a>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Initial Render
    renderProducts(products);

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === filterValue);
                renderProducts(filtered);
            }
            
            // Clear search
            searchInput.value = '';
        });
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Reset filters when searching
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });

    // 8. Form Submissions (Prevent Default for demo)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
                btn.classList.replace('btn-primary', 'btn-outline');
                btn.style.backgroundColor = '#25d366';
                btn.style.borderColor = '#25d366';
                btn.style.color = '#fff';
                
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-outline', 'btn-primary');
                    btn.style = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    });
    
    // 9. File Upload Name Display
    const fileInput = document.getElementById('resume');
    if(fileInput) {
        fileInput.addEventListener('change', function() {
            const label = this.previousElementSibling;
            if(this.files && this.files.length > 0) {
                label.innerHTML = `<i class="fa-solid fa-file-check"></i> ${this.files[0].name}`;
                label.style.color = 'var(--primary)';
            } else {
                label.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Upload Resume/ID`;
                label.style.color = '';
            }
        });
    }
});
