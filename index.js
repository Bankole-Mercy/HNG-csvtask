const csvtojson = require("csvtojson");
const fs = require("fs");
var SHA256 = require("crypto-js/sha256");
const csv_pathname = "./data.csv";
const { Parser } = require('json2csv');
let csvContent = []


csvtojson({
  noheader: false,
  headers: [
    "series-number",
    "filename",
    "name",
    "description",
    "gender",
    "attributes",
    "uuid",
  ],
})
  .fromFile(csv_pathname)
  .then((result) => {
    const convertToChip007 = result.map((data) => {
      return {
        format: "CHIP-0007",
        name: data.name,
        description: data.description ?? "",
        minting_tool: "SuperMinter/2.5.2",
        sensitive_content: false,
        series_number: data["series-number"],
        series_total: 1000,
        attributes: data.attributes ?? [],
        collection: {
          name: "Example Pokémon Collection",
          id: "e43fcfe6-1d5c-4d6e-82da-5de3aa8b3b57",
          attributes: [
            {
              type: "description",
              value:
                "Example Pokémon Collection is the best Pokémon collection. Get yours today!",
            },
            {
              type: "icon",
              value: "https://examplepokemoncollection.com/image/icon.png",
            },
            {
              type: "banner",
              value: "https://examplepokemoncollection.com/image/banner.png",
            },
            {
              type: "twitter",
              value: "ExamplePokemonCollection",
            },
            {
              type: "website",
              value: "https://examplepokemoncollection.com/",
            },
          ],
        },
      };
    });
    // console.log(data);
    // console.log(convertToChip007);
    convertToChip007.forEach((data) => {
      const hash = SHA256(data).toString();
      const newData = {
        ...data,
        hash,
      };
      const filename = 'files'
      if (!fs.existsSync(filename)) {
        fs.mkdirSync(filename);
      }
      csvContent.push(newData)



      fs.writeFile(
        `${filename}/${data.name}.output.json`,
        JSON.stringify(newData),
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    });
//convert to csv//
// console.log(csvContent);
try {
    const parser = new Parser();
    const csv = parser.parse(csvContent);
    fs.appendFile(`oldfilename.output.csv`, csv, 'utf-8', err => {
        if (err) {
          throw err;
        }
    })
    // console.log(csv);
  } catch (err) {
    console.error(err);
  }


  });
