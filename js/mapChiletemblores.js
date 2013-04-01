// Colores:
  // ALIZARIN: #E74C3C
  // POMEGRANATE: #C0392B
// Pero el mejor es #b50d0d, jaja
var map, listaSismos;
var markers = [];
var markersCirculos = [];
var textHtmlCirculos = [];
var globoInfo;
// Colores mapa
// http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
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
      center: new google.maps.LatLng(-39.44616,-70.659792),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      heading: 90,
      tilt: 45,
      keyboardShortcuts:false,
      disableDoubleClickZoom:true,
      //draggable:false,
      scrollwheel:false,
      //elements:{map:!1,lat:!1,lng:!1,locality:!1,country:!1},
      //draggableMarker:!0,
      //draggableCursor:true,
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
        var textHtml = globoTexto(sismo);
        var latLng = new google.maps.LatLng(sismo.lat,sismo.long);
        limits.extend(latLng);
        var marker = new google.maps.Marker({ //Circulo
              title: getTitle(sismo.mag,key),
              position: latLng,
              map: map,
              icon: getCircle(sismo.mag,key)
            });
        setGlobo(marker, textHtml);
        markersCirculos.push(marker);
        textHtmlCirculos.push(textHtml);
        var marker = new MarkerWithLabel({//markers
                position: latLng,
                map: map,
                title: getTitle(sismo.mag,key),
                // animation: google.maps.Animation.DROP,
                // draggable: true,
                // raiseOnDrag: true,
                labelContent: sismo.mag,
                labelAnchor: new google.maps.Point(11, 25),
                labelStyle: {opacity: 1.0},
                labelClass: "labelMarks", // the CSS class for the label
                // labelInBackground: true,
                icon:new google.maps.MarkerImage("img/symbol_blank.png",
                     new google.maps.Size(30,40),
                     new google.maps.Point(0,0),
                     new google.maps.Point(16,35)),
              });
              markers.push(marker);
              setGlobo(marker, textHtml);
              listaSismos.innerHTML += '<li title="'+ sismo.date +'" onmouseover="listaOver(' + key + ')" onclick="listaClick(' + key + ')">' 
              + sismo.mag + ' ' +sismo.ciudad +'</li>';
              setAllMap(null);
      });
      map.fitBounds(limits);
  });
  responsiveDesign(map, limits);
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

function setGlobo(marker, textHtml){
  google.maps.event.addListener(marker, 'mouseover', function(){
      var contentString = textHtml;
      if(!globoInfo){
          globoInfo
      globoInfo  = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });
          map.panTo(marker.position);
          globoInfo.open(map, this);
      }
      else {
        if(contentString != globoInfo.content){
          globoInfo.setContent(contentString);
          map.panTo(marker.position);
          globoInfo.open(map, this);
        }
        else if(contentString == globoInfo.content && globoInfo.anchor==null){
          map.panTo(marker.position);
          globoInfo.open(map, this);
        }
      }
    });
    google.maps.event.addListener(map, 'mouseout', function(){
        window.setTimeout(function() {
          if(globoInfo){
            globoInfo.close(map, this);
          }
          centrarMapa();
        }, 2000);
    });
    google.maps.event.addListener(marker, 'click', function(){
        if(globoInfo.anchor==null){
          map.panTo(marker.position);
          globoInfo.open(map, this);
        }
    });
    google.maps.event.addListener(map, 'click', function(){
        if(globoInfo){
          globoInfo.close(map, this);
          centrarMapa();
        }
    });
    if (marker.label){
       google.maps.event.addListener(marker, 'click', function(){
          if (marker.getAnimation() != null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ marker.setAnimation(null); }, 250);
          }
        });
    }
}

function listaOver(key){
      var contentString = textHtmlCirculos[key-1];
      if(!globoInfo){
          globoInfo
      globoInfo  = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });
          map.panTo(markersCirculos[key].position);
          globoInfo.open(map, markersCirculos[key-1]);
      }
      else {
        if(contentString != globoInfo.content){
          globoInfo.setContent(contentString);
          map.panTo(markersCirculos[key-1].position);
          globoInfo.open(map, markersCirculos[key-1]);
        }
        else if(contentString == globoInfo.content && globoInfo.anchor==null){
          map.panTo(markersCirculos[key-1].position);
          globoInfo.open(map, markersCirculos[key-1]);
        }
      }
}

function listaClick(key){
  if(globoInfo.anchor==null){
    map.panTo(markersCirculos[key-1].position);
    globoInfo.open(map, markersCirculos[key-1]);
  }
  else if(globoInfo.anchor){
    globoInfo.close(map, markersCirculos[key-1]);
    centrarMapa();
  }
}

function ocultarMostrarMarca() {
  if (markers[0].map)
  {
    setAllMap(null);
  } else {
    setAllMap(map);
  }
}
// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function centrarMapa(){
    map.setCenter(map.center);
    map.fitBounds(limits);
}

// Responsive Design gmap api v3
function responsiveDesign(map, limits) {
  google.maps.event.addDomListener(map, 'idle', function() {
    calculateCenter(map);
  });
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(map.center);
    map.fitBounds(limits);
  });
}
// Responsive Design gmap api v3
function calculateCenter(map) {
  map.center = map.getCenter();
}
// Metrica de Circulo
function getCircle(magnitude,key){
  var circle;
  // Si es el primer dato, entonces
  if(key==1)
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "yellow",
      fillOpacity: 0.4,
      scale: Math.pow(2,magnitude),
      strokeColor: "black",
      strokeWeight: .5
    };
  }
  else
  {
    circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "red",
      fillOpacity: 0.4,
      scale: Math.pow(2,magnitude),
      strokeColor: "yellow",
      strokeWeight: .5
    };
  }
  return circle;
}
// mouse over
function getTitle(magnitude,key){
  var title;
  // Si es el primer sismo, entonces
  if(key==1)
  {
    title = "Último Sismo: " + magnitude;
  }
  else
  {
    title = magnitude;
  }
  return title;
}
google.maps.event.addDomListener(window, 'load', initialize);