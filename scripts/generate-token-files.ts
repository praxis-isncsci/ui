const fs = require('fs'),
path = require('path'),
filePath = path.join(__dirname, '../assets/tokens/tokens.json');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    const cleanData = data
      .replace(/\"\$type\"/g, '\"type\"')
      .replace(/\"\$value\"/g, '\"value\"');
    const jsonData = JSON.parse(cleanData);
    
    jsonData.forEach((file) => {
      const fileName = file.fileName.toLowerCase().replace(/\s/g, '-');
      const filePath = path.join(__dirname, `../assets/tokens/${fileName}`);
      const fileBody = file.body;
      const fileTemplate = `${JSON.stringify(fileBody, null, 2)}\n`;

      fs.writeFile(filePath, fileTemplate, function(err) {
        if(err) {
          return console.log(err);
        }
        console.log(`The file ${fileName}.ts was saved!`);
      });
    });
  }
});
