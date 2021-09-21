# @i-xi-dev/uuid

A JavaScript UUID generator, implements the version 4 UUID defined in [RFC 4122](https://datatracker.ietf.org/doc/rfc4122/).


## Installation

### npm

```console
$ npm i @i-xi-dev/uuid
```

```javascript
import { Uuid } from "@i-xi-dev/uuid";
```

### CDN

```javascript
import { Uuid } from "https://unpkg.com/@i-xi-dev/uuid/dist/index.js";
```

```javascript
import { Uuid } from "https://cdn.jsdelivr.net/npm/@i-xi-dev/uuid/dist/index.js";
```


## Usage
```javascript
const uuid = Uuid.generateRandom();
// → random UUID string, for example "5eb893ba-ec79-4f55-958d-66731227b662"
```
