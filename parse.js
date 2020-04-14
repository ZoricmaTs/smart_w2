
function parseFile(input) {  

  let file = input.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() { 

    let validJSON = validateJson(reader.result);

    let html_template = JSON.parse(validJSON);   

    let doc = buildDocument(html_template); 

    let formattedHtmml = format(doc.documentElement.outerHTML);

    writeFile(`${html_template.name}.html` , formattedHtmml);
  }

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function format(html) {
  var tab = '\t';
  var result = '';
  var indent= '';

  html.split(/>\s*</).forEach(function(element) {
      if (element.match( /^\/\w/ )) {
          indent = indent.substring(tab.length);
      }

      result += indent + '<' + element + '>\r\n';

      if (element.match( /^<?\w[^>]*[^\/]$/ )) { 
          indent += tab;              
      }
  });

  return result.substring(1, result.length-3);
}

function validateJson(file){
  let validJSON = file.replace(/'/g, '"');

  validJSON = validJSON.replace(/="+[A-z0-9]*"/g, (str) => {
      return str.replace(/"/g, '\\"');
  });
  return validJSON;
}


function buildDocument(html_template) {
  let doc = document.implementation.createHTMLDocument(`${html_template.name}`);  
  
  let form =  doc.createElement("form"); 
  form.classList.add("container");
  
	let h2 = doc.createElement("h2");
  h2.innerHTML = html_template.name;
  h2.classList.add("form-title");
  form.appendChild(h2);

  for (let i = 0; i < html_template.fields.length; i++) { 
    let field = html_template.fields[i];    
    buildField(field, doc, form);
  } 

  if (typeof html_template.references !== 'undefined') {
    for (let i = 0; i < html_template.references.length; i++) {
      let reference = html_template.references[i];
      buildReference(reference, doc, form);
    }
  }
  
  if (typeof html_template.buttons !== 'undefined') {
     let divContainer = doc.createElement("div"); //
     divContainer.style = "margin-top:15px";
     divContainer.classList.add('buttons');
  
    for (let i = 0; i < html_template.buttons.length; i++) {
      let btn = html_template.buttons[i];
      buildButton(btn, doc, divContainer);
    }
    form.appendChild(divContainer);
  }
  
  buildMaskForInput(doc);

  doc.body.appendChild(form);

  return doc;
}

function buildMaskForInput(doc){
  
  let linkBootstrap =  doc.createElement("link");
  linkBootstrap.setAttribute("rel", "stylesheet");
  linkBootstrap.setAttribute("href", "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
  linkBootstrap.setAttribute("integrity", "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm");
  linkBootstrap.setAttribute("crossorigin", "anonymous");
  doc.head.appendChild(linkBootstrap);

  let jquery =  doc.createElement("script");
  jquery.setAttribute("src", "https://code.jquery.com/jquery-3.3.1.slim.min.js");
  doc.head.appendChild(jquery);
  
  let jqueryMask =  doc.createElement("script");
  jqueryMask.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js");
  doc.head.appendChild(jqueryMask);
/*
  let bootstrapJs =  doc.createElement("script");
  bootstrapJs.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js");
  doc.head.appendChild(bootstrapJs); 
 

  let multiSelect =  doc.createElement("script");
  multiSelect.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/js/bootstrap-multiselect.min.js");
  doc.head.appendChild(multiSelect);
*/  

  
  let script =  doc.createElement("script"); 
  script.setAttribute("type", "text/javascript");
  script.innerText = `$(document).ready(function(){$('#serialPassport').mask('00-00 000000');$('#code').mask('000-000');$('#phone').mask('+7 (000) 00-00-000');`;

  doc.body.appendChild(script);
}

function writeFile(name, value) {
  var val = value;

  if (value === undefined) {
    val = "";
  }

  var download = document.createElement("a");
  download.href = "data:text/plain;content-disposition=attachment;filename=file," + encodeURIComponent(val);
  download.download = name;
  download.style.display = "none";
  download.id = "download"; 
  document.body.appendChild(download);
  document.getElementById("download").click();
  document.body.removeChild(download);
}

function parseColor(doc, form, field){

  let inputColor = doc.createElement("input");
      
  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`);
    form.appendChild(label); 

    inputColor.setAttribute("name", field.label);
  }
 
  inputColor.setAttribute("type", "color");
  inputColor.setAttribute("list", "colors");
  inputColor.setAttribute("value", field.input.colors[0]);
  form.appendChild(inputColor);

  let datalistColor = doc.createElement("datalist");
  datalistColor.setAttribute("id", "colors");
  for (let j = 0; j < field.input.colors.length; j++) {
    let color = field.input.colors[j];
    let optionColor = doc.createElement("option");
    optionColor.setAttribute("value", color);
    optionColor.innerHTML = color; 
    optionColor.classList.add(`form__item-${field.input.type}`);
    datalistColor.appendChild(optionColor);
  }
  form.appendChild(datalistColor);
}

function parseTextarea(doc, form, field){
  let formGroup = doc.createElement("div"); // div for bootstrap
  formGroup.className = "form-group";

  let textarea = doc.createElement("textarea");
  textarea.classList.add("form-control");
  
  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`);
    formGroup.appendChild(label); 
  }

  if (field.input.required == true) {
    required = "required"; 
    textarea.setAttribute("required", required);  
  } 
       
  formGroup.appendChild(textarea);
  form.appendChild(formGroup);
}

function  parseTechnology(doc, form, field){
  let formGroup = doc.createElement("div"); // div for bootstrap
  formGroup.className = "form-group";

  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`); 
    formGroup.appendChild(label);
  }

  let selectTechnology = doc.createElement("select");
  selectTechnology.setAttribute("id", "technology");
  selectTechnology.classList.add("form-control", "mdb-select"); 
  
  if (field.input.multiple == true) {
    selectTechnology.setAttribute("multiple", "multiple");    
  }
  
  for (let j = 0; j < field.input.technologies.length; j++) {
    let technologyValue = field.input.technologies[j];
    let option = doc.createElement("option");
    option.innerHTML = technologyValue;
    option.setAttribute("value", technologyValue);
    option.classList.add(`form__select-${field.input.type}`);
    selectTechnology.appendChild(option);
  }

  formGroup.appendChild(selectTechnology);
  form.appendChild(formGroup);
}

function  parseCheckBox(doc, form, field){
  let formCheck = doc.createElement("div"); // div for bootstrap
  formCheck.className = "form-check";

  let inputCheckbox = doc.createElement("input");
  inputCheckbox.setAttribute("type", "checkbox");
  inputCheckbox.setAttribute("name", field.label);

  if (typeof field.input.checked == true) {    
    inputCheckbox.setAttribute("checked", "checked");
  } 

  inputCheckbox.classList.add('form-check-input', `form__input-${field.input.type}`);
  formCheck.appendChild(inputCheckbox);

  let label = doc.createElement("label");
  label.innerHTML = field.label; 
  label.classList.add(`form__label-${field.input.type}`, 'form-check-label');

  formCheck.appendChild(label); 
  form.appendChild(formCheck);
}

function parseNumber(doc, form, field){
  let formGroup = doc.createElement("div"); // div for bootstrap
  formGroup.className = "form-group";

  let inputNumber = doc.createElement("input");  
  inputNumber.setAttribute("name", field.label);
  inputNumber.classList.add("form-control");

  if (field.input.required == true) {  
    inputNumber.setAttribute("required", "required");  
  } 
  
  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`);
    formGroup.appendChild(label); 
  }

  if (typeof field.input.mask !== 'undefined') {
    inputNumber.setAttribute("type", "text");
    inputNumber.classList.add('item');

    if (field.input.mask  === '+7 (999) 99-99-999') {      
      addMaskFieldsAttribute(inputNumber, "phone", "+7 (999) 99-99-999", "+7\s\([0-9]{3}\)\s[0-9]{2}-[0-9]{2}-[0-9]{3}");
    
    } else  if (field.input.mask === '99-99 999999') {      
      addMaskFieldsAttribute(inputNumber, "serialPassport", "99-99 999999", "[0-9]{2}-[0-9]{2}\s[0-9]{6}");  
    
    } else  if (field.input.mask === '999-999') {      
      addMaskFieldsAttribute(inputNumber, "code", "999-999", "[0-9]{3}-[0-9]{3}");  
    }

  } else {
    inputNumber.setAttribute("type", field.input.type);
    inputNumber.setAttribute("min", "0");  
    inputNumber.setAttribute("max", "100");  
    inputNumber.setAttribute("pattern", "\d+"); 
    inputNumber.setAttribute("step", "1"); 
  }

  formGroup.appendChild(inputNumber);
  form.appendChild(formGroup);
}

