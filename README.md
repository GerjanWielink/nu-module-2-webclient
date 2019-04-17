# NUM2 Webclient

This is a small website used to control the filserver created for Nedap University Module 2.

## Requirements
- `NodeJS`
- `npm` or `Yarn` (npm should come with node by default these days.)

## Running

Clone the repository and in the root folder run the following commands: 

```bash
npm install

npm start
```
(npm can be freely interchanged with yarn)

This should spin up a webserver at `localhost:3000` which polls the file transfer server
at `localhost:8080`. The remotes page should show a list of all servers it detects 
(including localhost for testing purposes). Clicking a remote should give a list of files, when clicked
a download should start and you'll be redirected to the download page.

In order to see the files you first need to execute an inspection by clicking the server icon
next to the remote. This is done automatically for localhost.