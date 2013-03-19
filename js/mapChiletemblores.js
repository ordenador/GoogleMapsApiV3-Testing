// Colores:
  // #E74C3C
  // ALIZARIN
  // #C0392B
  // POMEGRANATE
// Pero el mejor es #b50d0d, jaja

    var map, listaSismos;
    var centroPrincipal = null;
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
    // Para centrar el mapa en los marcadores
    var limits = new google.maps.LatLngBounds();

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
        
        //Listado
        listaSismos = document.getElementById('listaSismos');
        // Colores mapa
        map.setOptions({styles: styles});
        
        recorreDatos();

        map.fitBounds(limits);
        responsiveDesign(map, limits);
        
      }
      // Datos de ChileTemblores jason
      function recorreDatos(){
        //$.getJSON('http://chiletemblores.cl/webservices/json.php', function(data) {//ori
          var data = {"1":{"id":"20130303092033","date":"2013\/03\/03 09:20:33","lat":"-24.016","long":"-67.349","mag":"3.7","prof":"252.9","ubi":"149 km al SE de San Pedro de Atacama","ciudad":"San Pedro de Atacama"},"2":{"id":"20130303071222","date":"2013\/03\/03 07:12:22","lat":"-24.963","long":"-70.763","mag":"3.3","prof":"46.4","ubi":"150 km al S de Antofagasta","ciudad":"Antofagasta"},"3":{"id":"20130303051639","date":"2013\/03\/03 05:16:39","lat":"-21.151","long":"-69.067","mag":"3.7","prof":"97.3","ubi":"74 km al NE de Quillagua","ciudad":"Quillagua"},"4":{"id":"20130303032908","date":"2013\/03\/03 03:29:08","lat":"-21.284","long":"-70.379","mag":"3.5","prof":"45.8","ubi":"97 km al NO de Quillagua","ciudad":"Quillagua"},"5":{"id":"20130303032250","date":"2013\/03\/03 03:22:50","lat":"-17.963","long":"-71.001","mag":"3.5","prof":"63.0","ubi":"80 km al O de Tacna","ciudad":"Tacna"},"6":{"id":"20130303025236","date":"2013\/03\/03 02:52:36","lat":"-34.900","long":"-73.845","mag":"3.5","prof":"34.3","ubi":"167 km al NO de Cobquecura","ciudad":"Cobquecura"},"7":{"id":"20130303021720","date":"2013\/03\/03 02:17:20","lat":"-22.466","long":"-70.530","mag":"4.0","prof":"27.4","ubi":"71 km al N de Mejillones","ciudad":"Mejillones"},"8":{"id":"20130303003024","date":"2013\/03\/03 00:30:24","lat":"-21.023","long":"-68.240","mag":"3.8","prof":"164.1","ubi":"49 km al SE de Mina Collahuasi","ciudad":"Mina Collahuasi"},"9":{"id":"20130302221856","date":"2013\/03\/02 22:18:56","lat":"-23.853","long":"-67.036","mag":"3.8","prof":"211.1","ubi":"158 km al SE de San Pedro de Atacama","ciudad":"San Pedro de Atacama"},"10":{"id":"20130302210958","date":"2013\/03\/02 21:09:58","lat":"-25.618","long":"-70.819","mag":"3.0","prof":"63.7","ubi":"83 km al N de Cha\u00f1aral.","ciudad":"Cha\u00f1aral."},"11":{"id":"20130302200504","date":"2013\/03\/02 20:05:04","lat":"-35.447","long":"-70.300","mag":"3.3","prof":"16.1","ubi":"100 km al SE de Curic\u00f3","ciudad":"Curic\u00f3"},"12":{"id":"20130302195845","date":"2013\/03\/02 19:58:45","lat":"-31.334","long":"-71.261","mag":"3.6","prof":"70.0","ubi":"30 km al SO de Combarbal\u00e1","ciudad":"Combarbal\u00e1"},"13":{"id":"20130302191117","date":"2013\/03\/02 19:11:17","lat":"-22.733","long":"-69.055","mag":"3.1","prof":"112.8","ubi":"33 km al NE de Sierra Gorda.","ciudad":"Sierra Gorda."},"14":{"id":"20130302183606","date":"2013\/03\/02 18:36:06","lat":"-21.311","long":"-67.261","mag":"3.9","prof":"279.0","ubi":"105 km al SO de Uyuni","ciudad":"Uyuni"},"15":{"id":"20130302165243","date":"2013\/03\/02 16:52:43","lat":"-35.377","long":"-70.323","mag":"3.2","prof":"9.4","ubi":"94 km al SE de Curic\u00f3","ciudad":"Curic\u00f3"}};//extra
            var sismo;//extra
            //$.each(data, function(key, sismo) {   //generate list //ori
            var key =1;//extra
            for (var sismo in data) {//extra
              sismo = data[key];//extra
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
               //animation: google.maps.Animation.DROP,
               // draggable: true,
               // raiseOnDrag: true,
               labelContent: sismo.mag,
               labelAnchor: new google.maps.Point(11, 25),
               labelStyle: {opacity: 1.0},
               labelClass: "labelMarks", // the CSS class for the label
               //labelInBackground: true,
               icon:new google.maps.MarkerImage("img/symbol_blank.png",
                    new google.maps.Size(30,40),
                    new google.maps.Point(0,0),
                    new google.maps.Point(16,35)),
                  //No es necesaria la sombra
                  // shadow:new google.maps.MarkerImage("img/shadow.png",
                  //       new google.maps.Size(25,9),
                  //       new google.maps.Point(0,0),
                  //       new google.maps.Point(12,5))
             });
             markers.push(marker);
             setGlobo(marker, textHtml);
             listaSismos.innerHTML += '<li title="'+ sismo.date +'" onmouseover="listaOver(' + key + ')" onclick="listaClick(' + key + ')">' 
             + sismo.mag + ' ' +sismo.ciudad +'</li>';
              //});
    key++;//extra
   }//extra
           //});//ori
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
              // else if(globoInfo.anchor){
              //   globoInfo.close(map, this);
              //   centrarMapa();
              // }
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
      // // Removes the overlays from the map, but keeps them in the array.
      // function clearOverlays() {
      //   setAllMap(null);
      // }

      // // Shows any overlays currently in the array.
      // function showOverlays() {
      //   setAllMap(map);
      // }

      // // Deletes all markers in the array by removing references to them.
      // function deleteOverlays() {
      //   clearOverlays();
      //   markers = [];
      // }





      function centrarMapa(){
          map.panTo(centroPrincipal);
      }

      // Responsive Design gmap api v3
      function responsiveDesign(map, limits) {
        google.maps.event.addDomListener(map, 'idle', function() {
          calculateCenter(map);
          if (centroPrincipal==null){
            centroPrincipal = map.getCenter();
          }
        });
        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(map.center);
          map.fitBounds(limits);
          var offSet = new google.maps.LatLng(map.center.mb, map.center.nb);
          map.panTo(offSet);
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
        // Si es el primer dato, entonces
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