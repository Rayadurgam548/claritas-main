document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-sequence');
    const man = document.querySelector('.man-container');
    const brand = document.querySelector('.brand-reveal');
    const introManImg = document.getElementById('intro-man');

    // Particles System
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.getElementById('particles-canvas').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 100;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resize);
    resize();
    // Magnetic Effect Logic
    function initMagneticEffect() {
        const letters = document.querySelectorAll('#brand-name span');
        
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            
            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const letterX = rect.left + rect.width / 2;
                const letterY = rect.top + rect.height / 2;
                
                const distanceX = clientX - letterX;
                const distanceY = clientY - letterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                const maxDistance = 300;
                if (distance < maxDistance) {
                    const power = (maxDistance - distance) / maxDistance;
                    const x = distanceX * power * 0.3;
                    const y = distanceY * power * 0.3;
                    letter.style.transform = `translate(${x}px, ${y}px) scale(${1 + power * 0.2})`;
                } else {
                    letter.style.transform = `translate(0, 0) scale(1)`;
                }
            });
        });
    }

    // Cinematic Intro Sequence Logic (Indefinite Experience)
    async function startIntro() {
        const fallbackSrc = 'https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?q=80&w=2000&auto=format&fit=crop';
        
        introManImg.src = fallbackSrc;
        introManImg.classList.remove('hidden');
        introManImg.style.display = 'block';
        
        initMagneticEffect();
        
        // 1. Man enters (0s -> 1.5s)
        man.style.transition = 'transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
        man.style.transform = 'translateX(calc(50vw + 150px))';
        
        await wait(1000); 
        
        // 2. Brand Reveal (1s -> 2s)
        brand.style.opacity = '1';
        brand.style.transform = 'scale(1)';
        
        // Sequence ends here, staying in the revealed/interactive state.
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startIntro();
});
