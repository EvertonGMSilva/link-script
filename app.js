const axios = require("axios");
const fs = require("fs");
const ImageLinks = require("./utils/image_links.json");

(async () => {
  let data = [];
  let count = 0

  async function getURL(element) {
    console.log(`testando url: ${element.Source}`);

    try {
      const response = await axios.get(element.Source);
      if (response.status !== 200) {
        data.push({
          src: element.Source,
          destination: element.Destination,
          status: response?.status,
        });
      }
      console.log(
        `finalizando teste url: ${element.Source}, status: ${response.status}`
      );
    } catch (error) {
      data.push(JSON.stringify({
        src: element.Source,
        destination: element.Destination,
        status: error.response?.status,
      }));
      console.log(
        `finalizando teste url: ${element.Source}, status: ${error.response?.status}`
      );
    }
  }

  for (element of ImageLinks) {
    count = count + 1
    await getURL(element);
    
    if(data.length === 50){
      fs.write(__dirname + `arquivo${new Date().toISOString()}.json`, data.toString(), (err) => {
      if (err) throw err;
      console.log("O arquivo foi criado!");
    });
    fs.writeFile(__dirname + `urlsconsultadas.txt`, count.toString(), (err) => {
      if (err) throw err;
      console.log(`Foram consultadas ${count} urls`);
    });
    data = []
  }
  }

})();
