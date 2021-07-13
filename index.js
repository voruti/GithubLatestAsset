const http = require('http');
const https = require('https');


const server = http.createServer();
server.on('request', async (request, response) => {
    const githubCom = 'https://github.com';
    // const githubApi = 'https://api.github.com/repos';
    const githubApiHostname = 'api.github.com';

    let pathArray = request.url.split('/');

    const fileRegex = pathArray[pathArray.length - 1];
    pathArray[pathArray.length - 1] = null;

    const repo = pathArray[1] + '/' + pathArray[2];
    pathArray[1] = null;
    pathArray[2] = null;

    // pathArray = pathArray.filter((element) => element);

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
    console.log(apiOptions);
    https.get(apiOptions, (apiResponse) => {
        let body = '';

        apiResponse.on('data', (chunk) => {
            body += chunk;
        });

        apiResponse.on('end', () => {
            try {
                let json = JSON.parse(body);
                console.log(
                    json.assets
                        .map((asset) => asset.name)
                        .filter((fileName) => fileName.match(fileRegex))
                );

                const file = json.assets
                    .map((asset) => asset.name)
                    .filter((fileName) => fileName.match(fileRegex))
                [0];

                console.log(githubCom, repo, path, file);


                response.writeHead(302, { 'location': [githubCom, repo, path, file].join('/') });
                response.end();
            } catch (error) {
                console.error(error.message);
            };
        });
        // }).on('error', (error) => {
        //     console.error(error.message);
    });
});

server.listen(8099);
