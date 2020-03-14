from splinter import Browser
from bs4 import BeautifulSoup as bs
import time
mars_data = {}


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape_info():
    browser = init_browser()

    url = 'https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
    browser.visit(url)

    time.sleep(1)

    # Scrape page into Soup
    html = browser.html
    soup = bs(html, "html.parser")

    news_title = soup.find('div', class_='content_title').text
    news_p = soup.find('div', class_='article_teaser_body').text
    # print(news_title)
    # print(news_p)
    
    mars_data['news_title'] = news_title
    mars_data['news_p'] = news_p


    # # Close the browser after scraping
    # browser.quit()
   
    
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)
    

    base_url = 'https://www.jpl.nasa.gov/'

    results = soup.find_all('figure', class_='lede')
    for i in results:
        featured_image_url =  base_url + i.a['href']
        print("=================")
        
        print(featured_image_url)
        print(i.img['title'])
        
    browser.quit()
    
    
    
    

    # Return results
    return mars_data
