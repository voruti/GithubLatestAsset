const http = require('http');
const https = require('https');


const server = http.createServer();
server.on('request', async (request, response) => {
    try {
        const githubCom = 'https://github.com';
        const githubApiHostname = 'api.github.com';

        let pathArray = request.url.split('/');

        const fileRegex = pathArray[pathArray.length - 1];
        // pathArray[pathArray.length - 1] = null;

        const repo = pathArray[1] + '/' + pathArray[2];
        // pathArray[1] = null;
        // pathArray[2] = null;

        // pathArray = pathArray.filter((element) => element);

        // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
        // const apiPathArray = pathArray.filter((element) => element !== 'download');
        // const apiPath = apiPathArray.join('/');
        const apiPath = 'releases/latest';

        // const path = pathArray.join('/');
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
                        response.end(error);
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
                        response.end(error);
                    };
                });
            } catch (error) {
                console.error(error);
                response.setHeader("Content-Type", "text/html");
                response.end(error);
            };
        });
    } catch (error) {
        console.error(error);
        response.setHeader("Content-Type", "text/html");
        response.end(error);
    };
});

server.listen(8099);
