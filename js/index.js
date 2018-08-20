  var urlArr = [];
  var newsUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=20&page=1&sortBy=popularity&apiKey=8baae84ab6274d09812004b7a722765c";  
  var pageNum = 1;
  var usrLocation = "Detroit";
  var todayDate = new Date();
  var lastWeekRaw = (todayDate - (24*60*60*1000*7));
  var lastWeek = formatDate(lastWeekRaw);
  
function getLocation(){
  return usrLocation;
}


  
function populatePage(num){
  
  
    $("#row-0").append('<div class="col"><div class="article-box" id="article-' + num + '"><div class="title-frame"><div class="article-title" id="article-' + num + '-title"></div><div class="sourcedate-frame"><div class="article-source" id="article-' + num + '-source"></div><div class="article-date" id="article-' + num + '-date"></div><hr></div></div><div class="image-box" id="article-' + num + '-image"></div><br><div class="article-description" id="article-' + num + '-description"></div></div></div>');
 
  
}

function depopulatePage(){
  $("#row-0").html("");
  urlArr = [];
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getArticles(newsUrl){
  $.getJSON(newsUrl, function(data){
    
    for (var i=0; i<data.articles.length; i++){
      
      populatePage(i);
      
      let date = new Date(data.articles[i].publishedAt);
      let articleTitle = "#article-" + i + "-title";
      let articleSource = "#article-" + i + "-source";
      let articleDate = "#article-" + i + "-date";
      let articleImage = "#article-" + i + "-image";
      let articleDescription = "#article-" + i + "-description";
      let articleUrl = "#url-" + i;
      
      $(articleTitle).text(data.articles[i].title);
      $(articleSource).text(data.articles[i].source.name);
      $(articleDate).text(date.toLocaleString());
      if (data.articles[i].urlToImage !== null){
      $(articleImage).html('<img src="' + data.articles[i].urlToImage + '" class="img-fluid">');} else {
        $(articleImage).html('<img src="https://lh6.ggpht.com/dQYJMHBHgUFwpHvuorlnlYrQrKywc78JtSm9c20_ZZb5uu9843Q3i0wJaLb1Nsge-f0=w300" class="article-image">');
      }
      
      if(data.articles[i].description !== null){
        $(articleDescription).text(data.articles[i].description);
      } else {
        $(articleDescription).text("Click to read more.");
      }
      
      urlArr[i] = data.articles[i].url;
    }
    if (data.totalResults <= (20 * pageNum)){
    $("#forward").prop("disabled", true);
  } else {
    $("#forward").prop("disabled", false);
  }
    
  if (pageNum <= 1){
    $("#back").prop("disabled", true);
  } else {
    $("#back").prop("disabled", false);
  }
  
  });
}

function listSources(){
  var url = "https://newsapi.org/v2/sources?apiKey=8baae84ab6274d09812004b7a722765c";
  
  $.getJSON(url, function(data){
    for (var i=0; i<data.sources.length; i++){
    }
  });
}

function setLocation(newLoc){
  
  if (typeof newLoc === "string"){
    usrLocation = newLoc;
      
    
      pageNum = 1; 
      depopulatePage();
      document.getElementById("page-buttons").style.display = "block";
        $("#title-text").html(usrLocation + " News" + "<br><div class='subtext-info'>Page " + pageNum + "</div>");
        newsUrl = "https://newsapi.org/v2/everything?q=" + usrLocation + "&pageSize=20&page=1&sortBy=popularity&from=" + lastWeek + "&apiKey=8baae84ab6274d09812004b7a722765c";
        
      getArticles(newsUrl);
  }
}


$(document).ready(function(){

  var totalResults = 0;

  getArticles(newsUrl);
  var searchterm = "";
	
	
  $("#page-container").on("click", ".article-box", function(){
    var target = this.id;
    var targInt = 0 //Number.parseInt(target.charAt(target.length-2), 10);
	var targStr = ""  
	
	  for (var i=0; i<target.length; i++){
		let part = Number.parseInt(target.charAt(i), 10);
		  if (!isNaN(part)){
			
			let stringpart = part.toString();
			
			targStr+=stringpart;
		  }
	  }
	  
	targInt = targStr.valueOf();
	  
    window.open(urlArr[targInt]);
    
  });
  
  $("#searchbox").keyup(function(event) {
    if (event.keyCode === 13) {
      searchterm = searchbox.value;
      var searchUrl = "";
      pageNum = 1; 
      depopulatePage();
      if (searchterm.length > 0){
        document.getElementById("page-buttons").style.display = "block";
        $("#title-text").html("Results: " + searchterm + "<br><div class='subtext-info'>Page " + pageNum + "</div>");
        searchUrl = "https://newsapi.org/v2/everything?q=" + searchterm + "&pageSize=20&page=1&sortBy=popularity&from=" + lastWeek + "&apiKey=8baae84ab6274d09812004b7a722765c";
        } else {
        searchUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=20&page=1&sortBy=popularity&apiKey=8baae84ab6274d09812004b7a722765c";
           
        }
      getArticles(searchUrl);
    }
    
    
  });
  
  $("#home").on("click", function(){
    depopulatePage();
    document.getElementById("page-buttons").style.display = "none";
    searchbox.value = "";
    $("#title-text").html("Today's Top Stories");
    newsUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=20&page=1&sortBy=popularity&apiKey=8baae84ab6274d09812004b7a722765c";
    pageNum = 1;
    getArticles(newsUrl);
  });
  
  $("#forward").on("click", function(){
 if (searchterm.length > 0){
    var regExp = new RegExp(/page=\d+/);
    pageNum++;
    newsUrl = "https://newsapi.org/v2/everything?q=" + searchterm + "&pageSize=20&page=1&sortBy=popularity&from=" + lastWeek + "&apiKey=8baae84ab6274d09812004b7a722765c";
    
    var newUrl = newsUrl.replace(regExp, "page=" + pageNum);
    
    $(".subtext-info").text("Page " + pageNum);
    depopulatePage();
    getArticles(newUrl);
   
   
 }
    
    
  });
  
  $("#back").on("click", function(){
 
    var regExp = new RegExp(/page=\d+/);
    pageNum--;
    var newUrl = newsUrl.replace(regExp, "page=" + pageNum);
    
    $(".subtext-info").text("Page " + pageNum);
    depopulatePage();
    getArticles(newUrl);   
  });
  
  $(".destination").on("click", function(){
      searchterm = this.id;
      
      if (searchterm === "Local"){
        searchterm = getLocation();
      }
    
      pageNum = 1; 
      depopulatePage();
      document.getElementById("page-buttons").style.display = "block";
        $("#title-text").html(searchterm + " News" + "<br><div class='subtext-info'>Page " + pageNum + "</div>");
        newsUrl = "https://newsapi.org/v2/everything?q=" + searchterm + "&pageSize=20&page=1&sortBy=popularity&from=" + lastWeek + "&apiKey=8baae84ab6274d09812004b7a722765c";
        
      getArticles(newsUrl);
    
  });
  
  $("#page-top").on("click", function(){
     document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0; 
  });
  
  $("#set-location").on("click", function(){
     var newLoc = prompt("Select your City/Region:", "Detroit")
     if (newLoc !== null){
      setLocation(newLoc);
     }
  })
  
});
