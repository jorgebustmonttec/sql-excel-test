function uploadFile() {
    var fileInput = document.getElementById("excelFileInput");
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        var contents = e.target.result;
        var workbook = new ExcelJS.Workbook();
  
        workbook.xlsx.load(contents)
          .then(function() {
            var worksheet = workbook.worksheets[0];
            var rows = worksheet.getSheetValues();
            console.log(rows);
          })
          .catch(function(error) {
            console.log("Error loading Excel file:", error);
          });
      };
  
      reader.readAsArrayBuffer(file);
    }
  }