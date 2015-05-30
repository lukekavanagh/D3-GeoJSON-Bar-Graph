$(document).ready(function(){

	// $.get( "some/route", function( geojson ) {
	//   	alert( "requesting data" );
	// }).done(function() {
	//     alert( "data loaded" );

	//     loadMapAndGraph();
	// });

	loadMapAndGraph();

	function loadMapAndGraph() {
			L.mapbox.accessToken = 'pk.eyJ1IjoiZW52aW50YWdlIiwiYSI6Inh6U0p2bkEifQ.p6VrrwOc_w0Ij-iTj7Zz8A';
		var map = L.mapbox.map('map', 'mapbox.streets')
		    .setView([-41.28760, 174.78639], 3);	

		L.geoJson(statesData).addTo(map);

		var columnWidth = 5;
	    var columnPadding = 2;
	    var w = statesData.features.length * (columnWidth + columnPadding) + (columnWidth * 5);
	    var h = 200;

	      var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-15, 10])
                .html(function(d) {


                    return "<strong>Happiness Index :</strong> <span style='color: #FF1919'>" + d.properties.happinessIndex + "</span>";
                })

	    // var tip = d3.tip()
	    //     .attr('class', 'd3-tip')
	    //     .offset([-15, 10])
	    //     .html(function(d) {
	    //         return "<strong>Happiness Index :</strong> <span style='color: #FF1919'>" + d.properties.happinessIndex + "</span>";
	    //     })

	 	//add graphBox to the map
		var info = L.control();

		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'graphBox');
		    this._div.innerHTML = '<h4>Happiness Index</h4>' + 'Hover over a region & Be Happy!';
		    // create a div with a class "graphBox"
		     this.update();

		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
			graphLoad(this._div);
		    
		};

		info.addTo(map);


		//Coloring density function
		function getColor(d) {
	    	return d > 1000 ? '#034e7b' :
	           d > 500  ? '#0570b0' :
	           d > 200  ? '#3690c0' :
	           d > 100  ? '#74a9cf' :
	           d > 50   ? '#a6bddb' :
	           d > 20   ? '#d0d1e6' :
	           d > 10   ? '#ece7f2' :
	                      '#fff7fb' ;
		}

		//Applies color and adds dashed outline + opacity
		function style(feature) {
		    return {
		        fillColor: getColor(feature.properties.density),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		}

		L.geoJson(statesData, {style: style}).addTo(map);

		//Defines event listner for mouseover highlighting of state. Sets thicker border & color, also bringing it to the front so that the border doesn’t clash with nearby states (but not for IE or Opera, since they have problems doing bringToFront on mouseover).
		function highlightFeature(e) {
		    var layer = e.target;
		    layer.setStyle({
		        weight: 5,
		        color: '#666',
		        dashArray: '',
		        fillOpacity: 0.7
		    });

			animateBar(layer.feature.properties.name);

		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
		}

		//Function to define mouseout. The handy geojson.resetStyle method will reset the layer style to its default state (defined by our style function). For this to work, make sure our GeoJSON layer is accessible through the geojson variable by defining it before our listeners and assigning the layer to it later
		function resetHighlight(e) {
			var layer = e.target;
	    	geojson.resetStyle(e.target);

	    	resetBar(layer.feature.properties.name);
		}


		//functions for animating d3 graphs when hover events on the map
		function animateBar(id){
			// tip().show();
	        var gs = d3.selectAll("rect")
	        shiftOut(gs[0], document.getElementById(id)["x"]["animVal"]["value"])
	        d3.select(document.getElementById(id))
		        .transition()
		        .duration(50)
		        .attr("width", (columnWidth * 5))
		        .style("fill", "#ff6633");


		        console.log("thing", document.getElementById(id)['height']["animVal"]["value"])
		        var data = {   properties:{happinessIndex: document.getElementById(id)['height']["animVal"]["value"] / 20 }};
		       

		       tip.show(data, document.getElementById(id))
	        // d3.select("svg").attr("width", (w + (columnWidth * 5 )))
		}
		
		function resetBar(id){
			// tip().show();
	        var gs = d3.selectAll("rect")
	        shiftBack(gs[0], document.getElementById(id)["x"]["animVal"]["value"])
	        d3.select(document.getElementById(id))
		        .transition()
		        .duration(50)
		        .attr("width", (columnWidth))
		        .style("fill", "#3355ff")
	        // d3.select("svg").attr("width", (w + (columnWidth * 5 )))
	    }

		// //Defines listner for zoom onclick
		// function zoomToFeature(e) {
	 	//map.fitBounds(e.target.getBounds());
		// }

		//Adds all previously defined listners to state layers
		function onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        mouseenter: tip.show,
		        mouseout: resetHighlight,
		       	//click: zoomToFeature
		    });

		}

		geojson = L.geoJson(statesData, {
		    style: style,
		    onEachFeature: onEachFeature
		}).addTo(map);

		function shiftOut(gs, x){
	        for (var i = 0; i < gs.length; i++) {
	            if (gs[i]["x"]["animVal"]["value"] > x) {
	                d3.select(gs[i])
	                .attr("x", gs[i]["x"]["animVal"]["value"] + columnWidth * 4)
	            };
	        };
	    }   
	    function shiftBack(gs, x){
	        for (var i = 0; i < gs.length; i++) {
	            if (gs[i]["x"]["animVal"]["value"] > x) {
	                d3.select(gs[i])
	                .attr("x", gs[i]["x"]["animVal"]["value"] - columnWidth * 4)
	            };
	        };
	    }  

		function graphLoad(graphDiv){
		    
		    var svg = d3.select(graphDiv)
		        .append("svg")
		        .attr("width", w)
		        .attr("height", h)
		        .attr("class", "svg")
		         .call(tip);


		    svg.selectAll("g")
		        .data(statesData.features)
		        .enter()
		        .append("g")
		        .append("rect")
		        .attr("class", "bar")
		        .attr("id", function(d) { return d.properties.name;})
		        .attr("x", 0)
		        .attr("y", function(d) { return h - d.properties.happinessIndex * 20;})
		        .attr("width", columnWidth)
		        .attr("height", function(d, i) { return d.properties.happinessIndex * 20;})
		        .attr("x", function(d, i) {return i * (columnWidth + columnPadding);});       
		};
	}
})