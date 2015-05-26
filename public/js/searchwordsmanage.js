(function() {
  $(function() {
    var apiBaseUri, getSeletSource, optionsdata;
    console.log('compile searchwordsmanage coffee success!');
    apiBaseUri = '/v1/api';
    optionsdata = {};
    $.ajax({
      method: 'get',
      url: apiBaseUri + "/words",
      success: function(results) {
        var i, j, len, len1, ref, ref1, result, results1, word;
        console.log(results);
        ref = results.data;
        for (i = 0, len = ref.length; i < len; i++) {
          result = ref[i];
          optionsdata[result.keyword] = result.words;
          $('#keyword').append("<option value='" + result.keyword + "'>" + result.keyword + "</option>");
        }
        ref1 = results.data[0].words;
        results1 = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          word = ref1[j];
          results1.push($('#word').append("<option value='" + word + "'>" + word + "</option>"));
        }
        return results1;
      }
    });
    getSeletSource = function(type) {
      return $.ajax({
        method: 'get',
        url: apiBaseUri + "/enterprises",
        success: function(results) {
          var entarr;
          console.log(results);
          entarr = results.data.map(function(ent) {
            var obj;
            if (type === 'entname') {
              obj = {};
              obj.label = ent.entname;
              obj._id = ent._id;
              return obj;
            } else {
              obj = {};
              obj.label = ent.corporation;
              obj._id = ent._id;
              return obj;
            }
          });
          console.log(entarr);
          return $('#main').autocomplete({
            source: entarr
          });
        }
      });
    };
    getSeletSource('entname');
    $('#typechange').change(function() {
      var type;
      type = $(this).val();
      console.log(type);
      return getSeletSource(type);
    });
    $('#keyword').change(function() {
      var i, len, results1, thisselect, word, words;
      console.log(optionsdata);
      thisselect = $(this).val();
      words = optionsdata[thisselect];
      $('#word').html('<option value="">空</option>');
      results1 = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        results1.push($('#word').append("<option>" + word + "</option>"));
      }
      return results1;
    });
    return $('#addsearchword-btn').click(function() {
      var keyword, main, word;
      main = $('#main').val();
      keyword = $('#keyword option:selected').val();
      word = $('#word option:selected').val();
      return $.ajax({
        method: 'post',
        url: apiBaseUri + "/searchwords",
        data: {
          main: main,
          keyword: keyword,
          word: word
        },
        success: function(result) {
          var searchwords;
          searchwords = result.data;
          return $('#searchwords-list').append("<li class='list-group-item'>" + searchwords.main + "," + searchwords.keyword + "," + searchwords.word + "</li>");
        }
      });
    });
  });

}).call(this);
