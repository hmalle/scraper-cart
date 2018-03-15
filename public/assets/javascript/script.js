
$(function(){
 
  //when the page loads display all the articles from the database
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      var article = ("<div>");
      article.addClass("each-article");
      article.append(
        "<p class='article-title' data-id='" + data[i]._id + "'>" + data[i].title + "</p>" + 
        "<p class='article-link'><a href=" + data[i].link +">"+  data[i].link + "</a></p>" +
      );
      var btn=$("<button>");
      btn.addClass("save");
      if(data[i].saved){ 
        btn.attr("text","saved"); 
      }else{
        btn.attr("text","save article");
      }
      $(".articles").append(article);
    }
  });

  $(document).on("click","#scrape",function(){
    //when the get new articles is clicked
    $.ajax({
      method:"GET",
      url: "/scrape"
    }).then(function(data){
      console.log(data);
      document.location.reload();
    });
  });

  $(document).on("click", "p", function() {
    //when an article is clicked
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});

