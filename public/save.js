var render = function(){
$.ajax({url: "/api/saved", method: "GET"}).then((data)=>{
    for(var i = 0; i < data.length; i++){
        var title = $("<p class = 'h5'>").html(data[i].title + "<br>");
        var link = $(`<a href=${data[i].link}>`).html(data[i].link +"<br>");
        var button = $(`<button type="button" class="btn btn-danger" value = ${data[i]._id}>`).text("delete");
        title.append(link);
        title.append(button);
        $(".save").append(title);
    }
})
}

render();
$(document).on("click", "button", function(){
    $(".save").empty();
    var id = $(this).val();
    console.log(id);
    $.ajax({url:"/api/remove/" + id, method: "POST"}).done((data)=>{
        console.log(data);
    })
    render();
})