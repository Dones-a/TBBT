// Script para reemplazar TODAS las imágenes directamente con SVG data URIs
function createSVGDataURI(season, episode) {
    const colors = ['FF6B23', 'F7931E', 'FFCC02', '8E44AD', 'E74C3C', '2ECC71'];
    const bgColor = colors[episode % colors.length];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
        <defs>
            <linearGradient id="grad${season}${episode}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#${bgColor}"/>
                <stop offset="100%" stop-color="#2C3E50"/>
            </linearGradient>
        </defs>
        <rect width="400" height="225" fill="url(#grad${season}${episode})"/>
        <text x="200" y="100" font-family="Arial,sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">S${season}E${episode}</text>
        <text x="200" y="140" font-family="Arial,sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">The Big Bang Theory</text>
        <text x="200" y="180" font-family="Arial,sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)">Episodio ${episode}</text>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Reemplazar INMEDIATAMENTE todas las imágenes
console.log('🎬 Iniciando reemplazo de imágenes...');

document.querySelectorAll('img[src*="episodes/"]').forEach(img => {
    const match = img.src.match(/s(\d+)e(\d+)/);
    if (match) {
        const season = parseInt(match[1]);
        const episode = parseInt(match[2]);
        const newSrc = createSVGDataURI(season, episode);
        
        console.log(`Reemplazando ${img.src} con SVG placeholder`);
        img.src = newSrc;
        img.style.display = 'block'; // Asegurar que sea visible
    }
});

console.log('✅ Reemplazo de imágenes completado');



