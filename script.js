console.log("the custom script is running");

// This was the first block of code written to remove current active class
// it has been refactored into jQuery below
//
// function changeActive(){
//     if ( $(('.list-group-item list-group-item-action active').length) != 0) {
//         var current = document.getElementsByClassName("list-group-item list-group-item-action active");
//         current[0].className = current[0].className.replace("list-group-item list-group-item-action active", "list-group-item list-group-item-action");
//     }
// }

// this function is called on every link click
// refactored to be speficically called on list-group-item
// link clicks
$("a.list-group-item").click(function(){
    // this removes the current active class
    $("a").removeClass("active");
    // this adds the active class to the clicked list-group-item
    $(this).addClass("active");
});