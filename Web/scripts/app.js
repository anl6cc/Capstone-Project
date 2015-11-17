  // JSON and node work on Aluu's computer
  //console.log(JSON.stringify(vis));
  console.log('hi');

function readTextFile(file)
  {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                //document.getElementById("textfile").innerHTML = rawFile.responseText;
                //console.log(rawFile.responseText);
                var dataString = rawFile.responseText;
                initialize(dataString);
            }
        }
    }
    rawFile.send(null);
  }

function initialize(dataString)
{

  var lines = dataString.split("\n");
  var num = parseInt(lines[0], 10);

  //console.log(JSON.stringify(lines));

  s1 = [];
  
  for(var i=1; i < num + 1; i++)
  {
    var pos = lines[i].split(" ");
    console.log(pos[1]);
    s1.push([parseFloat(pos[0]), parseFloat(pos[1])]);// parseFloat(pos[1]));
  }
 
  $.jqplot.config.enablePlugins = true;
 
  //s1 = [['23-May-08',1],['24-May-08',4],['25-May-08',2],['26-May-08', 6]];

/*
  var plot1 = $.jqplot('chart1', [s1], {  
      series:[{showMarker:false}],
      axes:{
        xaxis:{
          label:'Angle (radians)'
        },
        yaxis:{
          label:'Cosine'
        }
      }
  });*/
 
  plot1 = $.jqplot('chart1',[s1],{
     title: 'Highlighting, Dragging, Cursor and Trend Line',
     axes: {
      /*
         xaxis: {
             //renderer: $.jqplot.DateAxisRenderer,
             
             tickOptions: {
                 formatString: '%.2f'
             },
             numberTicks: 4
         },*/
         yaxis: {
          
             tickOptions: {
                 formatString: '%.2f'
             }
             
         }
     },
     highlighter: {
         sizeAdjust: 10,
         tooltipLocation: 'n',
         tooltipAxes: 'y',
         tooltipFormatString: '<b><i><span style="color:red;">hello</span></i></b> %.2f',
         useAxesFormatters: false
     },
     cursor: {
         show: true
     },
     series:[{
        dragable: {
        color: '#ff3366',
        constrainTo: 'y'
    },
    trendline: {
        color: '#cccccc'
    }
     }]
  });

}

$(document).ready(function () {
  readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh");
  //console.log('sup');
});

/*

  function readTextFile(file)
  {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                //document.getElementById("textfile").innerHTML = rawFile.responseText;
                //console.log(rawFile.responseText);
                var dataString = rawFile.responseText;
                initialize(dataString);
            }
        }
    }
    rawFile.send(null);
  }

  readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.esophagus.ddvh");
  //readTextFile("./patient_data/Patient_12508.Plan_14.dvh.1abCompositeDoseDelivered.heart.ddvh");

  //readTextFile("./patient_data/test.txt");

  // initialize the graph
  function initialize(dataString)
  {
      // create an array with nodes
  
  var nodes = new vis.DataSet([
    {id: 1, color: 'lime', x: 0, y: 0, allowedToMoveX: true},
    {id: 2, label: 'Node 2', x: 100.5, y: 100},
    {id: 3, label: 'Node 3', x: 200, y: 200},
    {id: 4, label: 'Node 4', x: 300, y: 300},
    {id: 5, label: 'Node 5', x: 400, y: 400}
  ]);
  

  var nodeArray = [];
  var edgeArray = [];

  var lines = dataString.split("\n");
  var num = parseInt(lines[0], 10);

  */

  //console.log(JSON.stringify(lines));
  /*
  for(var i=1; i < num + 1; i++)
  {
    var pos = lines[i].split(" ");
    nodeArray.push({id: i, x: parseFloat(pos[0]), y: parseFloat(pos[1]) * 1000});
    if(i !== 1)
    {
      edgeArray.push({from: i - 1, to: i, length: 10});
    }
  }
*/
  //console.log(JSON.stringify(nodeArray));
  
  //var nodes = new vis.DataSet(nodeArray);
  
  // create an array with edges

  /*
  
  var edges = new vis.DataSet([
    {from: 1, to: 2, length: 10},
    {from: 2, to: 3, length: 10},
    {from: 4, to: 5, length: 10}
  ]);
  /*
  var edges = new vis.DataSet(edgeArray);
  */
  /*
  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    nodes: {
        fixed: {
            //x: true,
            //y: true
            x: true,
            y: true
            //y: true
        }
    },
    edges: {
        smooth: {
            enabled: false
        }, 
        width: 5
    },
    height: '100%'
  };
  var network = new vis.Network(container, data, options);
  }

  */