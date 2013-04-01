// Colores:
  // ALIZARIN: #E74C3C
  // POMEGRANATE: #C0392B
// Pero el mejor es #b50d0d, jaja
var map, listaSismos;
var markers = [];
var markersCirculos = [];
var textHtmlCirculos = [];
var styles = [
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        { "visibility": "on" },
        { "color": "#000045" },
        { "lightness": 53 },
        { "gamma": 0.46 },
        { "saturation": -65 }
      ]
    },{
      "featureType": "landscape",
      "stylers": [
        { "saturation": 27 },
        { "lightness": -11 },
        { "gamma": 1 },
        { "color": "#ffffff" }
      ]
    }
  ];

function initialize() {
  var mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(-39.34616,-70.659792),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      heading: 90,
      tilt: 45,
      keyboardShortcuts:false,
      disableDoubleClickZoom:true,
      draggable:false,
      scrollwheel:false,
      backgroundColor: '#111145',
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // Listado
    listaSismos = document.getElementById('listaSismos');
    // Colores mapa
    map.setOptions({styles: styles});
    // obtiene datos, y genera marcadores
    recorreDatos();
}
// Para centrar el mapa en los marcadores
var limits = new google.maps.LatLngBounds();
// Datos de ChileTemblores jason
function recorreDatos(){
  $.getJSON('http://chiletemblores.cl/webservices/json.php', function(data) {//ori
      $.each(data, function(key, sismo) {   //generate list
      if (key==6) return (false);
        var textHtml = globoTexto(sismo);
        var latLng = new google.maps.LatLng(sismo.lat,sismo.long);
        var scale = Math.pow(2,sismo.mag); //tamaño circulo, magnitud
        var marker = new google.maps.Marker({ //Circulo
              title: getTitle(sismo.mag,sismo.ciudad,key),
              position: latLng,
              map: map,
              icon: getCircle(scale,key,false)
            });
              markers.push(marker);
              listaSismos.innerHTML += '<li title="'+ sismo.date +'" onmouseover="listaOverAndClick(' + key + ')" onclick="listaOverAndClick(' + key + ')">' 
              + sismo.mag + ' ' +sismo.ciudad +'</li>';
      });
  });
}

function globoTexto(sismo) {
  return '<div id="content">'+
         '<div id="siteNotice">'+
         '</div>'+
         '<h1 id="firstHeading" class="firstHeading">' + sismo.ciudad + '</h1>'+
         '<div id="bodyContent">'+
         '<p>Grado: '+ sismo.mag +'</p>'+
         '<p>Ubicación: '+ sismo.ubi +'</p>'+
         '<p>Fecha: '+ sismo.date +'</p>'+
         '<p>Profundidad: '+ sismo.prof +'</p>'+
         '<p>Latitud: '+ sismo.lat +'</p>'+
         '<p>Longitud: '+ sismo.long +'</p>'+
         '</div>'+
         '</div>';
}

function listaOverAndClick(key){
    for (var i = 0; i < markers.length; i++) {
    if (key == i+1)
    {
      markers[i].setIcon(getCircle(markers[i].icon.scale,i+1,true));
    }
    else
    {
      markers[i].setIcon(getCircle(markers[i].icon.scale,i+1,false));
    }
  }
}

// Metrica de Circulo
function getCircle(scale,key,activo){
  var circle;
  // Si es el primer dato, entonces
  if(key==1 && activo==true)
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "yellow",
      fillOpacity: 0.8,
      scale: scale,
      strokeColor: "black",
      strokeWeight: 2
    };
  }
  else if(key==1 && activo==false)
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "yellow",
      fillOpacity: 0.4,
      scale: scale,
      strokeColor: "black",
      strokeWeight: .5
    };
  }
  else if (activo==true)
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#b50d0d',
      fillOpacity: 0.8,
      scale: scale,
      strokeColor: "black",
      strokeWeight: 2
    };
  }
  else
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: 0.4,
      scale: scale,
      strokeColor: "black",
      strokeWeight: .5
    };
  }
  return circle;
}

// mouse over
function getTitle(magnitude,ciudad,key){
  var title;
  // Si es el primer sismo, entonces
  if(key==1)
  {
    title = "Último Sismo: " + magnitude+" "+ciudad;
  }
  else
  {
    title = magnitude+" "+ciudad;
  }
  return title;
}
google.maps.event.addDomListener(window, 'load', initialize);