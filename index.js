const http = require('http');
const https = require('https');


const server = http.createServer();
server.on('request', async (request, response) => {
    try {
        const githubCom = 'https://github.com';
        const githubApiHostname = 'api.github.com';

        const pathArray = request.url.split('/');

        const fileRegex = pathArray[pathArray.length - 1];

        const repo = pathArray[1] + '/' + pathArray[2];

        const apiPath = 'releases/latest';
        const path = 'releases/latest/download';

        const apiOptions = {
            hostname: githubApiHostname,
            path: ['', 'repos', repo, apiPath].join('/'),
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };
        https.get(apiOptions, (apiResponse) => {
            try {
                let body = '';

                apiResponse.on('data', (chunk) => {
                    try {
                        body += chunk;
                    } catch (error) {
                        console.error(error);
                        response.setHeader("Content-Type", "text/html");
                        response.end("Error");
                    };
                });

                apiResponse.on('end', () => {
                    try {
                        let json = JSON.parse(body);

                        const file = json.assets
                            .map((asset) => asset.name)
                            .filter((fileName) => fileName.match(fileRegex))
                        [0];
                        if (!file) {
                            throw 'File not found!';
                        }


                        response.writeHead(302, { 'location': [githubCom, repo, path, file].join('/') });
                        response.end();
                    } catch (error) {
                        console.error(error);
                        response.setHeader("Content-Type", "text/html");
                        response.end("Error");
                    };
                });
            } catch (error) {
                console.error(error);
                response.setHeader("Content-Type", "text/html");
                response.end("Error");
            };
        });
    } catch (error) {
        console.error(error);
        response.setHeader("Content-Type", "text/html");
        response.end("Error");
    };
});

server.listen(8099);
