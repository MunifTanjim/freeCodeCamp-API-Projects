# (freeCodeCamp) API Projects
by MunifTanjim

## Live Demo
__[(freeCodeCamp) API Projects - MunifTanjim](https://api-projects-fcc-mt.herokuapp.com/)__

## API Documentation

### [Timestamp Microservice](https://api-projects-fcc-mt.herokuapp.com/timestamp)

__Base URL ->__ `https://api-projects-fcc-mt.herokuapp.com/timestamp`

| Description | Request Type | URL endpoint | Example |
| :--- | :--- | :--- | :--- |
| Converts unix timestamp to natural language date | [ GET ] | `/<unix-timestamp>` | `/1819821600` |
| Converts natural language date to unix timestamp | [ GET ] | `/<natural-language-date>` | `/September%2002,%202027` |

 freeCodeCamp challenge: [timestamp-microservice](https://www.freecodecamp.com/challenges/timestamp-microservice)

### [Request Header Parser Microservice](https://api-projects-fcc-mt.herokuapp.com/request-header-parser)

__Base URL ->__ `https://api-projects-fcc-mt.herokuapp.com/request-header-parser`

| Description | Request Type | URL endpoint | Example |
| :--- | :--- | :--- | :--- |
| Returns information from request header |[ GET ] | `/whoami` | `/whoami` |

freeCodeCamp challenge: [request-header-parser-microservice](https://www.freecodecamp.com/challenges/request-header-parser-microservice)

### [URL Shortner Microservice](https://api-projects-fcc-mt.herokuapp.com/url-shortner)

__Base URL ->__ `https://api-projects-fcc-mt.herokuapp.com/url-shortner`

| Description | Request Type | URL endpoint | Example |
| :--- | :--- | :--- | :--- |
| Redirects to main url | [ GET ] | `/<shortcode>` | `/2` |
| Returns shorturl | [ GET ] | `/new/<url>` | `/new/https://www.freecodecamp.com` |

freeCodeCamp challenge: [url-shortener-microservice](https://www.freecodecamp.com/challenges/url-shortener-microservice)

### [Image Search Abstraction Layer](https://api-projects-fcc-mt.herokuapp.com/image-search)

__Base URL ->__ `https://api-projects-fcc-mt.herokuapp.com/image-search`

| Description | Request Type | URL endpoint | Example |
| :--- | :--- | :--- | :--- |
| Returns image search result | [ GET ] | `/search/<keyword>` | `/search/cats` |
| Returns image search result skipping offset number | [ GET ] | `/search/<keyword>?offset=<number>` | `/search/cats?offset=27` |
| Returns latest search terms | [ GET ] | `/latest` | `/latest` |

freeCodeCamp challenge: [image-search-abstraction-layer](https://www.freecodecamp.com/challenges/image-search-abstraction-layer)

### [File Metadata Microservice](https://api-projects-fcc-mt.herokuapp.com/file-metadata)

__Base URL ->__ `https://api-projects-fcc-mt.herokuapp.com/file-metadata`

| Description | Request Type | URL endpoint | Example |
| :--- | :--- | :--- | :--- |
| Returns uploaded file's size | [ POST ] | `/filesize` | Check live demo |

freeCodeCamp: [file-metadata-microservice](https://www.freecodecamp.com/challenges/file-metadata-microservice)
