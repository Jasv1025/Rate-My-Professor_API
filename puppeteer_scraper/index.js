// Import the Puppeteer library for headless browser automation
import puppeteer from 'puppeteer';

/**
 * Fetches professor data from RateMyProfessors based on a search name.
 * @param {string} name - Full name of the professor to search for.
 * @returns {Object|null} - An object containing professor details or null on error/failure.
 */
export async function fetchProfessorData(name) {
  // Launch a headless browser instance with sandboxing disabled for Docker compatibility
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Open a new browser tab
  const page = await browser.newPage();
  
  // Set a custom user-agent to avoid detection and potential bot blocking
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36");

  // Format the professor's name into a URL-friendly search query, 1087 is the code for CU Boulder change for a different school
  const searchQuery = name.replace(/\s+/g, '+');
  const url = `https://www.ratemyprofessors.com/search/professors/1087?q=${searchQuery}`;

  console.error("Navigating to:", url);

  try{
    // Navigate to the search results page and wait until the DOM content is loaded
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for at least one professor card to appear on the page
    await page.waitForSelector('a.TeacherCard__StyledTeacherCard-syjs0d-0', { timeout: 15000 });

    // Scrape data from the first matching professor card
    const result = await page.evaluate(() => {
      const prof = document.querySelector('a.TeacherCard__StyledTeacherCard-syjs0d-0');
      if (!prof) return null;

      const name = prof.querySelector('.CardName__StyledCardName-sc-1gyrgim-0')?.innerText.trim() || '';
      const department = prof.querySelector('.CardSchool__Department-sc-19lmz2k-0')?.innerText.trim() || '';
      const school = prof.querySelector('.CardSchool__School-sc-19lmz2k-1')?.innerText.trim() || '';
      const rating = prof.querySelector('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2')?.innerText.trim() || '';
      const numRatings = prof.querySelector('.CardNumRating__CardNumRatingCount-sc-17t4b9u-3')?.innerText.trim() || '';

      return{
        name,
        department,
        school,
        rating,
        numRatings
      };
    });

    await browser.close(); // Close the browser after scraping
    return result;
  }catch(err){
    // Log and return null if any error occurs during scraping
    console.error("Puppeteer error:", err.message);
    await browser.close();
    return null;
  }
}

// If run from the command line (not imported), take the professor name from args and print result
if(process.argv[2]){
  const searchName = process.argv.slice(2).join(" ");
  fetchProfessorData(searchName).then((data) => {
    console.log(JSON.stringify(data || { error: "Professor not found" }));
  });
}