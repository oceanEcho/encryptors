This project created on [Node.js](https://nodejs.org/en/).

To run scipts you must have [Node.js](https://nodejs.org/en/) not lower than 10.15.3 version.

Before using scripts install dependencies by `npm i` in project folder.

## Available Scripts

In the project directory, you can run:

`npm start <algorithm> <filename> <keyFile> <flag>`

Availible algorithms:

`gost-ecb` - GOST 28147 with ECB

`stream` - stream encryption

Availible flags:

`/e` - encrypt filee and generate key file

`/d` - decrypt file

To encrypt the file use flag /e

Example: `npm start gost-ecb file.txt key /e`

To decrypt the file use flag /d

Example: `npm start gost-ecb file.txt key /d`
