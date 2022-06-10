const webdriver = require('selenium-webdriver');
const { Executor } = require('selenium-webdriver/http');
const By = webdriver.By
const until = webdriver.until
const logger = require('./logger');


const {Console} = require('console');
const fs = require('fs');

require("chromedriver");

async function linkedinWorker(){
    
    const driver = await new webdriver.Builder()
        .forBrowser("chrome")
        .build();

        await driver.manage().window().maximize()


            // LINKEDIN LOGIN
        try{
            await driver.get('https://www.linkedin.com')
            await driver.findElement(By.xpath('/html/body/nav/div/a[2]')).click();
            await driver.wait(until.elementLocated(By.id('username')), 5000).sendKeys('mabudisa@vsite.hr');
            await driver.wait(until.elementLocated(By.id('password')), 5000).sendKeys('robertrobertic');
            await driver.wait(until.elementLocated(By.xpath('//*[@id="organic-div"]/form/div[3]/button')),5000).click();
        } catch(error) {
           logger.error('Linkedin login :', error);
        } 
        
        // ME + VIEW PROFILE
        try {
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/header/div/nav/ul/li[6]/div/button')), 15000).click(); // stavljeno 15 sekundi zbog captche
            await driver.sleep(1000);
            //viewProfile.sendKeys(webdriver.Key.TAB);
            //viewProfile.sendKeys(webdriver.Key.ENTER);
            //await driver.wait(until.elementLocated(By.xpath("///html/body/div[7]/header/div/nav/ul/li[6]/div/div')]")), 5000).click();
            await driver.wait(until.elementLocated(By.linkText('View Profile')),5000).click();
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/button')), 5000).click();
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/div[1]/div/ul/li[1]')), 5000).click();

        } catch(error){
            logger.error('Me + View profile :', error);
        }
        
        // FORMA ZA DODAVANJE POSLA
        try{
            //sendKeys() mi nije radio za cijelu formu ovdje, pa sam posebno tagirao pojedine inpute te po zasebnom inputu napravio sendKeys()
            
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[1]/div/div/div[1]/div/input')), 5000).sendKeys('Junior software engineer');
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[3]/div/div/div[1]/div/input')), 5000).sendKeys('Neyho Informatika d.o.o.');
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[6]/div/div/div/div[1]/fieldset[1]/div/span[1]/select')), 5000).sendKeys('May');
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[6]/div/div/div/div[1]/fieldset[1]/div/span[2]/select')), 5000).sendKeys('2022');

            //opcija Internet se ne može odabrati pa sam stavio Internet News
            const internet = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[8]/div/div/div[1]/div/input')), 5000);
            //clearam input jer pamti cijelo vrijeme
            internet.clear();
            internet.sendKeys('Internet News');
            //sleep() jer sendKeys() odma opali po key.enter kojeg ne hvata 
            await driver.sleep(1000);
            internet.sendKeys(webdriver.Key.ENTER);
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[3]/button')), 5000).click();

            //zatvaranje modal windowa od forme
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[3]/div/button')),5000).click();
        } catch(error){
            logger.error('Forma za poslove :', error);
        }

        //ADDING JOBS
        try{
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/header/div/nav/ul/li[3]/a')), 5000).click();

            //zbog toga što se drugi input za lokaciju pojavljuje tek nakon što smo upisali job search, spremio sam search u varijable kako bih mogao lakse upravljati sa njima
            const jobs = await driver.wait(until.elementLocated(By.className('jobs-search-box__text-input')), 5000);
            jobs.sendKeys('Software Developer Intern');
           
            //upis lokacije
            const location = await driver.wait(until.elementLocated(By.className('jobs-search-box__text-input')), 5000);
            location.sendKeys(webdriver.Key.TAB);
            location.sendKeys('Croatia');
            location.sendKeys(webdriver.Key.ENTER);
            

            //SetAlert = ON, umjesto klika na alert, sa isEnabled provjerim je li već kliknut
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div[3]/div[2]/div/section[1]/div/header/div[2]/div/div')),5000).isEnabled();
            
            const postedJobs = await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div[3]/div[2]/div/section[1]/div/div/ul')), 5000).getText();
        
            fs.writeFile('data.json', JSON.stringify(postedJobs), (err) => {
                   if(err) throw err;
                   console.log('Added data');
            });
        } catch(error){
            logger.error('Poslovi :', error);
        }
            
            // logging jobs to .txtLog
            /*const myLogger = new Console({
                stdout: fs.createWriteStream("normalStdout.txt"),
                stderr: fs.createWriteStream("errStderr.txt")
            });

            myLogger.log(postedJobs);*/

            //sleep da kopira sve poslove
        await driver.sleep(1000);

        //MESSAGING
        try{
            //Edge case, slanje poruke je uspjeno samo ako vec nije ostvarena komunikacija sa korisnikom
            //treba provjeriti sta ako je kontakt vec otvoren ??

            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/header/div/nav/ul/li[4]/a')), 5000).click();
            const primaoc = await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div[2]/div/div/main/div/section[2]/div[2]/div[2]/div/div/section/div/input')),5000);
            primaoc.clear();
            primaoc.sendKeys('Lea Malešević');
            await driver.sleep(1000);
            primaoc.sendKeys(webdriver.Key.ENTER);
            //await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div[2]/div/div/main/div/section[2]/div[2]/div[2]/div/div/div')), 5000).click();
            await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[3]/div[2]/div/div/main/div/section[2]/div[2]/form/div[2]/div/div[1]/div[1]/p')),5000).sendKeys('Hi\n\nMy name is Robot Robotić and this is test message.');

            //sleep dok se send gumb ne enabla
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.className('msg-form__send-button')),5000).click();
        } catch(error) {
            logger.error('Poruke :', error);
        }
   // await driver.quit();
}
linkedinWorker();
