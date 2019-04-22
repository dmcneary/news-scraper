$(document).on("ready", function () {
    var articleContainer = $(".article-container");
    //$("a.scrape-new").on("click", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);
    $(document).on("click", "p", renderComments);

    // function handleArticleScrape() {
    //     console.log("scraper")
    //     $.get("/scrape").then(function(data) {

    //       initPage();
    //       bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    //     });
    //   }

    function initPage() {
        $.get("/articles").then(function (data) {
            articleContainer.empty();
            console.log(data);
            if (data && data.length) { renderArticles(data); }
            else { renderEmpty(); }
        });
    }

    function renderArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
      }

    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
            $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.link)
                .text(article.title),
            $("<a class='btn btn-success save'>Save Article</a>")
            )
        );
        var cardBody = $("<div class='card-body'>").text(article.summary);
        cardBody.prepend($("<img>").attr("src", article.imgLink))
        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        return card;
    }

    function renderEmpty() {
        var emptyAlert = $(
          [
            "<div class='alert alert-warning text-center'>",
            "<h4>No articles to display</h4>",
            "</div>",
            "<div class='card'>",
            "<div class='card-header text-center'>",
            "<h3>What Would You Like To Do?</h3>",
            "</div>",
            "<div class='card-body text-center'>",
            "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
            "</div>",
            "</div>"
          ].join("")
        );
        // Appending this data to the page
        articleContainer.append(emptyAlert);
      }

      function handleArticleClear() {
        $.get("/clear").then(function() {
          articleContainer.empty();
          initPage();
        });
      }

    function renderComments () {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-_id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    }

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

    initPage();
});