import {test,expect} from '@playwright/test';
import profile from '../../src/data/profile.json' with { type: 'json' };
test('portfolio navigation, publications and shared local chat',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/api/chat', route=>route.fulfill({json:{answer:'Test response from portfolio sources.'}}));
 await page.goto('/');await expect(page.getByRole('heading',{name:profile.name,exact:true})).toBeVisible();
 await expect(page.locator('.publication')).toHaveCount(20);
 await page.getByLabel('Publication type').selectOption('journal');await expect(page.locator('.publication')).toHaveCount(5);
 await page.locator('.hero').getByRole('button',{name:'How does he use artificial intelligence?',exact:true}).click();
 await expect(page.locator('.hero .message.assistant')).toContainText(/Local search|Test response from portfolio sources/);
 await page.getByRole('button',{name:'Open Zoey AI assistant'}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#dialog-chat .message.assistant')).toHaveText(await page.locator('.hero .message.assistant').textContent() || '');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();expect(errors).toEqual([]);
});

test('education wheel, photo slots and immersive timeline remain usable',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('header > a')).toHaveText('GALVESVLV');
 await expect(page.locator('.portrait .photo-frame')).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('cover.png')});
 await expect(page.locator('.citation-count')).toHaveCount(0);
 await expect(page.locator('.wheel-sector')).toHaveCount(9);
 const wheel=page.locator('.education-wheel');
 await wheel.getByRole('button',{name:'Biosystems Engineering',exact:true}).focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('.education-detail')).toContainText('Master’s research');
 await wheel.screenshot({path:testInfo.outputPath('education-wheel.png')});
 await page.locator('#education-msc').scrollIntoViewIfNeeded();
 await expect(page.locator('#education-msc')).toBeVisible();
 await expect(page.locator('#education .map-aside')).toHaveCSS('position','sticky');
 const map=await page.locator('#education .map-host').boundingBox();
 expect(map?.width).toBe(page.viewportSize()!.width);
 const ordered=await page.locator('#education .story-step').evaluateAll(nodes=>nodes.map(node=>node.id));
 expect(ordered.slice(-2)).toEqual(['education-msc','education-vision']);
 await page.screenshot({path:testInfo.outputPath('story-map.png')});
 await expect(page.locator('.zoey-portrait figcaption')).toContainText('my dog');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
