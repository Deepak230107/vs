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
    // NOTE: `products` array is defined in products.html inside a <script> block
    // before this script.js is loaded — it is available here as a global variable.

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
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<p style="padding:80px; text-align:center; color:#71717a; font-size:1.2rem;">No products found.</p>';
            return;
        }

        productsToRender.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';

            // Media: video takes priority over image
            let mediaContent = product.video
                ? `<video src="${product.video}" autoplay loop muted playsinline></video>`
                : `<img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop'">`;


            card.innerHTML = `
                <div class="product-img">
                    ${mediaContent}
                    <span class="product-category">${product.category.toUpperCase()}</span>
                </div>
                <div class="product-info" data-index="0${index + 1}">
                    <div class="accent-line"></div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // IntersectionObserver: add 'in-view' class when card enters viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    updateScrollNav();
                }
            });
        }, { threshold: 0.45 });

        document.querySelectorAll('.product-card').forEach(card => observer.observe(card));

        // Mark first card visible immediately
        const firstCard = productsGrid.querySelector('.product-card');
        if (firstCard) firstCard.classList.add('in-view');

        buildScrollNav(productsToRender);
    }

    // Initial Render
    renderProducts(products);

    // ── Scroll-nav dot builder ──
    function buildScrollNav(productsToRender) {
        // Remove any existing nav
        const existing = document.querySelector('.products-scroll-nav');
        if (existing) existing.remove();
        if (!productsGrid || productsToRender.length === 0) return;

        const nav = document.createElement('nav');
        nav.className = 'products-scroll-nav';
        const cards = productsGrid.querySelectorAll('.product-card');

        cards.forEach((card, i) => {
            const dot = document.createElement('span');
            dot.className = 's-dot' + (i === 0 ? ' active' : '');
            dot.title = productsToRender[i]?.name || '';
            dot.addEventListener('click', () => {
                card.scrollIntoView({ behavior: 'smooth' });
            });
            nav.appendChild(dot);
        });
        document.body.appendChild(nav);
    }

    function updateScrollNav() {
        const cards = productsGrid ? productsGrid.querySelectorAll('.product-card') : [];
        const dots  = document.querySelectorAll('.s-dot');
        let activeIndex = 0;
        cards.forEach((card, i) => {
            if (card.classList.contains('in-view')) activeIndex = i;
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    }

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
    if (searchInput) {
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
    }

    // 8. Form Submissions and CAPTCHA
    const contactForm = document.getElementById('contact-form');
    const captchaQuestion = document.getElementById('captcha-question');
    const contactResponse = document.getElementById('contact-response');
    let captchaExpectedResult = 0;

    // Generate random math CAPTCHA
    function generateCaptcha() {
        if (!captchaQuestion) return;
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaExpectedResult = num1 + num2;
        captchaQuestion.innerText = `Security Question: What is ${num1} + ${num2}?`;
    }

    // Initialize CAPTCHA
    generateCaptcha();

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            // Validate CAPTCHA
            const userAnswer = parseInt(document.getElementById('contact-captcha').value);
            if (userAnswer !== captchaExpectedResult) {
                contactResponse.style.display = 'block';
                contactResponse.style.backgroundColor = '#f8d7da';
                contactResponse.style.color = '#721c24';
                contactResponse.innerText = 'Incorrect security answer. Please try again.';
                generateCaptcha();
                document.getElementById('contact-captcha').value = '';
                return;
            }

            // Get form data
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const phone = document.getElementById('contact-phone').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            const honeypot = document.getElementById('contact-honeypot').value;

            // Add professional fly animation to the paper-plane icon
            btn.classList.add('fly-anim');
            btn.disabled = true;
            contactResponse.style.display = 'none';

            setTimeout(async () => {
                try {
                    // Send to FormSubmit API to directly receive email
                    const response = await fetch('https://formsubmit.co/ajax/yuvarajwork25@gmail.com', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            phone: phone,
                            subject: subject || 'New Contact Form Enquiry',
                            message: message,
                            _captcha: "false" // Disable their default captcha since we have our own
                        })
                    });

                    if (response.ok) {
                        // Show success message immediately
                        btn.classList.remove('fly-anim');
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                        btn.classList.replace('btn-primary', 'btn-outline');
                        btn.style.backgroundColor = '#25d366';
                        btn.style.borderColor = '#25d366';
                        btn.style.color = '#fff';

                        contactResponse.style.display = 'block';
                        contactResponse.style.backgroundColor = '#d4edda';
                        contactResponse.style.color = '#155724';
                        contactResponse.innerHTML = 'Thank you! Your message has been sent directly to our email.<br><small style="font-size: 0.8rem; opacity: 0.8;">(Site owner: Please check your inbox for an activation email from FormSubmit if this is the first submission)</small>';

                        contactForm.reset();
                        generateCaptcha();

                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.classList.replace('btn-outline', 'btn-primary');
                            btn.style = '';
                            btn.disabled = false;
                            contactResponse.style.display = 'none';
                        }, 6000);
                    } else {
                        throw new Error('Failed to send email via server');
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    btn.classList.remove('fly-anim');
                    btn.innerHTML = originalText;
                    btn.disabled = false;

                    contactResponse.style.display = 'block';
                    contactResponse.style.backgroundColor = '#f8d7da';
                    contactResponse.style.color = '#721c24';
                    contactResponse.innerText = 'Something went wrong. Please try again later.';
                }
            }, 700); // Wait 700ms for animation to play before sending
        });
    }

});
