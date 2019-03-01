var call = function(){
$.ajax({url: "/api/scrape", method: "GET"}).then((data)=>{
    for(var i = 0; i < data.length; i++){
        var title = $("<p class = 'h5'>").html(data[i].title + "<br>");
        var link = $(`<a href=${data[i].link}>`).html(data[i].link +"<br>");
        var button = $(`<button type="button" class="btn btn-primary" value = ${data[i]._id}>`).text("save");
        title.append(link);
        title.append(button);
        $(".attach").append(title);
    }
})
};

call();
$(document).on("click", "button", function(){
    var id = $(this).val();
    console.log(id);
    $.ajax({url:"/api/saved/" + id, method: "POST"}).done((data)=>{
        console.log(data);
    })
})