# URL Shortener
A simple URL shortener. This is the main example for 6.170 Recitation 6 on Data Model and Schema.

Credit to [Harihar Subramanyam](https://github.com/hariharsubramanyam) for the idea.

## Installing PostGreSQL locally
Notes before starting download and install:
- At some point you will be asked to select components to download, youc an include all the suggestions especially pgAdmin. pgAdmin will be the UI that you can use to interact with your DB.
- Note down the password for you super user postgres.
- Allow default port setting and others.

To download and install postgresql go to https://www.enterprisedb.com/downloads/postgres-postgresql-downloads.

## Starting a server
There should be default server and database when you start the pgAdmin. By clicking on the default server under "Servers" the server should start.

You can also create a new server if need be.
- Right click on Servers and choose to create a Server.
In the General Tab
- Set name for it in the General tab
In the Connection tab
- Set Host name/address to localhost.
- Set the port number to 5432(might be there by default).
- Set the username and password to the user name and password used when setting up pg. Username is by default postgres.
- Click Save

After tables are created you can see the tables by navigatng the left section. 
Servers -> [your server] -> Databases -> [your database] -> Schemas -> Tables
Right click a table and choose View/Edit Data

## App
For you app you need to remember:
- username
- password
- host (this is normally set to localhost)
- port (his is normally 5432)
- name of database

You will a connection detail string which is of the form 
postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]

The node package we will be using is 'pg-promise' which you will see int he package.json of this sample app.

The main changes are in db_config.js you need to require the new package and instantiate it differently(see file for more details).
Also the method for the pgDB are different so pay attention to the changes in run, get and all functions.

Things to note:
- In your models, correct your sql statement syntax to postgresql. eg: == not valid. must be =.
This doc will be helpful: https://www.tutorialspoint.com/postgresql/postgresql_syntax.htm

## Heroku
- You need to also include the dotenv package. This allows you to set variable in a .env file and access the vairables in your application. Heroku uses the .env to tell your app where the postgresql server is. See .env file, package.json and db_config.js files for more information.
- Install the Heroku CLI if you haven't already.
- run "heroku login" and follow steps.
- run "heroku create [my app name]"
- run "heroku addons:create heroku-postgresql:hobby-dev --app=[my app name]"
- run "heroku addons" to verify that your app shows up with a heroku-postgresql plan. The hobby-dev plan is free!
- run "heroku local web" to test the heroku instance locally at http://localhost:5000
- run "heroku git:remote -a [my app name]" to create your heroku remote
- push code to heroku with "git add .", "git commit -m '[commit message]'", "git push heroku master"

Helpful link: taniarascia.com/node-express-postgresql-heroku/#deploy-app-to-heroku
https://devcenter.heroku.com/articles/heroku-postgresql#set-up-postgres-on-windows
