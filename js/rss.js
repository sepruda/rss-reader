$(document).ready(function(){

    hentNyheder();

    $(document).on("click", ".nyheds-indhold", function(begivenhed){ //event-listener gælder for alle fremtidige elementer med class nyheds-container (selector)
        console.log(this); //this bruges, da vi ikke kender elementet der bliver klikket på, før der klikkes.
        //var element = $(this);
        $(this).children(".nyheds-tekst, .nyheds-billede").slideToggle(); // jquery slide-in funktion, kræver at elementet er usynligt (derfor css-inline none på nyheds-te)
    });

});

function hentNyheder () {
    //URL til Yahoo Query Language, der laver en JSON-udgave af en RSS-feed
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%2CpubDate%2CDR%3AXmlImageArticle%20from%20rss%20where%20url%20%3D%20'https%3A%2F%2Fwww.dr.dk%2Fnyheder%2Fservice%2Ffeeds%2Fkultur'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?"

    $.getJSON(url, function(nyheder){

        console.log(nyheder.query.results.item);

        //Tællerfunktion der skal sætte en row ind for hver 3. nyhed
        var antal_kolonner = 3;

        //laver en række i globalscope til vores grid, hvor kortene herunder skal starte med at sætte
        var rakke = $("<div>")
        .addClass('card-deck')
        .appendTo('#indhold');

        $.each(nyheder.query.results.item, function (indeks, nyhed){ //her kan forEach eller for-loopet også bruges

            var billede
            //default billede hvis der ikke er billede til artiklen
            billede = "https://asset.dr.dk/ImageScaler03/?url=%2F%2Fwww.dr.dk%2Fimages%2Fother%2F2018%2F05%2F01%2Ftotoro_2.jpg&preset=c-xs&ratio=16-9";

            if (nyhed.XmlImageArticle) {
                if (typeof nyhed.XmlImageArticle.ImageUri620x349 == "object") { //hvis billedet kommer i et array, i stedet for et enkelt billede
                    nyhed.XmlImageArticle.ImageUri620x349.forEach(function (x){ //testes hvert element i arrayet
                      if (x.match(/(\.jpg|\.png)$/)) { //JS-funktion .match der vha regex tester om element slutter med jpg eller png
                        billede = x; //dette element tildeles variablen billede
                      }
                    });
                } else {
                    billede = nyhed.XmlImageArticle.ImageUri620x349; // ellers vælges billedet der fremkommer med artiklen
                }
            }

            //Betinget indsættelse af row-elementet til grid
            if (indeks % antal_kolonner == 0) {
               rakke = $("<div>")
              .addClass('card-deck pb-3')
              .appendTo('#indhold');
            }

            /*var kolonne = $("<div>")
            .addClass("col-md-4");*/

            var kort = $("<div>")
            .addClass("card");

            var dato = new Date(nyhed.pubDate).toLocaleString(); //omskriver den internationale datostring til dansk (lokal syntaks)

            var httpsLink = nyhed.link.replace("http", "https"); //erstatter links med https

            var kort_top = $('<div>')
            .appendTo(kort)
            .addClass("card-header");

            $('<small>')
            .text(dato)
            .addClass('text-muted')
            .appendTo(kort_top);

            $("<img>")
            .attr("src",billede)
            .appendTo(kort)
            .addClass("card-img-top");

            var kort_krop = $('<div>')
            .addClass("card-body")
            .appendTo(kort);

            $("<h5>").text(nyhed.title)
            .appendTo(kort_krop)
            .addClass("card-title");

            $("<p>")
            .text(nyhed.description)
            .appendTo(kort_krop)
            .addClass('card-text');

            var kort_fod = $('<div>')
            .addClass('card-footer')
            .appendTo(kort);

            $("<a>")
            .text('Læs hele artiklen')
            .attr('href',httpsLink)
            .addClass('btn btn-light btn-block')
            .appendTo(kort_fod);

            $(kort)
            .appendTo(rakke);

        });
    });

}
