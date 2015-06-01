(function() {
  $(function() {
    console.log('compile searchdoc coffee success');
    return $('.viewcontent').on('click', function() {
      var content;
      content = $(this).data('content');
      console.log(content);
      $('#contentmodal').find('.modal-body').html(content);
      return $('#contentmodal').modal();
    });
  });

}).call(this);