function addMaskFieldsAttribute(inputNumber, id, mask, pattern){
  inputNumber.setAttribute("id", id); 
  inputNumber.setAttribute("data-mask", mask);
  inputNumber.setAttribute("placeholder", mask);
  inputNumber.setAttribute("pattern", pattern);     
}

function  parseFieldFile(doc, form, field){
  let formGroup = doc.createElement("div"); // div for bootstrap
  formGroup.className = "form-group";

  let inputFile = doc.createElement("input");
  inputFile.setAttribute("type", "file");
  inputFile.setAttribute("name", field.label);

  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`, );
    formGroup.appendChild(label); 
    inputFile.setAttribute("name", field.label);
  }

  if (field.input.required == true) {
    required = "required"; 
    inputFile.setAttribute("required", required);  
  } 

  if (field.input.multiple == true) {
    let multiple = "multiple";
    inputFile.setAttribute("multiple", multiple);  
  } 
 
  if (typeof field.input.filetype !== 'undefined') {
    let accept = "";
    inputFile.classList.add("form-control-file");

    for (let j = 0; j < field.input.filetype.length; j++) {
      if (field.input.filetype[j] === "pdf") {
        accept += `application/${field.input.filetype[j]}`;
      } else {accept += `image/${field.input.filetype[j]},`;}
    }
    inputFile.setAttribute("accept", accept);  
  }

  formGroup.appendChild(inputFile);
  form.appendChild(formGroup);
}

function parseDefaultField(doc, form, field){
  let formGroup = doc.createElement("div"); // div for bootstrap
  formGroup.className = "form-group";

  let input = doc.createElement("input");
  input.setAttribute("type", field.input.type);
  

  if (typeof field.label !== 'undefined') {
    let label = doc.createElement("label");
    label.innerHTML = field.label; 
    label.classList.add(`form__label-${field.input.type}`);
    formGroup.appendChild(label); 
    input.setAttribute("name", field.label);
  }

  if (field.input.required == true) {
    required = "required"; 
    input.setAttribute("required", required);  
  } 
  if (typeof field.input.placeholder !== 'undefined') {
    input.setAttribute("placeholder", field.input.placeholder);  
  } 
  if (field.input.multiple == true) {
    let multiple = "multiple";
    input.setAttribute("multiple", multiple);  
  } 

  input.classList.add(`form__input-${field.input.type}`, "form-control");
  formGroup.appendChild(input);
  form.appendChild(formGroup);
}

function buildField(field, doc, form) {

  let typeInput = field.input.type;
 
  switch (typeInput) {
    case 'color':
        parseColor(doc, form, field);
        break;

    case 'textarea':
        parseTextarea(doc, form, field);
        break;

    case 'technology':
        parseTechnology(doc, form, field);     
        break;
  
    case 'checkbox':
        parseCheckBox(doc, form, field);    
        break;

    case 'number':
        parseNumber(doc, form, field);         
        break;

    case 'file':
        parseFieldFile(doc, form, field);           
        break;

    default:
        parseDefaultField(doc, form, field);      
        break;
  } 

}

function buildReference(reference, doc, form) {

  if (typeof reference.input !== 'undefined') {
      input = doc.createElement("input");
      input.classList.add(`form__input-${reference.input.type}`);
      input.setAttribute("type", reference.input.type);
      if (reference.input.checked == true) {
        let checked = "checked";
        input.setAttribute("checked", "checked");
      } 
      if (reference.input.required == true) {
        required = "required"; 
        input.setAttribute("required", "required");  
      } 
      form.appendChild(input);
  }
  
  if (typeof reference['text without ref'] !== 'undefined') {
    let span = doc.createElement("span");
    span.innerHTML += reference['text without ref'];
    span.classList.add('form-title__text');
    form.appendChild(span);
  }
  if ((typeof reference.text !== 'undefined')&&(typeof reference.ref !== 'undefined')) {
    let a = doc.createElement("a");
    a.innerHTML += reference.text;
    a.classList.add('form-title__link');
    a.setAttribute("href", reference.ref);
    form.appendChild(a);
  } 
}

function buildButton(btn, doc, divContainer) {
    let button = doc.createElement("button");
    button.innerHTML = btn.text;
    button.classList.add('btn-primary', 'form-title__button','btn');
    divContainer.appendChild(button);
}

