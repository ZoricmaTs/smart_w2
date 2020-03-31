
function readFile(input){
    let file = input.files[0];
  
    let reader = new FileReader();
  
    reader.readAsText(file);
  
    reader.onload = function() {
    
      var file = reader.result;
      let validJSON = file.replace(/'/g, '"');
  
      validJSON = validJSON.replace(/="+[A-z0-9]*"/g, (str) => {
          return str.replace(/"/g, '\\"');
      });
  
      let html_template = JSON.parse(validJSON);
      return html_template;     
}

function parseJson(input) {
    let html_template = readFile(input);

      var output = "";
      output = `<h2> ${html_template.name}</h2> `;  
  
      var fields = html_template.fields;
     
      var fieldStr = "";
      for (let i = 0; i < fields.length; i++) { 
         var field = fields[i];
         var required = "";
         if(field.input.required == true) {
          required = "required";
         }
         fieldStr +=`<label> ${field.label}</label> `; 
         fieldStr +=`<input type = "${field.input.type}" placeholder = "${field.input.placeholder}" ${required}> `; 
         //alert(field.label);
      }
      output += fieldStr;
      var references = html_template.references;
      var referenceStr = "";
      for (let j = 0; j < references.length; j++) {
          var reference = references[j];
          if (typeof reference['text without ref'] !== 'undefined')  {
              referenceStr += `<span>${reference["text without ref"]}</span>`;
          }
          referenceStr +=`<a href="${reference.ref}">${reference.text}</a>`;
      }
      output += referenceStr;
      //
      var buttons = html_template.buttons;
      var buttonStr = "";
      for (let k = 0; k < buttons.length; k++) {
          var button = buttons[k];
          buttonStr += `<button>${button.text}</button>`;
      }
      output += buttonStr;
  
      document.write(output);
    }
  
    reader.onerror = function() {
      console.log(reader.error);
    };
  
  }