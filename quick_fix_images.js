// Fix rápido para imágenes de episodios
document.addEventListener('DOMContentLoaded', function() {
    // Función para crear SVG placeholder
    function createSVGPlaceholder(season, episode) {
        const colors = ['#FF6B23', '#F7931E', '#FFCC02', '#8E44AD', '#E74C3C', '#2ECC71'];
        const bgColor = colors[episode % colors.length];
        
        return `data:image/svg+xml;charset=utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
                <defs>
                    <linearGradient id="g${season}${episode}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${bgColor}"/>
                        <stop offset="100%" stop-color="%232C3E50"/>
                    </linearGradient>
                </defs>
                <rect width="400" height="225" fill="url(%23g${season}${episode})"/>
                <text x="200" y="100" font-family="Arial" font-size="48" font-weight="bold" text-anchor="middle" fill="white">S${season}E${episode}</text>
                <text x="200" y="140" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="white">The Big Bang Theory</text>
                <text x="200" y="180" font-family="Arial" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)">Episodio ${episode}</text>
            </svg>`.replace(/\s+/g, ' ').trim();
    }
    
    // Reemplazar todas las imágenes de episodios
    const episodeImages = document.querySelectorAll('img[src*="episodes/"]');
    
    episodeImages.forEach(function(img) {
        // Extraer temporada y episodio de la ruta
        const match = img.src.match(/s(\d+)e(\d+)/);
        if (match) {
            const season = parseInt(match[1]);
            const episode = parseInt(match[2]);
            
            // Crear placeholder SVG
            const placeholderSrc = createSVGPlaceholder(season, episode);
            
            // Configurar eventos
            img.onerror = function() {
                this.src = placeholderSrc;
                this.onerror = null;
            };
            
            // Si la imagen ya está rota o no ha cargado
            if (!img.complete || img.naturalWidth === 0) {
                img.src = placeholderSrc;
            }
        }
    });
    
    console.log(`🎬 Fix aplicado a ${episodeImages.length} imágenes de episodios`);
});

