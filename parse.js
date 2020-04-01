
function parseFile(input) {  
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

    var output = "";
    output = `<h2> ${html_template.name}</h2> `; 

    var fieldStr = fieldInput(html_template.fields);
    output += fieldStr;
    if (typeof html_template.references !== 'undefined') {
      var referencesStr = references(html_template.references);
      output += referencesStr;
    }
    if (typeof html_template.buttons !== 'undefined') {
      var buttonStr = buttons(html_template.buttons);
      output += buttonStr;
    }
    document.write(output);
  }

  reader.onerror = function() {
    console.log(reader.error);
  };

}


//--------------------------------------------------------------------------------------------------------------------

function fieldInput(fields) {
 
  var fieldStr = "";
  for (let i = 0; i < fields.length; i++) { 
    var field = fields[i];
    var required = "";
    var checked = "";
    var typeInput = field.input.type;

    switch (typeInput) {

      case 'color':
        fieldStr +=`<label> ${field.label}</label> `; 
        for (let j = 0; j < field.input.colors.length; j++) {
          color = field.input.colors[j];
          fieldStr +=`<input type = "${field.input.type}" value="${color}"> `; 
        }
        break;

      case 'checkbox':
        if (typeof field.input.checked == true) {
          checked = "checked";
          fieldStr +=`<input type = "${field.input.type}" checked><label> ${field.label}</label>`; 
        } fieldStr +=`<input type = "${field.input.type}"><label> ${field.label}</label>`;
        break;

      default:
        if (typeof field.input.label !== 'undefined') {
          fieldStr +=`<label> ${field.label}</label> `; 
        }
        if (field.input.required == true) {
          required = "required";         
        } 
        fieldStr +=`<input type = "${field.input.type}" placeholder = "${field.input.placeholder}" ${required}>`;
      break;
    } //switch 
  } //for 
  return fieldStr;
}

function references(references){  
    var referenceStr = "";
    for (let j = 0; j < references.length; j++) {
        var reference = references[j];
        if (typeof reference['text without ref'] !== 'undefined')  {
            referenceStr += `<span>${reference["text without ref"]}</span>`;
        }
        referenceStr +=`<a href="${reference.ref}">${reference.text}</a>`;
    }
    return referenceStr;
}

function buttons(buttons) {
  var buttonStr = "";
  for (let k = 0; k < buttons.length; k++) {
      var button = buttons[k];
      buttonStr += `<button>${button.text}</button>`;
  }
  return buttonStr;
}

    
