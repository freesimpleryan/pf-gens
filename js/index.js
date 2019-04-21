
// <div class="item">New</div>
/**
 * "displayName": "Boats",
    "toolTip": "Different kinds of boats",
    "group": "nautical",
    "data":
 */
let datasets = {};
let groups = [];
$('.ui.dropdown')
  .dropdown()
;

function getJsonAndCreateWidgets(jsonFile){
    $.ajax({
        url : jsonFile,
        type : 'GET',
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
            file_name = jsonFile.split("/")[2]
            let id = file_name.split(".")[0]
            datasets[id] = data;
            let buttonId = "button_"+id;         
            $("#"+buttonDivId).append('<div class="ui button" id="'+buttonId+'" data-content="'+data.toolTip+'">'+data.displayName+'</div>');
            $('.button').popup();
            $("#"+buttonId).on("click", function(){
                let id = $(this).attr('id').split("_")[1]
                $("#textDisplay").empty();
                let thisDataset = datasets[id];
                if(thisDataset.group != "generator"){
                    $("#textDisplay").append("<h1>"+thisDataset.displayName+"</h1><hr>");
                    let all_results = thisDataset.data;
                    let randResult = all_results[Math.floor(Math.random() * all_results.length)];
                    $("#textDisplay").append("<p>"+randResult+"</p>");
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


$(document).ready(function(){
    let MASTER_JSON = "/data/master.json";
    $.ajax({
        url : MASTER_JSON,
        type : 'GET',
        success : function(data) {              
            for(let i = 0; i < data.data.length; i++){
                getJsonAndCreateWidgets("/data/"+data.data[i]);
            }
        },
        error : function(request,error)
        {
            console.log(error);
            alert("Request: "+JSON.stringify(request));
        }
    });
});