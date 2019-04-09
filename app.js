const puppeteer = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');
const log4js = require('log4js');
const fs = require('fs');


log4js.configure('./log4js.json');
let log = log4js.getLogger("app");

log.debug("Starting scratching pages...")

async function getPic() {
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto('https://google.com');
        await page.setViewport({width: 1000, height: 800})
        await page.screenshot({path: 'google.png'});
        await page.pdf({path: 'hn.pdf', format: 'A4'});      
        await browser.close();  
    } catch (error) {
        log.error("Error in getPic at app.js: ", error);
    }
   
  }
  
  getPic();


  async function scrapPage(){  
     
      try { 
        let obj = []          
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://books.toscrape.com/');

        await page.waitFor(1000);
        
    async function scrap (){        
        const result = await page.evaluate(() => {
            let data = [];
            let elements = document.querySelectorAll('.product_pod');
    
            for (var element of elements){
                let title = element.childNodes[5].innerText;
                let price = element.childNodes[7].children[0].innerText; 
    
                data.push({title, price});
            }
            
            
            return data; 
        });
        try {
            obj.push(result);
            const selector = '#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a';
            await page.waitForSelector(selector, {timeout: 1000}) 
            await page.click(selector) 
            await page.waitFor(100);                       
            await scrap()
           
        } catch (error) {
            if (error instanceof TimeoutError) {
                log.warn("End of pages")
                browser.close();
              } else {
                  log.error(error)
              }
        }
        
    }        
     await scrap();  
     let books = await Promise.all(obj);      
     fs.writeFile('books.txt', JSON.stringify(books, null, 2), (err) => {
             if (err) throw err;
             log.info('The file "books.txt" has been saved!');
           }); 
  
        
      } catch (error) {
          log.error("Error in scrapPage at app.js: ", error);
      }    
      }

 

 

scrapPage();

