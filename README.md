<h1 align="center">
  <br>
  <a href="https://natours-website-app.herokuapp.com/"> <img src="https://raw.githubusercontent.com/Denver44/Natours-MERN-App/main/public/img/logo-green.png" alt="Natours" width="200"></a>
  <br>
  Natours
  <br>
</h1>

<h4 align="center">An awesome tour booking site built on top of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

 <p align="center">
 <a href="#deployed-version">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#demonstration">Demonstration</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#build-with">Build With</a> •
  <a href="#installation">Installation</a> • 
  <a href="#known-bugs">Known Bugs</a> • 
  <a href="#future-updates">Future Updates</a> • 
  <a href="#acknowledgement">Acknowledgement</a>
</p>

## Deployed Version

Live demo (Feel free to visit) 👉 : https://natours-website-app.herokuapp.com/

## Key Features

- Authentication and Authorization
  - Login and logout
- Tour
  - Manage booking, check tours map, check user's reviews & rating
- User profile
  - Update username, photo, email, and password
- Online Payment through Stripe

## Demonstration

#### Home Page :

![natoursHomePageonline-video-cutt](https://github.com/Denver44/Natours-MERN-App/blob/main/public/video/Natours-All-Tours.gif?raw=true)

#### Tour Details :

![paymentprocess-1-ycnhrceamp4-7fW](https://github.com/Denver44/Natours-MERN-App/blob/main/public/video/Natours-exploring-a-tour.gif?raw=true)

#### Payment Process :

![tourOverviewonline-video-cutterc](https://github.com/Denver44/Natours-MERN-App/blob/main/public/video/Natours-Booking-a-tour.gif?raw=true)

#### Booked Tours :

<img src="https://github.com/Denver44/Natours-MERN-App/blob/main/public/img/screenshots/Natours%20_User-booked-tours.png?raw=true" width="450" height="450" alt="admin_profile" />

#### User Profile :

<img src="https://github.com/Denver44/Natours-MERN-App/blob/main/public/img/screenshots/Natours%20_%20Useraccount.png?raw=true" width="450" height="450" alt="admin_profile" />

#### Admin Profile :

<img src="https://github.com/Denver44/Natours-MERN-App/blob/main/public/img/screenshots/Natours%20_%20Admin-account.png?raw=true" width="450" height="450" alt="admin_profile" />

## How To Use

### Book a tour

- Login to the site
- Search for tours that you want to book
- Book a tour
- Proceed to the payment checkout page
- Enter the card details (Test Mood):
  ```
  - Card No. : 4242 4242 4242 4242
  - Expiry date: 02 / 22
  - CVV: 222
  ```
- Finished!

### Manage your booking

- Check the tour you have booked in "Manage Booking" page in your user settings. You'll be automatically redirected to this
  page after you have completed the booking.

### Update your profile

- You can update your own username, profile photo, email and password.

## Build With

- [NodeJS](https://nodejs.org/en/) - JS runtime environment
- [Express](http://expressjs.com/) - The web framework used
- [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
- [Pug](https://pugjs.org/api/getting-started.html) - High performance template engine
- [JSON Web Token](https://jwt.io/) - Security token
- [ParcelJS](https://parceljs.org/) - Blazing fast, zero configuration web application bundler
- [Stripe](https://stripe.com/) - Online payment API
- [Postman](https://www.getpostman.com/) - API testing
- [Mailtrap](https://mailtrap.io/) & [Sendgrid](https://sendgrid.com/) - Email delivery platform
- [Heroku](https://www.heroku.com/) - Cloud platform

## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running

```bash
$ npm i
set your env variables
$ npm run watch:js
$ npm run build:js
$ npm run start:dev (for development)
$ npm run start:prod (for production)
$ npm run debug (for debug)
```

## Known Bugs

Feel free to email me at denver.io@protonmail.com if you run into any issues or have questions, ideas or concerns.
Please enjoy and feel free to share your opinion, constructive criticism, or comments about my work. Thank you! 🙂

## Future Updates

- Allow user to add a review directly at the website after they have taken a tour
- Prevent duplicate bookings after user has booked that exact tour, implement favourite tours
- confirm user email, login with refresh token, 2FA
- Show the most popular and viewed tour among travellers.
- Improve overall UX/UI
- Build the frontend in NextJs framework.
- Create CI/CD pipeline
- Create a Dokcer Image
- And More ! There's always room for improvement!

## Acknowledgement

- This project is part of the online course I've taken at Udemy. Thanks to Jonas Schmedtmann for creating this awesome course! Link to the course: [Node.js, Express, MongoDB & More: The Complete Bootcamp 2019](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
