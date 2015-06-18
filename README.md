The Happiness Index.

Synopsis 

This was a Enspiral Dev Academy agile project which aimed to monitor the Happiness levels of Wellington residents by region using GeoJSON data and plugging this data into a responsive bargraph using the D3 Javascript library to dynamically represent the data as it changes - dynamic driven documents.

Motivation

To to use the sentiment analysis of real time twitter tweets, and display these via Chloropleth maps and D3 responsive bar graphs - The Happiness Index. As this was a 4 day project, to deliver minimum viable project we switched the location from Wellington to the U.S. Hover over the US states with Mapbox map and be amazed as the D3 Bar Chart gives the Happiness Index of each US state.

API References / Technology Used

C# backend hitting twitter's API to access GeoJSON providing the sentiment analysis of tweets.
Sentiment Analysis API
Twitter Oauth
D3 library to source the GeoJSON as a dataset and graphically represent the sentiment analysis.
Mapbox.js to render the location of the map.
Leaflet.js to add the chloropleth colouring to the map.
