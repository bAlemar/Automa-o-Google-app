
// Nome do Forms que quer criar
const url_forms = ""

// Nome da Sheet que irá extrair os dados
const nome_sheet = ""




// Acessando Forms
const form = FormApp.openById(url_forms)


function GetDataFromSheets () {
  // Ativando Google Sheets e carregando planilha
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nome_sheet)
  
  // Carregando os dados
  const [header, ...data] = sheet.getDataRange().getDisplayValues();
  // Estruturando os dados
  const dados_full = {}
  header.forEach(function(title,index){
    dados_full[title] = data.map(row => row[index]) //.filter(e=> e !== ""); Filtro para nulo
    Logger.log(header[index])
  });
 
  return dados_full;
}

// ==================================================//==//====================================
function FiltragemDados (dados_full) {
    // Filtrando os dados
  const dados_filtrados = {
    "Nome evento": [],
    "Data": [],
    "Nome evento Data":[],
    "Descrição":[]
  }
  // Filtragem map pegando nome coluna e index.
  dados_full.Tipo_Evento.map((nome,index)=>{
  const dataEvento = new Date(dados_full["Data"][index]);
  const dataHoje = new Date().setHours(0,0,0,0);
  
  // Forms é feito para eventos com lista e eventos que ocorreram de hoje em diante.
  if (nome === "lista" && dataEvento >= dataHoje){
  
    dados_filtrados["Nome evento"].push(dados_full["Nome evento"][index])
    dados_filtrados["Data"].push(dados_full["Data"][index]) 
    dados_filtrados["Nome evento Data"].push(`${dados_full["Nome evento"][index]} (${dados_full["Data_Formatada"][index]})`)
    dados_filtrados["Descrição"].push(dados_full["Descrição"][index])
      } 
    })
return dados_filtrados
}

// ==================================================//==//====================================

function AbastecendoGoogleForms(){
  // Pegando Dados
  const dados_full = GetDataFromSheets();  
  const dados_filtrados = FiltragemDados(dados_full)
  

  // Pegando Dropwdown Festa

  var dropdown = form.addListItem()
  .setTitle("Festas")

  CreatingSection(form,dados_filtrados,dropdown)
}

// ==================================================//==//====================================
function CreatingSection (form,dados_filtrados,dropdown){
  // Armazenando as opções
  var dropdown_items = []
  
  // Criando o Forms:
  dados_filtrados["Nome evento Data"].map((nome,index)=>{
  
  // Criando Seções que conectaram com item do DropDown
    var section = form.addPageBreakItem()
    .setTitle(nome)
    .setHelpText(dados_filtrados["Descrição"][index])
    .setGoToPage(FormApp.PageNavigationType.SUBMIT)
   
    // Lista nome 
    var section_Lista = form.addTextItem()
    .setTitle("Nome completos e separados por vírgula, por favor")


    // Abastecendo Lista de Items do Dropdown
    dropdown_items.push(dropdown.createChoice(nome,section))

  })
  // Setando valores no dropdown
  dropdown.setChoices(dropdown_items)
}
// ==================================================//==//====================================


// // Script apagar todos os itens Google Forms
function clearAll(form){
  var items=form.getItems();
  var d=0;//deleted items counter
  for (var i=0; i < items.length; i++) {
          form.deleteItem(i-d++);
  }
}

// ==================================================//==//====================================

// Rodando Script

clearAll(form)
AbastecendoGoogleForms()



// Script enviar cod Google Forms para Google Sheets


// enviar_url()







