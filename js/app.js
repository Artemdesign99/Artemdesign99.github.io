var map;

google.maps.event.addDomListener(window, 'load', init);

var mark_small = {url: 'img/mark_small.png'}, mark_big = {url: 'img/mark_big.png'};

var siding = [
	['Торговая точка 3', 54.3117, 48.3890, 3],
	['Торговая точка 2', 54.3127, 48.3870, 2],
	['Торговая точка 1', 54.3147, 48.3790, 1]
];

var waterstack =  [
	['Торговая точка 5', 54.3157, 48.3891, 5],
	['Торговая точка 4', 54.3117, 48.3898, 4]
];

var panels = [
	['Торговая точка 6', 54.3177, 48.3799, 6]
];

var roof =  [
	['Торговая точка 10', 54.3157, 48.3896, 10],
	['Торговая точка 9', 54.3197, 48.3878, 9],
	['Торговая точка 8', 54.3187, 48.3899, 8],
	['Торговая точка 7', 54.3127, 48.3828, 7]
];

var board = [
	['Торговая точка 11', 54.3227, 48.3829, 11]
];

var cities = ['Казань', 'Краснодар', 'Москва', 'Самара', 'Саранск', 'Саратов', 'Сызрань', 'Тольятти', 'Ульяновск', 'Уфа'];


function setMarkers(map, locations) {
  for (var i = 0; i < locations.length; i++) {
    var point = locations[i];
    var myLatLng = new google.maps.LatLng(point[1], point[2]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: mark_small,
		//animation: google.maps.Animation.DROP,
        title: point[0],
        zIndex: point[3]
    });
	map.addMarker(marker)
  }
}

google.maps.Map.prototype.markers = new Array();

google.maps.Map.prototype.addMarker = function(marker) {
    this.markers[this.markers.length] = marker;
};

google.maps.Map.prototype.getMarkers = function() {
    return this.markers
};

google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i<this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};

function init() {
	var mapOptions = {
		zoom: 15,
		disableDefaultUI: true,
		scrollwheel: false,
		center: new google.maps.LatLng(54.3117, 48.3750),
		styles: [{stylers:[{saturation:-100},{gamma:1}]},{elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"poi.business",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi.business",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"geometry",stylers:[{visibility:"simplified"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:50},{gamma:0},{hue:"#50a5d1"}]},{featureType:"administrative.neighborhood",elementType:"labels.text.fill",stylers:[{color:"#333333"}]},{featureType:"road.local",elementType:"labels.text",stylers:[{weight:0.5},{color:"#333333"}]},{featureType:"transit.station",elementType:"labels.icon",stylers:[{gamma:1},{saturation:50}]}]
	};

	var mapElement = document.getElementById('map');
	map = new google.maps.Map(mapElement, mapOptions);
	setMarkers(map, siding)
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push({ value: str });
      }
    });
    cb(matches);
  };
};

function set_markers() {
	map.clearMarkers();
	
	$('.filter .active').each(function() {
		eval('setMarkers(map, ' + $(this).attr('data-name') + ')')
	})
	
	set_center()
}

function set_center() {
	var center_one = 0, center_two = 0;
	for(var i = 0; i < map.markers.length; i++){
       var tmp = map.markers[i].position.toString().substring(1, map.markers[i].position.toString().length - 2).replace(' ', '').split(',');
		center_one += parseFloat(tmp[0]);
		center_two += parseFloat(tmp[1]);
    }
	map.setCenter(new google.maps.LatLng((center_one / map.markers.length).toFixed(6), (center_two / map.markers.length).toFixed(6) - 0.01))
}

$(function() {
	$('.header .list li').click(function() {
		if (!$(this).hasClass('active')) {
			$('.header .list li').removeClass('active');
			$(this).addClass('active')
		}
	})
	
	$('.filter a:not(.all)').click(function(event) {
		event.preventDefault();
		
		if ($(this).hasClass('active') && $('.filter .active').size() > 1)
			$(this).removeClass('active')
		else
			$(this).addClass('active');
		
		$('.filter .all').removeClass('active')
		
		set_markers();
		
		if ($('.filter a:not(.all)').size() == $('.filter a.active').size()) {
			$('.filter a').removeClass('active');
			$('.filter .all').addClass('active');
			map.clearMarkers();
			setMarkers(map, siding);
			setMarkers(map, waterstack);
			setMarkers(map, panels);
			setMarkers(map, roof);
			setMarkers(map, board)
		}
	})
	
	$('.filter .all').click(function(event){
		event.preventDefault();
		$('.filter a').removeClass('active');
		$(this).addClass('active');
		
		map.clearMarkers();
		setMarkers(map, siding);
		setMarkers(map, waterstack);
		setMarkers(map, panels);
		setMarkers(map, roof);
		setMarkers(map, board)
	})
	
	$('.choose').click(function() {
		$(this).addClass('active')
		$('.typeahead').val('');
		var cities_list = '';
		
		for(var i = 0; i < cities.length; i++)
			cities_list += '<div class="tt-suggestion"><p style="white-space: normal;" onclick="$(\'.typeahead\').val(\'' + cities[i] + '\')">' + cities[i] + '</p></div>';
		
		$('.tt-dataset-cities').html('<span class="tt-suggestions" style="display: block;">' + cities_list + '</span>');
		$('#ahead').slideDown()
	})
	
	$('.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'cities',
		displayKey: 'value',
		source: substringMatcher(cities)
	}).focusout(function() {
		$('.select .city').html($(this).val().length > 0 ? $(this).val() : 'Ульяновск');
		$('#ahead').slideUp()
		$('.choose').removeClass('active')
	})
})