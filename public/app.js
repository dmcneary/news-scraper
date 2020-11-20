$(document).ready(function () {
    //TODO: Article saving
    //ALSO: clean up extraneous jQuery
    var articleContainer = $(".article-container");
    $("button.clear").on("click", function () {
        $(".article-container").empty();
        $(".article-container").append(
            "<div class='alert alert-warning text-center'>" +
            "<h4>Cleared articles</h4>" +
            "</div>"
        )

    });
    $(".open-comments").on("click", renderComments);
    //$("button.save").on("click", handleArticleSave)
    $("#savenote").on("click", handleCommentSave);

    function initPage() {
        $.get("/articles").then(function (data) {
            articleContainer.empty();
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

    function renderEmpty() {
        var emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>No articles to display</h4>",
                "<h4>Try scraping some articles by clicking the button in the header</h4>",
                "</div>"
            ].join("")
        );
        articleContainer.append(emptyAlert);
    }

    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHeader = $("<div class='card-header bg-danger'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                    .attr("href", article.link)
                    .text(article.title),
                //$("<a class='btn btn-success save'>Save Article</a>")
            )
        );
        var cardBody = $("<div class='card-body'>").text(article.summary);
        //var cardComments = $("<div class='comment-link'>").html("<a class='open-comments' href='#openComments' data='" + article._id + "'>View comments</a>");
        //cardBody.prepend($("<img>").attr("src", article.imgLink))
        card.append(cardHeader, cardBody);
        return card;
    }
    
    function renderComments() {
        $("#display-comments").empty();
        var thisId = $(this).attr("data-_id");
        console.log(thisId);
        $.get("/articles/" + thisId).then(function(data) {
                console.log(data);
                $("#display-comments").append("<h2>" + data.title + "</h2>");
                $("#display-comments").append("<input id='titleinput' name='title' placeholder='Comment headline...'>");
                $("#display-comments").append("<textarea id='bodyinput' name='body' placeholder='Your comment..'></textarea>");
                $("#display-comments").append("<button data-id='" + data._id + "' id='savenote'>Save Comment</button>");

                /*if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }*/
        });
    }

    function handleCommentSave () {
        var thisId = $(this).attr("data-id");
        var commTitle = $("#titleinput").val();
        var commBody = $("#bodyinput").val();

        $.post({
            url: "/articles/" + thisId,
            data: { title: commTitle, body: commBody }
        }).then(function (data) {
                console.log(data);
                $("#notes").empty();
            });
        $("#titleinput").val("");
        $("#bodyinput").val("");
    }

    initPage();

});
