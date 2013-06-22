jSpider2
=======
jSpider is a simple library using RaphaelJS allowing you to draw or read diagram for players stats.

How to use it:

initialization :

var myDiagram = new jSpider( my_options );
[object] my_options:

- container (diagram parent's): DOM element (object) || DOM id (string) || jQuery element
EXAMPLE: container: $('#myParent') || 'myParent'


- labels ( labels describe qualifiers): Array of strings
EXAMPLE: ['offensive', 'defense', 'stamina', 'technical', 'phisical', 'fairplay']

- max (graduation between 0 and max): integer
 if max is not specified, by default it will be set with the array's color length

- colors (colors of the diagram steps): Array of strings
EXAMPLE: ["#be1623", "#e6342a", "#ea4e1b", "#f29200", "#f9b234", "#f0f0f0"]

EXAMPLE: 
var myDiagram = new jSpider({
  	container: $('#test'),
	labels: ['offensive', 'defense', 'stamina', 'technical', 'phisical', 'fairplay'],
	colors: ["#be1623", "#e6342a", "#ea4e1b", "#f29200", "#f9b234", "#f0f0f0"]
});

Now your diagram is ready to read or generate graduations

To read: 
myDiagram.read([1,2,2,4,1,4]);

To create:
myDiagram.startEdition();
when you finnished edition, use myDiagram.toJson(); toJson will return an array containing yours statistics: 
[ { label: "attaque" labelID: 0 value: 0.44117647058823534 },

{ label: "dÃ©fense" labelID: 1 value: 2 },

{ label: "endurance" labelID: 2 value: 4.071077524273835 },

{ label: "technique" labelID: 3 value: 3.1862745098039214 },

{ label: "physique" labelID: 4 value: 3.0635991476435565 },

{ label: "fairplay" labelID: 5 value: 3.004964224961859 },

]
