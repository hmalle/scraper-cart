
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

  $(document).on("click",".articles-button", function(){
    allArticles();
  });

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

  //////////////////functionality to save note and delete notes///////////////////////////////
  var currentArticleId;
  
  function getArticleNotes(currentArticleId){
    //place the notes on the modal-notes-section
    $.ajax({
      method:"GET",
      url: "/article-notes/"+ currentArticleId
    }).then(function(response){
      console.log(response.note);
      if(response.note){ 
        $(".modal-notes-section").empty();
        $(".modal-notes-section").append(
          "<div class='article-notes'>"+response.note.body+"</div>"
        );
      }
    });
  }

  $(document).on("click",".notes-button", function(){
    currentArticleId = $(this).attr("data-id");
    $(".notes-modal").modal("toggle");
    getArticleNotes(currentArticleId);
  });

  // When you click the savenote button 
  $(document).on("click", ".save-note-button", function() {
    var thisId = currentArticleId;
    var articleNotes = $(".article-note").val();
    $(".article-note").val("");
    $.ajax({
      method: "POST",
      url: "/save-note/" + thisId+"/"+articleNotes
    }).then(function(response){
      getArticleNotes(articleId);
    });
  });

});

