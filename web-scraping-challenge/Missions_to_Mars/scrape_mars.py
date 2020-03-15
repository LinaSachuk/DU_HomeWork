from splinter import Browser
from bs4 import BeautifulSoup as bs
import requests
from selenium.webdriver.common.by import By
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
import pandas as pd
import os

mars_data = {}


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape_info():
    # =================================================================================
    # getting Mars news
    # =================================================================================

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


    # Close the browser after scraping
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
    
    # =================================================================================
    # Getting Mars Featured Image
    # =================================================================================
    
    #launch url
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'

    # create a new Chrome session
    driver = webdriver.Chrome()
    driver.implicitly_wait(30)
    driver.get(url)

    driver.find_element_by_id('full_image').click() 

    # more info     
    driver.find_element_by_partial_link_text('more info').click() 

    soup=bs(driver.page_source, 'lxml')
    results = soup.find_all('figure', class_='lede')

    for i in results:
        featured_image_url =  base_url + i.a['href']
        featured_image_title = i.img['title']
        # print("=================")
        # print(featured_image_url)
        # print(featureed_image_title)
        
    mars_data['featured_image_url'] = featured_image_url
    mars_data['featured_image_title'] = featured_image_title

    driver.quit()

    # =================================================================================
    # Getting Mars weather
    # =================================================================================

    url = 'https://twitter.com/marswxreport?lang=en'
    page = requests.get(url)

    soup = bs(page.content, 'html.parser')

    results = soup.find_all('div', class_='js-tweet-text-container')

    for result in results:
        if 'InSight sol' in result.text:
    #         print(result.text)
            mars_weather = result.text
            mars_weather = mars_weather.replace('pic.twitter.com',' ').rsplit(' ',1)[0]
            break
        

    # print(mars_weather.strip())

    # Adding data to the mars dictionary
    mars_data['mars_weather'] = mars_weather.strip()
    print(mars_data)
     
     
    # =================================================================================
    # Getting Mars Facts
    # =================================================================================
    
    url = 'https://space-facts.com/mars/'
    tables = pd.read_html(url)
        
    mars_profile_df = tables[0]
    mars_facts_html = mars_profile_df.to_html(index=False, header = False)
    
    mars_data['facts'] = mars_facts_html
    # print(mars_data)
    
    
    # =================================================================================
    # Getting Mars Hemispheres
    # =================================================================================
    

    hemisphere_image_urls = []
    # 1
    #launch url
    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'


    # create a new Chrome session
    driver = webdriver.Chrome()
    driver.get(url)

    driver.find_element_by_id('product-section')
    all_elements = driver.find_elements(By.TAG_NAME, 'h3')



    heading = all_elements[0]
    heading.click()

    soup=bs(driver.page_source, 'lxml')
    #     print(soup)

    h = {}

    results2 = soup.find_all('h2', class_='title')

    for result2 in results2:
        print(result2.text)
        h['title'] =result2.text

    results = soup.find_all('div', class_='wide-image-wrapper')
    for result in results:
        print('==============')
        print(result.a['href'])
        h['img_url'] = result.a['href']


    hemisphere_image_urls.append(h)
    driver.quit()
    
    # 2
    #launch url
    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'


    # create a new Chrome session
    driver = webdriver.Chrome()
    driver.get(url)

    driver.find_element_by_id('product-section')
    all_elements = driver.find_elements(By.TAG_NAME, 'h3')



    heading = all_elements[1]
    heading.click()

    soup=bs(driver.page_source, 'lxml')
    #     print(soup)

    h = {}

    results2 = soup.find_all('h2', class_='title')

    for result2 in results2:
        print(result2.text)
        h['title'] =result2.text

    results = soup.find_all('div', class_='wide-image-wrapper')
    for result in results:
        print('==============')
        print(result.a['href'])
        h['img_url'] = result.a['href']


    hemisphere_image_urls.append(h)
    driver.quit()

    # 3
    #launch url
    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'


    # create a new Chrome session
    driver = webdriver.Chrome()
    driver.get(url)

    driver.find_element_by_id('product-section')
    all_elements = driver.find_elements(By.TAG_NAME, 'h3')



    heading = all_elements[2]
    heading.click()

    soup=bs(driver.page_source, 'lxml')
    #     print(soup)

    h = {}

    results2 = soup.find_all('h2', class_='title')

    for result2 in results2:
        print(result2.text)
        h['title'] =result2.text

    results = soup.find_all('div', class_='wide-image-wrapper')
    for result in results:
        print('==============')
        print(result.a['href'])
        h['img_url'] = result.a['href']


    hemisphere_image_urls.append(h)
    driver.quit()

    # 4
    #launch url
    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'


    # create a new Chrome session
    driver = webdriver.Chrome()
    driver.get(url)

    driver.find_element_by_id('product-section')
    all_elements = driver.find_elements(By.TAG_NAME, 'h3')



    heading = all_elements[3]
    heading.click()

    soup=bs(driver.page_source, 'lxml')
    #     print(soup)

    h = {}

    results2 = soup.find_all('h2', class_='title')

    for result2 in results2:
        print(result2.text)
        h['title'] =result2.text

    results = soup.find_all('div', class_='wide-image-wrapper')
    for result in results:
        print('==============')
        print(result.a['href'])
        h['img_url'] = result.a['href']


    hemisphere_image_urls.append(h)
    driver.quit()

        # Cutting the last word from titles
    for i in hemisphere_image_urls:
        i['title'] = i['title'].rsplit(' ', 1)[0]
        
    mars_data['hemisphere_image_urls'] = hemisphere_image_urls

    # Return results
    return mars_data
