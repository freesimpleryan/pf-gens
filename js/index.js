
// <div class="item">New</div>
/**
 * "displayName": "Boats",
    "toolTip": "Different kinds of boats",
    "group": "nautical",
    "data":
 */
const IS_LOCAL = false;
const NPC_BUTTONS_DIV = "divButtonsNpc";
let datasets = {};
let groups = [];
$('.ui.dropdown')
  .dropdown()
;

function getJsonAndCreateWidgets(jsonFile){
    $.ajax({
        url : jsonFile,
        type : 'GET',
        async: false,
        success : function(data) {
            let groupName = data.group.charAt(0).toUpperCase() + data.group.slice(1);     
            let groupComboId = "group"+groupName;
            let groupClass = "groupDisplay"+groupName;
            let divId = "divText"+groupName;
            let buttonDivId = "divButtons"+groupName;
            // Handle group creation items if needed
            if(groups.indexOf(groupName) < 0){
                groups.push(groupName);
                // Add to combobox
                $("#dropdownSelector").append('<div class="item" id="'+groupComboId+'">'+groupName+'</div>');
                // Create div for buttons
                $("#buttonRow").append('<div class="groupButtonRow '+groupClass+'" id="'+buttonDivId+'" style="display:none;"></div>');
                // Create div for text
                $("#textDisplay").append('<div class="groupTextDisplayRow '+groupClass+'" id="'+divId+'" style="display:none;></div>');
                $("#"+groupComboId).on('click', function(){
                    $(".groupButtonRow").hide();
                    $(".groupTextDisplayRow").hide();
                    $("."+groupClass).show();
                });
            }
            // Handle individual item creation
            file_name = IS_LOCAL ? jsonFile.split("/")[2] : jsonFile.split("/")[3]; 
            let id = file_name.split(".")[0]
            datasets[id] = data;
            let buttonId = "button_"+id;         
            $("#"+buttonDivId).append('<div class="ui button" id="'+buttonId+'" data-content="'+data.toolTip+'">'+data.displayName+'</div>');
            $('.button').popup();
            $("#"+buttonId).on("click", function(){
                let id = $(this).attr('id').split("_")[1]
                $("#textDisplay").empty();
                let thisDataset = datasets[id];
                $("#textDisplay").append("<h1>"+thisDataset.displayName+"</h1><hr>");
                if(thisDataset.group != "generator"){
                    let all_results = thisDataset.data;
                    let randResult = all_results[Math.floor(Math.random() * all_results.length)];
                    $("#textDisplay").append("<p>"+randResult+"</p>");
                }
                if(thisDataset.group == "generator"){
                    let all_results = thisDataset.data;
                    let result = "";
                    for(let i = 0; i < Object.keys(all_results).length; i++){
                        let key = (i+1).toString();
                        thisResult = all_results[key]
                        result += thisResult[Math.floor(Math.random() * thisResult.length)] + " ";
                    }
                    $("#textDisplay").append("<p>"+result+"</p>");
                }
            });
        },
        error : function(request,error)
        {
            console.log(error);
            alert("Request: "+JSON.stringify(request));
        }
    });
}

function _appendNpcAllButton(buttonDivId){
            let id = "npcAll";
            let tooltip = "Generate all for an NPC";
            let displayName = "NPC All";
            let buttonId = "button_"+id;
            console.log($("#"+buttonDivId).attr("id"));      
            $("#"+buttonDivId).append('<div class="ui button" id="'+buttonId+'" data-content="'+tooltip+'">'+displayName+'</div>');
            $('.button').popup();
            $("#"+buttonId).on("click", function(){
                let id = $(this).attr('id').split("_")[1]
                $("#textDisplay").empty();
                for(var p in datasets){
                    if(datasets[p].group === "npc"){
                        console.log(datasets);
                        let name = datasets[p]["displayName"];
                        let data = datasets[p]["data"]
                        let description = data[Math.floor(Math.random() * data.length)]
                        $("#textDisplay").append("<h1>"+name+"</h1><hr>");
                        $("#textDisplay").append("<p>"+description+"</p>");
                    }
                }
            });
}

function appendNpcAllButton(targetDiv){
    _appendNpcAllButton(targetDiv);
}

function createAll(data){
    for(let i = 0; i < data.data.length; i++){
        jsonpath = IS_LOCAL ? "/data/" : "/pf-gens/data/";
        getJsonAndCreateWidgets(jsonpath+data.data[i]);
    }
    appendNpcAllButton(NPC_BUTTONS_DIV);
}

$(document).ready(function(){
    let MASTER_JSON = IS_LOCAL ? "/data/master.json" : "/pf-gens/data/master.json";
    $.ajax({
        url : MASTER_JSON,
        type : 'GET',
        success : function(data) {              
            createAll(data);
        },
        error : function(request,error)
        {
            console.log(error);
            alert("Request: "+JSON.stringify(request));
        }
    });
});