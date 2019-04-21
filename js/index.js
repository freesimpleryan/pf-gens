
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
            datasets.groupName = data.data;
            $("#"+buttonDivId).append('<button class="ui button">'+data.displayName+'</button>');
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