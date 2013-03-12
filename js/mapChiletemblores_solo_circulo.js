     // Colores mapa
     // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
      function initialize() {
        var popup;
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
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        // Colores mapa
        map.setOptions({styles: styles});

        // Datos de ChileTemblores jason
        var limits = new google.maps.LatLngBounds();
        $.getJSON('http://chiletemblores.cl/webservices/json.php', function(data) {
            $.each(data, function(key, sismo) {   //generate list
              var latLng = new google.maps.LatLng(sismo.lat,sismo.long);
              limits.extend(latLng);
              var marker = new google.maps.Marker({ //Circulo
                  title: getTitle(sismo.mag,key),
                  position: latLng,
                  map: map,
                  icon: getCircle(sismo.mag,key)
              });
             var textHtml = globoTexto(sismo.ciudad,sismo.mag,sismo.date);
              google.maps.event.addListener(marker, 'mouseover', function(){
                var note = textHtml;
                if(!popup){
                    popup = new google.maps.InfoWindow();
                    popup.setContent(note);
                    popup.open(map, this);
                }
                else {
                  if(note != popup.content){
                    popup.setContent(note);
                    popup.open(map, this);
                  }
                  else if(note == popup.content && popup.anchor==null){
                    popup.open(map, this);
                  }

                }
              });
              google.maps.event.addListener(map, 'mouseout', function(){
                  window.setTimeout(function() {
                    if(popup){
                      popup.close(map, this);
                    }
                    map.fitBounds(limits);
                  }, 2000);
              });
              google.maps.event.addListener(marker, 'click', function(){
                  if(popup.anchor==null){
                    popup.open(map, this);
                  }
                  else if(popup.anchor){
                    popup.close(map, this);
                    map.fitBounds(limits);
                  }
              });
              google.maps.event.addListener(map, 'click', function(){
                  if(popup){
                    popup.close(map, this);
                    map.fitBounds(limits);
                  }
              });
              //sismo.ciudad
              //sismo.date
              });

             map.fitBounds(limits);
          });
        responsiveDesign(map, limits);
        }
        function globoTexto (ciudad,mag,date) {
            return '<H1>' + ciudad + '</H1><H3>Grado: '+ mag +'</H3>'
             +'<H3>Fecha: '+date+'</H3>';
          // body...
        }
      // Responsive Design gmap api v3
      function responsiveDesign(map, limits) {
        google.maps.event.addDomListener(map, 'idle', function() {
          calculateCenter(map);
        });
        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(center);
          map.fitBounds(limits);
        });
      }
      // Responsive Design gmap api v3
      function calculateCenter(map) {
        center = map.getCenter();
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
            fillOpacity: 0.5,
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
            fillOpacity: 0.5,
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