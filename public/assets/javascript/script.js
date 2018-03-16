
$(function(){
 
  function allArticles(){
    //to get all the articles
    $.ajax("/articles",{
      type:"GET"
    }).then(function(resp) {
      document.html(data);
      console.log("got the articles")
    });
  }

  allArticles();
  
  $(document).on("click", ".saved-articles-button", function(){
    //get all saved articles
    $.ajax("/saved-articles",{
        type:"GET"
    }).then(function() {
      console.log("got the saved articles");
      }
    );
  });

  $(document).on("click",".scrape-button",function(){
    //when the get new articles is clicked
    $.ajax("/scrape",{
      type:"GET",
    }).then(function(){
      allArticles();
    });
  });

  $(document).on("click",".save-button", function(){
    //mark an article as saved
    var id = $(this).attr("data-id");
    $.ajax({
      method: "PUT",
      url: "/marksaved/"+id
    }).then(function(){
      location.href="/articles";
      console.log("article saved successifully");
    });
  });

  $(document).on("click",".delete-button",function(){
    var id=$(".delete-button").attr("data-id");
    $.ajax({
      method:"PUT",
      url: "/markunsaved/"+id
    }).then(function(){
      location.href="/saved-articles";
      console.log("this doesnt even get console logged");
    });
  });

  $(document).on("click", "notes-save", function() {
    //when an article is clicked get its infomation
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

  //////////////////functionality to save note and delete notes///////////////////////////////
  var currentArticleId;
  $(document).on("click",".notes-button", function(){
    $(".notes-modal").modal("toggle");
    currentArticleId = $(this).attr("data-id");
  });

  // When you click the savenote button
  $(document).on("click", ".savenote", function() {
    var thisId = curentArticleId;
    var articleNotes = $(".articleNotes").val();
    $(".article-notes").val("");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: articleNotes
      }
    }).then(function(response) {
        console.log(response);
    });
  });

});

