(function() {
  $(function() {
    var apiBaseUri, bindLoadArticleFuc, bindLoadQyFuc, bindRefreshFuc, sendSearch;
    console.log('compile navbar coffee success');
    apiBaseUri = '/v1/api';
    sendSearch = function() {
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
          }, 1000);
        },
        success: function(result) {
          var html, postTemplate;
          postTemplate = JST['public/templates/search-results.handlebars'];
          html = postTemplate(result);
          $('#search-list').html(html);
          bindLoadQyFuc();
          bindLoadArticleFuc();
          return bindRefreshFuc();
        },
        complete: function() {
          clearInterval(time);
          $('.search-progress>.progress-bar').attr('style', "width: 100%");
          return setTimeout(function() {
            return $('.search-progress').hide();
          }, 500);
        }
      });
    };
    $('#search-btn').on('click', sendSearch);
    $(document).on('keypress', function(e) {
      var activeid, key;
      key = e.which;
      activeid = document.activeElement.id;
      if (key === 13 && activeid === 'searchval') {
        return sendSearch();
      }
    });
    $('#close-search-btn').click(function() {
      return $('.search-result').hide();
    });
    bindLoadQyFuc = function() {
      return $('.loaddata-btn').on('click', function() {
        var lcid;
        lcid = $(this).data('lcid');
        return $('#beginload-btn').on("click", function() {
          var percent, time;
          time = null;
          percent = 0;
          $('.loaddata-result').show();
          $('.loaddata-progress>.progress-bar').attr('style', "width: 0%");
          console.log('test');
          return $.ajax({
            type: 'GET',
            url: apiBaseUri + "/qy/" + lcid + "/loadqydata",
            beforeSend: function() {
              $('.loaddata-progress').show();
              return time = setInterval(function() {
                return $('.loaddata-progress>.progress-bar').attr('style', "width: " + (percent += 1) + "%");
              }, 1000);
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
    bindLoadArticleFuc = function() {
      return $('.loaddocs-btn').on('click', function() {
        var enterprise, lcid, wd;
        enterprise = $(this).data('enterprise');
        lcid = $(this).data('lcid');
        wd = null;
        return $('#beginsearch-btn').on('click', function() {
          var i, j, k, keyword, kw, len, len1, len2, percent, ref, ref1, ref2, rule, string, time;
          rule = $('input[name=optionsRadios]:checked', '#articledatamodal').val();
          keyword = $('input[name=optionsRadios]:checked', '#articledatamodal').parent().parent('div.radio').find('.searchval').val();
          switch (rule) {
            case 'allmatch':
              wd = '"' + ("" + enterprise) + '"';
              break;
            case 'exclude':
              string = '';
              ref = keyword.split(',');
              for (i = 0, len = ref.length; i < len; i++) {
                kw = ref[i];
                string = string + '-' + kw + ' ';
              }
              wd = enterprise + " " + string;
              break;
            case 'widematch':
              wd = "" + keyword;
              break;
            case 'intitle':
              wd = "intitle:" + enterprise;
              break;
            case 'allintitle':
              string = '';
              ref1 = keyword.split(',');
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                kw = ref1[j];
                string = string + kw + ' ';
              }
              wd = "allintitle:" + enterprise + " " + string;
              break;
            case 'keywords':
              string = '';
              ref2 = keyword.split(',');
              for (k = 0, len2 = ref2.length; k < len2; k++) {
                kw = ref2[k];
                string = string + kw + ' ';
              }
              wd = enterprise + " " + string;
          }
          time = null;
          percent = 0;
          $('.loaddata-result').show();
          $('.loaddata-progress>.progress-bar').attr('style', "width: 0%");
          return $.ajax({
            type: 'POST',
            url: apiBaseUri + "/spider",
            data: {
              lcid: lcid,
              wd: wd
            },
            beforeSend: function() {
              $('.loaddata-progress').show();
              return time = setInterval(function() {
                return $('.loaddata-progress>.progress-bar').attr('style', "width: " + (percent += 1) + "%");
              }, 1000);
            },
            success: function(result) {
              var html, postTemplate;
              postTemplate = JST['public/templates/search-doc.handlebars'];
              html = postTemplate({
                lcid: lcid
              });
              return $('#search-doc').html(html);
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
    return bindRefreshFuc = function() {
      return $('.entrefresh-btn').one("click", function() {
        var lcid;
        console.log('----------');
        lcid = $(this).data('lcid');
        return $.ajax({
          method: 'get',
          url: apiBaseUri + "/qy/" + lcid + "/refresh",
          success: function(data) {
            return console.log(data);
          }
        });
      });
    };
  });

}).call(this);
