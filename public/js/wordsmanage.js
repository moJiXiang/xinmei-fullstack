(function() {
  $(function() {
    var apiBaseUri;
    console.log('compile wordsmanage coffee success!');
    apiBaseUri = '/v1/api';
    $('#addkeyword-btn').click(function() {
      var kw;
      kw = $('#kw').val();
      return $.ajax({
        method: 'POST',
        data: {
          kw: kw
        },
        url: apiBaseUri + "/savekw",
        success: function(data) {
          console.log(data);
          return $('.list-group').append('<li class="list-group-item">' + data.data.keyword + '</li>');
        }
      });
    });
    $('.addwords-btn').on("click", function() {
      var kw, words;
      kw = $(this).data('kw');
      words = $(this).parent().parent().children('input.words').val();
      console.log(kw, words);
      return $.ajax({
        method: 'POST',
        data: {
          kw: kw,
          words: words
        },
        url: apiBaseUri + "/savewords",
        success: function(data) {
          return console.log(data);
        }
      });
    });
    return $('.delword-btn').on('click', function() {
      var kw, word;
      kw = $(this).parent().parent().parent().data('kw');
      word = $(this).data('word');
      console.log(kw);
      return $.ajax({
        method: 'POST',
        data: {
          kw: kw,
          word: word
        },
        url: apiBaseUri + "/delword",
        success: function(data) {
          return console.log(data);
        }
      });
    });
  });

}).call(this);
