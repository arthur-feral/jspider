jspider
=======

How to use it:

initialization :

var myDiagram = new jSpider( my_options );
[object] my_options:

- container (diagram parent's): DOM element (object) || DOM id (string) || jQuery element
EXAMPLE: container: $('#myParent') || 'myParent'


- labels ( labels describe qualifiers): Array of strings
EXAMPLE: ['offensive', 'defense', 'stamina', 'technical', 'phisical', 'fairplay']

- max (graduation between 0 and max): integer

- colors (colors of the diagram steps): Array of strings
EXAMPLE: ["#be1623", "#e6342a", "#ea4e1b", "#f29200", "#f9b234", "#f0f0f0"]

EXAMPLE: 
var myDiagram = new jSpider({
  container: $('#test'),
	labels: ['offensive', 'defense', 'stamina', 'technical', 'phisical', 'fairplay'],
	max: 5,
	colors: ["#be1623", "#e6342a", "#ea4e1b", "#f29200", "#f9b234", "#f0f0f0"]
});

Now your diagram is ready to read or generate graduations

To read: 
myDiagram.read([1,2,2,4,1,4]);

To create:
myDiagram.startEdition();
