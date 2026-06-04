const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Take a screenshot
  await page.screenshot({ path: 'home.png' });
  console.log('✅ Home page loaded successfully');
  
  // Click the chatbot button
  await page.click('button[class*="fixed bottom-6"]');
  await page.waitForTimeout(1000);
  
  // Take a screenshot of the chat
  await page.screenshot({ path: 'chatbot_opened.png' });
  console.log('✅ Chatbot opened');
  
  // Type a message
  await page.fill('input[placeholder*="Type"]', 'Hi! Can you tell me about website design?');
  await page.press('input[placeholder*="Type"]', 'Enter');
  
  await page.waitForTimeout(3000);
  
  // Take a screenshot of the response
  await page.screenshot({ path: 'chatbot_response.png' });
  console.log('✅ Message sent and response received');
  
  await browser.close();
})();
