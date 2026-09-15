import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',use:{baseURL:'http://localhost:4173',channel:'chromium'},webServer:{command:'npm run preview -- --port 4173',url:'http://localhost:4173',reuseExistingServer:!process.env.CI},projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844}}}]});
