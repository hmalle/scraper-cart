
$(function(){
 
  //when the page loads display all the articles from the database
  function allArticles(){
    $.getJSON("/articles", function(response) {
      $(".articles").empty();
      for (var i = 0; i < response.length; i++) {
        var article = $("<div>");
        article.addClass("each-article");
        article.append(
          "<div class='title-and-link'>"+
            "<p class='article-title' data-id='" + response[i]._id + "'>" + response[i].title + "</p>"+ 
            "<p class='article-link'><a href=" + response[i].link +">"+  response[i].link + "</a></p>"+
          "</div>" 
        );
        var btn=$("<button>");
        btn.data(response[i]._id);
        if(response[i].saved){ 
          btn.text("saved"); 
          btn.addClass("btn save-button");
        }else{
          btn.text("save article");
          btn.addClass("btn save-button");
        }
        article.append(btn);
        $(".articles").append(article);
      }
    });
  }

  allArticles();

  $(".saved-articles-button").on("click", function(){
    $.getJSON("/saved-articles", function(response) {
      $(".articles").empty();
      for (var i = 0; i < response.length; i++) {
        $(".articles").append(
          "<div class='each-article'>"+
            "<div class='title-and-link'>"+
              "<p class='article-title' data-id='" + response[i]._id + "'>" + response[i].title + "</p>"+ 
              "<p class='article-link'><a href=" + response[i].link +">"+  response[i].link + "</a></p>"+
            "</div>"+
            "<button class='btn btn-info note-button' data-id='"+response[i]._id+"'>Note</p>"+
            "<button class='btn btn-danger delete-button' data-id='"+response[i]._id+"'>Delete</p>"+
          "</div>"
        );
        var btn=$("<button>");
        btn.text("saved"); 
        btn.addClass("btn save-button");
        btn.text("save article");
        btn.addClass("btn save-button");
        article.append(btn);
        $(".articles").append(article);
      }
    });
  });

  $(document).on("click",".scrape-button",function(){
    //when the get new articles is clicked
    $.ajax({
      method:"GET",
      url: "/scrape"
    }).then(function(response){
      console.log(response);
      allArticles();
    });
  });

  $(document).on("click",".saved-articles-button", function(){
    var articleId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/"+articleId
    }).then(function(response){
      console.log(response);
    });
  });

  $(document).on("click", "p", function() {
    //when an article is clicked
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(response){
      console.log(response);
      $("#notes").append("<h2>" + response.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + response._id + "' id='savenote'>Save Note</button>");
      if (response.note) {
        $("#titleinput").val(response.note.title);
        $("#bodyinput").val(response.note.body);
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
    }).then(function(response) {
        console.log(response);
        $("#notes").empty();
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});

