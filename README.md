# DHBW-Kino

DHBW-Kino is a frontend used to order some movie tickets in SAUE Sem 3.

## Installation

1. Clone from github
2. open folder
3. run "npm install"
4. run "npm start"

## Relevant Structure

### SRC /src
- /assets 
    - /images 
        - favicon.png 
- /components 
    - /container 
        - Cart.tsx -> Our Card 
        - CookieConsent.tsx -> Cookie Modal 
        - Footer.tsx -> Bottom of our page 
        - Paypal.tsx -> Our Paypal Payment System 
    - /menus 
        - /public 
            - TopMenu.tsx -> Our Top Bar of the page 
            - TopMenuData.ts -> Data for Top Bar 
    - /pages 
        - /admin 
            - AdminDetails.tsx -> Menu to switch between pages 
            - AdminOverview.tsx -> Check login and render childs 
            - NewPresentation.tsx -> Component to create a new presentation 
        - /private 
            - /Profile 
                - ContactData.tsx -> Add/delete adresses 
                - Orders.tsx -> See own orders 
                - ProfileRoot.tsx -> To render childs of the profile area 
                - Settings.tsx -> to change name, email, password 
        - /public 
            - Checkout.tsx -> Our checkout page to do payment 
            - DefualtModal.tsx -> A Component to render a modal in some areas 
            - Imprint.tsx -> Our Imprint 
            - LandingPage.tsx -> Our Homepage 
            - Login.tsx -> Page to login as a user 
            - MovieDetail.tsx -> Page to show detailed movie informations 
            - MovieOverview.tsx -> Show all available movies 
            - PresentationDetail.tsx -> Page to show detailed presentation information 
            - PresentationOverview.tsx -> Show all available Presentations 
            - Privacy.tsx -> Our terms of privacy 
            - Signup.tsx -> Page to register as a new user 
    - /seat-picker 
        - SeatPicker.tsx -> Our SeatPicker div 
- /services 
    - adminService.ts -> Our backend calls for admin 
    - movieService.ts -> Our backend calls for movies 
    - presentationsService.ts -> Our backend calls for presentations 
    - userService.ts -> Our backend calls for user-infos 
- App.tsx -> React Root comp
- axiosConfig.ts -> axios config for backend calls (http req) 
- constants.tsx -> some constants 
- index.html -> basic index 
- index.tsx -> js index 

### TESTS /tests
same structure like src!
