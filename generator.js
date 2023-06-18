
const ExcelJS = require('exceljs');
const { connection, connectToDatabase } = require('./db.js');

//read from excel file
const workbook = new ExcelJS.Workbook();


//save to arrays of first and last names
var firstNames = [];
var lastNames = [];

workbook.xlsx.readFile('./xlsx/names.xlsx')
    .then(function() {
        const worksheet = workbook.getWorksheet('Sheet1');

        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            if (rowNumber !== 1) { // Skip the header row
                const firstName = row.getCell(1).value;
                const lastName = row.getCell(2).value;
                firstNames.push(firstName);
                lastNames.push(lastName);
            }
        });

        
        //test generatePerson
        

        getCarreraIds(function(ids) {
            const persons = [];
            for (let i = 0; i < 10; i++) {
                const person = generatePerson(ids, firstNames, lastNames);
                persons.push(person);
            }
        }
        );

        for (let i = 0; i < 10; i++) {
            console.log(persons[i]);
        }



    }
    )
    .catch(function(error) {
        console.error(error);
    }
    );

//person class
class Person {
    constructor(nombreAlumno, apellidoAlumno, fechaNacimiento, correoAlumno, telefonoAlumno, idCarrera, generoAlumno) {
        this.nombreAlumno = nombreAlumno;
        this.apellidoAlumno = apellidoAlumno;
        this.fechaNacimiento = fechaNacimiento;
        this.correoAlumno = correoAlumno;
        this.telefonoAlumno = telefonoAlumno;
        this.idCarrera = idCarrera;
        this.generoAlumno = generoAlumno;

    }
}

function generatefechaNacimiento() {
    const year = Math.floor(Math.random() * 14) + 1990;
    const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
    const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');
    const fechaNacimiento = `${year}-${month}-${day}`;
    return fechaNacimiento;
  }

  //generoAlumno
    function generategeneroAlumno() {
        const generos= ["M", "F"];
        const generoAlumno = generos[Math.floor(Math.random() * generos.length)];
        return generoAlumno;
    }

  


//generate random email from first and last name
function generateEmail(firstName, lastName) {
    const firstLetter = firstName.charAt(0).toLowerCase();
    const randomNumbers = Math.floor(Math.random() * 90) + 10;
    const email = `${ firstLetter }.${ lastName.toLowerCase() }${ randomNumbers }@itesm.mx`;
    return email;
}

//generate random phone number in format +5281xxxxxxxx
function generatePhone() {
    const number = Math.floor(Math.random() * 9000000000) + 1000000000;
    const phone = `+5281${number}`;
    return phone;
}

//get array of carrera ids from database

function getCarreraIds(callback) {
    const query = "SELECT idCarrera FROM carreras";
    connection.query(query, function(error, results, fields) {
        if (error) throw error;
        const ids = results.map(result => result.idCarrera);
        callback(ids);
    });
}

//test getCarreraIds

//generate random person

function generatePerson(ids, firstNames, lastNames){
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fechaNacimiento = generatefechaNacimiento();
    const correoAlumno = generateEmail(firstName, lastName);
    const telefpmpAlumno = generatePhone();
    const idCarrera = ids[Math.floor(Math.random() * ids.length)];
    const generoAlumno = generategeneroAlumno();
    const person = new Person(firstName, lastName, fechaNacimiento, correoAlumno, telefpmpAlumno, idCarrera, generoAlumno);
    return person;
}

function sendtodatabase(){
    getCarreraIds(function(ids) {
        const person = generatePerson(ids, firstNames, lastNames);
        console.log(person);

        //send to database
        const query = "INSERT INTO alumnos (nombreAlumno, apellidoAlumno, fechaNacimiento, correoAlumno, telefonoAlumno, idCarrera, generoAlumno) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [person.nombreAlumno, person.apellidoAlumno, person.fechaNacimiento, person.correoAlumno, person.telefonoAlumno, person.idCarrera, person.generoAlumno];
        connection.query(query, values, function(error, results, fields) {
            if (error) throw error;
            console.log(`Inserted row into the alumnos table.`);
        });

        } 
    );
}

function sendtodatabasen(n){

    for (let i = 0; i < n; i++) {
        getCarreraIds(function(ids) {
            const person = generatePerson(ids, firstNames, lastNames);
            console.log(person);
    
            //send to database
            const query = "INSERT INTO alumnos (nombreAlumno, apellidoAlumno, fechaNacimiento, correoAlumno, telefonoAlumno, idCarrera, generoAlumno) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [person.nombreAlumno, person.apellidoAlumno, person.fechaNacimiento, person.correoAlumno, person.telefonoAlumno, person.idCarrera, person.generoAlumno];
            connection.query(query, values, function(error, results, fields) {
                if (error) throw error;
                console.log(`Inserted row into the alumnos table.`);
            });
    
            } 
        );
    }
    
}
