const fs = require('fs');
const path = require('path');
const glob = require('glob');

// --- CONFIGURATION ---
const HOSTNAME = 'https://www.technarion.com';
const PAGES_FOLDER = './public'; // Or the path to your static pages folder
const OUTPUT_FILE = './public/sitemap.xml';

// --- MAIN FUNCTION ---
function generateSitemap() {
    // Start the XML with the required header
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Get all HTML files from the specified folder
    const files = glob.sync(`${PAGES_FOLDER}/**/*.html`);

    files.forEach(file => {
        // Get the relative path to the file
        const relativePath = path.relative(PAGES_FOLDER, file);
        
        // Exclude common files you don't want to include
        if (relativePath === '404.html') {
            return;
        }

        // Generate the URL based on the file path
        let urlPath = relativePath.replace('index.html', '').replace('.html', '');
        urlPath = urlPath.replace(/\\/g, '/'); // Normalize path separators for Windows
        const fullUrl = `${HOSTNAME}/${urlPath}`;

        // Add the URL to the sitemap
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${fullUrl}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        sitemap += `  </url>\n`;
    });

    // Close the XML
    sitemap += '</urlset>';

    // Write the sitemap to a file
    fs.writeFileSync(OUTPUT_FILE, sitemap);
    console.log(`Sitemap generated successfully at ${OUTPUT_FILE}`);
}

generateSitemap();