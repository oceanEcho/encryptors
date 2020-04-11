This project created on [Node.js](https://nodejs.org/en/).

To run scipts you must have [Node.js](https://nodejs.org/en/) not lower than 10.15.3 version.

Before using scripts install dependencies by `npm i` in project folder.

## Available Scripts

In the project directory, you can run:

`npm start <algorithm> <filename> <key file (or hash file)> <flag>`

### Availible algorithms:

#### `gost-ecb` - GOST 28147 with ECB

Flags:

`/e` - encrypt file and generate key file

`/d` - decrypt file

#### `stream` - stream encryption

Flags:

`/e` - encrypt file and generate key file

`/d` - decrypt file

#### `hash` - creating dile hash with SHA-256 algorithm

Flags:

`/c` - generate file hash and write it to file

`/d` - read file hash from file and verify it

### Examples:

To encrypt the file by GOST 28147 with ECB:

`npm start gost-ecb file.txt key /e`

To decrypt the file by GOST 28147 with ECB:

`npm start gost-ecb file.txt key /d`

To generate file hash and write it to file:

`npm start hash file.txt file-hash.txt /c`

