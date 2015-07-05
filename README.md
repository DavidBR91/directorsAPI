# directorsAPI
Simple directors database using the Livestream HTTP API

## Technologies used
* Node.js
* Redis
* Mocha.js (testing)

## API Methods
The following methods are included in the HTTP API:

### GET http://[server]/directors
Method to retrieve the information of all the users in the database (everyone has access to this).

### POST http//[server]/directors
Method to register a user in the system.

To be able to register in the system a valid livestream id must be provided. Two additional fields can be included as well, your favorite camera and your favorite movies. Both this last two fields are optional. This information must be included in the body of the request in valid JSON format.

Example:
```json
{
    "livestream_id": "1111111",
    "fav_cam": "cam1",
    "fav_movies": [
        "movie1",
        "movie2"
    ]
}
```

### PUT http://[server]/directors
Method to modify information of the account.

It is only possible to modfiy the information related to the favorite movies and favorite camera. To be able to modify these fields the following header must be included in the request:
```
Authorization: Bearer md5(accountidtomodify)
```
The changes must also be provided in a valid JSON format in the body of the request.

## Dependencies and tests
All the dependencies needed to run the system are included in the package.json file. To run the tests it is also needed to install the development dependencies (included in the package.json as well). Additionally, to be able to run the tests the framework Mocha.js has to be globally installed.

To run each test:
```
mocha [nameOfTheTestToRun]
