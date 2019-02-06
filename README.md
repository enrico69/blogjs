# JAW (Just A Word)

## A basic blog engine running with express.js
It is an educational project to produce a simple blog engine.
Features include:
- Category pages.
- Article page.
- Contact page.
- Search an article.
- Best article on the home page and on the bottom of each article page.
- Translation (just add the translation file, US english and french are already included).
- Discus integration.
- Link to your Github repository.
- Link to your Linkedin profile.
- Administration space

Features which will be added later:
- Possibility to have many authors.
- Possibility for developers to override the native code.

## Under the hood
This blog engine run with:
- Node JS
- Express.js
- A custom extra layer
- A simple blog theme (see licence)

## How to use it
- Clone this depot or download the archive.
- Create a database and import the schema stored in the _schema.sql_ file.
- Put the codebase in a directory on your server.
- Run a _npm install_ command.
- Copy the _config/preferences.yaml.dist_ file to _config/preferences.yaml_.
- Edit this copy to add your custom settings.
- Set your server to start the _index.js_ 

## Licences
- The express.js base rely on the licence is the one applied by its author (see the express.js repository for more information).
- The JAW layer is on MIT licence.
- The Peugeot 404 picture visible on the 404 page is under the Wikimedia commons licence.
- The simple blog template is under MIT licence (see https://startbootstrap.com/themes/clean-blog/)