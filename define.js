/**
 * A simple command line tool for finding the definition of a word. 
 * Uses "meetDeveloper"'s freeDictionaryAPI.
 * 
 * https://github.com/meetDeveloper/freeDictionaryAPI
 */
const https = require('https');

async function search(text) {
    return new Promise(function (resolve, reject) {

        var result = "";
        const host = 'api.dictionaryapi.dev';
        let path = `/api/v2/entries/en/${text}`;

        const options = {
            hostname: host,
            port: 443,
            path: path,
            method: 'GET'
        };

        //console.log(options.path);

        const req = https.request(options, res => {
            //console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                result += d;
            });

            res.on('end', () => {
                resolve(result);
            });
        });

        req.on('error', error => {
            reject(error);
        });

        req.end();
    });
}

(async () => {

    if (process.argv[2] == null && typeof process.argv[2] == "undefined") {
        throw "Must be called with a search term.";
    }

    try {

        console.log("#######################################################");
        console.log(`define: ${process.argv[2]}`);
        console.log("searching...");

        const json = await search(process.argv[2]);

        /* Display results to human. */
        let results = JSON.parse(json);
        
        if(typeof results.length === "undefined") {
            console.log(results.title);
            console.log(results.message);
            console.log(results.resolution);
            return;
        }

        console.log(`found ${results.length} result(s)...`);

        for (let result of results) {
            console.log("-------------------------------------------------------");
            console.log(`word: ${result.word}`);

            console.log('phonetics... ');
            for (let p of result.phonetics) {
                console.log(`text: ${p.text}`);
                console.log(`audio: ${p.audio}`);
            }

            console.log(`origin: ${result.origin}`);

            console.log('meanings... ');
            for (let m of result.meanings) {
                console.log(`type: ${m.partOfSpeech}`);

                for (let d of m.definitions) {
                    console.log(`definition: ${d.definition}`);
                    console.log(`example: ${d.example}`);
                    console.log(`synonyms: ${JSON.stringify(d.synonyms)}`);
                    console.log(`antonyms: ${JSON.stringify(d.antonyms)}`);
                }
            }
        }
        console.log("-------------------------------------------------------");
        console.log("end.");
        console.log("#######################################################");
    }
    catch (error) {
        console.error(error);
    }

})();