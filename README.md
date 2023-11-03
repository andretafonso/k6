# K6 - Performance tests generic project

## Introduction

This project aims to be a generic [k6](https://k6.io/ 'k6 website') project with the plus of having been implemented using typescript.

The project is ready to be used as it is but can also be forked to further adaption.

The provided "performance.test.ts" simulates an user that runs all tests three times, and for each endpoint, validates the min value of the three runs against the threshold. Each endpoint passes the test if the min value of the three runs is below or equal to the threshold.
The number of simulated users and interactions, as like other k6 scripts options, can be overridden through the use of cli arguments.

## Project Technical info

The k6 scripts in the src/tests folder need to have "test" word in the name.

All files placed in the assets folder will be copied to the dist folder along with compiled scripts.

The provided "performance.test.ts" k6 script expects three environment arguments:

- AUTH_INFO - indicating the path where to find the file containing the information to retrieve the authentication token.
- DATA_FILE - indicating the path where to find the file containing the requests information to test the target API.
- API_URL - the URL of the target API.

#### AUTH_INFO example

```
{
    "url": "https://keycloak.../auth/realms/public/protocol/openid-connect/token",
    "data": {
        "grant_type": "...",
        "username": "...",
        "password": "...",
        "client_id": "...",
        "client_secret": "..."
    },
    "tokenPath": "access_token"
}
```

**data** - is the place to put the x-www-form-urlencoded values.

#### DATA_FILE example

```
{
    "requests": [
        {
            ["disable": "true",]
            "method": "GET | POST",
            "path": "/...",

            "body": {
                "property1": ["K", "A", "G"],
                "property2": ["1A", "2B", "3C"],
                "property3": "xxx",
                ...
            },
            "body": {
                "name_of_the_file": "<path_of_the_json_file_containing_the_body>"
            },

            "threshold": 500,
            "tag": "endpoint1"
        }
        ...
    ]
}
```

**disable** - is optional and is used to exclude the test.

**path** - must start with a forward slash "/".

**body** - can contains one of two information:

- the body value;
- or in case that is considered too big, use the special property "name_of_the_file" indicating the path where to find the JSON file containing the body of the request.

**threshold** - is an integer in milliseconds.

**tag** - is used to distinguish the tests in the output.

## Requirements

- k6 installation -> in order to not share usage information, add K6_NO_USAGE_REPORT=true to system environment variables.
- JSON files:
  - all keys should be between double quotes
  - could not use trailing commas
  - the threshold property is an integer in milliseconds
  - the path property must start with a forward slash "/"

## How to use

The file package.json contains two scripts:

- bundle - to bundle the code and generate the compiled scripts.
- k6 - to run the provided performance.test.js script.

#### Run the script performance.test.js example

```
k6 run performance.test.js \
-e AUTH_INFO="auth_info.json" \
-e DATA_FILE="requests.json" \
-e API_URL="<api_url>"
```

## Outputs

The provided "performance.test.ts" k6 script returns the tests results to the standard console log as also to a summary.json file.

k6 scripts return 0 if everything goes ok and an error code otherwise.
