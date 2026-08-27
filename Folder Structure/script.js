/* ==========================================================================
   MOHAB AGENCY — JAVASCRIPT LOGIC & LIVE STATUS AUTOMATION
   script.js — Live Detection, FX Density, Clean Sound & Interactive UI
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Canvas Cyberpunk Background Animation with Dynamic FX Density
    const canvas = document.getElementById("nexus-canvas");
    let currentParticleCount = 45; // Default Normal density
    let particles = [];

    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        function initParticles() {
            particles = Array.from({ length: currentParticleCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.8 + 0.5,
                speedY: (Math.random() * 0.5 - 0.25),
                speedX: (Math.random() * 0.5 - 0.25),
                opacity: Math.random() * 0.6 + 0.2
            }));
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const accentColor = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#FF0000";

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.fillStyle = accentColor;
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();

        // ربط أزرار الـ FX Density بتغيير عدد الجسيمات فوراً
        const fxBtns = document.querySelectorAll("[data-fx]");
        fxBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                fxBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active", "pulse-click");
                setTimeout(() => btn.classList.remove("pulse-click"), 300);

                const fxLevel = btn.getAttribute("data-fx");
                if (fxLevel === "low") {
                    currentParticleCount = 18;
                } else if (fxLevel === "normal") {
                    currentParticleCount = 45;
                } else if (fxLevel === "high") {
                    currentParticleCount = 90;
                }
                initParticles();
                playSubtleClick();
            });
        });
    }

    // High-End Minimal Audio Feedback
    let audioCtx = null;
    function playSubtleClick() {
        const activeSfxBtn = document.querySelector("[data-sfx].active");
        if (!activeSfxBtn || activeSfxBtn.getAttribute("data-sfx") !== "on") return;

        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {}
    }

    // -------------------------------------------------------------------------
    // نظام محاكاة حالة البث (Live Status Automation)
    // يمكنك تعديل المتغير isLive إلى true فوراً حين تبدأ البث، أو ربطه لاحقاً بـ Kick API
    // -------------------------------------------------------------------------
    const isLive = false; // اجعلها true لتجربة شكل الموقع أثناء البث المباشر

    if (isLive) {
        // 1. تحديث شارة الـ Navbar (أوفلاين تتحول لأونلاين ولمبة خضراء منورة)
        const navStatusLabel = document.getElementById("brand-status-label");
        const navDot = document.getElementById("nav-dot");
        const liveStatusBox = document.getElementById("live-status-box");
        const topLivePill = document.getElementById("top-live-pill");

        if (navStatusLabel) {
            navStatusLabel.textContent = "ONLINE";
            navStatusLabel.classList.add("online");
        }
        if (navDot) navDot.classList.add("is-live");
        if (liveStatusBox) liveStatusBox.classList.add("is-live-popup");
        if (topLivePill) topLivePill.style.display = "flex";

        // 2. تحديث كارت البث الكبير في الهيرو (Hero Live Card)
        const heroLiveCard = document.getElementById("hero-live-card");
        const cardDotStatus = document.getElementById("card-dot-status");
        const liveCardStatus = document.getElementById("live-card-status");
        const heroScreenBox = document.getElementById("hero-screen-box");

        if (heroLiveCard) heroLiveCard.classList.add("is-live-card");
        if (cardDotStatus) cardDotStatus.classList.add("is-live");
        if (liveCardStatus) liveCardStatus.textContent = "LIVE ON KICK";
        if (heroScreenBox) {
            // هنا يمكنك وضع كود تضمين بث كيك الحقيقي (Embed Player) أو صورة المعاينة الحية
            heroScreenBox.innerHTML = `<iframe src="https://player.kick.com/imohab" height="100%" width="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>`;
        }

        // 3. تحديث كارت كيك في قسم المنصات (Channels) لتحويله لوضع اللايف بحدود منورة
        const kickCard = document.querySelector(".brand-kick");
        if (kickCard) {
            kickCard.classList.add("is-live-platform");
            const actionTypeSpan = kickCard.querySelector(".action-type");
            if (actionTypeSpan) actionTypeSpan.textContent = "LIVE ON KICK";
        }
    }

    // Mouse Spotlight & Card Glow Tracking
    const spotlight = document.getElementById("mouse-spotlight");
    window.addEventListener("mousemove", (e) => {
        if (spotlight) {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
        }

        document.querySelectorAll(".cyber-card").forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // Customizer Drawer Toggle
    const settingsToggle = document.getElementById("settings-toggle");
    const drawer = document.getElementById("customizer-drawer");
    const closeDrawer = document.getElementById("close-drawer");

    if (settingsToggle && drawer) {
        settingsToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            drawer.classList.toggle("open");
            playSubtleClick();
        });

        document.addEventListener("click", (e) => {
            if (!drawer.contains(e.target) && !settingsToggle.contains(e.target)) {
                drawer.classList.remove("open");
            }
        });
    }

    if (closeDrawer && drawer) {
        closeDrawer.addEventListener("click", () => {
            drawer.classList.remove("open");
            playSubtleClick();
        });
    }

    // Theme Switcher
    document.querySelectorAll(".theme-box").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".theme-box").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const theme = btn.getAttribute("data-theme");
            document.documentElement.setAttribute("data-theme", theme);
            playSubtleClick();
        });
    });

    // Accent Color Switcher
    document.querySelectorAll(".color-dot").forEach(dot => {
        dot.addEventListener("click", () => {
            document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
            dot.classList.add("active");
            const color = dot.getAttribute("data-color");
            document.body.setAttribute("data-accent", color);
            playSubtleClick();
        });
    });

    // Hover SFX Buttons Selector Logic
    const sfxBtns = document.querySelectorAll("[data-sfx]");
    sfxBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            sfxBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active", "pulse-click");
            setTimeout(() => btn.classList.remove("pulse-click"), 300);
            playSubtleClick();
        });
    });

    // Scroll to Top Button Functionality
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            playSubtleClick();
        });
    }

    // Email Copy Button
    const copyBtn = document.querySelector(".copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText("mohab@agency.com");
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "COPIED!";
            playSubtleClick();
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    }
});