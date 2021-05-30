$(document).ready(function () {
  if ($('#home').length) {
    new get_recent_donations();
  }

  const apiUrls = {
    shows: 'http://api.tvmaze.com/shows',
    search: 'http://api.tvmaze.com/search/shows'
  };

  const homeLink = $('#homeLink');

  $.ajax({
    url: apiUrls.shows,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      searchResult(data);
      homeLink.addClass('hide');
    }
  });

  function searchResult(results) {
    let ulElement = $('#showList');
    let liElement, aElement;
    for(let i = 0; i < results.length; i++ ) {
      liElement = document.createElement('li');
      aElement = document.createElement('a');
      aElement.href = results[i]._links.self.href;
      aElement.text = results[i].name;
      $(liElement).append(aElement);
      $(ulElement).append(liElement);
    }
    ulElement.removeClass('hide');
    $('#show').addClass('hide');
    homeLink.removeClass('hide');
  }

  $(document).on('click', 'ul#showList li a', function(e){
    e.preventDefault();
    let ulElement = $('#showList');
    ulElement.addClass('hide');
    let showElement = $('#show');
    showElement.empty();
    $.ajax({
      url: $(this).attr('href'),
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        homeLink.removeClass('hide');
        let h1Tag = document.createElement('h1');
        h1Tag.text = data.name || 'N/A';
        let impTag = document.createElement('img');
        if(data.image && data.image.medium) {
          impTag.src = data.image.medium;
        } else {
          impTag.src = `${location.origin}/public/image/no_image.jpeg`;
        }

        let dl = document.createElement('dl');
        let dt, dd;

        dt = document.createElement('dt');
        dt.innerText = 'Language';
        dl.append(dt);
        dd = document.createElement('dd');
        dd.innerText = data['language'] || 'N/A';
        dl.append(dd);

        dt = document.createElement('dt');
        dt.innerText = 'Genre';
        dl.append(dt);
        dd = document.createElement('dd');
        let ul = document.createElement('ul');
        let li;
        if(data.genres) {
          for(let i = 0; i < data.genres.length; i++) {
            li = document.createElement('li');
            li.innerText = data.genres[i];
            ul.appendChild(li);
          }
          dd.appendChild(ul);
        } else {
          dd = document.createElement('dd');
          dd.innerText = 'N/A';
        }
        dl.append(dd);

        dt = document.createElement('dt');
        dt.innerText = 'Average Rating';
        dl.append(dt);
        dd = document.createElement('dd');
        dd.innerText = data.rating.average  || 'N/A';
        dl.append(dd);

        dt = document.createElement('dt');
        dt.innerText = 'Network';
        dl.append(dt);
        dd = document.createElement('dd');
        dd.innerText = data.network.name  || 'N/A';
        dl.append(dd);

        dt = document.createElement('dt');
        dt.innerText = 'Summary';
        dl.append(dt);
        dd = document.createElement('dd');
        if(data.summary) {
          dd.append(data.summary );
        } else {
          dd.innerText = 'N/A';
        }

        dl.append(dd);

        showElement.append(h1Tag);
        showElement.append(impTag);
        showElement.append(dl);
        $('#show').removeClass('hide');
      }
    });
  });

  $('#searchForm').submit(function(e){
    e.preventDefault();
    let errorElement = $('#error');
    let searchField = $(this).find('input').val();
    if(searchField.trim().length < 1) {
      errorElement.text("Search field is empty");
      errorElement.css('color', 'red');
    } else {
      errorElement.text('');
      let ulElement = $('#showList');
      ulElement.empty();

      search(searchField);
    }
  });

  function search(query) {
    $.ajax({
      url: `${apiUrls.search}?q=${query}`,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        let result = [];
        for(let i = 0; i < data.length; i++) {
          result.push(data[i]["show"]);
        }
        searchResult(result);
      }
    });
  }
});