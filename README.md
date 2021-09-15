# URL aliases

URL aliases is a URL shortener webservice with extensive API and convenient user interface.
## API swagger & usage description

Available URL aliaces [GET]
~~~
curl --location --request GET 'localhost:3000/api/v1/urls' \
--header 'Content-Type: application/json'
~~~

Create new URL alias [POST]
~~~
curl --location --request POST 'localhost:3000/api/v1/url' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'slug=wiki' \
--data-urlencode 'source=https://en.wikipedia.org'
~~~

Delete using either `slug` or `source`[DELETE]
~~~
curl --location --request DELETE 'localhost:3000/api/v1/url' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'slug=wiki'


curl --location --request DELETE 'localhost:3000/api/v1/url' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'source=https://en.wikipedia.org'
~~~

## Done

* MongoDB integration
* Redirect by URL slug (short URL)
* Docker
* Linters and formatters


## ToDo

* Documentation

* REST API
* Tests
* Swagger
* CI/CD (at least linter checkers)
* Deployment by single script

