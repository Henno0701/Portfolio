// Shared animated background for every page: slow, blurry color blobs
// plus a soft glow that follows the mouse.
// Load it right after the Tailwind CDN script, e.g. <script src="../background.js"></script>
(() => {
    // Slow grow/shrink animations for the blobs
    if (window.tailwind) {
        tailwind.config = {
            theme: {
                extend: {
                    keyframes: {
                        'blob-1': {
                            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                            '33%': { transform: 'translate(12vw, 6vh) scale(1.3)' },
                            '66%': { transform: 'translate(4vw, 14vh) scale(0.9)' },
                        },
                        'blob-2': {
                            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                            '50%': { transform: 'translate(-14vw, 10vh) scale(1.4)' },
                        },
                        'blob-3': {
                            '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
                            '40%': { transform: 'translate(-10vw, -12vh) scale(0.85)' },
                            '70%': { transform: 'translate(8vw, -4vh) scale(1.3)' },
                        },
                        'blob-4': {
                            '0%, 100%': { transform: 'translate(0, 0) scale(0.8)' },
                            '50%': { transform: 'translate(6vw, -8vh) scale(1.25)' },
                        },
                    },
                    animation: {
                        'blob-1': 'blob-1 26s ease-in-out infinite',
                        'blob-2': 'blob-2 32s ease-in-out infinite',
                        'blob-3': 'blob-3 38s ease-in-out infinite',
                        'blob-4': 'blob-4 30s ease-in-out infinite',
                    },
                },
            },
        };
    }

    // Each blob is two divs: the outer one moves, the inner one holds the blur.
    // That way Chrome draws the blur once instead of every frame, which keeps it smooth.
    const backgroundHtml = `
        <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div class="absolute -left-[10vmax] -top-[10vmax] h-[45vmax] w-[45vmax] will-change-transform motion-safe:animate-blob-1">
                <div class="h-full w-full rounded-full bg-[#7B2CBF] opacity-20 blur-[120px]"></div>
            </div>
            <div class="absolute -right-[12vmax] top-[15vh] h-[40vmax] w-[40vmax] will-change-transform motion-safe:animate-blob-2">
                <div class="h-full w-full rounded-full bg-[#F8139C] opacity-10 blur-[120px]"></div>
            </div>
            <div class="absolute -bottom-[15vmax] left-[20vw] h-[50vmax] w-[50vmax] will-change-transform motion-safe:animate-blob-3">
                <div class="h-full w-full rounded-full bg-[#5200FF] opacity-[0.15] blur-[120px]"></div>
            </div>
            <div class="absolute left-[40vw] top-[30vh] h-[30vmax] w-[30vmax] will-change-transform motion-safe:animate-blob-4">
                <div class="h-full w-full rounded-full bg-[#3FF3FF] opacity-[0.06] blur-[120px]"></div>
            </div>

            <!-- Glow that follows the mouse -->
            <div id="cursor-glow" class="absolute left-0 top-0 h-[18rem] w-[18rem] opacity-0 transition-opacity duration-700 will-change-transform">
                <div class="h-full w-full rounded-full bg-[#9D4EDD] blur-[80px]"></div>
            </div>
        </div>`;

    // Soft glow that eases after the mouse (only on devices with a real mouse)
    function initCursorGlow(glow) {
        if (!glow || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        let targetX = 0, targetY = 0, x = 0, y = 0;
        let started = false, running = false;

        const render = () => {
            x += (targetX - x) * 0.08;
            y += (targetY - y) * 0.08;
            glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

            if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
                requestAnimationFrame(render);
            } else {
                running = false;
            }
        };

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;

            if (!started) {
                x = targetX;
                y = targetY;
                started = true;
            }

            glow.style.opacity = '0.2';

            if (!running) {
                running = true;
                requestAnimationFrame(render);
            }
        });

        // Fade out when the mouse leaves the window
        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget) glow.style.opacity = '0';
        });
    }

    function initBackground() {
        document.body.insertAdjacentHTML('afterbegin', backgroundHtml);
        initCursorGlow(document.getElementById('cursor-glow'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackground);
    } else {
        initBackground();
    }
})();
