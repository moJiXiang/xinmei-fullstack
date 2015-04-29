(function() {
  $(function() {
    var apiBaseUri, bindLoadFuc;
    console.log('compile navbar coffee success');
    apiBaseUri = '/v1/api';
    $('#search-btn').click(function() {
      var percent, searchval, time;
      searchval = $('#searchval').val();
      time = null;
      percent = 0;
      $('.search-result').show();
      $('.search-progress>.progress-bar').attr('style', "width: 0%");
      return $.ajax({
        method: 'get',
        url: apiBaseUri + "/search?enterprise=" + searchval,
        beforeSend: function() {
          $('.search-progress').show();
          return time = setInterval(function() {
            return $('.search-progress>.progress-bar').attr('style', "width: " + (percent += 2) + "%");
          }, 500);
        },
        success: function(result) {
          var html, postTemplate;
          postTemplate = JST['public/templates/search-results.handlebars'];
          html = postTemplate(result);
          $('#search-list').html(html);
          return bindLoadFuc();
        },
        complete: function() {
          clearInterval(time);
          $('.search-progress>.progress-bar').attr('style', "width: 100%");
          return setTimeout(function() {
            return $('.search-progress').hide();
          }, 500);
        }
      });
    });
    $('#close-search-btn').click(function() {
      return $('.search-result').hide();
    });
    return bindLoadFuc = function() {
      return $('.loaddata-btn').on('click', function() {
        var lcid;
        lcid = $(this).data('lcid');
        return $('#beginload-btn').on("click", function() {
          var percent, time;
          time = null;
          percent = 0;
          $('.loaddata-result').show();
          $('.loaddata-progress>.progress-bar').attr('style', "width: 0%");
          return $.ajax({
            type: 'POST',
            url: apiBaseUri + "/loadqydata",
            data: {
              lcid: lcid
            },
            beforeSend: function() {
              $('.loaddata-progress').show();
              return time = setInterval(function() {
                return $('.loaddata-progress>.progress-bar').attr('style', "width: " + (percent += 1) + "%");
              }, 500);
            },
            success: function(result) {
              var html, postTemplate;
              result.lcid = lcid;
              postTemplate = JST['public/templates/modal-result.handlebars'];
              html = postTemplate(result);
              return $('#modal-result').html(html);
            },
            complete: function() {
              clearInterval(time);
              $('.loaddata-progress>.progress-bar').attr('style', "width: 100%");
              return setTimeout(function() {
                return $('.loaddata-progress').hide();
              }, 500);
            }
          });
        });
      });
    };
  });

}).call(this);
