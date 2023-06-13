const ExcelJS = require('exceljs');
const connection = require('./db');

const workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile('./xlsx/carreras.xlsx')
    .then(function() {
        const worksheet = workbook.getWorksheet('Sheet1');

        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            if (rowNumber !== 1) { // Skip the header row
                const idCarrera = row.getCell(1).value;
                const nombreCarrera = row.getCell(2).value;
                const semestresCarrera = row.getCell(3).value;
                const idEntrada = row.getCell(4).value;

                // Prepare the SQL query
                const query = "INSERT INTO carreras (idCarrera, nombreCarrera, semestresCarrera, idEntrada) VALUES (?, ?, ?, ?)";
                const values = [idCarrera, nombreCarrera, semestresCarrera, idEntrada];

                // Execute the query
                connection.query(query, values, function(error, results, fields) {
                    if (error) throw error;
                    console.log(`Inserted row ${rowNumber} into the carreras table.`);
                });
            }
        });
    })
    .catch(function(error) {
        console.error(error);
    });
