/**
 * Browser Console Script: Extract Vimeo URLs from Squarespace Page
 *
 * Usage:
 * 1. Open the Squarespace project page in your browser (e.g., anoushkagarg.com/fotex)
 * 2. Open browser DevTools (F12 or Cmd+Option+I)
 * 3. Go to Console tab
 * 4. Paste this entire script and press Enter
 * 5. The script will copy a JSON object to your clipboard
 * 6. Paste the JSON into scripts/url-data/urls-{project-name}.json
 */

(function extractVimeoURLs() {
  // Extract all Vimeo iframe sources
  const iframes = document.querySelectorAll('iframe[src*="vimeo.com"]');
  const vimeoUrls = Array.from(iframes).map(iframe => iframe.src);

  // Extract Vimeo IDs from URLs
  const vimeoIds = vimeoUrls.map(url => {
    const match = url.match(/vimeo\.com\/video\/(\d+)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  // Extract all Squarespace images
  const images = document.querySelectorAll('img[src*="squarespace.com"]');
  const imageUrls = Array.from(images)
    .map(img => img.src)
    .filter(src => !src.includes('spacer.gif')); // Filter out spacer images

  // Get project name from URL
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const projectName = pathParts[pathParts.length - 1] || 'homepage';

  // Create JSON object
  const data = {
    project: projectName,
    vimeoIds: [...new Set(vimeoIds)], // Deduplicate
    vimeoUrls: [...new Set(vimeoUrls)], // Deduplicate
    images: [...new Set(imageUrls)] // Deduplicate
  };

  // Copy to clipboard using fallback method
  const jsonString = JSON.stringify(data, null, 2);

  // Create temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = jsonString;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (successful) {
      console.log('✅ Copied to clipboard!');
      console.log('\nFound:');
      console.log(`- ${data.vimeoIds.length} Vimeo videos`);
      console.log(`- ${data.images.length} images`);
      console.log('\nJSON preview:');
      console.log(jsonString);
      console.log('\nNext steps:');
      console.log(`1. Create file: scripts/url-data/urls-${projectName}.json`);
      console.log('2. Paste the clipboard content into that file');
      console.log('3. Run: tsx scripts/download-vimeo.ts');
    } else {
      throw new Error('Copy command failed');
    }
  } catch (err) {
    document.body.removeChild(textarea);
    console.error('Failed to copy to clipboard:', err);
    console.log('\nManually copy this JSON:');
    console.log(jsonString);
  }

  return data;
})();
