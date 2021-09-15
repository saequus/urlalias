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

Updating URL is possible by slug or by source. Provide `source`, `slug` and `using` (one of strings: 'slug' or  'source') body parameters. The `using` parameter defines which parameter is used to filter URL and the not-using is the value to be saved to database. 
~~~
curl --location --request PUT 'localhost:3000/api/v1/url' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'source=https://en.wikipedia.org \
--data-urlencode 'slug=myslug' \
--data-urlencode 'using=source'


curl --location --request PUT 'localhost:3000/api/v1/url' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'source=https://en.wikipedia.org \
--data-urlencode 'slug=myslug' \
--data-urlencode 'using=slug'
~~~

## Done

* MongoDB integration
* Redirect by URL slug (short URL)
* Docker
* Linters and formatters
* REST API


## ToDo

* Documentation
* Tests
* Swagger
* CI/CD (at least linter checkers)
* Deployment by single script

